"use client";

import { useState, type FormEvent } from "react";
import { subscribeToNewsletter } from "../blog/actions";
import styles from "./NewsletterForm.module.css";

export default function NewsletterForm({
  formClassName,
  inputClassName,
  buttonClassName,
}: {
  formClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    const result = await subscribeToNewsletter(email);
    if (!result.ok) {
      setError(result.error);
      setStatus("error");
      return;
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return <p className={styles.confirm}>You&rsquo;re on the list. Watch for the next piece.</p>;
  }

  return (
    <>
      <form className={formClassName} onSubmit={handleSubmit}>
        <input
          type="email"
          required
          placeholder="your email"
          aria-label="Your email address"
          className={inputClassName}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "sending"}
        />
        <button type="submit" className={buttonClassName} disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Keep me posted"}
        </button>
      </form>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </>
  );
}
