import Link from "next/link";

import { BrandLogo } from "@/components/ui/brand-logo";
import { Container } from "@/components/ui/container";
import { footerNavigation } from "@/config/navigation";
import { storeConfig } from "@/config/store";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-0 mt-auto bg-surface-navy pt-[var(--section-padding-top)] text-surface-navy-foreground">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <Link
            href="/"
            className="inline-block text-surface-lime"
            aria-label={storeConfig.name}
          >
            <BrandLogo title={storeConfig.name} className="h-8 sm:h-8" />
          </Link>
          <p className="mt-3 max-w-sm font-body text-surface-navy-foreground">
            {storeConfig.tagline}
          </p>
        </div>

        <div>
          <p className="font-heading text-sm font-bold uppercase tracking-wide text-surface-lime">
            Explore
          </p>
          <ul className="mt-4 space-y-2">
            {footerNavigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-medium text-surface-navy-foreground hover:text-surface-orange"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-heading text-sm font-bold uppercase tracking-wide text-surface-lime">
            Connect
          </p>
          <ul className="mt-4 space-y-2">
            <li>
              <a
                href={storeConfig.socialLinks.instagram}
                className="font-medium text-surface-navy-foreground hover:text-surface-orange"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href={storeConfig.socialLinks.facebook}
                className="font-medium text-surface-navy-foreground hover:text-surface-orange"
                target="_blank"
                rel="noreferrer"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href={storeConfig.socialLinks.tiktok}
                className="font-medium text-surface-navy-foreground hover:text-surface-orange"
                target="_blank"
                rel="noreferrer"
              >
                TikTok
              </a>
            </li>
            <li>
              <a
                href={`mailto:${storeConfig.contactEmail}`}
                className="font-medium text-surface-navy-foreground hover:text-surface-orange"
              >
                {storeConfig.contactEmail}
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <Container className="border-t border-surface-lime py-5">
        <p className="text-sm font-medium text-surface-navy-foreground">
          © {year} {storeConfig.name}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
