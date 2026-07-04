"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import styles from "./CheckoutSubmitButton.module.css";

// The submit button for every form whose action starts a Stripe Checkout redirect
// (startSubscriptionCheckout, startOwnChartCheckout, createGiftChartCheckout). That
// action does real work server-side (create/find a Stripe customer, call Stripe's API
// to create a Checkout Session) before redirecting, so there's a real gap — sometimes
// a second or more — between the click and anything visibly changing. useFormStatus
// reports the enclosing form's pending state, so this swaps to a spinner + label the
// instant it's clicked, no matter how long Stripe's API takes to answer.
export default function CheckoutSubmitButton({
  children,
  pendingLabel,
  className,
}: {
  children: ReactNode;
  pendingLabel: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending} aria-busy={pending}>
      {pending && (
        <span className={styles.spinner} aria-hidden="true">
          <svg viewBox="0 0 56 56" width="14" height="14" fill="currentColor">
            <path d="M28 7 L32.5 23.5 L49 28 L32.5 32.5 L28 49 L23.5 32.5 L7 28 L23.5 23.5 Z" />
          </svg>
        </span>
      )}
      {pending ? pendingLabel : children}
    </button>
  );
}
