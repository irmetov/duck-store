import type { Metadata } from "next";

import { CartProvider } from "@/components/commerce/cart-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { storeConfig } from "@/config/store";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: storeConfig.name,
    template: `%s · ${storeConfig.name}`,
  },
  description: storeConfig.description,
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  openGraph: {
    title: storeConfig.name,
    description: storeConfig.description,
    siteName: storeConfig.name,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {/* Adobe Fonts: Degular + Eldwin Script (kit yki4nse) */}
        <link rel="stylesheet" href="https://use.typekit.net/yki4nse.css" />
      </head>
      <body className="flex min-h-full flex-col bg-background font-body text-foreground">
        <CartProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
