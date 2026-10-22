"use client";

import { useEffect, useState } from "react";
import CheckoutSubmitButton from "../components/CheckoutSubmitButton";
import { startOwnChartCheckout } from "./checkoutActions";
import styles from "./page.module.css";

// Mobile-only sticky unlock bar. On a phone the paywall sits ~3.5 screens below where
// the chart renders, so most previewers never see a price or a Buy button at all (the
// measured leak: /chart visitors who don't click Buy). This keeps the $12 value and a
// one-tap Buy in view the whole time they explore the locked chart, then hides itself
// once the full paywall (#unlock, which carries both $12 and the $7/mo option) is on
// screen, so the two never stack. `birthDate` (YYYY-MM-DD) is the previewed chart; the
// guest checkout reads it, a signed-in buyer's is ignored server-side.
export default function StickyUnlockBar({ birthDate }: { birthDate: string }) {
  const [atPaywall, setAtPaywall] = useState(false);

  useEffect(() => {
    const paywall = document.getElementById("unlock");
    if (!paywall || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setAtPaywall(entry.isIntersecting), {
      // Fire a little before the paywall's top edge reaches the bottom of the screen.
      rootMargin: "0px 0px -35% 0px",
    });
    io.observe(paywall);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`${styles.stickyBar} ${atPaywall ? styles.stickyHidden : ""}`} aria-hidden={atPaywall}>
      <div className={styles.stickyText}>
        <span className={styles.stickyLead}>Unlock your full chart</span>
        <span className={styles.stickyPrice}>$12 once</span>
      </div>
      <form action={startOwnChartCheckout}>
        <input type="hidden" name="d" value={birthDate} />
        <input type="hidden" name="location" value="chart_sticky" />
        <CheckoutSubmitButton className={styles.stickyBuy} pendingLabel="…">
          Unlock
        </CheckoutSubmitButton>
      </form>
    </div>
  );
}
