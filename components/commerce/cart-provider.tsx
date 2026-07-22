"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";

import {
  getCurrentCartAction,
  removeCartLineAction,
  updateCartLineAction,
} from "@/lib/shopify/cart-actions";
import type { Cart } from "@/lib/shopify/types";

import { CartDrawer } from "./cart-drawer";

type CartContextValue = {
  cart: Cart | null;
  totalQuantity: number;
  isOpen: boolean;
  isPending: boolean;
  error: string | null;
  openCart: () => void;
  closeCart: () => void;
  clearError: () => void;
  setCart: (cart: Cart | null) => void;
  refreshCart: () => Promise<void>;
  updateLine: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

type CartProviderProps = {
  children: ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const clearError = useCallback(() => setError(null), []);
  const openCart = useCallback(() => {
    setError(null);
    setIsOpen(true);
  }, []);
  const closeCart = useCallback(() => {
    setError(null);
    setIsOpen(false);
  }, []);

  const refreshCart = useCallback(async () => {
    try {
      const next = await getCurrentCartAction();
      setCart(next);
    } catch (error) {
      console.error("[CartProvider] refreshCart", error);
    }
  }, []);

  useEffect(() => {
    let active = true;

    getCurrentCartAction()
      .then((next) => {
        if (active) setCart(next);
      })
      .catch((error) => {
        console.error("[CartProvider] initial cart load", error);
      });

    return () => {
      active = false;
    };
  }, []);

  const updateLine = useCallback((lineId: string, quantity: number) => {
    startTransition(async () => {
      setError(null);
      const result = await updateCartLineAction(lineId, quantity);
      if (result.ok) {
        setCart(result.cart);
      } else {
        setError(result.error);
      }
    });
  }, []);

  const removeLine = useCallback((lineId: string) => {
    startTransition(async () => {
      setError(null);
      const result = await removeCartLineAction(lineId);
      if (result.ok) {
        setCart(result.cart);
      } else {
        setError(result.error);
      }
    });
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      totalQuantity: cart?.totalQuantity ?? 0,
      isOpen,
      isPending,
      error,
      openCart,
      closeCart,
      clearError,
      setCart,
      refreshCart,
      updateLine,
      removeLine,
    }),
    [
      cart,
      isOpen,
      isPending,
      error,
      openCart,
      closeCart,
      clearError,
      refreshCart,
      updateLine,
      removeLine,
    ],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
