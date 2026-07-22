"use server";

import { getProducts, type ProductSort } from "@/lib/shopify/products";
import type { ProductCardData } from "@/lib/shopify/types";

export async function loadMoreProductsAction({
  after,
  sortKey,
  reverse,
  query,
}: {
  after: string;
  sortKey: ProductSort;
  reverse: boolean;
  query?: string;
}): Promise<{
  ok: true;
  products: ProductCardData[];
  hasNextPage: boolean;
  endCursor: string | null;
} | {
  ok: false;
  error: string;
}> {
  try {
    const result = await getProducts({
      first: 24,
      after,
      sortKey,
      reverse,
      query,
    });
    return {
      ok: true,
      products: result.products,
      hasNextPage: result.pageInfo.hasNextPage,
      endCursor: result.pageInfo.endCursor,
    };
  } catch (error) {
    console.error("[loadMoreProductsAction]", error);
    return { ok: false, error: "Unable to load more products." };
  }
}
