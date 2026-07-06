"use client";

import { useState } from "react";
import styles from "./TodayView.module.css";
import BirthdayFields from "../components/BirthdayFields";

// Signed-in only. Because a signed-in account's own birthday is fixed (it always
// wins on the default view), a looked-up birthday is unambiguously "not you", so we
// can label and share it as someone else's day without guessing. Submits ?on=/?ob=
// (name/birthday) — deliberately different params from the persisted ?n=/?b=, so a
// lookup never touches the `bday` cookie or the account. No 16+ gate here: the
// server allows any age for a signed-in account's lookups.
export default function LookupSomeone({ action }: { action: string }) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <div className={styles.lookup}>
        <button type="button" className={styles.lookupToggle} onClick={() => setOpen(true)}>
          Look up someone&rsquo;s day &rarr;
        </button>
      </div>
    );
  }

  return (
    <div className={styles.lookup}>
      <form className={styles.lookupForm} action={action} method="get">
        <span className={styles.lookupLbl}>Look up someone&rsquo;s day</span>
        <input
          type="text"
          name="on"
          placeholder="Their name"
          aria-label="Their name"
          autoComplete="off"
        />
        <BirthdayFields name="ob" required />
        <div className={styles.lookupActions}>
          <button type="submit" className={`${styles.btn} ${styles.btnSolid}`}>See their day</button>
          <button type="button" className={styles.btn} onClick={() => setOpen(false)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
