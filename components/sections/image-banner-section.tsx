import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { SectionSlantEdge } from "@/components/ui/section-slant-edge";
import { Subtitle } from "@/components/ui/subtitle";
import { cn } from "@/lib/utils/cn";

type ImageBannerSectionProps = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  tone: "frost" | "lemon" | "cotton" | "navy";
};

const toneClasses = {
  frost: "bg-surface-frost text-white",
  lemon: "bg-surface-lime text-surface-navy",
  cotton: "bg-surface-raspberry text-white",
  navy: "bg-surface-navy text-surface-navy-foreground",
} as const;

const edgeClasses = {
  frost: "bg-surface-frost",
  lemon: "bg-surface-lime",
  cotton: "bg-surface-raspberry",
  navy: "bg-surface-navy",
} as const;

export function ImageBannerSection({
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  tone,
}: ImageBannerSectionProps) {
  const lightText = tone === "frost" || tone === "cotton" || tone === "navy";

  return (
    <section
      className={cn(
        "section-slant relative z-[8] py-section",
        toneClasses[tone],
      )}
    >
      <Container className="relative text-center">
        <Subtitle
          size="md"
          className={lightText ? "text-surface-lime" : "text-raspberry"}
        >
          Made for you
        </Subtitle>
        <Heading
          as="h2"
          size="xl"
          className={cn(
            "mx-auto mt-2 max-w-2xl",
            lightText ? "text-white" : "text-surface-navy",
          )}
        >
          {title}
        </Heading>
        <p
          className={cn(
            "mx-auto mt-4 max-w-xl text-lg font-medium",
            lightText ? "text-white" : "text-surface-navy",
          )}
        >
          {subtitle}
        </p>
        <div className="mt-8">
          <Button asChild size="lg" variant={lightText ? "ghost" : "secondary"}>
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
        </div>
      </Container>
      <SectionSlantEdge direction="down-right" className={edgeClasses[tone]} />
    </section>
  );
}
