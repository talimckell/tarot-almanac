-- Enable Row-Level Security on every app table in the public schema.
--
-- Why: Supabase's PostgREST auto-exposes public-schema tables to the browser-side
-- anon key (NEXT_PUBLIC_SUPABASE_ANON_KEY, shipped in the client bundle for magic-link
-- auth). With RLS off, anyone could read/edit/delete all rows via the REST API. The
-- Supabase security advisor flags this as rls_disabled_in_public (Critical).
--
-- Safe because the app never touches these tables through PostgREST/anon — only through
-- Prisma, which connects as the `postgres` role (the table owner). With ENABLE (not FORCE)
-- ROW LEVEL SECURITY, the owner bypasses RLS, so Prisma keeps full access. Enabling RLS
-- with NO policies denies anon/authenticated (the PostgREST path) entirely. No app change.

ALTER TABLE "public"."Profile"                ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."SavedChart"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."MonthlyReading"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."YearReading"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."ReclaimedReversalUsage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."PinterestPinUsage"      ENABLE ROW LEVEL SECURITY;
