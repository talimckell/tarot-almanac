"use client";

import { useEffect } from "react";
import { TZ_COOKIE, TZ_RE } from "@/lib/today";

// Writes the browser's own IANA zone (Intl.DateTimeFormat, always accurate — unlike
// the IP-derived x-vercel-ip-timezone header, which VPNs and some cellular routing
// get wrong) into a cookie so the server's viewerNow() can prefer it on the next
// request. Silent no-op on the very first request of a session, before the cookie
// exists; falls back to the IP header until then.
export default function TimezoneSync() {
  useEffect(() => {
    try {
      const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (!zone || !TZ_RE.test(zone)) return;
      const current = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${TZ_COOKIE}=`))
        ?.slice(TZ_COOKIE.length + 1);
      if (current === zone) return;
      const maxAge = 60 * 60 * 24 * 365;
      document.cookie = `${TZ_COOKIE}=${zone}; path=/; max-age=${maxAge}; samesite=lax`;
    } catch {
      // Intl or document.cookie unavailable — the IP-header fallback still works.
    }
  }, []);

  return null;
}
