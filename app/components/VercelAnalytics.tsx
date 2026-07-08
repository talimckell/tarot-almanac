"use client";

import { Analytics } from "@vercel/analytics/next";
import { useEffect } from "react";

// Owner opt-out for Vercel Web Analytics. Vercel doesn't store visitor IPs, so
// there's no "exclude my IP" dashboard filter the way GA4 has one. The supported
// equivalent is beforeSend: it runs in the browser before every event is sent,
// and returning null drops the event. We gate on a `va-disable` localStorage
// flag so none of a flagged browser's client events (pageviews + client-side
// form_submit events) ever leave the page.
//
// Set the flag on any device by loading the site with ?va-disable=1, and clear
// it with ?va-disable=0 — the choice persists in localStorage for that browser.
// Server-side form events can't see this flag (they fire on the server), so they
// exclude the owner separately, by email, in lib/analytics-server.ts.
export default function VercelAnalytics() {
  useEffect(() => {
    try {
      const flag = new URLSearchParams(window.location.search).get("va-disable");
      if (flag === "1") localStorage.setItem("va-disable", "1");
      else if (flag === "0") localStorage.removeItem("va-disable");
    } catch {
      // localStorage can throw in locked-down privacy modes — ignore
    }
  }, []);

  return (
    <Analytics
      beforeSend={(event) => {
        try {
          if (localStorage.getItem("va-disable")) return null;
        } catch {
          // if we can't read the flag, fall through and send as normal
        }
        return event;
      }}
    />
  );
}
