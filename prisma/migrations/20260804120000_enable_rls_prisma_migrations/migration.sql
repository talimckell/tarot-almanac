-- Enable Row-Level Security on Prisma's internal migration-bookkeeping table.
--
-- Why: _prisma_migrations lives in the public schema, so Supabase's PostgREST
-- auto-exposes it to the browser-side anon key (NEXT_PUBLIC_SUPABASE_ANON_KEY).
-- With RLS off, anyone could read the migration history (schema/table names) and,
-- worse, DELETE or tamper with rows and corrupt Prisma's migration state. The
-- Supabase security advisor flags this as rls_disabled_in_public (Critical).
--
-- The 20260714120000_enable_rls migration covered all six Prisma *models* but not
-- this auto-created bookkeeping table, which is why the advisor still flagged it.
--
-- Safe: with ENABLE (not FORCE) ROW LEVEL SECURITY and no policies, the owner
-- `postgres` role (which Prisma connects as) bypasses RLS and keeps full access,
-- while anon/authenticated (the PostgREST path) are denied entirely. No app change.

ALTER TABLE "public"."_prisma_migrations" ENABLE ROW LEVEL SECURITY;
