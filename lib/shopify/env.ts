/** Normalize SHOPIFY_STORE_DOMAIN to host only (no protocol/path). */
export function sanitizeStoreDomain(value: string | undefined | null): string | undefined {
  if (!value?.trim()) return undefined;
  return value
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "")
    .replace(/\/$/, "");
}

/** Private Headless tokens (shpat_…) use a different header than public tokens. */
export function storefrontAuthHeaders(token: string): Record<string, string> {
  if (token.startsWith("shpat_")) {
    return { "Shopify-Storefront-Private-Token": token };
  }
  return { "X-Shopify-Storefront-Access-Token": token };
}

/** Admin store slug from myshopify domain for admin.shopify.com links. */
export function adminStoreSlug(domain: string): string {
  return domain.replace(/\.myshopify\.com$/i, "");
}
