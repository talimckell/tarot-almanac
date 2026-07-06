"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useState } from "react";
import {
  collectiveDayCard,
  personalDayCard,
  phaseBand,
  moonPhase,
  formatLongDate,
  type Element,
  type DayCard,
} from "@/lib/almanac";
import { getCollectiveReading } from "@/lib/collectiveReadings";
import { getPersonalReading } from "@/lib/personalReadings";
import type { Birthday } from "@/lib/today";
import BirthdayRevealForm from "./components/BirthdayRevealForm";
import { saveBirthdayFromToday } from "./today/actions";

// Suit pip icons, keyed by suit. Stroke inherits the element color via `currentColor`.
function SuitPip({ suit }: { suit: string }) {
  switch (suit) {
    case "Wands":
      return (
        <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <line x1="22" y1="11" x2="22" y2="38" />
          <path d="M22 11 C18 6 17 5 15 5 M22 11 C26 6 27 5 29 5 M22 16 C19 12 18 11 16 11 M22 16 C25 12 26 11 28 11" strokeWidth="2.1" />
        </svg>
      );
    case "Cups":
      return (
        <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round">
          <path d="M11 9 L33 9 L29 25 L15 25 Z" />
          <line x1="22" y1="25" x2="22" y2="34" />
          <line x1="14" y1="37" x2="30" y2="37" strokeLinecap="round" />
        </svg>
      );
    case "Swords":
      return (
        <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
          <path d="M22 6 L24.5 12 L24.5 31 L19.5 31 L19.5 12 Z" />
          <line x1="13" y1="31" x2="31" y2="31" strokeLinecap="round" />
          <line x1="22" y1="31" x2="22" y2="38" strokeLinecap="round" />
        </svg>
      );
    case "Pentacles":
      return (
        <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="22" cy="22" r="14" />
          <path d="M22 11 L25 19.5 L34 19.5 L26.7 25 L29.5 33.5 L22 28 L14.5 33.5 L17.3 25 L10 19.5 L19 19.5 Z" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

const ELEMENT_LABEL: Record<Element, string> = {
  fire: "Fire",
  water: "Water",
  air: "Air",
  earth: "Earth",
};

function pipCountFor(card: DayCard | null | undefined): number {
  // Ace–Ten show their number; courts (Page..King) show a single mark.
  return card ? (card.rank >= 11 ? 1 : card.rank) : 0;
}

export default function TodayEntry({
  birthday = null,
  name,
  signedIn = false,
}: {
  // Resolved server-side from the signed-in account (its birthday wins) or the
  // anonymous `bday` cookie. When present, the "You today" slot shows your card of
  // the day instead of the reveal form — the abbreviated version of /today (no table).
  birthday?: Birthday | null;
  name?: string;
  // Only signed-in accounts get the "look up someone else" affordance: their own
  // birthday is fixed, so a looked-up birthday is unambiguously not them.
  signedIn?: boolean;
} = {}) {
  const [today, setToday] = useState<{
    y: number;
    m: number;
    d: number;
    dateLabel: string;
    card: DayCard;
    phase: string;
    moon: string;
    personal: { card: DayCard; reading?: string } | null;
  } | null>(null);

  // Signed-in lookup of someone else's card — ephemeral, client-side only, never
  // persisted. `looking` shows the input; `guest` holds the resolved card.
  const [looking, setLooking] = useState(false);
  const [guest, setGuest] = useState<{ name?: string; bstr: string; card: DayCard; reading?: string } | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const bm = birthday?.bm;
  const bd = birthday?.bd;

  useEffect(() => {
    // Compute from the viewer's local calendar day. The personal card uses the same
    // local day so it can't drift a day off the collective card shown beside it.
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const d = now.getDate();
    const card = collectiveDayCard(y, m, d);
    let personal: { card: DayCard; reading?: string } | null = null;
    if (bm && bd) {
      const pCard = personalDayCard(y, m, d, bm, bd);
      personal = { card: pCard, reading: getPersonalReading(pCard) };
    }
    setToday({
      y,
      m,
      d,
      dateLabel: formatLongDate(y, m, d),
      card,
      phase: phaseBand(card.major),
      moon: moonPhase(y, m, d),
      personal,
    });
  }, [bm, bd]);

  const card = today?.card;
  const personal = today?.personal ?? null;
  const pipCount = pipCountFor(card);
  const pPipCount = pipCountFor(personal?.card);
  const gPipCount = pipCountFor(guest?.card);

  function handleLookup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!today) return;
    const fd = new FormData(e.currentTarget);
    const gName = ((fd.get("on") as string) ?? "").trim();
    const bstr = ((fd.get("ob") as string) ?? "").trim();
    const [byStr, bmStr, bdStr] = bstr.split("-");
    const gbm = Number(bmStr);
    const gbd = Number(bdStr);
    // No 16+ gate here: a signed-in account may look up anyone (a child in their care,
    // say). We just need a valid date. Any age is fine.
    if (!Number(byStr) || !gbm || !gbd) {
      setLookupError("Enter a full birthdate.");
      return;
    }
    const gCard = personalDayCard(today.y, today.m, today.d, gbm, gbd);
    setGuest({
      name: gName || undefined,
      bstr,
      card: gCard,
      reading: getPersonalReading(gCard),
    });
    setLooking(false);
    setLookupError(null);
  }

  function guestDayHref(): string {
    if (!guest) return "/today";
    const params = new URLSearchParams({ ob: guest.bstr });
    if (guest.name) params.set("on", guest.name);
    return `/today?${params.toString()}`;
  }

  return (
    <div className="hero-right">
      <div className="entry-header">
        <span className="entry-label">TODAY&rsquo;S ENTRY</span>
        <span className="entry-date">{today?.dateLabel ?? ""}</span>
      </div>

      <div className="entry-cards">
        {/* The collective card of the day */}
        <div className="ec">
          <span className={`ec-rule${card ? ` ${card.element}` : ""}`} />
          <div className="ec-body">
            <div className="ec-top">
              <span className="ec-role">THE WORLD TODAY</span>
            </div>
            <div className="ec-pips" style={card ? { color: `var(--${card.element})` } : undefined}>
              {card &&
                Array.from({ length: pipCount }).map((_, i) => (
                  <span className="pip" key={i}>
                    <SuitPip suit={card.suit} />
                  </span>
                ))}
            </div>
            <div className="ec-name">{card?.minorName ?? ""}</div>
            {card && getCollectiveReading(card) && (
              <p className="ec-prompt">{getCollectiveReading(card)}</p>
            )}
          </div>
        </div>

        {/* Your card — shown when we know your birthday (signed in or cookie),
            otherwise revealed by entering a birthdate. Signed-in accounts can flip
            this slot to look up (and open/share) someone else's card. */}
        <div className="ec">
          {guest ? (
            <>
              <span className={`ec-rule ${guest.card.element}`} />
              <div className="ec-body">
                <div className="ec-top">
                  <span className="ec-role">
                    {(guest.name ? `${guest.name} today` : "Their card").toUpperCase()}
                  </span>
                </div>
                <div className="ec-pips" style={{ color: `var(--${guest.card.element})` }}>
                  {Array.from({ length: gPipCount }).map((_, i) => (
                    <span className="pip" key={i}>
                      <SuitPip suit={guest.card.suit} />
                    </span>
                  ))}
                </div>
                <div className="ec-name">{guest.card.minorName}</div>
                {guest.reading && <p className="ec-prompt">{guest.reading}</p>}
                <div className="entry-lookup-links">
                  <Link href={guestDayHref()} className="entry-lookup-open">Open their day &rarr;</Link>
                  <button type="button" className="entry-lookup-back" onClick={() => setGuest(null)}>
                    &times; back to yours
                  </button>
                </div>
              </div>
            </>
          ) : looking ? (
            <>
              <span className="ec-rule" style={{ background: "var(--warm-stone)" }} />
              <div className="ec-body">
                <div className="ec-top">
                  <span className="ec-role">LOOK UP SOMEONE</span>
                </div>
                <form className="reveal-form" onSubmit={handleLookup} style={{ marginTop: "12px" }}>
                  <input type="text" name="on" placeholder="Their name" aria-label="Their name" autoComplete="off" />
                  <input type="date" name="ob" required aria-label="Their birthdate" />
                  <button type="submit" className="btn-reveal">See their card &rarr;</button>
                  <button
                    type="button"
                    className="entry-lookup-back"
                    onClick={() => { setLooking(false); setLookupError(null); }}
                  >
                    Cancel
                  </button>
                  {lookupError && <p className="reveal-error">{lookupError}</p>}
                </form>
              </div>
            </>
          ) : personal ? (
            <>
              <span className={`ec-rule ${personal.card.element}`} />
              <div className="ec-body">
                <div className="ec-top">
                  <span className="ec-role">YOU TODAY</span>
                </div>
                <div className="ec-pips" style={{ color: `var(--${personal.card.element})` }}>
                  {Array.from({ length: pPipCount }).map((_, i) => (
                    <span className="pip" key={i}>
                      <SuitPip suit={personal.card.suit} />
                    </span>
                  ))}
                </div>
                <div className="ec-name">{personal.card.minorName}</div>
                {personal.reading && <p className="ec-prompt">{personal.reading}</p>}
                {signedIn && (
                  <button type="button" className="entry-lookup-link" onClick={() => setLooking(true)}>
                    Look up someone else &rarr;
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <span className="ec-rule" style={{ background: "var(--warm-stone)" }} />
              <div className="ec-body">
                <div className="ec-top">
                  <span className="ec-num">?</span>
                  <svg className="ec-elem-mark" viewBox="0 0 40 40" fill="none" stroke="var(--warm-stone)" strokeWidth="2">
                    <circle cx="20" cy="20" r="13" />
                  </svg>
                </div>
                <span className="ec-role" style={{ marginBottom: "10px" }}>YOU TODAY</span>
                <BirthdayRevealForm
                  action="/today"
                  defaultName={name ?? ""}
                  saveAction={signedIn ? saveBirthdayFromToday : undefined}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="entry-meta">
        <div className="meta-item">
          <span className="meta-label">Phase</span>
          <span className="meta-val">{today?.phase ?? ""}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Element</span>
          <span className={`meta-val${card ? ` ${card.element}` : ""}`}>
            {card ? ELEMENT_LABEL[card.element] : ""}
          </span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Moon</span>
          <span className="meta-val">{today?.moon ?? ""}</span>
        </div>
      </div>
    </div>
  );
}
