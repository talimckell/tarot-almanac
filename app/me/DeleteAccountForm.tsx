"use client";

import { deleteAccountAction } from "./actions";
import styles from "./MeView.module.css";

// A destructive, irreversible action needs a confirmation step the server action
// itself can't provide — the plain <form action> pattern used elsewhere on this
// page (save, sign out) would fire on a single misclick.
export default function DeleteAccountForm() {
  return (
    <form
      action={deleteAccountAction}
      onSubmit={(e) => {
        if (!confirm("Delete your account? Your profile and saved charts are gone for good.")) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className={styles.deleteBtn}>Delete account</button>
    </form>
  );
}
