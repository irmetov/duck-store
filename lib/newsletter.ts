import { Resend } from "resend";

import { storeConfig } from "@/config/store";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function inboxAddress() {
  return process.env.NEWSLETTER_TO_EMAIL?.trim() || storeConfig.contactEmail;
}

function fromAddress() {
  return (
    process.env.RESEND_FROM_EMAIL?.trim() ||
    `${storeConfig.name} <onboarding@resend.dev>`
  );
}

export function isNewsletterConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export async function sendNewsletterSignup(email: string) {
  const normalized = email.trim().toLowerCase();

  if (!EMAIL_RE.test(normalized)) {
    throw new Error("Enter a valid email address.");
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("Newsletter is not configured.");
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: fromAddress(),
    to: inboxAddress(),
    replyTo: normalized,
    subject: `${storeConfig.name} — flock signup`,
    text: `${normalized} wants duck drops from the website.`,
  });

  if (error) {
    console.error("[sendNewsletterSignup]", error);
    throw new Error(error.message || "Could not send signup email.");
  }
}
