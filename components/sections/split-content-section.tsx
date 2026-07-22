import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionMark } from "@/components/ui/graphic";
import { Heading } from "@/components/ui/heading";
import { SectionSlantEdge } from "@/components/ui/section-slant-edge";
import { Subtitle } from "@/components/ui/subtitle";
import { cn } from "@/lib/utils/cn";

type SplitContentSectionProps = {
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  imageSrc: string;
  imageAlt: string;
  imagePosition: "left" | "right";
};

export function SplitContentSection({
  title,
  body,
  ctaLabel,
  ctaHref,
  imageSrc,
  imageAlt,
  imagePosition,
}: SplitContentSectionProps) {
  return (
    <section className="section-slant-alt relative z-[9] bg-surface-cream py-section">
      <Container
        className={cn(
          "relative grid items-center gap-10 lg:grid-cols-2 lg:gap-14",
          imagePosition === "right" && "[&>*:first-child]:lg:order-1",
        )}
      >
        <div
          className={cn(
            "relative aspect-[4/5] overflow-hidden rounded-image border-graphic sm:aspect-[5/4] lg:aspect-square",
            imagePosition === "right" && "lg:order-2",
          )}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </div>

        <div>
          <Subtitle size="sm" className="text-raspberry">
            Our story
          </Subtitle>
          <Heading as="h2" size="xl" className="mt-1">
            {title}
          </Heading>
          <SectionMark />
          <p className="mt-4 max-w-md font-body text-lg text-foreground">{body}</p>
          <div className="mt-8">
            <Button asChild size="lg" variant="secondary">
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
          </div>
        </div>
      </Container>
      <SectionSlantEdge direction="down-left" className="bg-surface-cream" />
    </section>
  );
}
