"use client";

import type { ProductOption, ProductVariant } from "@/lib/shopify/types";
import { cn } from "@/lib/utils/cn";

type VariantSelectorProps = {
  options: ProductOption[];
  variants: ProductVariant[];
  selectedOptions: Record<string, string>;
  onChange: (name: string, value: string) => void;
};

function isOptionAvailable(
  variants: ProductVariant[],
  selectedOptions: Record<string, string>,
  optionName: string,
  optionValue: string,
) {
  const next = { ...selectedOptions, [optionName]: optionValue };
  return variants.some(
    (variant) =>
      variant.availableForSale &&
      variant.selectedOptions.every(
        (opt) => next[opt.name] === opt.value,
      ),
  );
}

export function VariantSelector({
  options,
  variants,
  selectedOptions,
  onChange,
}: VariantSelectorProps) {
  const meaningfulOptions = options.filter(
    (option) =>
      !(option.name === "Title" && option.values.length === 1 && option.values[0] === "Default Title"),
  );

  if (!meaningfulOptions.length) return null;

  return (
    <div className="space-y-5">
      {meaningfulOptions.map((option) => (
        <fieldset key={option.id}>
          <legend className="font-heading text-sm font-semibold text-foreground">
            {option.name}
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {option.values.map((value) => {
              const selected = selectedOptions[option.name] === value;
              const available = isOptionAvailable(
                variants,
                selectedOptions,
                option.name,
                value,
              );

              return (
                <button
                  key={value}
                  type="button"
                  disabled={!available}
                  aria-pressed={selected}
                  onClick={() => onChange(option.name, value)}
                  className={cn(
                    "rounded-button border px-4 py-2 font-heading text-sm font-semibold transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selected
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border bg-surface text-foreground hover:border-accent",
                    !available && "cursor-not-allowed opacity-40",
                  )}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
