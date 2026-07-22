"use client";

import { primaryNavigation } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";

import { NavHoverLink } from "./nav-hover-link";

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
        {primaryNavigation.map((item, index) => (
          <NavHoverLink
            key={item.href}
            href={item.href}
            label={item.label}
            index={index}
            className="w-full justify-start px-2.5 py-1.5 font-heading font-semibold"
            onClick={() => onOpenChange(false)}
          />
        ))}
      </nav>
    </div>
  );
}
