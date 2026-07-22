import { cn } from "@/lib/utils/cn";

type SectionMarkProps = {
  className?: string;
};

/** Thick graphic underline bar under section titles */
export function SectionMark({ className }: SectionMarkProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "mt-3 block h-2 w-16 rounded-badge bg-raspberry",
        className,
      )}
    />
  );
}
