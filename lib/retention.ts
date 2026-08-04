import { prisma } from "./prisma";

// Signed-in return-rate metrics for the owner-only /studio/retention dashboard.
//
// Source of truth is Supabase's own auth schema, NOT the Prisma Profile table:
// Profile has no reliable "last login" (its updatedAt is bumped by Stripe webhooks and
// profile edits, not just sign-ins), whereas auth.users.last_sign_in_at is the real thing.
// The app's pooled connection runs as the `postgres` role, which can read the auth schema
// (verified: auth.users is readable). These are all read-only SELECTs.
//
// A "return" here means: signed in on a LATER CALENDAR DAY than the account was created.
// Auth is magic-link, so every sign-in is a deliberate "I came back and clicked a fresh
// link" action (silent token refreshes are a separate auth event and never touch
// last_sign_in_at), which makes this a strong intent signal rather than idle traffic.
//
// A true week-over-week cohort curve would need the login *history* in
// auth.audit_log_entries, but that table is currently empty (Supabase isn't retaining it),
// so this module deliberately sticks to auth.users, which is always complete.

// Only count accounts old enough to have HAD a chance to come back, so a fresh signup
// from an hour ago doesn't drag the rate down as a false "didn't return".
const MATURITY_DAYS = 7;

export interface RetentionSummary {
  accounts: number; // accounts at least MATURITY_DAYS old
  returned: number; // of those, how many signed in on a later day
  returnRatePct: number | null; // null when there are no mature accounts yet
  activeLast30: number; // signed in within the last 30 days (any account age)
  totalAccounts: number; // every account, regardless of age
}

export async function getRetentionSummary(): Promise<RetentionSummary> {
  const rows = await prisma.$queryRawUnsafe<
    {
      accounts: number;
      returned: number;
      active_last_30: number;
      total_accounts: number;
    }[]
  >(`
    select
      count(*) filter (where created_at < now() - interval '${MATURITY_DAYS} days')::int
        as accounts,
      count(*) filter (
        where created_at < now() - interval '${MATURITY_DAYS} days'
          and last_sign_in_at::date > created_at::date
      )::int as returned,
      count(*) filter (where last_sign_in_at > now() - interval '30 days')::int
        as active_last_30,
      count(*)::int as total_accounts
    from auth.users
  `);

  const r = rows[0];
  return {
    accounts: r.accounts,
    returned: r.returned,
    returnRatePct: r.accounts > 0 ? round1((100 * r.returned) / r.accounts) : null,
    activeLast30: r.active_last_30,
    totalAccounts: r.total_accounts,
  };
}

export interface CohortWeek {
  week: string; // ISO date of the Monday that starts the signup week
  signups: number;
  returned: number;
  returnRatePct: number | null;
}

// Signups grouped by the week they joined, with how many later came back — so a rising or
// falling return rate over time is visible, not just one blended number.
export async function getWeeklyCohorts(): Promise<CohortWeek[]> {
  const rows = await prisma.$queryRawUnsafe<
    { week: Date; signups: number; returned: number }[]
  >(`
    select
      date_trunc('week', created_at)::date as week,
      count(*)::int as signups,
      count(*) filter (where last_sign_in_at::date > created_at::date)::int as returned
    from auth.users
    group by 1
    order by 1 desc
    limit 26
  `);

  return rows.map((r) => ({
    week: toIsoDate(r.week),
    signups: r.signups,
    returned: r.returned,
    returnRatePct: r.signups > 0 ? round1((100 * r.returned) / r.signups) : null,
  }));
}

export interface SegmentRow {
  segment: string;
  accounts: number;
  returned: number;
  returnRatePct: number | null;
}

// The metric that actually matters for a subscription product: do payers come back more
// than free accounts. Joins auth.users to the Prisma Profile (same UUID) to read
// subscription / purchase state. Only mature accounts are counted, same as the summary.
export async function getSegmentRetention(): Promise<SegmentRow[]> {
  const rows = await prisma.$queryRawUnsafe<
    { segment: string; accounts: number; returned: number }[]
  >(`
    select
      case
        when p."subscriptionStatus" = 'active' then 'Subscriber'
        when p."ownChartPurchasedPaymentIntentId" is not null
          or exists (select 1 from "SavedChart" s where s."ownerId" = p.id)
          or exists (select 1 from "YearReading" y where y."ownerId" = p.id)
          then 'One-off buyer'
        else 'Free'
      end as segment,
      count(*)::int as accounts,
      count(*) filter (where u.last_sign_in_at::date > u.created_at::date)::int as returned
    from auth.users u
    join "Profile" p on p.id = u.id::text
    where u.created_at < now() - interval '${MATURITY_DAYS} days'
    group by 1
  `);

  const order = ["Subscriber", "One-off buyer", "Free"];
  return rows
    .map((r) => ({
      segment: r.segment,
      accounts: r.accounts,
      returned: r.returned,
      returnRatePct: r.accounts > 0 ? round1((100 * r.returned) / r.accounts) : null,
    }))
    .sort((a, b) => order.indexOf(a.segment) - order.indexOf(b.segment));
}

export interface RecentAccount {
  email: string;
  joined: string;
  lastSeen: string;
  returned: boolean;
}

// A small "who's actually here" table for the owner — most recent signups, whether each
// has come back. Owner-gated at the page level; this is the owner viewing their own
// customer list, the one place individual emails are appropriate.
export async function getRecentAccounts(limit = 20): Promise<RecentAccount[]> {
  const rows = await prisma.$queryRawUnsafe<
    { email: string; created_at: Date; last_sign_in_at: Date | null }[]
  >(`
    select email, created_at, last_sign_in_at
    from auth.users
    order by created_at desc
    limit ${limit}
  `);

  return rows.map((r) => ({
    email: r.email,
    joined: toIsoDate(r.created_at),
    lastSeen: r.last_sign_in_at ? toIsoDate(r.last_sign_in_at) : "—",
    returned: r.last_sign_in_at
      ? toIsoDate(r.last_sign_in_at) > toIsoDate(r.created_at)
      : false,
  }));
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}
