export type Money = {
  amount: string;
  currencyCode: string;
};

export type ShopifyImage = {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  sku: string | null;
  selectedOptions: { name: string; value: string }[];
  price: Money;
  compareAtPrice: Money | null;
  image: ShopifyImage | null;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  tags: string[];
  productType: string;
  vendor: string;
  featuredImage: ShopifyImage | null;
  images: ShopifyImage[];
  options: ProductOption[];
  variants: ProductVariant[];
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  compareAtPriceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  seo: {
    title: string | null;
    description: string | null;
  };
};

export type ProductCardData = {
  id: string;
  handle: string;
  title: string;
  productType?: string;
  featuredImage: ShopifyImage | null;
  price: Money;
  compareAtPrice: Money | null;
  availableForSale: boolean;
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
  seo: {
    title: string | null;
    description: string | null;
  };
};

export type CollectionWithProducts = Collection & {
  products: ProductCardData[];
  pageInfo: PageInfo;
};

export type PageInfo = {
  hasNextPage: boolean;
  endCursor: string | null;
};

export type CartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    selectedOptions: { name: string; value: string }[];
    product: {
      handle: string;
      title: string;
      featuredImage: ShopifyImage | null;
    };
    price: Money;
  };
  cost: {
    totalAmount: Money;
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
  };
  lines: CartLine[];
};

export type Connection<T> = {
  edges: { node: T; cursor?: string }[];
  pageInfo?: {
    hasNextPage: boolean;
    endCursor?: string | null;
  };
};
