"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";

import { IconButton } from "@/components/ui/icon-button";
import { Price } from "@/components/ui/price";
import type { CartLine } from "@/lib/shopify/types";

import { QuantitySelector } from "./quantity-selector";
import { useCart } from "./cart-provider";

type CartItemProps = {
  line: CartLine;
};

export function CartItem({ line }: CartItemProps) {
  const { updateLine, removeLine, isPending } = useCart();
  const image = line.merchandise.product.featuredImage;
  const options = line.merchandise.selectedOptions.filter(
    (opt) => !(opt.name === "Title" && opt.value === "Default Title"),
  );

  return (
    <article className="flex gap-3 border-b border-border py-4 last:border-b-0">
      <Link
        href={`/products/${line.merchandise.product.handle}`}
        className="relative size-20 shrink-0 overflow-hidden rounded-input bg-surface-sky"
      >
        {image ? (
          <Image
            src={image.url}
            alt={image.altText || line.merchandise.product.title}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : null}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/products/${line.merchandise.product.handle}`}
              className="font-heading text-sm font-semibold text-foreground hover:text-accent"
            >
              {line.merchandise.product.title}
            </Link>
            {options.length ? (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {options.map((opt) => opt.value).join(" · ")}
              </p>
            ) : null}
          </div>
          <IconButton
            label={`Remove ${line.merchandise.product.title}`}
            size="sm"
            disabled={isPending}
            onClick={() => removeLine(line.id)}
          >
            <Trash2 className="size-4" aria-hidden />
          </IconButton>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3">
          <QuantitySelector
            value={line.quantity}
            onChange={(quantity) => updateLine(line.id, quantity)}
          />
          <Price price={line.cost.totalAmount} size="sm" />
        </div>
      </div>
    </article>
  );
}
