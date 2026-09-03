// HeyCatch analytics — server-side init, module scope, once per server bundle
// (see https://heycatch.ai/agents.md). Anything running server-side that needs
// to call analytics.setIdentity/trackEvent (the auth callback, the Stripe
// webhook) imports `analytics` from here rather than `@heycatch/sdk` directly,
// so init is guaranteed to have run first regardless of which route's bundle
// executes. Same project key as the client init in instrumentation-client.ts.
import { analytics } from "@heycatch/sdk";

analytics.init({
  projectKey: "hck_pk_QNRY_y9HVVagZ4-SOuTciSc2ifPZsUgf",
});

export { analytics };
