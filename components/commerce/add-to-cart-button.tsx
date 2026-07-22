"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { addToCartAction } from "@/lib/shopify/cart-actions";

import { useCart } from "./cart-provider";

type AddToCartButtonProps = {
  merchandiseId: string;
  quantity?: number;
  available?: boolean;
  className?: string;
};

export function AddToCartButton({
  merchandiseId,
  quantity = 1,
  available = true,
  className,
}: AddToCartButtonProps) {
  const { openCart, setCart } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className={className}>
      <Button
        size="lg"
        className="w-full sm:w-auto"
        disabled={!available || !merchandiseId || isPending}
        aria-busy={isPending}
        onClick={() => {
          setError(null);

          if (merchandiseId.startsWith("demo-")) {
            setError(
              "Demo mode: connect Shopify in .env.local to add items and checkout.",
            );
            return;
          }

          startTransition(async () => {
            const result = await addToCartAction(merchandiseId, quantity);
            if (result.ok) {
              setCart(result.cart);
              openCart();
            } else {
              setError(result.error);
            }
          });
        }}
      >
        {!available
          ? "Sold out"
          : isPending
            ? "Adding…"
            : "Add to cart"}
      </Button>
      {error ? (
        <p role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
