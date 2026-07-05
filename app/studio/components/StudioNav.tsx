import Link from "next/link";
import { STUDIO_LINKS } from "../studioLinks";

// Renders every studio tool except the current page (passed as `except`, matched by href).
export default function StudioNav({ except }: { except: string }) {
  return (
    <p style={{ marginTop: 8, display: "flex", gap: 16, flexWrap: "wrap" }}>
      {STUDIO_LINKS.filter((link) => link.href !== except).map((link) => (
        <Link key={link.href} href={link.href} style={{ color: "var(--indigo)" }}>
          {link.label} &rarr;
        </Link>
      ))}
    </p>
  );
}
