"use client";

import Link from "next/link";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { EmptyState } from "@/components/ui/empty-state";
import { Price } from "@/components/ui/price";
import { Text } from "@/components/ui/text";
import { storeConfig } from "@/config/store";
import { redirectToCheckoutAction } from "@/lib/shopify/cart-actions";

import { CartItem } from "./cart-item";
import { useCart } from "./cart-provider";

export function CartDrawer() {
  const { cart, isOpen, closeCart, isPending } = useCart();
  const [checkoutPending, startCheckout] = useTransition();
  const lines = cart?.lines ?? [];
  const isEmpty = lines.length === 0;

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) closeCart();
      }}
      title="Your cart"
      description={
        isEmpty
          ? "Your flock is waiting."
          : `${cart?.totalQuantity ?? 0} item${(cart?.totalQuantity ?? 0) === 1 ? "" : "s"}`
      }
      footer={
        !isEmpty && cart ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between font-heading font-semibold">
              <span>Subtotal</span>
              <Price price={cart.cost.subtotalAmount} />
            </div>
            <Text size="sm" tone="muted">
              {storeConfig.shippingNote}
            </Text>
            <Button
              size="lg"
              className="w-full"
              disabled={checkoutPending || isPending}
              onClick={() => {
                startCheckout(async () => {
                  await redirectToCheckoutAction();
                });
              }}
            >
              {checkoutPending ? "Redirecting…" : "Checkout"}
            </Button>
            <Button asChild variant="outline" size="md" className="w-full">
              <Link href="/cart" onClick={closeCart}>
                View cart
              </Link>
            </Button>
          </div>
        ) : undefined
      }
    >
      {isEmpty ? (
        <EmptyState
          title="Cart is empty"
          description="Add a rubber ducky and make a splash."
          action={
            <Button asChild>
              <Link href="/products" onClick={closeCart}>
                Shop ducks
              </Link>
            </Button>
          }
          className="border-0 bg-transparent py-10"
        />
      ) : (
        <div>
          {lines.map((line) => (
            <CartItem key={line.id} line={line} />
          ))}
        </div>
      )}
    </Drawer>
  );
}
