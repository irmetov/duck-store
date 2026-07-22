/**
 * Seeds Shopify with sample Duck Donuts rubber duck products + collections.
 *
 * Requires Admin API credentials via either:
 *   SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_...
 * or (Dev Dashboard — preferred):
 *   SHOPIFY_CLIENT_ID=...
 *   SHOPIFY_CLIENT_SECRET=...
 *
 * Also requires:
 *   SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
 *   SHOPIFY_API_VERSION=2025-01 (optional)
 *
 * Usage:
 *   npm run seed
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  adminStoreSlug,
  sanitizeStoreDomain,
  storefrontAuthHeaders,
} from "../lib/shopify/env";
import { seedCollections, seedProducts } from "../config/seed-data";

const rawDomain = sanitizeStoreDomain(process.env.SHOPIFY_STORE_DOMAIN);
const apiVersion = process.env.SHOPIFY_API_VERSION || "2025-01";
const clientId = process.env.SHOPIFY_CLIENT_ID;
const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

let adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

if (!rawDomain) {
  console.error("Missing SHOPIFY_STORE_DOMAIN.");
  process.exit(1);
}

const domain: string = rawDomain;

async function resolveAdminToken(): Promise<string> {
  if (adminToken?.trim()) return adminToken.trim();

  if (!clientId?.trim() || !clientSecret?.trim()) {
    console.error(
      "Missing Admin credentials.\n" +
        "Set SHOPIFY_ADMIN_ACCESS_TOKEN, or SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET\n" +
        "from Dev Dashboard → Duck-Shop-Dev → Settings.",
    );
    process.exit(1);
  }

  console.log("Requesting Admin access token via client credentials…");
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId.trim(),
    client_secret: clientSecret.trim(),
  });

  const response = await fetch(
    `https://${domain}/admin/oauth/access_token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    },
  );

  const text = await response.text();
  let json: {
    access_token?: string;
    scope?: string;
    error?: string;
    error_description?: string;
  };
  try {
    json = JSON.parse(text) as typeof json;
  } catch {
    console.error(`Token request failed (HTTP ${response.status}):\n${text.slice(0, 500)}`);
    process.exit(1);
  }

  if (!response.ok || !json.access_token) {
    console.error(
      `Token request failed (HTTP ${response.status}): ` +
        `${json.error ?? "unknown"} ${json.error_description ?? text.slice(0, 300)}`,
    );
    process.exit(1);
  }

  console.log("Admin access token acquired.");
  console.log(`Granted scopes: ${json.scope ?? "(none returned)"}`);
  if (json.scope && !json.scope.split(",").map((s) => s.trim()).includes("read_products")) {
    console.warn(
      "Note: token has no read_products — seeding will create only (no skip-if-exists checks).",
    );
  }
  return json.access_token;
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

async function ensureCollection(
  handle: string,
  title: string,
  description: string,
): Promise<string | null> {
  const fromEnv = process.env[`SHOPIFY_COLLECTION_${handle.toUpperCase()}_ID`];
  if (fromEnv?.trim()) {
    const id = fromEnv.includes("gid://")
      ? fromEnv.trim()
      : `gid://shopify/Collection/${fromEnv.trim()}`;
    await writeSeedStateCollection(handle, id);
    console.log(`Collection from env: ${handle}`);
    return id;
  }

  const cachedId = await readSeedStateCollection(handle);
  if (cachedId) {
    console.log(`Collection from seed state: ${handle}`);
    return cachedId;
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

  const id = created.collectionCreate.collection?.id;
  if (id) {
    await writeSeedStateCollection(handle, id);
    return id;
  }

  const messages = created.collectionCreate.userErrors.map((e) => e.message).join("; ");
  const alreadyExists = /taken|exists|already/i.test(messages);
  if (alreadyExists) {
    const existingId = await lookupCollectionIdViaStorefront(handle);
    if (existingId) {
      await writeSeedStateCollection(handle, existingId);
      console.log(`Collection already exists, reusing: ${handle}`);
      return existingId;
    }
    // Allow seeding products without collection IDs; user can assign later in Admin.
    console.warn(
      `Collection "${handle}" already exists — skipping link for now.\n` +
        `  Fix later: delete it at https://admin.shopify.com/store/${adminStoreSlug(domain)}/collections then re-seed,\n` +
        `  or open the collection and set SHOPIFY_COLLECTION_${handle.toUpperCase()}_ID=<numeric id from URL>.`,
    );
    return null;
  }

  throw new Error(messages || `Failed to create collection ${handle}`);
}

const seedStatePath = path.join(process.cwd(), ".seed-state.json");

async function readSeedStateCollection(handle: string): Promise<string | null> {
  try {
    const raw = await readFile(seedStatePath, "utf8");
    const state = JSON.parse(raw) as { collections?: Record<string, string> };
    return state.collections?.[handle] ?? null;
  } catch {
    return null;
  }
}

async function writeSeedStateCollection(handle: string, id: string) {
  let state: { collections: Record<string, string> } = { collections: {} };
  try {
    const raw = await readFile(seedStatePath, "utf8");
    state = JSON.parse(raw) as typeof state;
    state.collections ??= {};
  } catch {
    // fresh state
  }
  state.collections[handle] = id;
  await writeFile(seedStatePath, `${JSON.stringify(state, null, 2)}\n`);
}

async function lookupCollectionIdViaStorefront(handle: string): Promise<string | null> {
  const storefrontToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (!storefrontToken) return null;

  const response = await fetch(
    `https://${domain}/api/${apiVersion}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...storefrontAuthHeaders(storefrontToken),
      },
      body: JSON.stringify({
        query: `#graphql
          query ($handle: String!) {
            collection(handle: $handle) { id }
          }
        `,
        variables: { handle },
      }),
    },
  );

  if (!response.ok) return null;
  const json = (await response.json()) as {
    data?: { collection: { id: string } | null };
  };
  return json.data?.collection?.id ?? null;
}

async function createProduct(product: (typeof seedProducts)[number], imageUrl: string) {
  const created = await adminFetch<{
    productCreate: {
      product: { id: string; variants: { nodes: { id: string }[] } } | null;
      userErrors: { message: string }[];
    };
  }>(
    `#graphql
      mutation ProductCreate($product: ProductCreateInput!, $media: [CreateMediaInput!]) {
        productCreate(product: $product, media: $media) {
          product {
            id
            variants(first: 1) { nodes { id } }
          }
          userErrors { field message }
        }
      }
    `,
    {
      product: {
        title: product.title,
        handle: product.handle,
        descriptionHtml: `<p>${product.description}</p>`,
        productType: product.productType,
        vendor: product.vendor,
        tags: product.tags,
        status: "ACTIVE",
      },
      media: [
        {
          originalSource: imageUrl,
          alt: product.imageAlt,
          mediaContentType: "IMAGE",
        },
      ],
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

  // Newer APIs prefer productVariantsBulkUpdate over productVariantUpdate
  await adminFetch(
    `#graphql
      mutation ProductVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
        productVariantsBulkUpdate(productId: $productId, variants: $variants) {
          userErrors { field message }
        }
      }
    `,
    {
      productId,
      variants: [
        {
          id: variantId,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          inventoryItem: { sku: product.sku, tracked: false },
        },
      ],
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
  adminToken = await resolveAdminToken();
  console.log("Seeding Duck Donuts rubber duckies…");

  const collectionIds = new Map<string, string>();
  for (const collection of seedCollections) {
    const id = await ensureCollection(
      collection.handle,
      collection.title,
      collection.description,
    );
    if (id) {
      collectionIds.set(collection.handle, id);
      console.log(`Collection ready: ${collection.handle}`);
    }
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
