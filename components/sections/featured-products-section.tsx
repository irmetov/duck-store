import Link from "next/link";

import { ProductGrid } from "@/components/commerce/product-grid";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionMark } from "@/components/ui/graphic";
import { Heading } from "@/components/ui/heading";
import { SectionSlantEdge } from "@/components/ui/section-slant-edge";
import { Subtitle } from "@/components/ui/subtitle";
import type { ProductCardData } from "@/lib/shopify/types";
import { cn } from "@/lib/utils/cn";

type FeaturedProductsSectionProps = {
  title: string;
  subtitle: string;
  products: ProductCardData[];
  className?: string;
};

export function FeaturedProductsSection({
  title,
  subtitle,
  products,
  className,
}: FeaturedProductsSectionProps) {
  return (
    <section
      className={cn(
        "section-slant-alt relative z-20 bg-surface-cream py-section",
        className,
      )}
    >
      <Container>
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <Subtitle size="sm" className="text-raspberry">
              Fresh from the flock
            </Subtitle>
            <Heading as="h2" size="xl" className="mt-1">
              {title}
            </Heading>
            <SectionMark />
            <p className="mt-3 font-body text-base text-foreground">{subtitle}</p>
          </div>
          <Button asChild variant="secondary">
            <Link href="/products">View all</Link>
          </Button>
        </div>

        {products.length ? (
          <ProductGrid products={products} />
        ) : (
          <EmptyState
            title="No ducks here yet"
            description="Connect Shopify or add products to this collection to populate this section."
          />
        )}
      </Container>
      <SectionSlantEdge direction="down-left" className="bg-surface-cream" />
    </section>
  );
}
