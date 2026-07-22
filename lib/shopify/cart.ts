import { shopifyFetch } from "./client";
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
} from "./mutations";
import { normalizeCart } from "./normalize";
import { CART_QUERY } from "./queries";
import type { Cart } from "./types";

type UserErrors = { field?: string[] | null; message: string }[];

type CartPayload = {
  cart: Parameters<typeof normalizeCart>[0];
  userErrors: UserErrors;
};

function assertNoUserErrors(userErrors: UserErrors) {
  if (userErrors?.length) {
    throw new Error(userErrors.map((error) => error.message).join("; "));
  }
}

export async function createCart(
  lines?: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const data = await shopifyFetch<{ cartCreate: CartPayload }>({
    query: CART_CREATE_MUTATION,
    variables: { lines },
    cache: "no-store",
  });

  assertNoUserErrors(data.cartCreate.userErrors);
  const cart = normalizeCart(data.cartCreate.cart);
  if (!cart) throw new Error("Unable to create cart.");
  return cart;
}

export async function getCart(cartId: string): Promise<Cart | null> {
  try {
    const data = await shopifyFetch<{ cart: Parameters<typeof normalizeCart>[0] }>({
      query: CART_QUERY,
      variables: { cartId },
      cache: "no-store",
    });
    return normalizeCart(data.cart);
  } catch (error) {
    console.error("[getCart]", error);
    return null;
  }
}

export async function addCartLines(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesAdd: CartPayload }>({
    query: CART_LINES_ADD_MUTATION,
    variables: { cartId, lines },
    cache: "no-store",
  });

  assertNoUserErrors(data.cartLinesAdd.userErrors);
  const cart = normalizeCart(data.cartLinesAdd.cart);
  if (!cart) throw new Error("Unable to update cart.");
  return cart;
}

export async function updateCartLines(
  cartId: string,
  lines: { id: string; quantity: number }[],
): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesUpdate: CartPayload }>({
    query: CART_LINES_UPDATE_MUTATION,
    variables: { cartId, lines },
    cache: "no-store",
  });

  assertNoUserErrors(data.cartLinesUpdate.userErrors);
  const cart = normalizeCart(data.cartLinesUpdate.cart);
  if (!cart) throw new Error("Unable to update cart.");
  return cart;
}

export async function removeCartLines(cartId: string, lineIds: string[]): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesRemove: CartPayload }>({
    query: CART_LINES_REMOVE_MUTATION,
    variables: { cartId, lineIds },
    cache: "no-store",
  });

  assertNoUserErrors(data.cartLinesRemove.userErrors);
  const cart = normalizeCart(data.cartLinesRemove.cart);
  if (!cart) throw new Error("Unable to update cart.");
  return cart;
}

export async function getCheckoutUrl(cartId: string): Promise<string | null> {
  const cart = await getCart(cartId);
  return cart?.checkoutUrl ?? null;
}
