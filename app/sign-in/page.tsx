"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "../../lib/supabase/client";
import styles from "./page.module.css";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    const next = new URLSearchParams(window.location.search).get("next");
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
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className={styles.wrap}>
        <span className={styles.eyebrow}>Sign in</span>
        <h1 className={styles.sentTitle}>Check your email</h1>
        <p className={styles.sentBody}>
          We sent a sign-in link to {email}. Open it on this device to
          continue.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <span className={styles.eyebrow}>Sign in</span>
      <h1>Your almanac</h1>
      <p className={styles.deck}>
        Enter your email and we&rsquo;ll send you a link to sign in. No
        password to remember.
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
