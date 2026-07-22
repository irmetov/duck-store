import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductGallery } from "@/components/commerce/product-gallery";
import { ProductGrid } from "@/components/commerce/product-grid";
import { ProductInfo } from "@/components/commerce/product-info";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Heading } from "@/components/ui/heading";
import { storeConfig } from "@/config/store";
import { getProductByHandle, getProducts } from "@/lib/shopify/products";
import type { Product, ProductCardData } from "@/lib/shopify/types";

type ProductPageProps = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;

  try {
    const product = await getProductByHandle(handle);
    if (!product) return { title: "Product not found" };

    const title = product.seo.title || product.title;
    const description =
      product.seo.description || product.description || storeConfig.description;
    const image = product.featuredImage?.url;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: image ? [{ url: image }] : undefined,
      },
    };
  } catch {
    return { title: "Product" };
  }
}

function productJsonLd(product: Product) {
  const variant = product.variants[0];
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.map((img) => img.url),
    sku: variant?.sku || undefined,
    brand: {
      "@type": "Brand",
      name: product.vendor || storeConfig.name,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      price: product.priceRange.minVariantPrice.amount,
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `/products/${product.handle}`,
    },
  };
}

async function getRelatedProducts(product: Product): Promise<ProductCardData[]> {
  const queries: string[] = [];
  if (product.productType) {
    queries.push(`product_type:'${product.productType.replace(/'/g, "\\'")}'`);
  }
  if (product.tags[0]) {
    queries.push(`tag:'${product.tags[0].replace(/'/g, "\\'")}'`);
  }

  for (const query of queries) {
    try {
      const { products } = await getProducts({ first: 8, query });
      const related = products
        .filter((item) => item.handle !== product.handle)
        .slice(0, 4);
      if (related.length) return related;
    } catch (error) {
      console.error("[getRelatedProducts]", error);
    }
  }

  try {
    const { products } = await getProducts({ first: 8 });
    return products
      .filter((item) => item.handle !== product.handle)
      .slice(0, 4);
  } catch {
    return [];
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;

  let product: Product | null = null;
  try {
    product = await getProductByHandle(handle);
  } catch (error) {
    console.error("[ProductPage]", error);
    return (
      <Container className="py-16">
        <EmptyState
          title="Unable to load product"
          description="Please try again shortly."
          action={
            <Button asChild variant="outline">
              <Link href="/products">Back to shop</Link>
            </Button>
          }
        />
      </Container>
    );
  }

  if (!product) notFound();

  const related = await getRelatedProducts(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd(product)),
        }}
      />
      <Container className="py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <ProductGallery
            images={
              product.images.length
                ? product.images
                : product.featuredImage
                  ? [product.featuredImage]
                  : []
            }
            alt={product.title}
          />
          <ProductInfo product={product} />
        </div>

        {related.length ? (
          <section className="mt-16 border-t border-border pt-12">
            <Heading as="h2" size="lg" className="mb-8">
              More from the flock
            </Heading>
            <ProductGrid products={related} />
          </section>
        ) : null}
      </Container>
    </>
  );
}
