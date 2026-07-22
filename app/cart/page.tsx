import { CartPageContent } from "@/components/commerce/cart-page-content";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { isShopifyConfigured } from "@/lib/shopify/client";

export const metadata = {
  title: "Cart",
  description: "Review your Duck Donuts cart.",
};

export default function CartPage() {
  if (!isShopifyConfigured()) {
    return (
      <Container className="py-16">
        <EmptyState
          title="Shopify is not configured"
          description="Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN to use the cart."
        />
      </Container>
    );
  }

  return (
    <Container className="py-12 sm:py-16">
      <CartPageContent />
    </Container>
  );
}
