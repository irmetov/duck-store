import type { ProductCardData } from "@/lib/shopify/types";
import { cn } from "@/lib/utils/cn";

import { ProductCard } from "./product-card";

type ProductGridProps = {
  products: ProductCardData[];
  className?: string;
};

export function ProductGrid({ products, className }: ProductGridProps) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6",
        className,
      )}
    >
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
