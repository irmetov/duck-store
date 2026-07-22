import { storeConfig } from "@/config/store";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function inboxAddress() {
  return (
    process.env.NEWSLETTER_TO_EMAIL?.trim() || storeConfig.contactEmail
  );
}

export async function sendNewsletterSignup(email: string) {
  const normalized = email.trim().toLowerCase();

  if (!EMAIL_RE.test(normalized)) {
    throw new Error("Enter a valid email address.");
  }

  const to = inboxAddress();
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
        message: `${normalized} wants duck drops from the website.`,
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Could not send signup email.");
  }
}
