import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type HeadingLevel = "h1" | "h2" | "h3" | "h4";

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  as?: HeadingLevel;
  size?: "display" | "xl" | "lg" | "md" | "sm";
};

const sizeClasses = {
  display: "text-4xl sm:text-5xl lg:text-6xl leading-[1.05]",
  xl: "text-3xl sm:text-4xl lg:text-5xl leading-tight",
  lg: "text-2xl sm:text-3xl leading-tight",
  md: "text-xl sm:text-2xl leading-snug",
  sm: "text-lg sm:text-xl leading-snug",
} as const;

export function Heading({
  as: Comp = "h2",
  size = "lg",
  className,
  children,
  ...props
}: HeadingProps) {
  return (
    <Comp
      className={cn(
        "font-heading text-foreground tracking-tight text-balance",
        sizeClasses[size],
        className,
      )}
      style={{ fontWeight: "var(--font-weight-heading)" }}
      {...props}
    >
      {children}
    </Comp>
  );
}
