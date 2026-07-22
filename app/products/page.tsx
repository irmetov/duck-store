import Link from "next/link";

import { ProductGrid } from "@/components/commerce/product-grid";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { getProducts, type ProductSort } from "@/lib/shopify/products";
import type { ProductCardData } from "@/lib/shopify/types";
import { cn } from "@/lib/utils/cn";

export const metadata = {
  title: "Shop all ducks",
  description: "Browse the full Duck Donuts rubber ducky flock.",
};

type SearchParams = Promise<{
  sort?: string;
  availability?: string;
  type?: string;
  after?: string;
}>;

const SORT_OPTIONS: { label: string; value: string; sortKey: ProductSort; reverse: boolean }[] = [
  { label: "Featured", value: "featured", sortKey: "BEST_SELLING", reverse: false },
  { label: "Newest", value: "newest", sortKey: "CREATED_AT", reverse: true },
  { label: "Price: low to high", value: "price-asc", sortKey: "PRICE", reverse: false },
  { label: "Price: high to low", value: "price-desc", sortKey: "PRICE", reverse: true },
  { label: "A–Z", value: "title", sortKey: "TITLE", reverse: false },
];

function buildQuery({ availability, type }: { availability?: string; type?: string }) {
  const parts: string[] = [];
  if (availability === "in-stock") parts.push("available_for_sale:true");
  if (type) parts.push(`product_type:${JSON.stringify(type)}`);
  return parts.length ? parts.join(" AND ") : undefined;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const sortOption =
    SORT_OPTIONS.find((option) => option.value === params.sort) ?? SORT_OPTIONS[0]!;

  let products: ProductCardData[] = [];
  let hasNextPage = false;
  let endCursor: string | null = null;

  try {
    const result = await getProducts({
      first: 24,
      after: params.after,
      sortKey: sortOption.sortKey,
      reverse: sortOption.reverse,
      query: buildQuery({
        availability: params.availability,
        type: params.type,
      }),
    });
    products = result.products;
    hasNextPage = result.pageInfo.hasNextPage;
    endCursor = result.pageInfo.endCursor;
  } catch (error) {
    console.error("[ProductsPage]", error);
    return (
      <Container className="py-16">
        <EmptyState
          title="Unable to load products"
          description="Please try again in a moment."
          action={
            <Button asChild variant="outline">
              <Link href="/">Go home</Link>
            </Button>
          }
        />
      </Container>
    );
  }

  const filterHref = (overrides: Record<string, string | undefined>) => {
    const next = new URLSearchParams();
    const merged = {
      sort: params.sort,
      availability: params.availability,
      type: params.type,
      ...overrides,
    };
    for (const [key, value] of Object.entries(merged)) {
      if (value) next.set(key, value);
    }
    const query = next.toString();
    return query ? `/products?${query}` : "/products";
  };

  return (
    <Container className="py-12 sm:py-16">
      <div className="mb-8 max-w-2xl">
        <Heading as="h1" size="xl">
          Shop all ducks
        </Heading>
        <Text tone="muted" className="mt-2">
          Bright collectibles with icing energy and Outer Banks heart.
        </Text>
      </div>

      <div className="mb-8 flex flex-col gap-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Availability filter">
          <FilterChip
            href={filterHref({ availability: undefined })}
            active={!params.availability}
            label="All"
          />
          <FilterChip
            href={filterHref({ availability: "in-stock" })}
            active={params.availability === "in-stock"}
            label="In stock"
          />
          <FilterChip
            href={filterHref({ type: params.type === "Rubber Duck" ? undefined : "Rubber Duck" })}
            active={params.type === "Rubber Duck"}
            label="Rubber Duck"
          />
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Sort products">
          {SORT_OPTIONS.map((option) => (
            <FilterChip
              key={option.value}
              href={filterHref({ sort: option.value === "featured" ? undefined : option.value })}
              active={sortOption.value === option.value}
              label={option.label}
            />
          ))}
        </div>
      </div>

      {products.length ? (
        <>
          <ProductGrid products={products} />
          {hasNextPage && endCursor ? (
            <div className="mt-10 flex justify-center">
              <Button asChild variant="outline">
                <Link href={filterHref({ after: endCursor })}>Load more</Link>
              </Button>
            </div>
          ) : null}
        </>
      ) : (
        <EmptyState
          title="No products match"
          description="Try clearing filters or check back after seeding your Shopify catalog."
          action={
            <Button asChild variant="outline">
              <Link href="/products">Clear filters</Link>
            </Button>
          }
        />
      )}
    </Container>
  );
}

function FilterChip({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-3 py-1.5 text-sm font-semibold transition-colors duration-fast focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]",
        active
          ? "bg-accent text-accent-foreground"
          : "bg-surface text-foreground ring-1 ring-border hover:bg-surface-sky",
      )}
    >
      {label}
    </Link>
  );
}
