"use client";

import { useEffect, useState } from "react";
import {
  collectiveDayCard,
  phaseBand,
  moonPhase,
  formatLongDate,
  type Element,
  type DayCard,
} from "@/lib/almanac";

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

export default function TodayEntry() {
  const [today, setToday] = useState<{
    dateLabel: string;
    card: DayCard;
    phase: string;
    moon: string;
  } | null>(null);

  useEffect(() => {
    // Compute from the viewer's local calendar day.
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const d = now.getDate();
    const card = collectiveDayCard(y, m, d);
    setToday({
      dateLabel: formatLongDate(y, m, d),
      card,
      phase: phaseBand(card.major),
      moon: moonPhase(y, m, d),
    });
  }, []);

  const card = today?.card;
  // Pip count: Ace–Ten show their number; courts (Page..King) show a single mark.
  const pipCount = card ? (card.rank >= 11 ? 1 : card.rank) : 0;

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
          </div>
        </div>

        {/* Your card — revealed by entering a birthdate */}
        <div className="ec">
          <span className="ec-rule" style={{ background: "var(--warm-stone)" }} />
          <div className="ec-body">
            <div className="ec-top">
              <span className="ec-num">?</span>
              <svg className="ec-elem-mark" viewBox="0 0 40 40" fill="none" stroke="var(--warm-stone)" strokeWidth="2">
                <circle cx="20" cy="20" r="13" />
              </svg>
            </div>
            <span className="ec-role" style={{ marginBottom: "10px" }}>YOU TODAY</span>
            <form className="reveal-form" action="/today" method="get">
              <input type="text" name="n" placeholder="Your name" autoComplete="given-name" aria-label="Your name" />
              <input type="date" name="b" required aria-label="Your birthdate" />
              <button type="submit" className="btn-reveal">Reveal my card &rarr;</button>
            </form>
          </div>
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
