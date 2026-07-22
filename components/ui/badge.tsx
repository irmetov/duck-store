import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "accent" | "warning" | "danger" | "success" | "soft" | "navy";
};

const toneClasses = {
  accent: "bg-accent text-accent-foreground",
  warning: "bg-warning text-white",
  danger: "bg-danger text-white",
  success: "bg-success text-white",
  soft: "bg-surface-sweetness text-foreground",
  navy: "bg-surface-navy text-surface-navy-foreground",
} as const;

export function Badge({
  tone = "soft",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-badge px-3 py-1 font-heading text-xs font-semibold uppercase tracking-wide",
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
