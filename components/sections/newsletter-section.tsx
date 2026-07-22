"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionMark } from "@/components/ui/graphic";
import { Heading } from "@/components/ui/heading";
import { SectionSlantEdge } from "@/components/ui/section-slant-edge";
import { Subtitle } from "@/components/ui/subtitle";
import { storeConfig } from "@/config/store";

type NewsletterSectionProps = {
  title: string;
  subtitle: string;
};

type FormSubmitResponse = {
  success?: string | boolean;
  message?: string;
};

function inboxAddress() {
  return (
    process.env.NEXT_PUBLIC_NEWSLETTER_TO_EMAIL?.trim() ||
    storeConfig.contactEmail
  );
}

export function NewsletterSection({ title, subtitle }: NewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || status === "loading") return;

    const form = event.currentTarget;
    const honeypot = new FormData(form).get("company");
    if (String(honeypot ?? "").trim()) {
      setStatus("success");
      return;
    }

    setStatus("loading");
    setError(null);

    const normalized = email.trim().toLowerCase();
    const to = inboxAddress();

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(to)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: normalized,
            _subject: `${storeConfig.name} — flock signup`,
            _template: "table",
            _captcha: "false",
            message: `${normalized} wants duck drops from the website.`,
          }),
        },
      );

      const data = (await response.json().catch(() => null)) as FormSubmitResponse | null;
      const failed =
        !response.ok ||
        data?.success === false ||
        data?.success === "false";

      if (failed) {
        const message = data?.message ?? "";
        if (/activation/i.test(message)) {
          throw new Error(
            "Almost there — check the inbox for a one-time FormSubmit activation link, then try again.",
          );
        }
        throw new Error("Couldn't add you to the flock. Try again in a moment.");
      }

      setStatus("success");
      setEmail("");
    } catch (submitError) {
      setStatus("error");
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Couldn't add you to the flock. Try again in a moment.",
      );
    }
  }

  return (
    <section className="section-slant-alt relative z-[7] bg-surface-orange py-section">
      <Container narrow className="relative text-center">
        <Subtitle size="md" className="text-surface-navy">
          Get the drops
        </Subtitle>
        <Heading as="h2" size="xl" className="mt-1 text-surface-navy">
          {title}
        </Heading>
        <SectionMark className="mx-auto bg-surface-navy" />
        <p className="mt-3 font-body text-lg font-medium text-surface-navy">
          {subtitle}
        </p>

        {status === "success" ? (
          <p className="mt-8 font-heading text-lg font-bold text-surface-navy">
            You&apos;re in the flock — thanks for joining!
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex w-full max-w-lg flex-col gap-3 sm:flex-row"
            noValidate
          >
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
            />
            <input
              id="newsletter-email"
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              disabled={status === "loading"}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 flex-1 rounded-button border-graphic bg-surface px-5 font-body text-foreground placeholder:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
            />
            <Button
              type="submit"
              size="lg"
              variant="secondary"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Quacking…" : "Hop in"}
            </Button>
          </form>
        )}

        {status === "error" && error ? (
          <p className="mt-4 font-body text-sm font-medium text-surface-navy" role="alert">
            {error}
          </p>
        ) : null}
      </Container>
      <SectionSlantEdge direction="down-left" className="bg-surface-orange" />
    </section>
  );
}
