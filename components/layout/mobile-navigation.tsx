"use client";

import Link from "next/link";

import { primaryNavigation } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";

type MobileNavigationProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MobileNavigation({ open, onOpenChange }: MobileNavigationProps) {
  return (
    <div
      id="mobile-navigation"
      className={cn(
        "border-t border-border bg-background lg:hidden",
        open ? "block" : "hidden",
      )}
    >
      <nav aria-label="Mobile" className="flex flex-col px-page py-3">
        {primaryNavigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => onOpenChange(false)}
            className="rounded-button px-4 py-3 font-heading text-base font-semibold text-foreground hover:bg-surface-sky"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
