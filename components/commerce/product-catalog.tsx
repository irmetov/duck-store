"use client";

import { useState, useTransition } from "react";

import { ProductGrid } from "@/components/commerce/product-grid";
import { Button } from "@/components/ui/button";
import { loadMoreProductsAction } from "@/lib/shopify/product-actions";
import type { ProductSort } from "@/lib/shopify/products";
import type { ProductCardData } from "@/lib/shopify/types";

type ProductCatalogProps = {
  initialProducts: ProductCardData[];
  initialHasNextPage: boolean;
  initialEndCursor: string | null;
  sortKey: ProductSort;
  reverse: boolean;
  query?: string;
};

export function ProductCatalog({
  initialProducts,
  initialHasNextPage,
  initialEndCursor,
  sortKey,
  reverse,
  query,
}: ProductCatalogProps) {
  const [products, setProducts] = useState(initialProducts);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [endCursor, setEndCursor] = useState(initialEndCursor);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <ProductGrid products={products} />
      {error ? (
        <p role="alert" className="mt-6 text-center text-sm text-danger">
          {error}
        </p>
      ) : null}
      {hasNextPage && endCursor ? (
        <div className="mt-10 flex justify-center">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => {
              setError(null);
              startTransition(async () => {
                const result = await loadMoreProductsAction({
                  after: endCursor,
                  sortKey,
                  reverse,
                  query,
                });
                if (!result.ok) {
                  setError(result.error);
                  return;
                }
                setProducts((current) => {
                  const seen = new Set(current.map((item) => item.id));
                  const next = result.products.filter((item) => !seen.has(item.id));
                  return [...current, ...next];
                });
                setHasNextPage(result.hasNextPage);
                setEndCursor(result.endCursor);
              });
            }}
          >
            {isPending ? "Loading…" : "Load more"}
          </Button>
        </div>
      ) : null}
    </>
  );
}
