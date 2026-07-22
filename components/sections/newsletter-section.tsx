"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionMark } from "@/components/ui/graphic";
import { Heading } from "@/components/ui/heading";
import { SectionSlantEdge } from "@/components/ui/section-slant-edge";
import { Subtitle } from "@/components/ui/subtitle";

type NewsletterSectionProps = {
  title: string;
  subtitle: string;
};

export function NewsletterSection({ title, subtitle }: NewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <section className="section-slant-alt relative z-[7] bg-surface-orange py-section">
      <Container narrow className="relative text-center">
        <Subtitle size="md" className="text-surface-navy">
          Stay sweet
        </Subtitle>
        <Heading as="h2" size="xl" className="mt-1 text-surface-navy">
          {title}
        </Heading>
        <SectionMark className="mx-auto bg-surface-navy" />
        <p className="mt-3 font-body text-lg font-medium text-surface-navy">
          {subtitle}
        </p>

        {submitted ? (
          <p className="mt-8 font-heading text-lg font-bold text-surface-navy">
            You&apos;re in the flock — thanks for joining!
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex w-full max-w-lg flex-col gap-3 sm:flex-row"
          >
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 flex-1 rounded-button border-graphic bg-surface px-5 font-body text-foreground placeholder:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button type="submit" size="lg" variant="secondary">
              Join
            </Button>
          </form>
        )}
      </Container>
      <SectionSlantEdge direction="down-left" className="bg-surface-orange" />
    </section>
  );
}
