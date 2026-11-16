import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../../components/SiteNav";
import Footer from "../../components/Footer";
import { SITE_URL } from "@/lib/site";
import GiftLinkBox from "../GiftLinkBox";
import styles from "../gift.module.css";

export const metadata: Metadata = {
  title: "Your gift is ready | The Tarot Almanac",
  robots: { index: false },
};

export default async function GiftSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; name?: string }>;
}) {
  const { token, name } = await searchParams;
  const who = name && name.trim() ? name.trim() : "them";

  // No token (e.g. a refresh after the params were cleared): the gift is still safe in the
  // buyer's account; point them to the sign-in email we sent.
  if (!token) {
    return (
      <>
        <SiteNav />
        <main className={styles.wrap}>
          <div className={styles.successHead}>
            <span className={styles.eyebrow}>Payment complete</span>
            <h1>Thank you &mdash; your gift is made</h1>
            <p className={styles.lede}>
              Check your email for a sign-in link. Open it, and you&rsquo;ll find the gift in your
              account, ready to send.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const link = `${SITE_URL}/gift/${token}`;

  return (
    <>
      <SiteNav />
      <main className={styles.wrap}>
        <div className={styles.successHead}>
          <span className={styles.eyebrow}>Payment complete</span>
          <h1>Your gift is ready &#127873;</h1>
          <p className={styles.lede}>
            You made a tarot birth chart for {who}. Here&rsquo;s how to give it to them.
          </p>
        </div>

        <div className={styles.linkCard}>
          <span className={styles.linkStep}>1. Copy this link</span>
          <GiftLinkBox url={link} />
          <span className={styles.linkStep} style={{ marginTop: 18 }}>2. Send it to {who}</span>
          <p className={styles.plainNote}>Text it, email it, or write it inside a card. However you like.</p>
        </div>

        <ol className={styles.whatNext}>
          <li>When {who} opens the link, they see their cards right away.</li>
          <li>They don&rsquo;t need an account, an app, or to pay anything.</li>
          <li>We also emailed you a sign-in link, so you can find this gift in your account anytime.</li>
        </ol>

        <div className={styles.previewCta}>
          <Link href={`/gift/${token}`} className={styles.secondaryBtn}>
            See exactly what {who} will open &rarr;
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
