import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { SectionSlantEdge } from "@/components/ui/section-slant-edge";
import { Text } from "@/components/ui/text";

type HeroSectionProps = {
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaHref: string;
  imageSrc: string;
  imageAlt: string;
};

export function HeroSection({
  headline,
  subheadline,
  ctaLabel,
  ctaHref,
  imageSrc,
  imageAlt,
}: HeroSectionProps) {
  return (
    <section className="section-slant relative z-30 bg-surface-navy pb-8 sm:pb-10">
      <Container className="relative grid items-center gap-10 py-10 sm:py-12 lg:grid-cols-2 lg:gap-12 lg:py-14">
        <div className="animate-[fade-up_0.7s_var(--ease-out)_both]">
          <Heading
            as="h1"
            size="display"
            className="text-surface-navy-foreground"
          >
            {headline}
          </Heading>
          <Text className="mt-4 max-w-md text-2xl leading-relaxed text-surface-navy-foreground">
            {subheadline}
          </Text>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="primary">
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-surface-navy-foreground bg-surface-navy text-surface-navy-foreground hover:border-surface-frost hover:bg-surface-frost hover:text-white"
            >
              <Link href="/collections/classics">Browse classics</Link>
            </Button>
          </div>
        </div>

        <div className="relative aspect-square overflow-hidden rounded-image border-graphic border-surface-navy-foreground bg-surface-cream sm:aspect-[4/5] lg:aspect-square">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover object-center"
          />
        </div>
      </Container>
      <SectionSlantEdge direction="down-right" className="bg-surface-navy" />
    </section>
  );
}
