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
}: {
  target: YMD;
  now: YMD;
  birthday: Birthday | null;
  name?: string;
  signedIn?: boolean;
  subscribed?: boolean;
}) {
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
  const greeting = name ? `${name}'s today` : "Find your angle on the day";

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
  if (birthday && personalOpen) {
    PY = personalYear(target.y, birthday.bm, birthday.bd);
    PM = personalMonth(target.y, target.m, birthday.bm, birthday.bd);
    pCard = personalDayCard(target.y, target.m, target.d, birthday.bm, birthday.bd);
    pReading = getPersonalReading(pCard);
    bIdx = bearingIndex(birthday.bm, birthday.bd);
    aligned = bIdx === cCard.major;
  }

  // The card the share image features: your card when a birthday is set, else the day's
  // collective card (the image route applies the same rule).
  const featured = pCard ?? cCard;
  const shareTitle = name ? `${name}'s card for ${dateLabel}` : `My card for ${dateLabel}`;
  const shareText = `${featured.minorName} · The Tarot Almanac`;

  const shareParams = new URLSearchParams();
  if (birthday && pCard) {
    shareParams.set("bm", String(birthday.bm));
    shareParams.set("bd", String(birthday.bd));
    if (name) shareParams.set("n", name);
  }
  const shareQuery = shareParams.toString();
  const shareSuffix = shareQuery ? `?${shareQuery}` : "";
  const slug = formatDateSlug(target);
  const shareImagePath = `/today/${slug}/share/image${shareSuffix}`;
  const sharePagePath = `/today/${slug}/share${shareSuffix}`;

  return (
    <div className={styles.wrap}>
      {header}

      <div className={styles.pair}>
        <div>
          <div className={styles.colHead}>
            <span className={`${styles.colHeadLbl} ${styles.world}`}>The world today</span>
          </div>
          <div className={styles.dayCardBlock}>
            <PipGrid suit={cCard.suit} rank={cCard.rank} color={`var(--${cCard.element})`} />
            <div className={styles.cardname}>
              <Link href={`/tarot/${minorSlug(cCard)}`}>{cCard.minorName}</Link>
            </div>
            <div className={styles.cardsub}>{cCard.suit} · {cap(cCard.element)}</div>
            {cReading && <div className={styles.reading}>{cReading}</div>}
            <Link className={styles.fulllink} href={`/tarot/${minorSlug(cCard)}`}>Read the full card &rarr;</Link>
          </div>
          <div className={styles.majorRow}>
            <span className={styles.rowLbl}>Day major</span>
            <Link className={styles.majorLink} href={`/tarot/${MAJOR_SLUGS[cCard.major]}`}>{cCard.majorName}</Link>
          </div>
        </div>

        <div className={styles.colPersonal}>
          <div className={styles.colHead}>
            <span className={`${styles.colHeadLbl} ${styles.yours}`}>
              {name ? `${name} today` : "You today"}
            </span>
          </div>
          <div className={styles.dayCardBlock}>
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
                <div className={styles.cardname}>Your card, kept</div>
                <div className={styles.reading}>
                  The world&rsquo;s card for this day is always open. Your own card for a past
                  day is part of the almanac. Today and anything earlier this month stay free;
                  a subscription opens every day behind you as yours to keep.
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
          <div className={styles.majorRow}>
            <span className={styles.rowLbl}>Day major</span>
            {pCard && (
              <Link className={styles.majorLink} href={`/tarot/${MAJOR_SLUGS[pCard.major]}`}>{pCard.majorName}</Link>
            )}
          </div>
        </div>
      </div>

      {!personalLocked && (
        <div className={styles.between}>
          <span className={styles.lbl}>Between you</span>
          <p className={styles.syn}>{pCard ? synthesis(cCard, pCard) : NO_BIRTHDAY_SYNTHESIS}</p>
        </div>
      )}

      {/* Collective Month/Year are non-personal and always shown when the day is open.
          The personal Month/Year sit beside them only when a personal card is present;
          without one, the box collapses to a single full-width collective column. */}
      <div className={pCard ? styles.contextPair : `${styles.contextPair} ${styles.contextSolo}`}>
        <div>
          <div className={styles.contextRow}>
            <span className={styles.rowLbl}>Collective Month</span>
            <Link className={styles.contextLink} href={`/tarot/${MAJOR_SLUGS[CM]}`}>{MAJORS[CM]}</Link>
          </div>
          <div className={`${styles.contextRow} ${styles.contextDivider}`}>
            <span className={styles.rowLbl}>Collective Year</span>
            <Link className={styles.contextLink} href={`/tarot/${MAJOR_SLUGS[CY]}`}>{MAJORS[CY]}</Link>
          </div>
        </div>
        {pCard && (
          <div className={styles.colPersonalCtx}>
            <div className={styles.contextRow}>
              <span className={styles.rowLbl}>Your Month</span>
              <Link className={styles.contextLink} href={`/tarot/${MAJOR_SLUGS[PM]}`}>{MAJORS[PM]}</Link>
            </div>
            <div className={`${styles.contextRow} ${styles.contextDivider}`}>
              <span className={styles.rowLbl}>Your Year</span>
              <Link className={styles.contextLink} href={`/tarot/${MAJOR_SLUGS[PY]}`}>{MAJORS[PY]}</Link>
            </div>
          </div>
        )}
      </div>

      {pCard && (
        <div className={styles.bearing}>
          <span className={styles.bGlyph}>
            <svg aria-hidden="true"><use href={`#ma-${bIdx}`} /></svg>
          </span>
          <div className={styles.bText}>
            <span className={styles.bLabel}>Your Bearing</span>
            <span className={styles.bName}>
              The lifelong card you steer by is <span className={styles.bCard}>{MAJORS[bIdx]}</span>.
            </span>
          </div>
          <Link className={styles.bLink} href={`/bearing/${MAJOR_SLUGS[bIdx]}`}>See your Bearing &rarr;</Link>
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
          label="Share today"
        />
        <Link className={`${styles.btn} ${styles.btnSolid}`} href="/me">Keep your days</Link>
      </div>
    </div>
  );
}
