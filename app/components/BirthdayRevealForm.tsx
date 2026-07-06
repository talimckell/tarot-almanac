"use client";

import { type FormEvent, useState } from "react";
import { isOldEnough, type YMD } from "@/lib/today";

// Shared by the homepage's "You today" block (today-entry.tsx) and /today's own
// "Add your birthday" empty state (TodayView.tsx) — same reveal form, same age
// check. The real gate is server-side (lib/today.ts's parseBirthday and
// proxy.ts both reject an under-16 date too, so this can't be bypassed by
// skipping JS or hand-editing the URL) — this just gives immediate feedback
// instead of a silent, confusing non-reveal after the page reloads.
export default function BirthdayRevealForm({
  action = "",
  defaultName = "",
  saveAction,
}: {
  action?: string;
  defaultName?: string;
  // Signed-in visitors get a server action that writes the birthday to their
  // Profile — the plain GET below only persists for anonymous visitors (via the
  // proxy.ts cookie), so without this a signed-in reveal is a silent no-op.
  saveAction?: (formData: FormData) => void | Promise<void>;
}) {
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    const raw = new FormData(e.currentTarget).get("b") as string;
    const [byStr, bmStr, bdStr] = (raw ?? "").split("-");
    const by = Number(byStr);
    const bm = Number(bmStr);
    const bd = Number(bdStr);
    if (!by || !bm || !bd) return;

    const now = new Date();
    const nowYMD: YMD = { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() };
    if (!isOldEnough(by, bm, bd, nowYMD)) {
      e.preventDefault();
      setError("You need to be 16 or older for your own daily reading.");
    }
  }

  return (
    <form
      className="reveal-form"
      action={saveAction ?? action}
      method={saveAction ? undefined : "get"}
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        name="n"
        placeholder="Your name"
        autoComplete="given-name"
        aria-label="Your name"
        defaultValue={defaultName}
      />
      <input type="date" name="b" required aria-label="Your birthdate" />
      <button type="submit" className="btn-reveal">Reveal my card &rarr;</button>
      {error && <p className="reveal-error">{error}</p>}
    </form>
  );
}
