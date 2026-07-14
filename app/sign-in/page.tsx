"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "../../lib/supabase/client";
import { trackFormSubmit } from "@/lib/analytics";
import styles from "./page.module.css";

export default function SignInPage() {
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
      <span className={styles.eyebrow}>Sign in</span>
      <h1>Your almanac</h1>
      <p className={styles.deck}>
        Enter your email and I&rsquo;ll send you a link and a 6-digit code to
        sign in. No password to remember.
      </p>
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
