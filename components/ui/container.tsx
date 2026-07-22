import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "section" | "main" | "header" | "footer" | "nav";
  narrow?: boolean;
};

export function Container({
  as: Comp = "div",
  narrow = false,
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Comp
      className={cn(
        "mx-auto w-full px-page",
        narrow ? "max-w-3xl" : "max-w-[var(--container-width)]",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
