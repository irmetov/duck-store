import Link from "next/link";

import { Container } from "@/components/ui/container";
import { storeConfig } from "@/config/store";
import { cn } from "@/lib/utils/cn";

type AnnouncementBarProps = {
  className?: string;
};

export function AnnouncementBar({ className }: AnnouncementBarProps) {
  return (
    <div
      className={cn(
        "bg-surface-raspberry text-surface-raspberry-foreground",
        className,
      )}
    >
      <Container className="flex items-center justify-center gap-2 py-2.5 text-center text-sm font-bold uppercase tracking-wide">
        <p>
          {storeConfig.shippingNote}{" "}
          <Link
            href="/products"
            className="underline decoration-2 underline-offset-4 hover:text-surface-lime"
          >
            Shop ducks
          </Link>
        </p>
      </Container>
    </div>
  );
}
