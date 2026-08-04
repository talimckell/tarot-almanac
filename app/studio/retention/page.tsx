import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { STUDIO_OWNER_EMAIL } from "@/lib/studioAuth";
import SiteNav from "../../components/SiteNav";
import Footer from "../../components/Footer";
import StudioNav from "../components/StudioNav";
import {
  getRetentionSummary,
  getWeeklyCohorts,
  getSegmentRetention,
  getRecentAccounts,
} from "@/lib/retention";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Return Rate",
  robots: { index: false },
};

const label: React.CSSProperties = {
  fontFamily: "var(--serif-sc)",
  letterSpacing: 2,
  textTransform: "uppercase",
  color: "var(--label)",
  fontSize: 14,
};

const card: React.CSSProperties = {
  border: "1px solid var(--rule)",
  borderRadius: 8,
  padding: "18px 20px",
  background: "var(--vellum)",
};

const th: React.CSSProperties = {
  textAlign: "left",
  fontFamily: "var(--serif-sc)",
  letterSpacing: 1,
  textTransform: "uppercase",
  fontSize: 12,
  color: "var(--label)",
  padding: "8px 12px",
  borderBottom: "1px solid var(--rule)",
};

const td: React.CSSProperties = {
  padding: "8px 12px",
  borderBottom: "1px solid var(--rule)",
  fontVariantNumeric: "tabular-nums",
};

function pct(n: number | null): string {
  return n === null ? "—" : `${n}%`;
}

export default async function RetentionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/studio/retention");
  if (user.email?.toLowerCase() !== STUDIO_OWNER_EMAIL.toLowerCase()) notFound();

  const [summary, cohorts, segments, recent] = await Promise.all([
    getRetentionSummary(),
    getWeeklyCohorts(),
    getSegmentRetention(),
    getRecentAccounts(),
  ]);

  return (
    <>
      <SiteNav current="me" />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px 80px" }}>
        <p style={label}>Internal tool</p>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: 32, margin: "6px 0 8px" }}>
          Signed-in Return Rate
        </h1>
        <p style={{ color: "var(--label)", maxWidth: 660 }}>
          Who comes back. A &ldquo;return&rdquo; means an account signed in on a later day
          than it was created &mdash; and since sign-in is magic-link, every one is a
          deliberate return, not idle traffic. Read live from Supabase auth; accounts newer
          than seven days are excluded from rates so a brand-new signup isn&rsquo;t counted
          as &ldquo;didn&rsquo;t return&rdquo; yet.
        </p>
        <StudioNav except="/studio/retention" />

        {/* Summary cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16,
            margin: "28px 0 8px",
          }}
        >
          <div style={card}>
            <div style={label}>Return rate</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 40 }}>
              {pct(summary.returnRatePct)}
            </div>
            <div style={{ color: "var(--label)", fontSize: 13 }}>
              {summary.returned} of {summary.accounts} mature accounts came back
            </div>
          </div>
          <div style={card}>
            <div style={label}>Total accounts</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 40 }}>
              {summary.totalAccounts}
            </div>
            <div style={{ color: "var(--label)", fontSize: 13 }}>all-time signups</div>
          </div>
          <div style={card}>
            <div style={label}>Active last 30 days</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 40 }}>
              {summary.activeLast30}
            </div>
            <div style={{ color: "var(--label)", fontSize: 13 }}>
              signed in within 30 days
            </div>
          </div>
        </div>

        {/* Segment table */}
        <h2 style={{ fontFamily: "var(--serif)", fontSize: 22, margin: "36px 0 4px" }}>
          Return rate by segment
        </h2>
        <p style={{ color: "var(--label)", fontSize: 14, margin: "0 0 12px" }}>
          The one that matters for a subscription: do payers come back more than free
          accounts.
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>Segment</th>
              <th style={{ ...th, textAlign: "right" }}>Accounts</th>
              <th style={{ ...th, textAlign: "right" }}>Returned</th>
              <th style={{ ...th, textAlign: "right" }}>Return rate</th>
            </tr>
          </thead>
          <tbody>
            {segments.length === 0 ? (
              <tr>
                <td style={{ ...td, color: "var(--label)" }} colSpan={4}>
                  No mature accounts yet.
                </td>
              </tr>
            ) : (
              segments.map((s) => (
                <tr key={s.segment}>
                  <td style={td}>{s.segment}</td>
                  <td style={{ ...td, textAlign: "right" }}>{s.accounts}</td>
                  <td style={{ ...td, textAlign: "right" }}>{s.returned}</td>
                  <td style={{ ...td, textAlign: "right" }}>{pct(s.returnRatePct)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Weekly cohorts */}
        <h2 style={{ fontFamily: "var(--serif)", fontSize: 22, margin: "36px 0 4px" }}>
          By signup week
        </h2>
        <p style={{ color: "var(--label)", fontSize: 14, margin: "0 0 12px" }}>
          Is return rate trending up as the product improves? Most recent first.
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>Week of</th>
              <th style={{ ...th, textAlign: "right" }}>Signups</th>
              <th style={{ ...th, textAlign: "right" }}>Returned</th>
              <th style={{ ...th, textAlign: "right" }}>Return rate</th>
            </tr>
          </thead>
          <tbody>
            {cohorts.map((c) => (
              <tr key={c.week}>
                <td style={td}>{c.week}</td>
                <td style={{ ...td, textAlign: "right" }}>{c.signups}</td>
                <td style={{ ...td, textAlign: "right" }}>{c.returned}</td>
                <td style={{ ...td, textAlign: "right" }}>{pct(c.returnRatePct)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Recent accounts */}
        <h2 style={{ fontFamily: "var(--serif)", fontSize: 22, margin: "36px 0 4px" }}>
          Recent accounts
        </h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>Email</th>
              <th style={th}>Joined</th>
              <th style={th}>Last seen</th>
              <th style={{ ...th, textAlign: "right" }}>Returned</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((a) => (
              <tr key={a.email}>
                <td style={td}>{a.email}</td>
                <td style={td}>{a.joined}</td>
                <td style={td}>{a.lastSeen}</td>
                <td style={{ ...td, textAlign: "right" }}>{a.returned ? "Yes" : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p style={{ color: "var(--label)", fontSize: 13, marginTop: 36, maxWidth: 660 }}>
          Note: a true week-over-week retention curve (week 0 &rarr; week N) needs the login
          history in <code>auth.audit_log_entries</code>, which Supabase isn&rsquo;t
          currently retaining (the table is empty), so it isn&rsquo;t shown here. Everything
          above comes from <code>auth.users.last_sign_in_at</code>, which is always complete.
        </p>
      </div>
      <Footer />
    </>
  );
}
