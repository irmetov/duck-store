/**
 * Seeds Shopify with sample Duck Donuts rubber duck products + collections.
 *
 * Requires Admin API credentials (Custom App with write_products):
 *   SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
 *   SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_...
 *   SHOPIFY_API_VERSION=2025-01 (optional)
 *
 * Usage:
 *   npx tsx scripts/seed-shopify.ts
 */

import { readFile } from "node:fs/promises";
import path from "node:path";

import { seedCollections, seedProducts } from "./seed-data";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_API_VERSION || "2025-01";

if (!domain || !adminToken) {
  console.error(
    "Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_ACCESS_TOKEN.\n" +
      "Create a Custom App in Shopify Admin with write_products / write_files scopes.",
  );
  process.exit(1);
}

type GqlResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

async function adminFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(
    `https://${domain}/admin/api/${apiVersion}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": adminToken!,
      },
      body: JSON.stringify({ query, variables }),
    },
  );

  if (!response.ok) {
    throw new Error(`Admin API HTTP ${response.status}: ${await response.text()}`);
  }

  const json = (await response.json()) as GqlResponse<T>;
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }
  if (!json.data) throw new Error("Empty Admin API response");
  return json.data;
}

async function stagedUpload(filePath: string, filename: string) {
  const bytes = await readFile(filePath);
  const mimeType = "image/png";

  const data = await adminFetch<{
    stagedUploadsCreate: {
      stagedTargets: {
        url: string;
        resourceUrl: string;
        parameters: { name: string; value: string }[];
      }[];
      userErrors: { message: string }[];
    };
  }>(
    `#graphql
      mutation StagedUploads($input: [StagedUploadInput!]!) {
        stagedUploadsCreate(input: $input) {
          stagedTargets {
            url
            resourceUrl
            parameters { name value }
          }
          userErrors { message }
        }
      }
    `,
    {
      input: [
        {
          filename,
          mimeType,
          httpMethod: "POST",
          resource: "PRODUCT_IMAGE",
          fileSize: String(bytes.byteLength),
        },
      ],
    },
  );

  if (data.stagedUploadsCreate.userErrors.length) {
    throw new Error(data.stagedUploadsCreate.userErrors.map((e) => e.message).join("; "));
  }

  const target = data.stagedUploadsCreate.stagedTargets[0];
  if (!target) throw new Error("No staged upload target");

  const form = new FormData();
  for (const param of target.parameters) {
    form.append(param.name, param.value);
  }
  form.append("file", new Blob([new Uint8Array(bytes)], { type: mimeType }), filename);

  const uploadResponse = await fetch(target.url, { method: "POST", body: form });
  if (!uploadResponse.ok) {
    throw new Error(`Staged upload failed: ${uploadResponse.status}`);
  }

  return target.resourceUrl;
}

async function ensureCollection(handle: string, title: string, description: string) {
  const existing = await adminFetch<{
    collectionByHandle: { id: string } | null;
  }>(
    `#graphql
      query CollectionByHandle($handle: String!) {
        collectionByHandle(handle: $handle) { id }
      }
    `,
    { handle },
  );

  if (existing.collectionByHandle?.id) {
    return existing.collectionByHandle.id;
  }

  const created = await adminFetch<{
    collectionCreate: {
      collection: { id: string } | null;
      userErrors: { message: string }[];
    };
  }>(
    `#graphql
      mutation CollectionCreate($input: CollectionInput!) {
        collectionCreate(input: $input) {
          collection { id }
          userErrors { message }
        }
      }
    `,
    {
      input: {
        title,
        handle,
        descriptionHtml: `<p>${description}</p>`,
      },
    },
  );

  if (created.collectionCreate.userErrors.length) {
    throw new Error(created.collectionCreate.userErrors.map((e) => e.message).join("; "));
  }

  const id = created.collectionCreate.collection?.id;
  if (!id) throw new Error(`Failed to create collection ${handle}`);
  return id;
}

async function createProduct(product: (typeof seedProducts)[number], imageUrl: string) {
  const existing = await adminFetch<{
    productByHandle: { id: string } | null;
  }>(
    `#graphql
      query ProductByHandle($handle: String!) {
        productByHandle(handle: $handle) { id }
      }
    `,
    { handle: product.handle },
  );

  if (existing.productByHandle?.id) {
    console.log(`Skip existing product: ${product.handle}`);
    return existing.productByHandle.id;
  }

  const created = await adminFetch<{
    productCreate: {
      product: { id: string; variants: { nodes: { id: string }[] } } | null;
      userErrors: { message: string }[];
    };
  }>(
    `#graphql
      mutation ProductCreate($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            variants(first: 1) { nodes { id } }
          }
          userErrors { message }
        }
      }
    `,
    {
      input: {
        title: product.title,
        handle: product.handle,
        descriptionHtml: `<p>${product.description}</p>`,
        productType: product.productType,
        vendor: product.vendor,
        tags: product.tags,
        status: "ACTIVE",
        images: [{ src: imageUrl, altText: product.imageAlt }],
      },
    },
  );

  if (created.productCreate.userErrors.length) {
    throw new Error(created.productCreate.userErrors.map((e) => e.message).join("; "));
  }

  const productId = created.productCreate.product?.id;
  const variantId = created.productCreate.product?.variants.nodes[0]?.id;
  if (!productId || !variantId) {
    throw new Error(`Failed to create product ${product.handle}`);
  }

  await adminFetch(
    `#graphql
      mutation ProductVariantUpdate($input: ProductVariantInput!) {
        productVariantUpdate(input: $input) {
          userErrors { message }
        }
      }
    `,
    {
      input: {
        id: variantId,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        sku: product.sku,
        inventoryItem: { tracked: false },
      },
    },
  );

  console.log(`Created product: ${product.handle}`);
  return productId;
}

async function addProductsToCollection(collectionId: string, productIds: string[]) {
  if (!productIds.length) return;

  await adminFetch(
    `#graphql
      mutation CollectionAddProducts($id: ID!, $productIds: [ID!]!) {
        collectionAddProducts(id: $id, productIds: $productIds) {
          userErrors { message }
        }
      }
    `,
    { id: collectionId, productIds },
  );
}

async function main() {
  console.log("Seeding Duck Donuts rubber duckies…");

  const collectionIds = new Map<string, string>();
  for (const collection of seedCollections) {
    const id = await ensureCollection(
      collection.handle,
      collection.title,
      collection.description,
    );
    collectionIds.set(collection.handle, id);
    console.log(`Collection ready: ${collection.handle}`);
  }

  const productsDir = path.join(process.cwd(), "public/images/products");
  const productsByCollection = new Map<string, string[]>();

  for (const product of seedProducts) {
    const imagePath = path.join(productsDir, product.imageFile);
    const resourceUrl = await stagedUpload(imagePath, product.imageFile);
    const productId = await createProduct(product, resourceUrl);

    for (const handle of product.collections) {
      const list = productsByCollection.get(handle) ?? [];
      list.push(productId);
      productsByCollection.set(handle, list);
    }
  }

  for (const [handle, productIds] of productsByCollection) {
    const collectionId = collectionIds.get(handle);
    if (!collectionId) continue;
    await addProductsToCollection(collectionId, productIds);
    console.log(`Linked ${productIds.length} products → ${handle}`);
  }

  console.log("Seed complete. Publish Headless Storefront token and restart the app.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
