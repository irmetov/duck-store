import Image from "next/image";
import Link from "next/link";

import type { Collection } from "@/lib/shopify/types";
import { cn } from "@/lib/utils/cn";

type CollectionCardProps = {
  collection: Collection;
  className?: string;
};

type Accent = {
  bg: string;
  text: string;
};

/** Accents from brand screenshots: raspberry / orange / frost */
const accentByHandle: Record<string, Accent> = {
  classics: {
    bg: "bg-surface-raspberry",
    text: "text-surface-raspberry-foreground",
  },
  seasonal: {
    bg: "bg-surface-orange",
    text: "text-surface-orange-foreground",
  },
  limited: {
    bg: "bg-surface-frost",
    text: "text-surface-frost-foreground",
  },
};

const accentFallback: Accent[] = [
  { bg: "bg-surface-raspberry", text: "text-surface-raspberry-foreground" },
  { bg: "bg-surface-orange", text: "text-surface-orange-foreground" },
  { bg: "bg-surface-frost", text: "text-surface-frost-foreground" },
];

function getAccent(handle: string, index = 0): Accent {
  return (
    accentByHandle[handle] ??
    accentFallback[index % accentFallback.length]!
  );
}

export function CollectionCard({
  collection,
  className,
  index = 0,
}: CollectionCardProps & { index?: number }) {
  const accent = getAccent(collection.handle, index);

  return (
    <Link
      href={`/collections/${collection.handle}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-card border-graphic bg-surface transition-colors duration-normal",
        className,
      )}
    >
      <div className="relative aspect-[4/5] shrink-0 bg-sky-pale">
        {collection.image ? (
          <Image
            src={collection.image.url}
            alt={collection.image.altText || collection.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-slow group-hover:scale-105"
          />
        ) : (
          <div className={cn("absolute inset-0", accent.bg)} />
        )}
      </div>
      <div
        className={cn(
          "flex flex-1 flex-col border-t border-border p-5",
          accent.bg,
          accent.text,
        )}
      >
        <h3 className="font-heading text-2xl font-bold">{collection.title}</h3>
        {collection.description ? (
          <p className="mt-1 line-clamp-3 text-sm font-medium">
            {collection.description}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
