import Link from "next/link";

import { ProductGrid } from "@/components/commerce/product-grid";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { searchProducts } from "@/lib/shopify/products";
import type { ProductCardData } from "@/lib/shopify/types";

export const metadata = {
  title: "Search",
  description: "Search Duck Donuts rubber duckies and collectibles.",
};

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  let products: ProductCardData[] = [];
  if (query) {
    try {
      products = await searchProducts(query);
    } catch (error) {
      console.error("[SearchPage]", error);
      return (
        <Container className="py-16">
          <EmptyState
            title="Search unavailable"
            description="Please try again in a moment."
          />
        </Container>
      );
    }
  }

  return (
    <Container className="py-12 sm:py-16">
      <div className="mb-10 max-w-2xl">
        <Heading as="h1" size="xl">
          Search
        </Heading>
        <Text tone="muted" className="mt-2">
          Find your favorite flavor of duck.
        </Text>
      </div>

      <form action="/search" method="get" className="mb-10 flex max-w-xl gap-3">
        <label className="sr-only" htmlFor="search-q">
          Search products
        </label>
        <input
          id="search-q"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Search ducks…"
          className="h-12 flex-1 rounded-button border border-border bg-surface px-5 font-body text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button type="submit" size="lg">
          Search
        </Button>
      </form>

      {!query ? (
        <EmptyState
          title="Start searching"
          description="Try “classic”, “seasonal”, or a duck name."
        />
      ) : products.length ? (
        <>
          <Text tone="muted" className="mb-6">
            {products.length} result{products.length === 1 ? "" : "s"} for “
            {query}”
          </Text>
          <ProductGrid products={products} />
        </>
      ) : (
        <EmptyState
          title={`No results for “${query}”`}
          description="Try another keyword or browse the full flock."
          action={
            <Button asChild>
              <Link href="/products">Shop all</Link>
            </Button>
          }
        />
      )}
    </Container>
  );
}
