import type { MetadataRoute } from "next";

import { isShopifyConfigured } from "@/lib/shopify/client";
import { getCollections } from "@/lib/shopify/collections";
import { getProducts } from "@/lib/shopify/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: "daily", priority: 1 },
    {
      url: `${siteUrl}/products`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/search`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.4,
    },
  ];

  if (!isShopifyConfigured()) return staticRoutes;

  try {
    const [{ products }, collections] = await Promise.all([
      getProducts({ first: 100 }),
      getCollections(50),
    ]);

    const productRoutes = products.map((product) => ({
      url: `${siteUrl}/products/${product.handle}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const collectionRoutes = collections.map((collection) => ({
      url: `${siteUrl}/collections/${collection.handle}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...productRoutes, ...collectionRoutes];
  } catch (error) {
    console.error("[sitemap]", error);
    return staticRoutes;
  }
}
