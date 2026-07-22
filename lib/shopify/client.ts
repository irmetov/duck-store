import {
  sanitizeStoreDomain,
  storefrontAuthHeaders,
} from "./env";

const domain = sanitizeStoreDomain(process.env.SHOPIFY_STORE_DOMAIN);
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_API_VERSION || "2025-01";

type ShopifyFetchOptions = {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
  tags?: string[];
  revalidate?: number | false;
};

type ShopifyErrorShape = {
  message: string;
  extensions?: Record<string, unknown>;
};

type ShopifyResponse<T> = {
  data?: T;
  errors?: ShopifyErrorShape[];
};

export class ShopifyError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ShopifyError";
    this.status = status;
  }
}

export function isShopifyConfigured() {
  return Boolean(domain && storefrontAccessToken);
}

export async function shopifyFetch<T>({
  query,
  variables,
  cache = "force-cache",
  tags = [],
  revalidate = 60,
}: ShopifyFetchOptions): Promise<T> {
  if (!domain || !storefrontAccessToken) {
    throw new ShopifyError(
      "Shopify is not configured. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN.",
      500,
    );
  }

  const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;

  let response: Response;

  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...storefrontAuthHeaders(storefrontAccessToken),
      },
      body: JSON.stringify({ query, variables }),
      cache,
      next: {
        revalidate: revalidate === false ? undefined : revalidate,
        tags,
      },
    });
  } catch (error) {
    console.error("[shopifyFetch] network error", error);
    throw new ShopifyError("Unable to reach Shopify. Please try again later.", 503);
  }

  if (!response.ok) {
    console.error("[shopifyFetch] HTTP error", response.status, await response.text());
    throw new ShopifyError("Shopify API is temporarily unavailable.", response.status);
  }

  const json = (await response.json()) as ShopifyResponse<T>;

  if (json.errors?.length) {
    // Shopify often returns partial data with field-level access errors.
    // Prefer data when present so PDP/listings still render.
    console.error("[shopifyFetch] GraphQL errors", json.errors);
    if (!json.data) {
      throw new ShopifyError(
        json.errors.map((error) => error.message).join("; ") || "Shopify GraphQL error.",
        502,
      );
    }
  }

  if (!json.data) {
    throw new ShopifyError("Shopify returned an empty response.", 502);
  }

  return json.data;
}
