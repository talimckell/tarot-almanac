import { Resend } from "resend";

// Lazy: the Resend SDK throws in its constructor if no API key is available
// (env or arg), so a bare `new Resend(...)` at module scope would crash any
// route that imports this file until a real key is set. Callers check for
// null and degrade instead.
let client: Resend | null = null;

export function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

// Contacts land in this Segment (Resend's current model — Audiences are
// deprecated in favor of a single global Contacts list divided into
// Segments: https://resend.com/docs/dashboard/segments/migrating-from-audiences-to-segments).
export const RESEND_NEWSLETTER_SEGMENT_ID = process.env.RESEND_NEWSLETTER_SEGMENT_ID;
