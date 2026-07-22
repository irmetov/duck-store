import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

import { Heading } from "./heading";
import { Text } from "./text";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-card bg-surface-sky px-6 py-16 text-center",
        className,
      )}
    >
      <Heading as="h2" size="md" className="max-w-md">
        {title}
      </Heading>
      {description ? (
        <Text tone="muted" className="mt-3 max-w-md">
          {description}
        </Text>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
