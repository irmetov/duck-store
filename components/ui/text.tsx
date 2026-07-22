import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type TextProps = HTMLAttributes<HTMLParagraphElement> & {
  as?: "p" | "span" | "div";
  size?: "sm" | "md" | "lg";
  tone?: "default" | "muted" | "inverse";
};

const sizeClasses = {
  sm: "text-sm leading-relaxed",
  md: "text-base leading-relaxed",
  lg: "text-lg leading-relaxed",
} as const;

const toneClasses = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  inverse: "text-surface-navy-foreground",
} as const;

export function Text({
  as: Comp = "p",
  size = "md",
  tone = "default",
  className,
  children,
  ...props
}: TextProps) {
  return (
    <Comp
      className={cn(
        "font-body text-pretty",
        sizeClasses[size],
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
