"use client";

import { Minus, Plus } from "lucide-react";

import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils/cn";

type QuantitySelectorProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
};

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
}: QuantitySelectorProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-button border border-border bg-surface px-1",
        className,
      )}
    >
      <IconButton
        label="Decrease quantity"
        size="sm"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Minus className="size-4" aria-hidden />
      </IconButton>
      <span
        aria-live="polite"
        className="min-w-8 text-center font-heading font-semibold tabular-nums"
      >
        {value}
      </span>
      <IconButton
        label="Increase quantity"
        size="sm"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <Plus className="size-4" aria-hidden />
      </IconButton>
    </div>
  );
}
