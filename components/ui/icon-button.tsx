import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  variant?: "ghost" | "soft" | "outline";
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "size-9",
  md: "size-11",
  lg: "size-12",
} as const;

const variantClasses = {
  ghost: "bg-transparent hover:bg-surface-sky",
  soft: "bg-surface-sky hover:bg-surface-cotton",
  outline: "border border-border bg-surface hover:bg-surface-sky",
} as const;

export function IconButton({
  label,
  variant = "ghost",
  size = "md",
  className,
  type = "button",
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        "inline-flex items-center justify-center rounded-full text-foreground transition-all duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.96]",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
