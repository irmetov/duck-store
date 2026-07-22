export function formatMoney(amount: string, currencyCode: string, locale = "en-US") {
  const value = Number.parseFloat(amount);

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

export function hasDiscount(price: string, compareAtPrice?: string | null) {
  if (!compareAtPrice) return false;
  return Number.parseFloat(compareAtPrice) > Number.parseFloat(price);
}
