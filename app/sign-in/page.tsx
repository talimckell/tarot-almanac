"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";
import { trackFormSubmit } from "@/lib/analytics";
import styles from "./page.module.css";

// Every checkout flow (year reading, chart, gift chart, /me) lands here mid-purchase with
// no explanation of why — the generic "Your almanac" framing only makes sense if someone
// clicked in from /today or /me directly. A `reason` param on the redirect (set alongside
// `next`) lets the checkout action that sent them here say what the account is actually
// for, so this reads as "create your account to get this" instead of an unexplained wall.
// `sample` is an optional proof link — somewhere free to see what the thing they're
// signing in for actually looks like before they hand over an email.
interface ReasonCopy {
  eyebrow: string;
  title: string;
  deck: string;
  sample?: { href: string; label: string };
}
const REASON_COPY: Record<string, ReasonCopy> = {
  "year-reading": {
    eyebrow: "Create your account",
    title: "One thing first",
    deck: "Your year-ahead reading needs an account to live in, so you can come back and read it again. It's a one-time $15 purchase, not a subscription. Enter your email and I'll send you a link and a code. No password to remember.",
  },
  chart: {
    eyebrow: "Create your account",
    title: "See your chart",
    deck: "Your natal chart runs on your birthday, so I need an account to keep it in. The chart preview is free to see, structure and all, no purchase required. Enter your email and I'll send you a link and a code. No password to remember.",
    sample: { href: "/tarot-birth-chart/sample", label: "See a full sample chart" },
  },
  // The homepage's "Make your almanac" CTA and /me both land here — this is the main
  // subscription entry point, not a one-off purchase, so the value prop covers the
  // whole thing (reusing the same line /pricing already uses for this tier).
  almanac: {
    eyebrow: "Create your account",
    title: "Make your almanac",
    deck: "Every day you've already lived, open to walk back through, and always a month ahead. Your full natal chart. A monthly personal reading. $7 a month, cancel anytime. Enter your email and I'll send you a link and a code. No password to remember.",
    sample: { href: "/today", label: "See today's cards free, no account needed" },
  },
};
const DEFAULT_COPY: ReasonCopy = {
  eyebrow: "Sign in",
  title: "Your almanac",
  deck: "Enter your email and I'll send you a link and a 6-digit code to sign in. No password to remember.",
};

export default function SignInPage() {
  const [copy, setCopy] = useState(DEFAULT_COPY);
  useEffect(() => {
    const reason = new URLSearchParams(window.location.search).get("reason");
    if (reason && REASON_COPY[reason]) setCopy(REASON_COPY[reason]);
  }, []);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  // Code-entry path. The magic link fails whenever it opens in a different
  // browser than the one that requested it (in-app browsers, cross-device),
  // because the PKCE code_verifier lives in the requesting browser's cookies.
  // Entering the 6-digit code keeps the user on this page, so verifyOtp sets
  // the session in the same browser and the code_verifier never matters.
  const [code, setCode] = useState("");
  const [verifyStatus, setVerifyStatus] = useState<"idle" | "verifying" | "error">("idle");
  const [verifyError, setVerifyError] = useState<string | null>(null);

  function nextParam() {
    return new URLSearchParams(window.location.search).get("next");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    const next = nextParam();
    const callbackUrl = new URL("/auth/callback", window.location.origin);
    if (next) callbackUrl.searchParams.set("next", next);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: callbackUrl.toString(),
      },
    });

    if (error) {
      setError(error.message);
      setStatus("error");
      return;
    }
    trackFormSubmit("sign_in");
    setStatus("sent");
  }

  async function handleVerify(e: FormEvent) {
    e.preventDefault();
    setVerifyStatus("verifying");
    setVerifyError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code.trim(),
      type: "email",
    });

    if (error) {
      setVerifyError(error.message);
      setVerifyStatus("error");
      return;
    }

    // Session cookies are now set in this browser. Send the account onward.
    window.location.assign(nextParam() ?? "/today");
  }

  if (status === "sent") {
    return (
      <div className={styles.wrap}>
        <span className={styles.eyebrow}>Sign in</span>
        <h1 className={styles.sentTitle}>Check your email</h1>
        <p className={styles.sentBody}>
          I sent a sign-in link and a code to {email}. Tap the link, or enter
          the code below to sign in right here.
        </p>
        <form
          className={styles.form}
          onSubmit={handleVerify}
          style={{ marginTop: 28 }}
        >
          <label className={styles.label} htmlFor="code">
            Sign-in code
          </label>
          <input
            id="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]*"
            maxLength={10}
            required
            className={styles.input}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          />
          {verifyError && <p className={styles.error}>{verifyError}</p>}
          <button
            type="submit"
            className={styles.submit}
            disabled={verifyStatus === "verifying" || code.length < 6}
          >
            {verifyStatus === "verifying" ? "Verifying..." : "Sign in"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <span className={styles.eyebrow}>{copy.eyebrow}</span>
      <h1>{copy.title}</h1>
      <p className={styles.deck}>{copy.deck}</p>
      {copy.sample && (
        <Link href={copy.sample.href} className={styles.sampleLink}>
          {`${copy.sample.label} →`}
        </Link>
      )}
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button
          type="submit"
          className={styles.submit}
          disabled={status === "sending"}
        >
          {status === "sending" ? "Sending..." : "Send sign-in link"}
        </button>
      </form>
    </div>
  );
}
