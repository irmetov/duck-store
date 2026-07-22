import { CollectionCard } from "@/components/commerce/collection-card";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionMark } from "@/components/ui/graphic";
import { Heading } from "@/components/ui/heading";
import { SectionSlantEdge } from "@/components/ui/section-slant-edge";
import { Subtitle } from "@/components/ui/subtitle";
import type { Collection } from "@/lib/shopify/types";
import { cn } from "@/lib/utils/cn";

type CollectionGridSectionProps = {
  title: string;
  subtitle: string;
  collections: Collection[];
  className?: string;
};

export function CollectionGridSection({
  title,
  subtitle,
  collections,
  className,
}: CollectionGridSectionProps) {
  return (
    <section
      className={cn(
        "section-slant relative z-10 bg-surface-cotton py-section",
        className,
      )}
    >
      <Container className="relative">
        <div className="mb-10 max-w-xl">
          <Subtitle size="sm" className="text-surface-navy">
            Shop by collection
          </Subtitle>
          <Heading as="h2" size="xl" className="mt-1">
            {title}
          </Heading>
          <SectionMark className="bg-surface-frost" />
          <p className="mt-3 font-body text-base text-foreground">{subtitle}</p>
        </div>

        {collections.length ? (
          <ul className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection, index) => (
              <li key={collection.id} className="h-full min-h-0">
                <CollectionCard collection={collection} index={index} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="Collections coming soon"
            description="Create collections in Shopify to feature them here."
          />
        )}
      </Container>
      <SectionSlantEdge direction="down-right" className="bg-surface-cotton" />
    </section>
  );
}
