import Link from "next/link";
import BirthdayRevealForm from "../components/BirthdayRevealForm";
import {
  MAJORS,
  MAJOR_SLUGS,
  collectiveYear,
  collectiveMonth,
  collectiveDayCard,
  personalYear,
  personalMonth,
  personalDayCard,
  bearingIndex,
  moonFraction,
  moonPhase,
  formatLongDate,
  type DayCard,
} from "@/lib/almanac";
import {
  type YMD,
  type Birthday,
  isDateOpenForViewer,
  isCollectiveOpenForViewer,
  monthUnlockDate,
  addDays,
  formatDateSlug,
  synthesis,
  NO_BIRTHDAY_SYNTHESIS,
  alignmentText,
} from "@/lib/today";
import { getCollectiveReading } from "@/lib/collectiveReadings";
import { getPersonalReading } from "@/lib/personalReadings";
import PipGrid from "./PipGrid";
import MoonGlyph from "./MoonGlyph";
import LookupSomeone from "./LookupSomeone";
import ShareImageButton from "../components/ShareImageButton";
import styles from "./TodayView.module.css";

function minorSlug(card: DayCard): string {
  return `${card.rankName.toLowerCase()}-of-${card.suit.toLowerCase()}`;
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function TodayView({
  target,
  now,
  birthday,
  name,
  signedIn,
  subscribed,
  otherBirthday = null,
  otherName,
  basePath = "/today",
}: {
  target: YMD;
  now: YMD;
  birthday: Birthday | null;
  name?: string;
  signedIn?: boolean;
  subscribed?: boolean;
  // A signed-in account looking someone else up. When set, the personal column shows
  // that person's day (labeled with their name), not the account holder's. Only ever
  // populated for signed-in accounts, so a lookup can't override an anonymous cookie.
  otherBirthday?: Birthday | null;
  otherName?: string;
  // This route's own path (no query), for the lookup form target and the "back to your
  // card" link — "/today" or "/today/<slug>".
  basePath?: string;
}) {
  // The subject of the personal column: the looked-up person in lookup mode, else you.
  const otherMode = !!otherBirthday;
  const subject: Birthday | null = otherMode ? otherBirthday : birthday;
  const subjectName = otherMode ? otherName : name;
  // Two independent gates. The collective (world) card is public for past/today so it
  // can be indexed; the personal card stays on the subscriber gate. A "future, gated"
  // date fails both and shows the full gate card. A past date for a non-subscriber
  // passes collective (show the world card) but fails personal (show a subscribe nudge).
  const collectiveOpen = isCollectiveOpenForViewer(target, now, !!subscribed);
  const personalOpen = isDateOpenForViewer(target, now, !!subscribed);
  const personalLocked = collectiveOpen && !personalOpen;
  const prevSlug = formatDateSlug(addDays(target, -1));
  const nextSlug = formatDateSlug(addDays(target, 1));
  const isToday = target.y === now.y && target.m === now.m && target.d === now.d;

  const dateLabel = formatLongDate(target.y, target.m, target.d);
  const greeting = otherMode
    ? `${subjectName ? `${subjectName}'s` : "Their"} day`
    : name
      ? `${name}'s today`
      : "Find your angle on the day";

  const header = (
    <div className={styles.dayhead}>
      <span className={styles.greeting}>{greeting}</span>
      <div className={styles.dateRow}>
        <h1>{dateLabel}</h1>
        {collectiveOpen && (
          <span className={styles.moonMark}>
            <MoonGlyph frac={moonFraction(target.y, target.m, target.d)} />
          </span>
        )}
      </div>
      {collectiveOpen && (
        <span className={styles.moonPhaseLabel}>
          {moonPhase(target.y, target.m, target.d)}
        </span>
      )}
      <div className={styles.stepper}>
        <Link href={`/today/${prevSlug}`}>&larr; Earlier</Link>
        {isToday ? (
          <span className={styles.todayPill}>Today</span>
        ) : (
          <Link href="/today" className={styles.todayPill}>Today</Link>
        )}
        <Link href={`/today/${nextSlug}`}>Later &rarr;</Link>
      </div>
    </div>
  );

  // ===== Gated: no card data is computed or sent for out-of-window future dates. =====
  if (!collectiveOpen) {
    const unlock = monthUnlockDate(target);
    const unlockLabel = formatLongDate(unlock.y, unlock.m, unlock.d);

    return (
      <div className={styles.wrap}>
        {header}
        <div className={styles.gateWrap}>
          <div className={styles.gateCard}>
            <svg className={styles.star} viewBox="0 0 56 56" fill="var(--indigo)" aria-hidden="true">
              <path d="M28 7 L32.5 23.5 L49 28 L32.5 32.5 L28 49 L23.5 32.5 L7 28 L23.5 23.5 Z" />
            </svg>
            {subscribed ? (
              <>
                <h2>Not open yet</h2>
                <p>
                  Your almanac reaches one month ahead at a time. This date unlocks on{" "}
                  {unlockLabel}, when it becomes next month. See you then.
                </p>
                <div className={styles.gateActions}>
                  <Link href="/me" className={`${styles.btn} ${styles.btnSolid}`}>See my almanac</Link>
                  <Link href="/today" className={styles.btn}>Back to today</Link>
                </div>
              </>
            ) : (
              <>
                <h2>Travel the year</h2>
                <p>
                  Today&rsquo;s reading, and anything earlier this month, is always free.
                  Subscribing lets you go back further and see what&rsquo;s ahead.
                </p>
                <p className={styles.gateSub}>Every date, collective and personal, permanent and yours.</p>
                <div className={styles.gateActions}>
                  {signedIn ? (
                    <Link href="/chart" className={`${styles.btn} ${styles.btnSolid}`}>Subscribe</Link>
                  ) : (
                    <Link href="/me" className={`${styles.btn} ${styles.btnSolid}`}>See what an account holds</Link>
                  )}
                  <Link href="/today" className={styles.btn}>Back to today</Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===== Open date: the full stack =====
  const CY = collectiveYear(target.y);
  const CM = collectiveMonth(target.y, target.m);
  const cCard = collectiveDayCard(target.y, target.m, target.d);
  const cReading = getCollectiveReading(cCard);

  let pCard: DayCard | null = null;
  let pReading: string | undefined;
  let PY = 0;
  let PM = 0;
  let bIdx = 0;
  let aligned = false;
  if (subject && personalOpen) {
    PY = personalYear(target.y, subject.bm, subject.bd);
    PM = personalMonth(target.y, target.m, subject.bm, subject.bd);
    pCard = personalDayCard(target.y, target.m, target.d, subject.bm, subject.bd);
    // The reading is authored in the second person ("your day card is…"). When you look
    // someone up, "you" reads as that person — the banner and the "<name> today" column
    // header establish whose day it is — so the full reading shows for them too, exactly
    // as it does for your own. Only the chrome labels (below) name the person.
    pReading = getPersonalReading(pCard);
    bIdx = bearingIndex(subject.bm, subject.bd);
    aligned = bIdx === cCard.major;
  }

  // The card the share image features: the subject's card when a birthday is set, else
  // the day's collective card (the image route applies the same rule).
  const featured = pCard ?? cCard;
  const shareTitle = subjectName
    ? `${subjectName}'s card for ${dateLabel}`
    : otherMode
      ? `A card for ${dateLabel}`
      : `My card for ${dateLabel}`;
  const shareText = `${featured.minorName} · The Tarot Almanac`;

  const shareParams = new URLSearchParams();
  if (subject && pCard) {
    shareParams.set("bm", String(subject.bm));
    shareParams.set("bd", String(subject.bd));
    if (subjectName) shareParams.set("n", subjectName);
  }
  const shareQuery = shareParams.toString();
  const shareSuffix = shareQuery ? `?${shareQuery}` : "";
  const slug = formatDateSlug(target);
  const shareImagePath = `/today/${slug}/share/image${shareSuffix}`;
  const sharePagePath = `/today/${slug}/share${shareSuffix}`;

  return (
    <div className={styles.wrap}>
      {header}

      {otherMode && (
        <div className={styles.viewingBanner}>
          <span className={styles.viewingText}>
            You&rsquo;re looking up {subjectName ? `${subjectName}’s` : "someone’s"} day. This is a one-off.
          </span>
          <Link className={styles.viewingClear} href={basePath}>&times; Back to your card</Link>
        </div>
      )}

      {/* One real grid. Each labeled row (headers, cards, day-major, Between, month,
          year) is a shared grid row via named areas, so every horizontal line spans
          both columns and aligns. The center divider is a single left border on the
          right-hand cells. Empty right cells are still rendered so rows stay paired. */}
      <div className={styles.grid}>
        <div className={styles.colHead} style={{ gridArea: "wHead" }}>
          <span className={`${styles.colHeadLbl} ${styles.world}`}>The world today</span>
        </div>
        <div className={`${styles.colHead} ${styles.right}`} style={{ gridArea: "yHead" }}>
          <span className={`${styles.colHeadLbl} ${styles.yours}`}>
            {otherMode
              ? subjectName
                ? `${subjectName} today`
                : "Their card"
              : name
                ? `${name} today`
                : "You today"}
          </span>
        </div>

        <div className={styles.dayCardBlock} style={{ gridArea: "wCard" }}>
          <PipGrid suit={cCard.suit} rank={cCard.rank} color={`var(--${cCard.element})`} />
          <div className={styles.cardname}>
            <Link href={`/tarot/${minorSlug(cCard)}`}>{cCard.minorName}</Link>
          </div>
          <div className={styles.cardsub}>{cCard.suit} · {cap(cCard.element)}</div>
          {cReading && <div className={styles.reading}>{cReading}</div>}
          <Link className={styles.fulllink} href={`/tarot/${minorSlug(cCard)}`}>Read the full card &rarr;</Link>
        </div>
        <div className={`${styles.dayCardBlock} ${styles.right}`} style={{ gridArea: "yCard" }}>
          {pCard ? (
            <>
              <PipGrid suit={pCard.suit} rank={pCard.rank} color={`var(--${pCard.element})`} />
              <div className={styles.cardname}>
                <Link href={`/tarot/${minorSlug(pCard)}`}>{pCard.minorName}</Link>
              </div>
              <div className={styles.cardsub}>{pCard.suit} · {cap(pCard.element)}</div>
              {pReading && <div className={styles.reading}>{pReading}</div>}
              <Link className={styles.fulllink} href={`/tarot/${minorSlug(pCard)}`}>Read the full card &rarr;</Link>
            </>
          ) : personalLocked ? (
            <>
              <div className={styles.cardname}>{otherMode ? "This day is beyond the free window" : "Your card, kept"}</div>
              <div className={styles.reading}>
                {otherMode ? (
                  <>
                    The world&rsquo;s card for this day is always open. Personal cards for past
                    days, yours or anyone you look up, are part of the almanac. Today and
                    anything earlier this month stay free; a subscription opens the rest.
                  </>
                ) : (
                  <>
                    The world&rsquo;s card for this day is always open. Your own card for a past
                    day is part of the almanac. Today and anything earlier this month stay free;
                    a subscription opens every day behind you as yours to keep.
                  </>
                )}
              </div>
              <div className={styles.gateActions}>
                {signedIn ? (
                  <Link href="/chart" className={`${styles.btn} ${styles.btnSolid}`}>Subscribe</Link>
                ) : (
                  <Link href="/me" className={`${styles.btn} ${styles.btnSolid}`}>See what an account holds</Link>
                )}
              </div>
            </>
          ) : (
            <>
              <div className={styles.cardname}>Add your birthday</div>
              <div className={styles.reading}>See the card the day sets for you.</div>
              <BirthdayRevealForm defaultName={name ?? ""} />
            </>
          )}
        </div>

        <div className={`${styles.majorRow} ${styles.rowsep}`} style={{ gridArea: "wMaj" }}>
          <span className={styles.rowLbl}>Day major</span>
          <Link className={styles.majorLink} href={`/tarot/${MAJOR_SLUGS[cCard.major]}`}>{cCard.majorName}</Link>
        </div>
        <div className={`${styles.majorRow} ${styles.rowsep} ${styles.right}`} style={{ gridArea: "yMaj" }}>
          {pCard && (
            <>
              <span className={styles.rowLbl}>Day major</span>
              <Link className={styles.majorLink} href={`/tarot/${MAJOR_SLUGS[pCard.major]}`}>{pCard.majorName}</Link>
            </>
          )}
        </div>

        {!personalLocked && (
          <div className={`${styles.between} ${styles.rowsep}`} style={{ gridArea: "btwn" }}>
            <span className={styles.lbl}>
              {otherMode ? `Between ${subjectName ?? "them"} and the world` : "Between you"}
            </span>
            <p className={styles.syn}>{pCard ? synthesis(cCard, pCard) : NO_BIRTHDAY_SYNTHESIS}</p>
          </div>
        )}

        <div className={`${styles.contextRow} ${styles.rowsep}`} style={{ gridArea: "cMon" }}>
          <span className={styles.rowLbl}>Collective Month</span>
          <Link className={styles.contextLink} href={`/tarot/${MAJOR_SLUGS[CM]}`}>{MAJORS[CM]}</Link>
        </div>
        <div className={`${styles.contextRow} ${styles.rowsep} ${styles.right}`} style={{ gridArea: "yMon" }}>
          {pCard && (
            <>
              <span className={styles.rowLbl}>{otherMode ? (subjectName ? `${subjectName}'s Month` : "Their Month") : "Your Month"}</span>
              <Link className={styles.contextLink} href={`/tarot/${MAJOR_SLUGS[PM]}`}>{MAJORS[PM]}</Link>
            </>
          )}
        </div>

        <div className={`${styles.contextRow} ${styles.rowsep}`} style={{ gridArea: "cYr" }}>
          <span className={styles.rowLbl}>Collective Year</span>
          <Link className={styles.contextLink} href={`/tarot/${MAJOR_SLUGS[CY]}`}>{MAJORS[CY]}</Link>
        </div>
        <div className={`${styles.contextRow} ${styles.rowsep} ${styles.right}`} style={{ gridArea: "yYr" }}>
          {pCard && (
            <>
              <span className={styles.rowLbl}>{otherMode ? (subjectName ? `${subjectName}'s Year` : "Their Year") : "Your Year"}</span>
              <Link className={styles.contextLink} href={`/tarot/${MAJOR_SLUGS[PY]}`}>{MAJORS[PY]}</Link>
            </>
          )}
        </div>
      </div>

      {pCard && (
        <div className={styles.bearing}>
          <span className={styles.bGlyph}>
            <svg aria-hidden="true"><use href={`#ma-${bIdx}`} /></svg>
          </span>
          <div className={styles.bText}>
            <span className={styles.bLabel}>
              {otherMode ? (subjectName ? `${subjectName}'s Bearing` : "Their Bearing") : "Your Bearing"}
            </span>
            <span className={styles.bName}>
              The lifelong card you steer by is <span className={styles.bCard}>{MAJORS[bIdx]}</span>.
            </span>
          </div>
          <Link className={styles.bLink} href={`/bearing/${MAJOR_SLUGS[bIdx]}`}>
            {otherMode ? "See this Bearing" : "See your Bearing"} &rarr;
          </Link>
        </div>
      )}

      {aligned && (
        <div className={styles.alignFlag}>
          <div className={styles.alignDot} />
          <span className={styles.alignText}>{alignmentText(MAJORS[bIdx])}</span>
        </div>
      )}

      <div className={styles.actions}>
        <ShareImageButton
          imagePath={shareImagePath}
          pagePath={sharePagePath}
          linkPath="/today"
          title={shareTitle}
          text={shareText}
          className={styles.btn}
          label={otherMode ? (subjectName ? `Share ${subjectName}'s card` : "Share their card") : "Share today"}
        />
        {otherMode ? (
          <Link className={`${styles.btn} ${styles.btnSolid}`} href={basePath}>Back to your card</Link>
        ) : (
          <Link className={`${styles.btn} ${styles.btnSolid}`} href="/me">Keep your days</Link>
        )}
      </div>

      {/* Signed-in accounts can look up (and share) anyone's day — see LookupSomeone. */}
      {signedIn && !otherMode && <LookupSomeone action={basePath} />}
    </div>
  );
}
