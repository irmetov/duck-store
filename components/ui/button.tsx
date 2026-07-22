import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-button font-heading font-bold uppercase tracking-wide transition-colors duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:translate-y-px",
  {
    variants: {
      variant: {
        primary:
          "border-graphic border-surface-navy bg-surface-frost text-white hover:bg-surface-lime hover:text-surface-navy hover:border-surface-navy",
        secondary:
          "border-graphic border-surface-navy bg-surface-navy text-surface-navy-foreground hover:bg-surface-raspberry hover:border-surface-raspberry",
        outline:
          "border-graphic border-surface-navy bg-surface text-surface-navy hover:bg-surface-orange",
        ghost:
          "border-graphic border-surface-navy bg-surface-cream text-surface-navy hover:bg-surface-lime",
        soft:
          "border-graphic border-surface-navy bg-surface-cotton text-surface-navy hover:bg-surface-raspberry hover:text-white",
        danger:
          "border-graphic border-surface-navy bg-surface-raspberry text-white hover:bg-strawberry",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-8 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  type = "button",
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      type={asChild ? undefined : type}
      {...props}
    />
  );
}

export { buttonVariants };
