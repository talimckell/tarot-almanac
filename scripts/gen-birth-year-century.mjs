// Generates the blog-13 figure (the birth-year card post):
//   public/birth-year-century.svg — every birth year from 1925 to 2025 sorted by the
//     card it lands on, twice. One lane per method: the wheel of twenty-two, and the
//     same years folded to a single digit.
//
// Every count is resolved LIVE from lib/almanac.ts, so the picture can't drift from the
// engine. Palette, fonts and the row grammar match public/life-path-ceiling.svg and
// public/personal-month-loop-vs-walk.svg.
//
// SIZING. .body figure img.diagram caps at 420px (app/blog/[slug]/page.module.css), so
// the canvas width sets the on-screen type size: this renders at 420/520 = 0.81, against
// 0.58 on the 720-wide siblings, which read too small at blog width. Keep the canvas
// narrow and check it rasterized at 420px, never at full size.
//
//   node scripts/gen-birth-year-century.mjs
//
import { writeFileSync } from "node:fs";
import { MAJORS, collectiveYear, sumDigits } from "../lib/almanac.ts";

const FROM = 1925, TO = 2025;

// --- Palette / type (matched to the sibling figures) -----------------------
const INDIGO = "#1e3a58", WARM = "#b8a890", VELLUM = "#e8e0d0";
const LABEL = "#5f5648", CHARCOAL = "#4a3e30";
const SERIF = "'Cormorant',Georgia,serif";
const SC = "'Cormorant SC',Georgia,serif";
const SANS = "'Lato',system-ui,sans-serif";
const FONTS = `<defs><style>@import url("https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,500;1,400&amp;family=Cormorant+SC:wght@400;500&amp;family=Lato:wght@300;400&amp;display=swap");</style></defs>`;

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// --- Data, straight off the engine ----------------------------------------
const fold = (n) => { while (n > 9) n = sumDigits(n); return n; };
const wheel = Array.from({ length: 22 }, () => 0);
const folded = Array.from({ length: 22 }, () => 0);
let total = 0;
for (let y = FROM; y <= TO; y++) { total++; wheel[collectiveYear(y)]++; folded[fold(y)]++; }

const usedWheel = wheel.filter((v) => v > 0).length;
const usedFold = folded.filter((v) => v > 0).length;
const maxWheel = Math.max(...wheel);
const maxFold = Math.max(...folded);

// --- Geometry -------------------------------------------------------------
const W = 520;
const ROW0 = 148, PITCH = 24;
const H = ROW0 + 22 * PITCH + 50;

const NUM_X = 26, NAME_X = 36;
const LANE_A = 200, LANE_B = 330;
const DOT = 11, R = 3.9;
const RULE_Y = 136;

const ALT = "Twenty-two rows, one for each Major Arcana card from the Fool to the World. "
  + "Each row carries two lanes of dots: the birth years from 1925 to 2025 that land on that "
  + "card on the wheel of twenty-two, and the birth years that land on it when the year is "
  + "folded to a single digit. The wheel lane has dots on all twenty-two rows, between one and "
  + "eight of them. The folded lane has dots on nine rows, the Magician through the Hermit, "
  + "about a dozen each, and none at all on the other thirteen.";

let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(ALT)}">${FONTS}`;

s += `<text x="${W / 2}" y="32" text-anchor="middle" font-family="${SC}" font-size="16" letter-spacing="2.4" fill="${LABEL}">A CENTURY OF BIRTH YEARS</text>`;
s += `<text x="${W / 2}" y="60" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="17" fill="${CHARCOAL}">Every year from ${FROM} to ${TO}, sorted by the card it lands on.</text>`;

// Lane headers
const laneEnd = (x0, n) => x0 + (n - 1) * DOT + R;
const laneHead = (x0, n, title, count, color) =>
  `<text x="${x0 - 4}" y="106" font-family="${SERIF}" font-style="italic" font-size="16" fill="${color}">${title}</text>`
  + `<text x="${x0 - 4}" y="126" font-family="${SC}" font-size="12.5" letter-spacing="1.3" fill="${color}">${count} CARDS USED</text>`
  + `<path d="M ${x0 - 8} ${RULE_Y} L ${laneEnd(x0, n) + 8} ${RULE_Y}" stroke="${WARM}" stroke-width="1"/>`;

s += laneHead(LANE_A, maxWheel, "on the wheel", usedWheel, INDIGO);
s += laneHead(LANE_B, maxFold, "folded to a digit", usedFold, LABEL);

// Rows
for (let i = 0; i < 22; i++) {
  const y = ROW0 + i * PITCH;

  s += `<path d="M ${NUM_X - 14} ${y + 12} L ${W - 22} ${y + 12}" stroke="${VELLUM}" stroke-width="1"/>`;
  s += `<text x="${NUM_X}" y="${y}" text-anchor="end" dominant-baseline="central" font-family="${SERIF}" font-size="15" fill="${WARM}">${i}</text>`;
  s += `<text x="${NAME_X}" y="${y}" dominant-baseline="central" font-family="${SERIF}" font-size="18" fill="${CHARCOAL}">${esc(MAJORS[i])}</text>`;

  for (let d = 0; d < wheel[i]; d++)
    s += `<circle cx="${LANE_A + d * DOT}" cy="${y}" r="${R}" fill="${INDIGO}"/>`;

  if (folded[i] > 0) {
    for (let d = 0; d < folded[i]; d++)
      s += `<circle cx="${LANE_B + d * DOT}" cy="${y}" r="${R}" fill="none" stroke="${WARM}" stroke-width="1.3"/>`;
  } else {
    // an explicit "none", so an empty lane reads as a result and not a rendering fault
    s += `<path d="M ${LANE_B - R} ${y} L ${LANE_B + R + 7} ${y}" stroke="${WARM}" stroke-width="1.3" stroke-dasharray="2 3"/>`;
  }
}

const foot = ROW0 + 22 * PITCH + 26;
s += `<text x="${NUM_X - 14}" y="${foot}" font-family="${SANS}" font-weight="300" font-size="13" fill="${LABEL}">${total} birth years, ${FROM}–${TO}. One dot is one year.</text>`;
s += `</svg>`;

writeFileSync(new URL("../public/birth-year-century.svg", import.meta.url), s);
console.log(`wrote public/birth-year-century.svg  ${W}x${H}  (renders at ${(420 / W).toFixed(2)} scale)`);
console.log(`wheel: ${usedWheel} cards used, max ${maxWheel}/row | folded: ${usedFold} cards used, max ${maxFold}/row | ${total} years`);
