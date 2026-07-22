import type {
  Cart,
  CartLine,
  Collection,
  Connection,
  Money,
  PageInfo,
  Product,
  ProductCardData,
  ProductVariant,
  ShopifyImage,
} from "./types";

type RawMoney = { amount: string; currencyCode: string };
type RawImage = {
  url: string;
  altText?: string | null;
  width?: number;
  height?: number;
} | null;

function money(value?: RawMoney | null): Money {
  return {
    amount: value?.amount ?? "0.0",
    currencyCode: value?.currencyCode ?? "USD",
  };
}

function image(value?: RawImage): ShopifyImage | null {
  if (!value?.url) return null;
  return {
    url: value.url,
    altText: value.altText ?? null,
    width: value.width,
    height: value.height,
  };
}

export function normalizePageInfo(
  pageInfo?: { hasNextPage?: boolean; endCursor?: string | null } | null,
): PageInfo {
  return {
    hasNextPage: Boolean(pageInfo?.hasNextPage),
    endCursor: pageInfo?.endCursor ?? null,
  };
}

export function normalizeProductCard(node: {
  id: string;
  handle: string;
  title: string;
  availableForSale: boolean;
  featuredImage?: RawImage;
  priceRange: { minVariantPrice: RawMoney };
  compareAtPriceRange?: { minVariantPrice: RawMoney };
}): ProductCardData {
  const price = money(node.priceRange.minVariantPrice);
  const compare = node.compareAtPriceRange
    ? money(node.compareAtPriceRange.minVariantPrice)
    : null;

  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    featuredImage: image(node.featuredImage),
    price,
    compareAtPrice:
      compare && Number.parseFloat(compare.amount) > Number.parseFloat(price.amount)
        ? compare
        : null,
    availableForSale: node.availableForSale,
  };
}

export function normalizeProduct(node: {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  tags: string[];
  productType: string;
  vendor: string;
  featuredImage?: RawImage;
  images: Connection<{
    url: string;
    altText?: string | null;
    width?: number;
    height?: number;
  }>;
  options: { id: string; name: string; values: string[] }[];
  variants: Connection<{
    id: string;
    title: string;
    availableForSale: boolean;
    sku?: string | null;
    selectedOptions: { name: string; value: string }[];
    price: RawMoney;
    compareAtPrice?: RawMoney | null;
    image?: RawImage;
  }>;
  priceRange: { minVariantPrice: RawMoney; maxVariantPrice: RawMoney };
  compareAtPriceRange: { minVariantPrice: RawMoney; maxVariantPrice: RawMoney };
  seo: { title?: string | null; description?: string | null };
}): Product {
  const variants: ProductVariant[] = node.variants.edges.map(({ node: variant }) => ({
    id: variant.id,
    title: variant.title,
    availableForSale: variant.availableForSale,
    sku: variant.sku ?? null,
    selectedOptions: variant.selectedOptions,
    price: money(variant.price),
    compareAtPrice: variant.compareAtPrice ? money(variant.compareAtPrice) : null,
    image: image(variant.image),
  }));

  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description,
    descriptionHtml: node.descriptionHtml,
    availableForSale: node.availableForSale,
    tags: node.tags,
    productType: node.productType,
    vendor: node.vendor,
    featuredImage: image(node.featuredImage),
    images: node.images.edges.map(({ node: img }) => ({
      url: img.url,
      altText: img.altText ?? null,
      width: img.width,
      height: img.height,
    })),
    options: node.options,
    variants,
    priceRange: {
      minVariantPrice: money(node.priceRange.minVariantPrice),
      maxVariantPrice: money(node.priceRange.maxVariantPrice),
    },
    compareAtPriceRange: {
      minVariantPrice: money(node.compareAtPriceRange.minVariantPrice),
      maxVariantPrice: money(node.compareAtPriceRange.maxVariantPrice),
    },
    seo: {
      title: node.seo.title ?? null,
      description: node.seo.description ?? null,
    },
  };
}

export function normalizeCollection(node: {
  id: string;
  handle: string;
  title: string;
  description: string;
  image?: RawImage;
  seo: { title?: string | null; description?: string | null };
}): Collection {
  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description,
    image: image(node.image),
    seo: {
      title: node.seo.title ?? null,
      description: node.seo.description ?? null,
    },
  };
}

export function normalizeCart(cart: {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: RawMoney;
    totalAmount: RawMoney;
  };
  lines: Connection<{
    id: string;
    quantity: number;
    merchandise: {
      id: string;
      title: string;
      selectedOptions: { name: string; value: string }[];
      product: {
        handle: string;
        title: string;
        featuredImage?: RawImage;
      };
      price: RawMoney;
    };
    cost: { totalAmount: RawMoney };
  }>;
} | null): Cart | null {
  if (!cart) return null;

  const lines: CartLine[] = cart.lines.edges.map(({ node }) => ({
    id: node.id,
    quantity: node.quantity,
    merchandise: {
      id: node.merchandise.id,
      title: node.merchandise.title,
      selectedOptions: node.merchandise.selectedOptions,
      product: {
        handle: node.merchandise.product.handle,
        title: node.merchandise.product.title,
        featuredImage: image(node.merchandise.product.featuredImage),
      },
      price: money(node.merchandise.price),
    },
    cost: {
      totalAmount: money(node.cost.totalAmount),
    },
  }));

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    cost: {
      subtotalAmount: money(cart.cost.subtotalAmount),
      totalAmount: money(cart.cost.totalAmount),
    },
    lines,
  };
}
