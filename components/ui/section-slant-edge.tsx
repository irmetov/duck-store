import { cn } from "@/lib/utils/cn";

type SectionSlantEdgeProps = {
  /** Matching solid section background class, e.g. `bg-surface-orange` */
  className: string;
  /** Alternating slant direction */
  direction?: "down-right" | "down-left";
};

/**
 * Solid-color diagonal tongue overhanging into the next section.
 * Parent section must NOT use overflow:hidden / overflow-x-clip.
 */
export function SectionSlantEdge({
  className,
  direction = "down-right",
}: SectionSlantEdgeProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 z-20 h-12 translate-y-[calc(100%-1px)] sm:h-14 lg:h-16",
        direction === "down-right" &&
          "[clip-path:polygon(0_0,100%_0,0_100%)]",
        direction === "down-left" &&
          "[clip-path:polygon(0_0,100%_0,100%_100%)]",
        className,
      )}
    />
  );
}
