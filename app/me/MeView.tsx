import Link from "next/link";
import {
  MAJORS,
  MAJOR_SLUGS,
  ELEMENT_BY_MAJOR,
  collectiveDayCard,
  personalDayCard,
  personalMonth,
  bearingIndex,
  formatLongDate,
  type DayCard,
} from "@/lib/almanac";
import {
  type YM,
  addMonths,
  formatMonthSlug,
  formatMonthLabel,
  daysInMonth,
  firstWeekday,
  formatDateSlug,
} from "@/lib/today";
import { suitGlyphId, majorGlyphId } from "@/lib/pips";
import { updateProfile, createChart, createGiftChartCheckout, signOutAction } from "./actions";
import { startSubscriptionCheckout } from "../chart/checkoutActions";
import DeleteAccountForm from "./DeleteAccountForm";
import styles from "./MeView.module.css";

const DOW = ["S", "M", "T", "W", "T", "F", "S"];

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

interface Profile {
  name: string | null;
  email: string;
  birthDate: string | null; // "YYYY-MM-DD"
  subscribed: boolean;
}

interface SavedChart {
  id: string;
  name: string;
  birthDate: string;
}

export default function MeView({
  profile,
  savedCharts,
  month,
  monthSlug,
  isCurrentMonth,
  nextLocked,
  prevLocked,
  today,
  birthday,
  view,
  checkout,
}: {
  profile: Profile;
  savedCharts: SavedChart[];
  month: YM;
  monthSlug: string;
  isCurrentMonth: boolean;
  nextLocked: boolean;
  prevLocked: boolean;
  today: { y: number; m: number; d: number };
  birthday: { bm: number; bd: number } | null;
  view: "personal" | "collective";
  checkout?: string;
}) {
  const prevSlug = formatMonthSlug(addMonths(month, -1));
  const nextMonth = addMonths(month, 1);
  const nextSlug = formatMonthSlug(nextMonth);
  const nextMonthLabel = formatMonthLabel(nextMonth);

  const days: { day: number; card: DayCard }[] = [];
  for (let day = 1; day <= daysInMonth(month); day++) {
    const card =
      view === "personal" && birthday
        ? personalDayCard(month.y, month.m, day, birthday.bm, birthday.bd)
        : collectiveDayCard(month.y, month.m, day);
    days.push({ day, card });
  }
  const blanks = firstWeekday(month);

  const monthMajor = birthday ? personalMonth(month.y, month.m, birthday.bm, birthday.bd) : null;
  const bIdx = birthday ? bearingIndex(birthday.bm, birthday.bd) : null;
  const bornLabel = profile.birthDate
    ? formatLongDate(...(profile.birthDate.split("-").map(Number) as [number, number, number]))
    : null;

  return (
    <div className={styles.wrap}>
      <div className={styles.welcome}>
        <span className={styles.eyebrow}>Your Almanac</span>
        <h1>Welcome back{profile.name ? `, ${profile.name}` : ""}</h1>
      </div>

      <div className={styles.monthHead}>
        <div className={styles.monthNav}>
          {prevLocked ? (
            <span
              className={`${styles.mnav} ${styles.locked}`}
              title="Subscribe to see past months."
              aria-label="Past months require a subscription"
            >
              &lsaquo;
            </span>
          ) : (
            <Link
              className={styles.mnav}
              href={`/me?month=${prevSlug}${view === "collective" ? "&view=collective" : ""}`}
              aria-label="Previous month"
            >
              &lsaquo;
            </Link>
          )}
          <span className={styles.monthTitle}>{formatMonthLabel(month)}</span>
          {nextLocked ? (
            <span
              className={`${styles.mnav} ${styles.locked}`}
              title={
                profile.subscribed
                  ? `${nextMonthLabel} opens when ${formatMonthLabel(month)} ends. Your almanac always reaches one month ahead.`
                  : "Subscribe to see future months."
              }
              aria-label={`${nextMonthLabel} is locked${profile.subscribed ? ` until ${formatMonthLabel(month)} ends` : ""}`}
            >
              &rsaquo;
            </span>
          ) : (
            <Link
              className={styles.mnav}
              href={`/me?month=${nextSlug}${view === "collective" ? "&view=collective" : ""}`}
              aria-label="Next month"
            >
              &rsaquo;
            </Link>
          )}
        </div>
        <div className={styles.monthRight}>
          {!isCurrentMonth && (
            <Link className={styles.thismonth} href="/me">
              This month
            </Link>
          )}
          {birthday && (
            <div className={styles.toggle}>
              <Link
                href={`/me?month=${monthSlug}`}
                className={view === "personal" ? styles.on : undefined}
              >
                Mine
              </Link>
              <Link
                href={`/me?month=${monthSlug}&view=collective`}
                className={view === "collective" ? styles.on : undefined}
              >
                The world&rsquo;s
              </Link>
            </div>
          )}
        </div>
      </div>
      <p className={styles.monthSub}>
        {view === "personal"
          ? "Your days this month, set by your birthdate."
          : "The world's days this month, the same for everyone."}
        {!profile.subscribed && (
          <>
            {" "}
            <Link href="#subscribe">Subscribe</Link> to see the rest of this month and travel to others.
          </>
        )}
      </p>

      <div className={styles.cal}>
        {DOW.map((d, i) => (
          <div className={styles.dow} key={i}>{d}</div>
        ))}
        {Array.from({ length: blanks }).map((_, i) => (
          <div className={`${styles.cell} ${styles.blank}`} key={`b${i}`} />
        ))}
        {days.map(({ day, card }) => {
          const isToday = isCurrentMonth && day === today.d;
          const dayLocked = !profile.subscribed && isCurrentMonth && day > today.d;
          if (dayLocked) {
            return (
              <span
                key={day}
                className={`${styles.cell} ${styles.cellLocked}`}
                title="Subscribe to see this day before it arrives."
                aria-label={`Day ${day} requires a subscription`}
              >
                <span className={styles.cellDay}>{day}</span>
              </span>
            );
          }
          return (
            <Link
              key={day}
              href={`/today/${formatDateSlug({ y: month.y, m: month.m, d: day })}`}
              className={`${styles.cell}${isToday ? ` ${styles.today}` : ""}`}
            >
              <span className={styles.cellDay}>{day}</span>
              <span className={styles.cellGlyph} style={{ color: `var(--${card.element})` }}>
                <svg width="18" height="18" aria-hidden="true">
                  <use href={`#${suitGlyphId(card.suit)}`} />
                </svg>
              </span>
              <span className={styles.cellCard}>{card.minorName}</span>
            </Link>
          );
        })}
      </div>

      <div className={styles.legend}>
        <span className={styles.leg}><span className={styles.dot} style={{ background: "var(--fire)" }} />Fire · Wands</span>
        <span className={styles.leg}><span className={styles.dot} style={{ background: "var(--water)" }} />Water · Cups</span>
        <span className={styles.leg}><span className={styles.dot} style={{ background: "var(--air)" }} />Air · Swords</span>
        <span className={styles.leg}><span className={styles.dot} style={{ background: "var(--earth)" }} />Earth · Pentacles</span>
      </div>

      {monthMajor !== null ? (
        <Link
          className={styles.monthBand}
          href={profile.subscribed ? `/me/reading/${monthSlug}` : `/tarot/${MAJOR_SLUGS[monthMajor]}`}
        >
          <div className={styles.mbGlyph} style={{ color: `var(--${ELEMENT_BY_MAJOR[monthMajor]})` }}>
            <svg width="40" height="40" aria-hidden="true">
              <use href={`#${majorGlyphId(monthMajor)}`} />
            </svg>
          </div>
          <div className={styles.mbBody}>
            <div className={styles.mbLabel}>
              {isCurrentMonth ? "This month, for you" : `Your ${formatMonthLabel(month)}`}
            </div>
            <div className={styles.mbCard}>{MAJORS[monthMajor]}</div>
          </div>
          <div className={styles.mbCta}>{profile.subscribed ? "Read this month" : "Read the card"} &rarr;</div>
        </Link>
      ) : (
        <a className={styles.monthBand} href="#your-details">
          <div className={styles.mbBody}>
            <div className={styles.mbLabel}>Your month</div>
            <div className={styles.mbCard}>Add your birthday to see it</div>
          </div>
          <div className={styles.mbCta}>Add it below &rarr;</div>
        </a>
      )}

      {bIdx !== null ? (
        <div className={styles.youBand}>
          <div className={styles.youMedallion}>
            <span className={styles.ymLabel}>Bearing</span>
            <svg width="28" height="28" aria-hidden="true">
              <use href={`#${majorGlyphId(bIdx)}`} />
            </svg>
            <span className={styles.ymName}>{MAJORS[bIdx]}</span>
          </div>
          <div className={styles.youText}>
            <h2>Your chart</h2>
            <p>
              {bornLabel && `Born ${bornLabel}. `}
              Bearing of {MAJORS[bIdx]}.
            </p>
          </div>
          <Link className={styles.youCta} href="/chart">
            Open my chart
          </Link>
        </div>
      ) : (
        <div className={styles.youBand}>
          <div className={styles.youText}>
            <h2>Your chart</h2>
            <p>Add your birthday to find your Bearing, the card fixed the day you arrived.</p>
          </div>
        </div>
      )}

      {checkout === "success" && (
        <p className={styles.shelfEmpty}>
          Payment received. If your new chart doesn&rsquo;t appear below yet, <Link href="/me">refresh this page</Link> in
          a few seconds.
        </p>
      )}

      <div className={styles.secHead}>
        <h2>Your library</h2>
        <span className={styles.count}>
          {savedCharts.length === 0 ? "no charts yet" : `${savedCharts.length} chart${savedCharts.length === 1 ? "" : "s"}`}
        </span>
      </div>
      {savedCharts.length === 0 && (
        <p className={styles.shelfEmpty}>Charts you make for people you love will live here.</p>
      )}
      {savedCharts.length > 0 && (
        <div className={styles.shelf}>
          {savedCharts.map((c) => (
            <Link className={styles.libcard} href={`/chart/${c.id}`} key={c.id}>
              <div className={styles.libName}>{c.name}</div>
              <div className={styles.libBorn}>{c.birthDate}</div>
            </Link>
          ))}
        </div>
      )}
      {profile.subscribed ? (
        <form className={styles.detailsForm} action={createChart}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="chartName">Name</label>
            <input id="chartName" name="name" type="text" className={styles.fieldInput} placeholder="Their name" required />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="chartBirthday">Birthday</label>
            <input id="chartBirthday" name="birthday" type="date" className={styles.fieldInput} required />
          </div>
          <button type="submit" className={styles.saveBtn}>Add a chart</button>
        </form>
      ) : (
        <div className={styles.paywall} id="subscribe">
          <h3>Add a chart</h3>
          <p>Subscribe for unlimited charts, or buy this one for $12 without subscribing.</p>
          <div className={styles.options}>
            <div className={`${styles.opt} ${styles.primary}`}>
              <div className={styles.tagline}>Everything, always</div>
              <div className={styles.price}>
                $7<span className={styles.per}>/mo</span>
              </div>
              <div className={styles.what}>
                Charts for everyone you love, monthly readings, and time-travel through past and near-future readings.
              </div>
              <form action={startSubscriptionCheckout}>
                <button type="submit" className={styles.buy}>
                  Subscribe
                </button>
              </form>
            </div>
            <div className={`${styles.opt} ${styles.secondary}`}>
              <div className={styles.tagline}>Just this chart</div>
              <div className={styles.price}>
                $12<span className={styles.per}> once</span>
              </div>
              <div className={styles.what}>Unlock a chart for one person to read and keep. No subscription.</div>
              <form className={styles.optForm} action={createGiftChartCheckout}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="giftChartName">Name</label>
                  <input id="giftChartName" name="name" type="text" className={styles.fieldInput} placeholder="Their name" required />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="giftChartBirthday">Birthday</label>
                  <input id="giftChartBirthday" name="birthday" type="date" className={styles.fieldInput} required />
                </div>
                <button type="submit" className={styles.buy}>
                  Buy this chart
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className={styles.secHead} id="your-details">
        <h2>Your details</h2>
      </div>
      <form className={styles.detailsForm} action={updateProfile}>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            className={styles.fieldInput}
            defaultValue={profile.name ?? ""}
            placeholder="Your name"
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="birthday">Birthday</label>
          <input
            id="birthday"
            name="birthday"
            type="date"
            className={styles.fieldInput}
            defaultValue={profile.birthDate ?? ""}
          />
        </div>
        <button type="submit" className={styles.saveBtn}>Save</button>
      </form>

      <div className={styles.tiny}>
        <span>{profile.email}</span>
        <form action={signOutAction} className={styles.signOutForm}>
          <button type="submit" className={styles.signOutBtn}>Sign out</button>
        </form>
      </div>

      <div className={styles.dangerZone}>
        <div className={styles.dangerText}>
          <div className={styles.dangerH}>Delete account</div>
          <p>Permanently removes your profile and everything in your library. This can&rsquo;t be undone.</p>
        </div>
        <DeleteAccountForm />
      </div>
    </div>
  );
}
