# The Tarot Almanac — Roadmap

Living roadmap. **This file is the source of truth.** A rendered view is published as
an Artifact (link below) for easy reading.

When something comes up in a working session, say **"add it to the roadmap"** and it
gets appended here in the format below, then the Artifact is refreshed.

**Artifact view:** https://claude.ai/code/artifact/bd532d6a-d42b-417a-8b3b-11ce3204993d
(redeploy to this same URL when the file changes — pass it as the Artifact `url`)

## How entries are written
Each open item captures: **Problem / root cause**, **When it happens** (concrete use
cases), **Planned fix**, and **Effort / dependencies**. Priority markers:
🔴 blocker · 🟠 important · 🟡 polish.

---

## Open

### 🔴 Magic-link sign-in strands in-app-browser users
**Added:** 2026-07-06

**Problem / root cause.** Sign-in uses a PKCE magic link. Requesting the link stores a
secret `code_verifier` in the cookie store of the browser that requested it; the
`/auth/callback` step (`exchangeCodeForSession`) can only finish sign-in if that *same*
cookie store is what opens the link. If the link opens in any other browser context,
sign-in fails and bounces back to `/sign-in`.

**When it happens.**
1. **In-app browser → phone's default browser** (the Shannon case). User is on the site
   inside an app's in-app browser (Gmail, Instagram, Facebook, LinkedIn, X, TikTok,
   Slack…), requests the link there, then opens email and taps the link → launches
   Safari/Chrome, a *different* cookie store.
2. **Requested on laptop, opened on phone** (or vice versa). Different device = no verifier.
3. **Two browsers on one device.** Requests in Chrome, but the mail app opens links in Safari.
4. **Mail app's own in-app browser.** Gmail/Outlook/Yahoo apps open links in *their* webview,
   not the requesting browser.
5. **Normal ↔ private/incognito, or aggressive cookie clearing** dropping the verifier
   between request and click.
6. **Desktop mail client → non-default browser.**

Works only when the *same* browser both requests and opens the link. It's probabilistic —
some users sail through, others hit a dead-end loop (click → bounced to `/sign-in` → retry
→ same). Silently blocks signup, which gates everything (subscriptions, saved birthday).

**Planned fix.** Add a 6-digit email code path (`verifyOtp`): the user reads the code from
the email and types it into the page they're already on, so the link never has to open in
the same browser. Keep the existing magic link as-is (no regression) — the code is a purely
additive, context-proof path. Two parts: (1) code-entry UI on `/sign-in`; (2) a one-line
Supabase email-template change to include `{{ .Token }}`.

**Effort / dependencies.** ~Half a day of code + a Supabase dashboard template edit (owner
action). Also fix the misleading "Open it on this device" copy on the sent screen (the real
requirement is the same *browser*, not just device).

---

### 🟠 Stripe Checkout unreliable in in-app webviews
**Added:** 2026-07-06

**Problem / root cause.** When a user in an in-app browser taps Subscribe, the redirect to
Stripe Checkout is unreliable in embedded webviews, and Apple Pay / Google Pay aren't
offered there at all — so the fastest mobile payment path silently disappears, and some
webviews mishandle the return redirect after payment.

**When it happens.** Any subscribe or one-off checkout started from inside an in-app browser
on mobile. Lower frequency than the auth issue (fewer users reach checkout in a webview),
but it's real revenue.

**Planned fix.** Detect in-app webviews and nudge "open in Safari/Chrome to pay," and/or
make sure card entry (which does work) is the obvious fallback. Verify the return/redirect
path in a real in-app browser.

**Effort / dependencies.** ~Half a day; needs manual testing in real in-app browsers.

---

### 🟡 Minor mobile polish (from the 2026-07-06 audit)
**Added:** 2026-07-06

- **Hero `90vh` → `svh`.** `globals.css` `.hero` uses `min-height: 90vh`; mobile toolbars
  still nudge content below the fold. Use `svh`/`dvh` units.
- **Birthday select placeholder graying.** On iOS the empty "Month/Day/Year" options render
  in normal text, reading a bit like real values. Small styling tweak.
- **Explicit `viewport` export.** No `viewport` in `app/layout.tsx`; Next's default is fine
  (zoom allowed), so this is clarity-only, not a bug.

---

### 🟡 Timezone Option B — device-accurate zone
**Added:** 2026-07-06

**Problem.** "Today" now localizes via Vercel's IP timezone header (shipped). IP
geolocation is right the vast majority of the time but can be wrong on VPNs or some
cellular routing.

**Planned fix.** A tiny client snippet writes the device's `Intl` timezone to a cookie;
`viewerNow()` prefers the cookie over the header (cookie → header → UTC). Layers cleanly on
the existing helper.

**Effort.** ~1–2 hours. Optional; Option A covers the common case.

---

## Shipped

### 2026-07-06 — mobile hardening
- **Birthday entry: native date picker → Month/Day/Year selects (site-wide).** The native
  `<input type="date">` rendered a month/year-only picker with no day in Gmail's in-app
  browser, so a comped user couldn't complete a birthday. Replaced with explicit M/D/Y
  selects (`BirthdayFields`) on the reveal form (/today + homepage), /me → Your details,
  both "look up someone" fields, and both chart-creation fields. Studio tools left on native
  inputs (owner-only, desktop).
- **Signed-in birthday save from /today.** A signed-in account's /today birthday form was a
  silent no-op (it submitted `?b=`, which the page ignores for logged-in users). Added the
  `saveBirthdayFromToday` server action to persist straight to the Profile.
- **Timezone-aware "today" (Option A).** "Today" was computed in server UTC everywhere, so
  viewers in behind/ahead-of-UTC zones saw the wrong day. Added `lib/viewerNow.ts` reading
  Vercel's `x-vercel-ip-timezone` header (UTC fallback); centralized ~8 duplicated
  `serverNow()` helpers across today, home, /me, month, and the birthday actions. Sitemap
  stays UTC.
- **iOS input-zoom fix.** All form controls were 14–15px, triggering iOS Safari's focus
  zoom. One mobile-only rule bumps inputs/selects/textareas to 16px at ≤640px; desktop
  unchanged.
- **Hamburger tap target.** The mobile menu button was a ~30px target; now a 44px box with
  the icon centered.
