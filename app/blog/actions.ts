"use server";

import { getResend, RESEND_NEWSLETTER_SEGMENT_ID } from "@/lib/resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeToNewsletter(
  emailRaw: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const email = emailRaw.trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }

  const resend = getResend();
  if (!resend || !RESEND_NEWSLETTER_SEGMENT_ID) {
    console.error("Newsletter signup attempted without RESEND_API_KEY / RESEND_NEWSLETTER_SEGMENT_ID set");
    return { ok: false, error: "Signups aren't available right now. Try again later." };
  }

  const { error } = await resend.contacts.create({
    email,
    unsubscribed: false,
    segments: [{ id: RESEND_NEWSLETTER_SEGMENT_ID }],
  });

  if (error) {
    console.error("Resend contact create failed", error);
    return { ok: false, error: "Something went wrong. Try again in a moment." };
  }

  return { ok: true };
}
