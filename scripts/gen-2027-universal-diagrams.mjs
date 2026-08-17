// Generates the two blog-12 figures (the 2027 universal year number post):
//
//   public/2027-eleven-two-ways.svg  — one eleven, two systems. Top strip: reduced to
//     one digit, so only 1-9 are reachable and the eleven falls back to the two.
//     Bottom strip: kept on the wheel, all twenty-two reachable, the eleven stays put
//     at Justice.
//   public/2027-decade-drift.svg     — 2020 to 2030 as two tracks. Identical for six
//     years, split for four, rejoined at 2030.
//
// Every value is resolved LIVE from lib/almanac.ts so the pictures can't drift from the
// engine. Matches the visual family of public/personal-month-loop-vs-walk.svg and
// life-path-ceiling.svg (same strip geometry, palette, fonts) with type sized up again:
// figure text has to read at the ~680px width the blog renders it at.
//
//   node scripts/gen-2027-universal-diagrams.mjs
//
import { writeFileSync } from "node:fs";
import { collectiveYear, sumDigits, MAJORS } from "../lib/almanac.ts";

// --- Engine-derived values -------------------------------------------------
const YEAR = 2027;
const reduce = (n) => { while (n > 9) n = String(n).split("").reduce((a, c) => a + +c, 0); return n; };

const total = sumDigits(YEAR);          // 11
const onWheel = collectiveYear(YEAR);   // 11 → Justice
const folded = reduce(total);           // 2  → the High Priestess
const gap = onWheel - folded;           // 9 cards apart

const YEARS = Array.from({ length: 11 }, (_, i) => 2020 + i);
const wheelSeries = YEARS.map((y) => collectiveYear(y));
const foldSeries = YEARS.map((y) => reduce(sumDigits(y)));
const agrees = YEARS.map((_, i) => wheelSeries[i] === foldSeries[i]);

const short = (i) => MAJORS[i].replace(/^The /, "");

// --- Palette / type (matched to the sibling figures) -----------------------
const INDIGO = "#1e3a58", STONE = "#f6f2eb", WARM = "#b8a890";
const LABEL = "#5f5648", CHARCOAL = "#4a3e30", FIRE = "#b83820", AIR = "#9a7820";
const SERIF = "'Cormorant',Georgia,serif";
const SC = "'Cormorant SC',Georgia,serif";
const FONTS = `<defs><style>@import url("https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,500;1,400&amp;family=Cormorant+SC:wght@400;500&amp;family=Lato:wght@300;400&amp;display=swap");</style></defs>`;

const W = 720, H = 400;

// ===========================================================================
// Figure 1 — one eleven, two systems
// ===========================================================================
const x = (i) => 48 + i * 29.714286;

function strip(cy, reachedSet, ringIdx) {
  let s = "";
  for (let i = 0; i <= 21; i++) {
    if (reachedSet.has(i)) {
      s += `<circle cx="${x(i)}" cy="${cy}" r="13" fill="${INDIGO}" stroke="${INDIGO}" stroke-width="1.2"/>`;
      s += `<text x="${x(i)}" y="${cy}" text-anchor="middle" dominant-baseline="central" font-family="${SERIF}" font-size="16" fill="${STONE}">${i}</text>`;
    } else {
      s += `<circle cx="${x(i)}" cy="${cy}" r="12" fill="none" stroke="${WARM}" stroke-width="1.2"/>`;
      s += `<text x="${x(i)}" y="${cy}" text-anchor="middle" dominant-baseline="central" font-family="${SERIF}" font-size="15" fill="${WARM}">${i}</text>`;
    }
  }
  s += `<circle cx="${x(ringIdx)}" cy="${cy}" r="16.5" fill="none" stroke="${FIRE}" stroke-width="1.8"/>`;
  return s;
}

const reachedByFold = new Set(Array.from({ length: 9 }, (_, i) => i + 1));   // 1..9
const reachedByWheel = new Set(Array.from({ length: 22 }, (_, i) => i));      // 0..21

const rowA = 178, rowB = 316;
let f1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Two rows of the twenty-two Major Arcana. In the top row, reduced to one digit, only cards one through nine are filled and a dashed arc runs from the empty eleven back to card two, the High Priestess, where 2027 lands. In the bottom row, kept on the wheel, all twenty-two cards are filled and 2027 stays at card eleven, Justice.">`;
f1 += FONTS;
f1 += `<text x="${W / 2}" y="34" text-anchor="middle" font-family="${SC}" font-size="19" letter-spacing="2.8" fill="${LABEL}">ONE ELEVEN, TWO SYSTEMS</text>`;
f1 += `<text x="${W / 2}" y="64" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="21" fill="${CHARCOAL}">The digits of 2027 add up to ${total}. What happens next is a choice.</text>`;

// Panel A: reduced
f1 += `<text x="48" y="100" font-family="${SC}" font-size="16" letter-spacing="1.6" fill="${INDIGO}">REDUCED TO ONE DIGIT</text>`;
f1 += `<text x="672" y="100" text-anchor="end" font-family="${SERIF}" font-style="italic" font-size="17" fill="${LABEL}">nine places to stand</text>`;
const from11 = x(11), to2 = x(folded);
f1 += `<text x="${(from11 + to2) / 2}" y="${rowA - 54}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="16.5" fill="${INDIGO}">the eleven falls back to the two</text>`;
f1 += `<path d="M ${from11} ${rowA - 22} C ${from11} ${rowA - 52}, ${to2} ${rowA - 52}, ${to2} ${rowA - 22}" fill="none" stroke="${INDIGO}" stroke-width="1.3" stroke-dasharray="3 2.5"/>`;
f1 += `<path d="M ${to2 - 4} ${rowA - 28} L ${to2} ${rowA - 20} L ${to2 + 4} ${rowA - 28}" fill="none" stroke="${INDIGO}" stroke-width="1.3"/>`;
f1 += strip(rowA, reachedByFold, folded);
f1 += `<text x="${x(folded)}" y="${rowA + 36}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="16" fill="${FIRE}">${short(folded)}</text>`;
f1 += `<text x="${x(11)}" y="${rowA + 36}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="16" fill="${WARM}">no eleventh place</text>`;

// Panel B: the wheel
f1 += `<text x="48" y="262" font-family="${SC}" font-size="16" letter-spacing="1.6" fill="${INDIGO}">KEPT ON THE WHEEL</text>`;
f1 += `<text x="672" y="262" text-anchor="end" font-family="${SERIF}" font-style="italic" font-size="17" fill="${LABEL}">twenty-two places to stand</text>`;
f1 += `<text x="${x(onWheel)}" y="${rowB - 34}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="16.5" fill="${INDIGO}">the eleven stays where it is</text>`;
f1 += `<path d="M ${x(onWheel)} ${rowB - 26} L ${x(onWheel)} ${rowB - 19}" fill="none" stroke="${INDIGO}" stroke-width="1.3"/>`;
f1 += strip(rowB, reachedByWheel, onWheel);
f1 += `<text x="${x(onWheel)}" y="${rowB + 36}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="16" fill="${FIRE}">${short(onWheel)}</text>`;

f1 += `<text x="${W / 2}" y="${H - 12}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="18.5" fill="${CHARCOAL}">Same sum. <tspan fill="${FIRE}">${short(folded)}</tspan> by reduction, <tspan fill="${FIRE}">${short(onWheel)}</tspan> by the wheel, ${gap} cards apart.</text>`;
f1 += `</svg>`;

// ===========================================================================
// Figure 2 — the decade drift
// ===========================================================================
const PX = (i) => 74 + i * 57.2;                 // 2020 at left, 2030 at right
const PY = (v) => 330 - v * 15.4;                // card number up the page

let f2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Two tracks plotted from 2020 to 2030. The reduced number and the wheel card run along the same line from 2020 to 2025. In 2026 the reduced track drops to one while the wheel track climbs to ten, and the two stay apart through 2029. In 2030 both return to five and the tracks meet again.">`;
f2 += FONTS;
f2 += `<text x="${W / 2}" y="34" text-anchor="middle" font-family="${SC}" font-size="19" letter-spacing="2.8" fill="${LABEL}">SIX YEARS OF AGREEMENT, THEN FOUR OF DRIFT</text>`;
f2 += `<text x="${W / 2}" y="64" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="21" fill="${CHARCOAL}">The card each method names, year by year.</text>`;

// Divergence band
const bandX0 = PX(YEARS.indexOf(2026)) - 28, bandX1 = PX(YEARS.indexOf(2029)) + 28;
f2 += `<rect x="${bandX0}" y="92" width="${bandX1 - bandX0}" height="248" fill="${WARM}" fill-opacity="0.16"/>`;
f2 += `<text x="${(bandX0 + bandX1) / 2}" y="110" text-anchor="middle" font-family="${SC}" font-size="15" letter-spacing="1.6" fill="${LABEL}">THEY DISAGREE</text>`;

// Tracks
const line = (series) => series.map((v, i) => `${PX(i)},${PY(v)}`).join(" ");
f2 += `<polyline points="${line(wheelSeries)}" fill="none" stroke="${INDIGO}" stroke-width="2.1"/>`;
f2 += `<polyline points="${line(foldSeries)}" fill="none" stroke="${AIR}" stroke-width="2.1" stroke-dasharray="5 3"/>`;

// Points + year labels
YEARS.forEach((y, i) => {
  f2 += `<circle cx="${PX(i)}" cy="${PY(wheelSeries[i])}" r="5" fill="${INDIGO}"/>`;
  if (!agrees[i]) f2 += `<circle cx="${PX(i)}" cy="${PY(foldSeries[i])}" r="5" fill="${AIR}"/>`;
  f2 += `<text x="${PX(i)}" y="358" text-anchor="middle" font-family="${SERIF}" font-size="16" fill="${agrees[i] ? LABEL : CHARCOAL}">${y}</text>`;
});

// The 2027 annotation: the gap, measured
const i27 = YEARS.indexOf(2027);
f2 += `<path d="M ${PX(i27)} ${PY(foldSeries[i27]) - 8} L ${PX(i27)} ${PY(wheelSeries[i27]) + 8}" fill="none" stroke="${FIRE}" stroke-width="1.3" stroke-dasharray="3 2.5"/>`;
f2 += `<circle cx="${PX(i27)}" cy="${PY(wheelSeries[i27])}" r="9" fill="none" stroke="${FIRE}" stroke-width="1.8"/>`;
f2 += `<circle cx="${PX(i27)}" cy="${PY(foldSeries[i27])}" r="9" fill="none" stroke="${FIRE}" stroke-width="1.8"/>`;
f2 += `<text x="${PX(i27) + 14}" y="${(PY(foldSeries[i27]) + PY(wheelSeries[i27])) / 2 + 5}" font-family="${SERIF}" font-style="italic" font-size="16" fill="${FIRE}">${gap} cards apart</text>`;

// Track labels, placed at their own ends
f2 += `<text x="96" y="176" font-family="${SC}" font-size="15" letter-spacing="1.4" fill="${INDIGO}">ON THE WHEEL</text>`;
f2 += `<text x="${PX(YEARS.indexOf(2029))}" y="${PY(foldSeries[YEARS.indexOf(2029)]) + 34}" text-anchor="middle" font-family="${SC}" font-size="15" letter-spacing="1.4" fill="${AIR}">REDUCED</text>`;
// the two values the gap is measured between, so the scale is readable
f2 += `<text x="${PX(i27) - 24}" y="${PY(wheelSeries[i27]) + 6}" text-anchor="end" font-family="${SERIF}" font-size="18" fill="${INDIGO}">${wheelSeries[i27]}</text>`;
f2 += `<text x="${PX(i27) - 24}" y="${PY(foldSeries[i27]) + 6}" text-anchor="end" font-family="${SERIF}" font-size="18" fill="${AIR}">${foldSeries[i27]}</text>`;
f2 += `<text x="${PX(YEARS.indexOf(2025))}" y="${PY(wheelSeries[YEARS.indexOf(2025)]) - 16}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="16" fill="${LABEL}">one line, six years</text>`;
f2 += `<text x="${PX(YEARS.indexOf(2027))}" y="${PY(wheelSeries[i27]) - 20}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="16" fill="${INDIGO}">${short(onWheel)}</text>`;

f2 += `<text x="${W / 2}" y="${H - 12}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="18.5" fill="${CHARCOAL}">Nothing to reduce until 2026. Then four years, four cards, and in 2030 the gap closes.</text>`;
f2 += `</svg>`;

// --- Write -----------------------------------------------------------------
writeFileSync(new URL("../public/2027-eleven-two-ways.svg", import.meta.url), f1);
writeFileSync(new URL("../public/2027-decade-drift.svg", import.meta.url), f2);
console.log("wrote public/2027-eleven-two-ways.svg and public/2027-decade-drift.svg");
console.log(`sum ${total} | wheel ${onWheel} ${MAJORS[onWheel]} | reduced ${folded} ${MAJORS[folded]} | gap ${gap}`);
console.log("wheel: ", wheelSeries.join(","));
console.log("reduce:", foldSeries.join(","));
console.log("agree: ", YEARS.filter((_, i) => agrees[i]).join(","));
