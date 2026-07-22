import { formatMoney, hasDiscount } from "@/lib/shopify/money";
import type { Money } from "@/lib/shopify/types";
import { cn } from "@/lib/utils/cn";

type PriceProps = {
  price: Money;
  compareAtPrice?: Money | null;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
} as const;

export function Price({
  price,
  compareAtPrice,
  className,
  size = "md",
}: PriceProps) {
  const discounted = hasDiscount(price.amount, compareAtPrice?.amount);

  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-2 font-heading font-semibold tabular-nums",
        sizeClasses[size],
        className,
      )}
    >
      <span className="text-foreground">
        {formatMoney(price.amount, price.currencyCode)}
      </span>
      {discounted && compareAtPrice ? (
        <span className="text-sm font-medium text-muted-foreground line-through">
          {formatMoney(compareAtPrice.amount, compareAtPrice.currencyCode)}
        </span>
      ) : null}
    </span>
  );
}
