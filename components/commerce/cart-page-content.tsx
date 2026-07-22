"use client";

import Link from "next/link";
import { useTransition } from "react";

import { useCart } from "@/components/commerce/cart-provider";
import { CartItem } from "@/components/commerce/cart-item";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Heading } from "@/components/ui/heading";
import { Price } from "@/components/ui/price";
import { Text } from "@/components/ui/text";
import { storeConfig } from "@/config/store";
import { redirectToCheckoutAction } from "@/lib/shopify/cart-actions";

export function CartPageContent() {
  const { cart, isPending } = useCart();
  const [checkoutPending, startCheckout] = useTransition();
  const lines = cart?.lines ?? [];

  if (!cart || !lines.length) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Add a rubber ducky and make a splash."
        action={
          <Button asChild>
            <Link href="/products">Shop ducks</Link>
          </Button>
        }
      />
    );
  }

  return (
    <>
      <Heading as="h1" size="xl" className="mb-8">
        Your cart
      </Heading>

      <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
        <div className="rounded-card border border-border bg-surface p-4 sm:p-6">
          {lines.map((line) => (
            <CartItem key={line.id} line={line} />
          ))}
        </div>

        <aside className="h-fit rounded-card border border-border bg-surface-cream p-6">
          <div className="flex items-center justify-between font-heading text-lg font-semibold">
            <span>Subtotal</span>
            <Price price={cart.cost.subtotalAmount} />
          </div>
          <Text size="sm" tone="muted" className="mt-3">
            {storeConfig.shippingNote}
          </Text>
          <Button
            type="button"
            size="lg"
            className="mt-6 w-full"
            disabled={checkoutPending || isPending}
            onClick={() => {
              startCheckout(async () => {
                await redirectToCheckoutAction();
              });
            }}
          >
            {checkoutPending ? "Redirecting…" : "Checkout"}
          </Button>
          <Button asChild variant="outline" className="mt-3 w-full">
            <Link href="/products">Continue shopping</Link>
          </Button>
        </aside>
      </div>
    </>
  );
}
