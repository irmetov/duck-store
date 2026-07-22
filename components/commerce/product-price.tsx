import { Price } from "@/components/ui/price";
import type { Money } from "@/lib/shopify/types";

type ProductPriceProps = {
  price: Money;
  compareAtPrice?: Money | null;
  size?: "sm" | "md" | "lg";
};

export function ProductPrice({
  price,
  compareAtPrice,
  size = "lg",
}: ProductPriceProps) {
  return <Price price={price} compareAtPrice={compareAtPrice} size={size} />;
}
