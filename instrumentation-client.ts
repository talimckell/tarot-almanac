// HeyCatch analytics — client init. Next.js (>=15.3) loads this file on the
// client before hydration, which is why init lives here rather than in a
// component: it must run in module scope, statically imported, before any
// route renders (see https://heycatch.ai/agents.md). Autocapture (pageviews,
// clicks, SPA navigation) starts the moment this evaluates — no per-page
// wiring needed. Identity + business events are called separately, from
// wherever the app actually learns them (see app/auth/callback/route.ts and
// app/api/webhooks/stripe/route.ts).
import { analytics } from "@heycatch/sdk";

analytics.init({
  projectKey: "hck_pk_QNRY_y9HVVagZ4-SOuTciSc2ifPZsUgf",
  install: {
    framework: "nextjs",
    frameworkVersion: "16",
    agent: "claude-code",
  },
});
