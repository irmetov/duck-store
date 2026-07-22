import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import type { ProductCardData } from "@/lib/shopify/types";
import {
  getCardHoverClass,
  getProductAspectClass,
} from "@/lib/theme/theme-utils";
import { cn } from "@/lib/utils/cn";

type ProductCardProps = {
  product: ProductCardData;
  className?: string;
};

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.handle}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-card border-graphic bg-surface transition-colors duration-normal hover:bg-surface-lime",
        getCardHoverClass(),
        className,
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden border-b border-border bg-sky-pale",
          getProductAspectClass(),
        )}
      >
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-surface-cream text-sm font-bold text-foreground">
            No image
          </div>
        )}
        {!product.availableForSale ? (
          <Badge tone="danger" className="absolute left-3 top-3">
            Sold out
          </Badge>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1 bg-surface p-3 group-hover:bg-surface-lime">
        <h3 className="font-heading text-base font-bold leading-snug text-foreground">
          {product.title}
        </h3>
        <Price
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          size="sm"
        />
      </div>
    </Link>
  );
}
