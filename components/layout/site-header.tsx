"use client";

import { Search, ShoppingBag, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useCart } from "@/components/commerce/cart-provider";
import { BrandLogo } from "@/components/ui/brand-logo";
import { Container } from "@/components/ui/container";
import { IconButton } from "@/components/ui/icon-button";
import { primaryNavigation } from "@/config/navigation";
import { storeConfig } from "@/config/store";
import { cn } from "@/lib/utils/cn";

import { MobileNavigation } from "./mobile-navigation";

export function SiteHeader() {
  const { openCart, totalQuantity } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <Container className="flex h-header items-center justify-between gap-4">
        <div className="flex items-center gap-2 lg:hidden">
          <IconButton
            label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? (
              <X className="size-5" aria-hidden />
            ) : (
              <Menu className="size-5" aria-hidden />
            )}
          </IconButton>
        </div>

        <Link
          href="/"
          className="text-accent"
          aria-label={storeConfig.name}
        >
          <BrandLogo title={storeConfig.name} />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {primaryNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-button px-4 py-2 font-body text-sm font-bold text-foreground hover:bg-surface-sky"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/search"
            className="inline-flex size-11 items-center justify-center rounded-full text-foreground transition-all duration-normal hover:bg-surface-sky focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Search products"
          >
            <Search className="size-5" aria-hidden />
          </Link>
          <button
            type="button"
            onClick={openCart}
            aria-label={
              totalQuantity
                ? `Open cart, ${totalQuantity} items`
                : "Open cart"
            }
            className={cn(
              "relative inline-flex size-11 items-center justify-center rounded-full text-foreground transition-all duration-normal hover:bg-surface-sky focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            <ShoppingBag className="size-5" aria-hidden />
            {totalQuantity > 0 ? (
              <span className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {totalQuantity > 99 ? "99+" : totalQuantity}
              </span>
            ) : null}
          </button>
        </div>
      </Container>

      <MobileNavigation open={mobileOpen} onOpenChange={setMobileOpen} />
    </header>
  );
}
