"use server";

import { isNewsletterConfigured, sendNewsletterSignup } from "./newsletter";

export type NewsletterActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function subscribeNewsletterAction(
  formData: FormData,
): Promise<NewsletterActionResult> {
  const honeypot = String(formData.get("company") ?? "").trim();
  if (honeypot) {
    return { ok: true };
  }

  if (!isNewsletterConfigured()) {
    return {
      ok: false,
      error: "Signup isn't ready yet — try again soon.",
    };
  }

  try {
    await sendNewsletterSignup(String(formData.get("email") ?? ""));
    return { ok: true };
  } catch (error) {
    console.error("[subscribeNewsletterAction]", error);
    const message =
      error instanceof Error && /valid email/i.test(error.message)
        ? error.message
        : "Couldn't add you to the flock. Try again in a moment.";
    return { ok: false, error: message };
  }
}
