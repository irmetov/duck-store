import { cookies } from "next/headers";

export const CART_COOKIE = "cartId";

export async function getCartId() {
  const jar = await cookies();
  return jar.get(CART_COOKIE)?.value;
}

export async function setCartId(cartId: string) {
  const jar = await cookies();
  jar.set(CART_COOKIE, cartId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearCartId() {
  const jar = await cookies();
  jar.delete(CART_COOKIE);
}
