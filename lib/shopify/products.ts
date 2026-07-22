import { isShopifyConfigured, shopifyFetch } from "./client";
import {
  getDemoProductByHandle,
  getDemoProducts,
  searchDemoProducts,
} from "./demo-catalog";
import {
  normalizePageInfo,
  normalizeProduct,
  normalizeProductCard,
} from "./normalize";
import {
  PRODUCT_BY_HANDLE_QUERY,
  PRODUCTS_QUERY,
  SEARCH_PRODUCTS_QUERY,
} from "./queries";
import type { PageInfo, Product, ProductCardData } from "./types";

type ProductsResponse = {
  products: {
    pageInfo: { hasNextPage: boolean; endCursor?: string | null };
    edges: { node: Parameters<typeof normalizeProductCard>[0] }[];
  };
};

type ProductResponse = {
  product: Parameters<typeof normalizeProduct>[0] | null;
};

type SearchResponse = {
  search: {
    edges: { node: Parameters<typeof normalizeProductCard>[0] | Record<string, never> }[];
  };
};

export type ProductSort =
  | "BEST_SELLING"
  | "CREATED_AT"
  | "PRICE"
  | "TITLE"
  | "UPDATED_AT";

function sortDemoProducts(
  products: ProductCardData[],
  sortKey: ProductSort,
  reverse: boolean,
) {
  const sorted = [...products].sort((a, b) => {
    switch (sortKey) {
      case "PRICE":
        return Number.parseFloat(a.price.amount) - Number.parseFloat(b.price.amount);
      case "TITLE":
        return a.title.localeCompare(b.title);
      default:
        return a.title.localeCompare(b.title);
    }
  });
  return reverse ? sorted.reverse() : sorted;
}

export async function getProducts({
  first = 24,
  after,
  sortKey = "BEST_SELLING",
  reverse = false,
  query,
}: {
  first?: number;
  after?: string;
  sortKey?: ProductSort;
  reverse?: boolean;
  query?: string;
} = {}): Promise<{ products: ProductCardData[]; pageInfo: PageInfo }> {
  if (!isShopifyConfigured()) {
    let products = getDemoProducts();

    if (query?.includes("available_for_sale:true")) {
      products = products.filter((product) => product.availableForSale);
    }
    const typeMatch = query?.match(/product_type:"([^"]+)"/);
    if (typeMatch?.[1]) {
      const productType = typeMatch[1];
      products = products.filter((product) => product.productType === productType);
    }

    products = sortDemoProducts(products, sortKey, reverse);

    return {
      products: products.slice(0, first),
      pageInfo: { hasNextPage: false, endCursor: null },
    };
  }

  const data = await shopifyFetch<ProductsResponse>({
    query: PRODUCTS_QUERY,
    variables: { first, after, sortKey, reverse, query },
    tags: ["products"],
    revalidate: 60,
  });

  return {
    products: data.products.edges.map(({ node }) => normalizeProductCard(node)),
    pageInfo: normalizePageInfo(data.products.pageInfo),
  };
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  if (!isShopifyConfigured()) {
    return getDemoProductByHandle(handle);
  }

  const data = await shopifyFetch<ProductResponse>({
    query: PRODUCT_BY_HANDLE_QUERY,
    variables: { handle },
    tags: ["products", `product:${handle}`],
    revalidate: 60,
  });

  return data.product ? normalizeProduct(data.product) : null;
}

export async function searchProducts(
  q: string,
  first = 24,
): Promise<ProductCardData[]> {
  if (!q.trim()) return [];

  if (!isShopifyConfigured()) {
    return searchDemoProducts(q).slice(0, first);
  }

  const data = await shopifyFetch<SearchResponse>({
    query: SEARCH_PRODUCTS_QUERY,
    variables: { query: q, first },
    cache: "no-store",
  });

  return data.search.edges
    .map(({ node }) => node)
    .filter((node): node is Parameters<typeof normalizeProductCard>[0] =>
      Boolean(node && "handle" in node && node.handle),
    )
    .map((node) => normalizeProductCard(node));
}
