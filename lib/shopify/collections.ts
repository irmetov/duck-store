import { isShopifyConfigured, shopifyFetch } from "./client";
import {
  getDemoCollectionByHandle,
  getDemoCollections,
} from "./demo-catalog";
import {
  normalizeCollection,
  normalizePageInfo,
  normalizeProductCard,
} from "./normalize";
import { COLLECTION_BY_HANDLE_QUERY, COLLECTIONS_QUERY } from "./queries";
import type { Collection, CollectionWithProducts } from "./types";

type CollectionsResponse = {
  collections: {
    edges: { node: Parameters<typeof normalizeCollection>[0] }[];
  };
};

type CollectionResponse = {
  collection: (Parameters<typeof normalizeCollection>[0] & {
    products: {
      pageInfo: { hasNextPage: boolean; endCursor?: string | null };
      edges: { node: Parameters<typeof normalizeProductCard>[0] }[];
    };
  }) | null;
};

export async function getCollections(first = 20): Promise<Collection[]> {
  if (!isShopifyConfigured()) {
    return getDemoCollections().slice(0, first);
  }

  const data = await shopifyFetch<CollectionsResponse>({
    query: COLLECTIONS_QUERY,
    variables: { first },
    tags: ["collections"],
    revalidate: 60,
  });

  return data.collections.edges.map(({ node }) => normalizeCollection(node));
}

export async function getCollectionByHandle(
  handle: string,
  {
    first = 24,
    after,
    sortKey = "BEST_SELLING",
    reverse = false,
  }: {
    first?: number;
    after?: string;
    sortKey?: "BEST_SELLING" | "CREATED" | "PRICE" | "TITLE" | "COLLECTION_DEFAULT";
    reverse?: boolean;
  } = {},
): Promise<CollectionWithProducts | null> {
  if (!isShopifyConfigured()) {
    const collection = getDemoCollectionByHandle(handle);
    if (!collection) return null;
    return {
      ...collection,
      products: collection.products.slice(0, first),
    };
  }

  const data = await shopifyFetch<CollectionResponse>({
    query: COLLECTION_BY_HANDLE_QUERY,
    variables: { handle, first, after, sortKey, reverse },
    tags: ["collections", `collection:${handle}`],
    revalidate: 60,
  });

  if (!data.collection) return null;

  const collection = normalizeCollection(data.collection);

  return {
    ...collection,
    products: data.collection.products.edges.map(({ node }) =>
      normalizeProductCard(node),
    ),
    pageInfo: normalizePageInfo(data.collection.products.pageInfo),
  };
}
