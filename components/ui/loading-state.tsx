import { cn } from "@/lib/utils/cn";

type LoadingStateProps = {
  label?: string;
  className?: string;
  rows?: number;
};

export function LoadingState({
  label = "Loading…",
  className,
  rows = 4,
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn("space-y-4 py-8", className)}
    >
      <span className="sr-only">{label}</span>
      <div className="h-8 w-48 animate-pulse rounded-button bg-surface-sky" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="aspect-square animate-pulse rounded-card bg-surface-sky"
          />
        ))}
      </div>
    </div>
  );
}
