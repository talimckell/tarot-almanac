// Dev-server memory fix. Preloaded by `npm run dev` via NODE_OPTIONS, never by a build
// or by production.
//
// The problem: React's dev-only Flight runtime (vendored inside
// next/dist/compiled/next-server/app-page-turbo.runtime.dev.js) installs an
// async_hooks hook that records every promise the process creates in a
// `pendingOperations` map, so React DevTools can show which await a component was
// suspended on. Entries are keyed by asyncId and dropped in the `destroy` hook, but each
// entry also holds strong `awaited`/`previous` links to the entry it came from. Turbopack's
// HMR subscriptions are infinite `for await` loops, one per server chunk, so every compile
// event links a new node onto a chain that is never collected. Measured here: about 10MB
// retained per edit-and-reload cycle, roughly 650MB per two minutes under steady editing,
// until next-server hits its ~8GB heap limit and dies with "Ineffective mark-compacts near
// heap limit". That is the crash we were seeing after 25 to 55 minutes.
//
// Upstream: https://github.com/vercel/next.js/issues/91396 (open). The same hook ships in
// 16.2.12 and 16.3.6, and in the webpack dev runtime, so upgrading does not fix it.
//
// The fix: stop that one hook from being installed. We lose React's async debug info in
// dev (the "await" attribution in the DevTools performance panel). Error stacks, HMR, and
// every other dev feature are unaffected. With the hook gone the dev server holds flat at
// roughly 350 to 450MB heap on 16.3.6, over 255 edit-and-navigate cycles in 12 minutes,
// the same load that used to kill it in 12.
//
// Remove this file (and the NODE_OPTIONS in package.json's dev script) once the upstream
// issue is fixed; the guard below will warn if the hook it targets no longer matches.
// CommonJS on purpose: Node loads this through --require before ESM is available.
/* eslint-disable @typescript-eslint/no-require-imports */
const asyncHooks = require("node:async_hooks");

const originalCreateHook = asyncHooks.createHook;
let neutralized = false;

// Matches only React's promise-tracking hook: it deletes from `pendingOperations` on
// destroy and reads from it on init. Any other async_hooks user is left alone.
function isReactAsyncDebugHook(hooks) {
  if (!hooks || typeof hooks.destroy !== "function" || typeof hooks.init !== "function") {
    return false;
  }
  return (
    /pendingOperations\s*\.\s*delete/.test(String(hooks.destroy)) &&
    /pendingOperations\s*\.\s*get/.test(String(hooks.init))
  );
}

asyncHooks.createHook = function createHook(hooks) {
  if (isReactAsyncDebugHook(hooks)) {
    neutralized = true;
    const inert = {
      enable() {
        return inert;
      },
      disable() {
        return inert;
      },
    };
    return inert;
  }
  return originalCreateHook.apply(this, arguments);
};

// The render process is the one that loads React. If it ever stops matching, say so, since
// the silent failure mode is the old memory leak coming back.
if (process.title && process.title.startsWith("next-server")) {
  setTimeout(() => {
    if (!neutralized) {
      console.warn(
        "[dev] scripts/dev-react-async-debug-off.cjs did not match React's async debug hook. " +
          "Next.js may have changed it; check github.com/vercel/next.js/issues/91396 and update or delete this file."
      );
    }
  }, 60000).unref();
}
