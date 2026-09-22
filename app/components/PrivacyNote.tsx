import Link from "next/link";
import type { CSSProperties } from "react";

// One-line data-handling reassurance shown wherever we ask someone for their info.
// Every claim here must stay true to content/privacy-policy.md: birth dates are only
// used to compute cards, we never sell personal data, accounts are self-deletable,
// and email is only used for sign-in and transactional mail.
type Subject = "yours" | "theirs" | "email";

const LEAD: Record<Subject, string> = {
  yours: "Your birthday is only used to work out your cards.",
  theirs: "Their birthday is only used to work out their cards.",
  email: "We only use your email to sign you in and send you receipts and account notices.",
};

export default function PrivacyNote({
  subject = "yours",
  className,
  style,
}: {
  subject?: Subject;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <p
      className={className}
      style={{
        fontSize: 12,
        lineHeight: 1.5,
        color: "var(--warm-stone)",
        margin: "10px 0 0",
        ...style,
      }}
    >
      {LEAD[subject]} We don&rsquo;t sell{" "}
      <Link href="/privacy" style={{ color: "inherit", textDecoration: "underline" }}>
        your data
      </Link>
      {subject === "theirs" ? "." : ", and you can delete your account anytime."}
    </p>
  );
}
