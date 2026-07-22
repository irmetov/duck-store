"use client";

import { useMemo, useState } from "react";

import { Text } from "@/components/ui/text";
import { storeConfig } from "@/config/store";
import type { Product } from "@/lib/shopify/types";

import { AddToCartButton } from "./add-to-cart-button";
import { ProductPrice } from "./product-price";
import { QuantitySelector } from "./quantity-selector";
import { VariantSelector } from "./variant-selector";

type ProductInfoProps = {
  product: Product;
};

function findVariant(
  product: Product,
  selectedOptions: Record<string, string>,
) {
  return (
    product.variants.find((variant) =>
      variant.selectedOptions.every(
        (option) => selectedOptions[option.name] === option.value,
      ),
    ) ?? product.variants[0]
  );
}

export function ProductInfo({ product }: ProductInfoProps) {
  const initialOptions = useMemo(() => {
    const defaults: Record<string, string> = {};
    for (const option of product.options) {
      defaults[option.name] = option.values[0] ?? "";
    }
    const firstAvailable = product.variants.find((v) => v.availableForSale);
    if (firstAvailable) {
      for (const opt of firstAvailable.selectedOptions) {
        defaults[opt.name] = opt.value;
      }
    }
    return defaults;
  }, [product]);

  const [selectedOptions, setSelectedOptions] = useState(initialOptions);
  const [quantity, setQuantity] = useState(1);
  const variant = findVariant(product, selectedOptions);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {product.title}
        </h1>
        <div className="mt-3">
          <ProductPrice
            price={variant?.price ?? product.priceRange.minVariantPrice}
            compareAtPrice={
              variant?.compareAtPrice ??
              product.compareAtPriceRange.minVariantPrice
            }
          />
        </div>
      </div>

      {product.description ? (
        <Text tone="muted" className="max-w-prose">
          {product.description}
        </Text>
      ) : null}

      <VariantSelector
        options={product.options}
        variants={product.variants}
        selectedOptions={selectedOptions}
        onChange={(name, value) =>
          setSelectedOptions((prev) => ({ ...prev, [name]: value }))
        }
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <QuantitySelector value={quantity} onChange={setQuantity} />
        <AddToCartButton
          merchandiseId={variant?.id ?? ""}
          quantity={quantity}
          available={Boolean(variant?.availableForSale)}
          className="flex-1"
        />
      </div>

      <Text size="sm" tone="muted">
        {storeConfig.shippingNote}
      </Text>
      <Text size="sm" tone="muted">
        {storeConfig.returnNote}
      </Text>
    </div>
  );
}
