import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductGrid } from "@/components/commerce/product-grid";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { getCollectionByHandle } from "@/lib/shopify/collections";

type CollectionPageProps = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { handle } = await params;

  try {
    const collection = await getCollectionByHandle(handle, { first: 1 });
    if (!collection) return { title: "Collection not found" };
    return {
      title: collection.seo.title || collection.title,
      description: collection.seo.description || collection.description,
    };
  } catch {
    return { title: "Collection" };
  }
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { handle } = await params;

  let collection = null;
  try {
    collection = await getCollectionByHandle(handle, { first: 24 });
  } catch (error) {
    console.error("[CollectionPage]", error);
    return (
      <Container className="py-16">
        <EmptyState
          title="Unable to load collection"
          description="Please try again shortly."
          action={
            <Button asChild variant="outline">
              <Link href="/products">Shop all</Link>
            </Button>
          }
        />
      </Container>
    );
  }

  if (!collection) notFound();

  return (
    <Container className="py-12 sm:py-16">
      <div className="mb-10 max-w-2xl">
        <Heading as="h1" size="xl">
          {collection.title}
        </Heading>
        {collection.description ? (
          <Text tone="muted" className="mt-2">
            {collection.description}
          </Text>
        ) : null}
      </div>

      {collection.products.length ? (
        <ProductGrid products={collection.products} />
      ) : (
        <EmptyState
          title="No products in this collection"
          description="Check back soon for new ducks."
          action={
            <Button asChild>
              <Link href="/products">Browse all</Link>
            </Button>
          }
        />
      )}
    </Container>
  );
}
