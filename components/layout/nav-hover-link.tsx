import Link from "next/link";

import { cn } from "@/lib/utils/cn";

const navSlabTones = [
  {
    slab: "bg-surface-lime",
    lightText: false,
    tilt: "hover:-rotate-2 focus-visible:-rotate-2",
  },
  {
    slab: "bg-surface-frost",
    lightText: true,
    tilt: "hover:rotate-2 focus-visible:rotate-2",
  },
  {
    slab: "bg-surface-orange",
    lightText: false,
    tilt: "hover:-rotate-2 focus-visible:-rotate-2",
  },
  {
    slab: "bg-surface-raspberry",
    lightText: true,
    tilt: "hover:rotate-2 focus-visible:rotate-2",
  },
] as const;

type NavHoverLinkProps = {
  href: string;
  label: string;
  index: number;
  className?: string;
  onClick?: () => void;
};

export function NavHoverLink({
  href,
  label,
  index,
  className,
  onClick,
}: NavHoverLinkProps) {
  const tone = navSlabTones[index % navSlabTones.length];

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group relative isolate inline-flex items-center px-2.5 py-1 font-body text-lg font-bold text-foreground",
        "transition-[color,transform] duration-normal ease-[var(--ease-out)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        tone.tilt,
        tone.lightText && "hover:text-white focus-visible:text-white",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 origin-center scale-x-0",
          "transition-transform duration-normal ease-[var(--ease-out)]",
          "group-hover:scale-x-100 group-focus-visible:scale-x-100",
          tone.slab,
        )}
      />
      <span className="relative z-10">{label}</span>
    </Link>
  );
}
