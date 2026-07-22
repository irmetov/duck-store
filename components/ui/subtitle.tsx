import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type SubtitleProps = HTMLAttributes<HTMLParagraphElement> & {
  as?: "p" | "span" | "div";
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "text-lg sm:text-xl",
  md: "text-xl sm:text-2xl",
  lg: "text-2xl sm:text-3xl lg:text-4xl",
} as const;

/** Eldwin Script — for subtitles / decorative lines only */
export function Subtitle({
  as: Comp = "p",
  size = "md",
  className,
  children,
  ...props
}: SubtitleProps) {
  return (
    <Comp
      className={cn(
        "font-subtitle text-foreground leading-snug text-pretty",
        sizeClasses[size],
        className,
      )}
      style={{ fontWeight: "var(--font-weight-subtitle)" }}
      {...props}
    >
      {children}
    </Comp>
  );
}
