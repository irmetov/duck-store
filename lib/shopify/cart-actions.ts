"use server";

import { redirect } from "next/navigation";

import {
  addCartLines,
  createCart,
  getCart,
  getCheckoutUrl,
  removeCartLines,
  updateCartLines,
} from "./cart";
import { clearCartId, getCartId, setCartId } from "./cookies";
import type { Cart } from "./types";

async function ensureCart(): Promise<Cart> {
  const existingId = await getCartId();

  if (existingId) {
    const existing = await getCart(existingId);
    if (existing) return existing;
    await clearCartId();
  }

  const cart = await createCart();
  await setCartId(cart.id);
  return cart;
}

function friendlyCartError(error: unknown) {
  const message = error instanceof Error ? error.message : "Something went wrong with your cart.";
  if (/not found|invalid|expired/i.test(message)) {
    return "Your cart expired. Please try adding the item again.";
  }
  return "We couldn't update your cart. Please try again.";
}

export async function addToCartAction(merchandiseId: string, quantity = 1) {
  try {
    const cart = await ensureCart();
    const updated = await addCartLines(cart.id, [{ merchandiseId, quantity }]);
    await setCartId(updated.id);
    return { ok: true as const, cart: updated };
  } catch (error) {
    console.error("[addToCartAction]", error);
    return { ok: false as const, error: friendlyCartError(error) };
  }
}

export async function updateCartLineAction(lineId: string, quantity: number) {
  try {
    if (quantity < 1) {
      return removeCartLineAction(lineId);
    }

    const cartId = await getCartId();
    if (!cartId) return { ok: false as const, error: "Your cart is empty." };

    const updated = await updateCartLines(cartId, [{ id: lineId, quantity }]);
    return { ok: true as const, cart: updated };
  } catch (error) {
    console.error("[updateCartLineAction]", error);
    return { ok: false as const, error: friendlyCartError(error) };
  }
}

export async function removeCartLineAction(lineId: string) {
  try {
    const cartId = await getCartId();
    if (!cartId) return { ok: false as const, error: "Your cart is empty." };

    const updated = await removeCartLines(cartId, [lineId]);
    return { ok: true as const, cart: updated };
  } catch (error) {
    console.error("[removeCartLineAction]", error);
    return { ok: false as const, error: friendlyCartError(error) };
  }
}

export async function getCurrentCartAction(): Promise<Cart | null> {
  const cartId = await getCartId();
  if (!cartId) return null;
  const cart = await getCart(cartId);
  if (!cart) {
    await clearCartId();
    return null;
  }
  return cart;
}

export async function redirectToCheckoutAction() {
  const cartId = await getCartId();
  if (!cartId) {
    return { ok: false as const, error: "Your cart is empty." };
  }

  const checkoutUrl = await getCheckoutUrl(cartId);
  if (!checkoutUrl) {
    return { ok: false as const, error: "Checkout is unavailable right now. Please try again." };
  }

  redirect(checkoutUrl);
}
