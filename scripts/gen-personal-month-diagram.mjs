// Generates public/personal-month-loop-vs-walk.svg — the blog-10 figure.
// Two 22-card strips for March 15, 2026: the numerology personal-month NUMBER
// (folds to 1-9, loops) vs. the personal-month CARD (wraps the wheel, walks
// forward into the back half). Highlighted sets are resolved LIVE from the engine
// so the picture can never drift from lib/almanac.ts. Matches the visual family of
// public/life-path-ceiling.svg (same strip geometry, palette, fonts) but with
// larger type — figure text must read at the ~680px width the blog renders it at.
//
//   node scripts/gen-personal-month-diagram.mjs
//
import { writeFileSync } from "node:fs";
import { personalYear, personalMonth, MAJORS } from "../lib/almanac.ts";

const BM = 3, BD = 15, Y = 2026;

// --- Engine-derived values -------------------------------------------------
const wheelWalk = Array.from({ length: 12 }, (_, i) => personalMonth(Y, i + 1, BM, BD));
const wheelSet = new Set(wheelWalk);
const wheelAug = personalMonth(Y, 8, BM, BD); // August's card index (Temperance, 14)

const reduce = (n) => { while (n > 9) n = String(n).split("").reduce((a, c) => a + +c, 0); return n; };
const numYear = reduce(BM + BD + Y);
const numWalk = Array.from({ length: 12 }, (_, i) => reduce(numYear + i + 1));
const numSet = new Set(numWalk);          // the cards the number reaches: {1..9}
const numAug = reduce(numYear + 8);        // August's number/card (the Hermit, 9)

// --- Palette / geometry (matched to life-path-ceiling.svg) -----------------
const INDIGO = "#1e3a58", STONE = "#f6f2eb", WARM = "#b8a890";
const LABEL = "#5f5648", CHARCOAL = "#4a3e30", FIRE = "#b83820";
const SERIF = "'Cormorant',Georgia,serif";
const SC = "'Cormorant SC',Georgia,serif";
const x = (i) => 48 + i * 29.714286;

function strip(cy, reachedSet, augIdx) {
  let s = "";
  for (let i = 0; i <= 21; i++) {
    const reached = reachedSet.has(i);
    if (reached) {
      s += `<circle cx="${x(i)}" cy="${cy}" r="13" fill="${INDIGO}" stroke="${INDIGO}" stroke-width="1.2"/>`;
      s += `<text x="${x(i)}" y="${cy}" text-anchor="middle" dominant-baseline="central" font-family="${SERIF}" font-size="15" fill="${STONE}">${i}</text>`;
    } else {
      s += `<circle cx="${x(i)}" cy="${cy}" r="12" fill="none" stroke="${WARM}" stroke-width="1.2"/>`;
      s += `<text x="${x(i)}" y="${cy}" text-anchor="middle" dominant-baseline="central" font-family="${SERIF}" font-size="14" fill="${WARM}">${i}</text>`;
    }
  }
  s += `<circle cx="${x(augIdx)}" cy="${cy}" r="16.5" fill="none" stroke="${FIRE}" stroke-width="1.8"/>`;
  return s;
}

// --- Compose ---------------------------------------------------------------
const W = 720, H = 400;
const rowA = 172, rowB = 312;
let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Two rows of the twenty-two Major Arcana for the birthday March 15 across 2026. In the top row, the personal month number, only cards one through nine are highlighted and a dashed arc shows September looping back to the start; August lands on the Hermit, card nine. In the bottom row, the personal month card, twelve cards from the Chariot at seven to the Moon at eighteen are highlighted in a forward walk into the back half of the deck; August lands on Temperance, card fourteen.">`;
svg += `<defs><style>@import url("https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,500;1,400&amp;family=Cormorant+SC:wght@400;500&amp;family=Lato:wght@300;400&amp;display=swap");</style></defs>`;

// Title + subtitle
svg += `<text x="${W/2}" y="32" text-anchor="middle" font-family="${SC}" font-size="18" letter-spacing="2.8" fill="${LABEL}">TWELVE MONTHS, TWO METHODS</text>`;
svg += `<text x="${W/2}" y="61" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="20" fill="${CHARCOAL}">The same birthday, March 15, walked across 2026.</text>`;

// ---- Panel A: the number ----
svg += `<text x="48" y="100" font-family="${SC}" font-size="15" letter-spacing="1.6" fill="${INDIGO}">THE PERSONAL MONTH NUMBER</text>`;
svg += `<text x="672" y="100" text-anchor="end" font-family="${SERIF}" font-style="italic" font-size="16" fill="${LABEL}">nine cards, then it repeats</text>`;
const a9 = x(9), a1 = x(1);
svg += `<text x="${(a9+a1)/2}" y="${rowA-56}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="15.5" fill="${INDIGO}">September folds back to the start</text>`;
svg += `<path d="M ${a9} ${rowA-22} C ${a9} ${rowA-50}, ${a1} ${rowA-50}, ${a1} ${rowA-22}" fill="none" stroke="${INDIGO}" stroke-width="1.3" stroke-dasharray="3 2.5"/>`;
svg += `<path d="M ${a1-4} ${rowA-28} L ${a1} ${rowA-20} L ${a1+4} ${rowA-28}" fill="none" stroke="${INDIGO}" stroke-width="1.3"/>`;
svg += strip(rowA, numSet, numAug);
svg += `<text x="${x(1)}" y="${rowA+34}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="15" fill="${LABEL}">Magician</text>`;
svg += `<text x="${x(9)}" y="${rowA+34}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="15" fill="${LABEL}">Hermit</text>`;

// ---- Panel B: the card ----
svg += `<text x="48" y="258" font-family="${SC}" font-size="15" letter-spacing="1.6" fill="${INDIGO}">THE PERSONAL MONTH CARD</text>`;
svg += `<text x="672" y="258" text-anchor="end" font-family="${SERIF}" font-style="italic" font-size="16" fill="${LABEL}">twelve cards, into the back half</text>`;
const b7 = x(7), b18 = x(18);
svg += `<text x="${(b7+b18)/2}" y="${rowB-34}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="15.5" fill="${INDIGO}">twelve months walk forward, no loop</text>`;
svg += `<path d="M ${b7} ${rowB-24} L ${b18-4} ${rowB-24}" fill="none" stroke="${INDIGO}" stroke-width="1.3"/>`;
svg += `<path d="M ${b18-9} ${rowB-28} L ${b18-3} ${rowB-24} L ${b18-9} ${rowB-20}" fill="none" stroke="${INDIGO}" stroke-width="1.3"/>`;
svg += strip(rowB, wheelSet, wheelAug);
svg += `<text x="${x(7)}" y="${rowB+34}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="15" fill="${LABEL}">Chariot</text>`;
svg += `<text x="${x(18)}" y="${rowB+34}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="15" fill="${LABEL}">the Moon</text>`;

// ---- Bottom tie: August ----
svg += `<text x="${W/2}" y="${H-14}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="17.5" fill="${CHARCOAL}"><tspan fill="${FIRE}">August</tspan> lands on the ${MAJORS[numAug].replace(/^The /,"")} by the number, and on ${MAJORS[wheelAug].replace(/^The /,"")} by the wheel.</text>`;

svg += `</svg>`;

writeFileSync(new URL("../public/personal-month-loop-vs-walk.svg", import.meta.url), svg);
console.log("wrote public/personal-month-loop-vs-walk.svg");
console.log("number set:", [...numSet].sort((a,b)=>a-b).join(","), "| aug ->", numAug, MAJORS[numAug]);
console.log("wheel set: ", [...wheelSet].sort((a,b)=>a-b).join(","), "| aug ->", wheelAug, MAJORS[wheelAug]);
