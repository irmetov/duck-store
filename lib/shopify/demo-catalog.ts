import { seedProducts } from "@/config/seed-data";
import type {
  Collection,
  CollectionWithProducts,
  PageInfo,
  Product,
  ProductCardData,
} from "./types";

function money(amount: string) {
  return { amount, currencyCode: "USD" };
}

function productImage(file: string, alt: string) {
  return {
    url: `/images/products/${file}`,
    altText: alt,
    width: 1024,
    height: 1024,
  };
}

export function getDemoProducts(): ProductCardData[] {
  return seedProducts.map((product) => ({
    id: `demo-${product.handle}`,
    handle: product.handle,
    title: product.title,
    productType: product.productType,
    featuredImage: productImage(product.imageFile, product.imageAlt),
    price: money(product.price),
    compareAtPrice: product.compareAtPrice ? money(product.compareAtPrice) : null,
    availableForSale: true,
  }));
}

export function getDemoProductByHandle(handle: string): Product | null {
  const product = seedProducts.find((item) => item.handle === handle);
  if (!product) return null;

  const image = productImage(product.imageFile, product.imageAlt);
  const price = money(product.price);
  const compareAtPrice = product.compareAtPrice ? money(product.compareAtPrice) : null;

  return {
    id: `demo-${product.handle}`,
    handle: product.handle,
    title: product.title,
    description: product.description,
    descriptionHtml: `<p>${product.description}</p>`,
    availableForSale: true,
    tags: product.tags,
    productType: product.productType,
    vendor: product.vendor,
    featuredImage: image,
    images: [image],
    options: [
      {
        id: `demo-option-${product.handle}`,
        name: "Title",
        values: ["Default Title"],
      },
    ],
    variants: [
      {
        id: `demo-variant-${product.handle}`,
        title: "Default Title",
        availableForSale: true,
        sku: product.sku,
        selectedOptions: [{ name: "Title", value: "Default Title" }],
        price,
        compareAtPrice,
        image,
      },
    ],
    priceRange: {
      minVariantPrice: price,
      maxVariantPrice: price,
    },
    compareAtPriceRange: {
      minVariantPrice: compareAtPrice ?? price,
      maxVariantPrice: compareAtPrice ?? price,
    },
    seo: {
      title: product.title,
      description: product.description,
    },
  };
}

export function getDemoCollections(): Collection[] {
  const titles: Record<string, { title: string; description: string }> = {
    classics: {
      title: "Classics",
      description: "Everyday Duck Donuts rubber duckies with iconic icing energy.",
    },
    seasonal: {
      title: "Seasonal",
      description: "Limited-time ducks inspired by seasonal flavors and beachy vibes.",
    },
    limited: {
      title: "Limited",
      description: "Collector ducks that hatch in small batches.",
    },
  };

  return Object.entries(titles).map(([handle, meta]) => {
    const first = seedProducts.find((product) =>
      (product.collections as readonly string[]).includes(handle),
    );
    return {
      id: `demo-collection-${handle}`,
      handle,
      title: meta.title,
      description: meta.description,
      image: first ? productImage(first.imageFile, first.imageAlt) : null,
      seo: {
        title: meta.title,
        description: meta.description,
      },
    };
  });
}

export function getDemoCollectionByHandle(handle: string): CollectionWithProducts | null {
  const collections = getDemoCollections();
  const collection = collections.find((item) => item.handle === handle);
  if (!collection) return null;

  const products = getDemoProducts().filter((product) => {
    const seed = seedProducts.find((item) => item.handle === product.handle);
    return seed
      ? (seed.collections as readonly string[]).includes(handle)
      : false;
  });

  const pageInfo: PageInfo = { hasNextPage: false, endCursor: null };

  return {
    ...collection,
    products,
    pageInfo,
  };
}

export function searchDemoProducts(q: string): ProductCardData[] {
  const query = q.trim().toLowerCase();
  if (!query) return [];

  return getDemoProducts().filter((product) => {
    const seed = seedProducts.find((item) => item.handle === product.handle);
    const haystack = `${product.title} ${seed?.description ?? ""}`.toLowerCase();
    return haystack.includes(query);
  });
}
