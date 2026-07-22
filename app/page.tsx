import { HomepageSections } from "@/components/sections/homepage-sections";
import { Text } from "@/components/ui/text";
import { isShopifyConfigured } from "@/lib/shopify/client";

export default function HomePage() {
  return (
    <>
      {!isShopifyConfigured() ? (
        <div className="bg-surface-sky px-page py-3 text-center">
          <Text size="sm" className="text-foreground">
            Local demo mode — browsing sample rubber duckies. Connect Shopify to enable cart and checkout.
          </Text>
        </div>
      ) : null}
      <HomepageSections />
    </>
  );
}
