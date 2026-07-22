import { CollectionGridSection } from "@/components/sections/collection-grid-section";
import { FeaturedProductsSection } from "@/components/sections/featured-products-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ImageBannerSection } from "@/components/sections/image-banner-section";
import { NewsletterSection } from "@/components/sections/newsletter-section";
import { SplitContentSection } from "@/components/sections/split-content-section";
import {
  homepageSections,
  type HomepageSection,
} from "@/config/homepage";
import { getCollectionByHandle } from "@/lib/shopify/collections";
import { getProducts } from "@/lib/shopify/products";
import type { Collection, ProductCardData } from "@/lib/shopify/types";

async function loadFeaturedProducts(
  props: Extract<HomepageSection, { type: "featured-products" }>["props"],
): Promise<ProductCardData[]> {
  try {
    if (props.collectionHandle) {
      const collection = await getCollectionByHandle(props.collectionHandle, {
        first: props.limit ?? 8,
      });
      return collection?.products ?? [];
    }

    const { products } = await getProducts({ first: props.limit ?? 8 });
    return products;
  } catch (error) {
    console.error("[HomepageSections] featured products", error);
    return [];
  }
}

async function loadCollections(handles: string[]): Promise<Collection[]> {
  const results = await Promise.all(
    handles.map(async (handle) => {
      try {
        const collection = await getCollectionByHandle(handle, { first: 1 });
        if (!collection) return null;
        return {
          id: collection.id,
          handle: collection.handle,
          title: collection.title,
          description: collection.description,
          image: collection.image,
          seo: collection.seo,
        };
      } catch (error) {
        console.error(`[HomepageSections] collection ${handle}`, error);
        return null;
      }
    }),
  );

  return results.filter((item): item is Collection => Boolean(item));
}

export async function HomepageSections() {
  const nodes = await Promise.all(
    homepageSections.map(async (section, index) => {
      switch (section.type) {
        case "hero":
          return <HeroSection key={`hero-${index}`} {...section.props} />;
        case "featured-products": {
          const products = await loadFeaturedProducts(section.props);
          return (
            <FeaturedProductsSection
              key={`featured-${index}`}
              title={section.props.title}
              subtitle={section.props.subtitle}
              products={products}
            />
          );
        }
        case "collection-grid": {
          const collections = await loadCollections(section.props.handles);
          return (
            <CollectionGridSection
              key={`collections-${index}`}
              title={section.props.title}
              subtitle={section.props.subtitle}
              collections={collections}
            />
          );
        }
        case "image-banner":
          return (
            <ImageBannerSection key={`banner-${index}`} {...section.props} />
          );
        case "split-content":
          return (
            <SplitContentSection key={`split-${index}`} {...section.props} />
          );
        case "newsletter":
          return (
            <NewsletterSection key={`newsletter-${index}`} {...section.props} />
          );
        default:
          return null;
      }
    }),
  );

  return <>{nodes}</>;
}
