// Generates the two blog-14 figures (the wedding-date post):
//
//   public/wedding-month-wheel.svg      — June 2027 laid around the wheel of 22,
//                                          one card a day, thirty days making a lap
//                                          and a bit.
//   public/anniversary-two-methods.svg  — fifty anniversaries of one date, the
//                                          folded number's nine values against the
//                                          wheel's thirteen cards.
//
// Every highlighted position is resolved LIVE from lib/almanac.ts, so the pictures
// can't drift from the engine. Palette, fonts and strip geometry match the existing
// family (life-path-ceiling.svg, personal-month-loop-vs-walk.svg, tarot-cycle.svg).
//
// CANVAS WIDTH IS 520, NOT 720. `.body figure img.diagram` caps at 420px
// (app/blog/[slug]/page.module.css:182), so a narrower canvas is what makes the type
// read at blog width. Always eyeball a new figure rasterized at 420px, not full size.
//
//   npx tsx scripts/gen-wedding-date-diagrams.mjs
//
import { writeFileSync } from "node:fs";
import { collectiveDayMajor, MAJORS } from "../lib/almanac.ts";

const Y = 2027, M = 6, D = 14; // the post's worked date

// --- Palette / type (matched to the existing figure family) -----------------
const INDIGO = "#1e3a58", STONE = "#f6f2eb", WARM = "#b8a890";
const LABEL = "#5f5648", CHARCOAL = "#4a3e30";
const SERIF = "'Cormorant',Georgia,serif";
const SC = "'Cormorant SC',Georgia,serif";
const SANS = "'Lato',system-ui,sans-serif";
const FONTS = `<defs><style>@import url("https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,500;1,400&amp;family=Cormorant+SC:wght@400;500&amp;family=Lato:wght@300;400&amp;display=swap");</style></defs>`;

// ===========================================================================
// Figure 1 — the month around the wheel
// ===========================================================================
const daysInMonth = new Date(Y, M, 0).getDate();

// wheel position -> the days of the month that land on it, in order
const byPosition = {};
for (let d = 1; d <= daysInMonth; d++) {
  const p = collectiveDayMajor(Y, M, d);
  (byPosition[p] ||= []).push(d);
}

const W1 = 520, H1 = 578;
const CX = 260, CY = 296, R = 168;
const angle = (i) => (-90 + i * (360 / 22)) * (Math.PI / 180);
const px = (i, r) => CX + r * Math.cos(angle(i));
const py = (i, r) => CY + r * Math.sin(angle(i));

let f1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W1} ${H1}" role="img" aria-label="The twenty-two Major Arcana arranged in a wheel, numbered zero to twenty-one, with the thirty days of June 2027 placed around the outside. The first of the month sits on card eighteen and each following day moves one position clockwise, so the fourth reaches twenty-one, the fifth comes back around to zero, and the twenty-second reaches seventeen. The remaining eight days, the twenty-third to the thirtieth, begin a second lap and are printed on an outer ring in a lighter colour.">`;
f1 += FONTS;
f1 += `<circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="${WARM}" stroke-width="1.2"/>`;

// Centre block
f1 += `<text x="${CX}" y="${CY - 16}" text-anchor="middle" font-family="${SC}" font-size="21" letter-spacing="3" fill="${LABEL}">JUNE 2027</text>`;
f1 += `<text x="${CX}" y="${CY + 12}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="19" fill="${CHARCOAL}">around the wheel of 22</text>`;
f1 += `<text x="${CX}" y="${CY + 38}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="16" fill="${INDIGO}">one card a day</text>`;

for (let i = 0; i <= 21; i++) {
  const days = byPosition[i] || [];
  const cx = px(i, R), cy = py(i, R);
  f1 += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="13" fill="${INDIGO}" stroke="${INDIGO}" stroke-width="1.4"/>`;
  f1 += `<text x="${cx.toFixed(1)}" y="${cy.toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-family="${SANS}" font-size="12" fill="${STONE}">${i}</text>`;

  // first lap: the day printed just outside its card
  if (days[0] != null) {
    const lx = px(i, R + 27), ly = py(i, R + 27);
    f1 += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-family="${SERIF}" font-size="17" fill="${CHARCOAL}">${days[0]}</text>`;
  }
  // second lap: further out, lighter, so the partial outer arc reads as the lap
  if (days[1] != null) {
    const lx = px(i, R + 51), ly = py(i, R + 51);
    f1 += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-family="${SERIF}" font-size="16" fill="${WARM}">${days[1]}</text>`;
  }
}

// Key, bottom-left, spelling out the two rings
f1 += `<text x="${CX}" y="${H1 - 40}" text-anchor="middle" font-family="${SERIF}" font-size="16" fill="${CHARCOAL}">The 1st to the 22nd go once around.</text>`;
f1 += `<text x="${CX}" y="${H1 - 18}" text-anchor="middle" font-family="${SERIF}" font-size="16" fill="${LABEL}">The 23rd to the 30th start again.</text>`;
f1 += `</svg>`;
writeFileSync(new URL("../public/wedding-month-wheel.svg", import.meta.url), f1);

// ===========================================================================
// Figure 2 — fifty anniversaries, two methods
// ===========================================================================
const SPAN = 50;
const digitSum = (y, m, d) => `${d}${m}${y}`.split("").reduce((a, c) => a + +c, 0);
const foldValue = (n) => {
  if (n === 11 || n === 22 || n === 33) return n; // master numbers are kept
  return n < 10 ? n : foldValue(String(n).split("").reduce((a, c) => a + +c, 0));
};

const wheelSet = new Set();
const numberSet = new Set();
for (let y = Y; y < Y + SPAN; y++) {
  wheelSet.add(collectiveDayMajor(y, M, D));
  numberSet.add(foldValue(digitSum(y, M, D)) % 22); // a folded value names the card of that index
}

const W2 = 520, H2 = 320;
const rowA = 150, rowB = 258;
const sx = (i) => 32 + i * 21.7;

function strip(cy, reached) {
  let s = "";
  for (let i = 0; i <= 21; i++) {
    if (reached.has(i)) {
      s += `<circle cx="${sx(i).toFixed(1)}" cy="${cy}" r="10" fill="${INDIGO}" stroke="${INDIGO}" stroke-width="1.2"/>`;
      s += `<text x="${sx(i).toFixed(1)}" y="${cy}" text-anchor="middle" dominant-baseline="central" font-family="${SERIF}" font-size="12" fill="${STONE}">${i}</text>`;
    } else {
      s += `<circle cx="${sx(i).toFixed(1)}" cy="${cy}" r="9.2" fill="none" stroke="${WARM}" stroke-width="1.1"/>`;
      s += `<text x="${sx(i).toFixed(1)}" y="${cy}" text-anchor="middle" dominant-baseline="central" font-family="${SERIF}" font-size="11.5" fill="${WARM}">${i}</text>`;
    }
  }
  return s;
}

let f2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W2} ${H2}" role="img" aria-label="Two rows of the twenty-two Major Arcana, covering the first fifty anniversaries of one June date. In the top row, the folded number, nine positions are filled and the rest are empty. In the bottom row, the wheel, thirteen consecutive positions from three to fifteen are filled and the rest are empty.">`;
f2 += FONTS;
f2 += `<text x="${W2 / 2}" y="30" text-anchor="middle" font-family="${SC}" font-size="17" letter-spacing="2.6" fill="${LABEL}">FIFTY ANNIVERSARIES, TWO METHODS</text>`;
f2 += `<text x="${W2 / 2}" y="57" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="18" fill="${CHARCOAL}">The same date, come back to every year.</text>`;

f2 += `<text x="32" y="${rowA - 34}" font-family="${SC}" font-size="14" letter-spacing="1.8" fill="${INDIGO}">THE FOLDED NUMBER</text>`;
f2 += `<text x="${W2 - 32}" y="${rowA - 34}" text-anchor="end" font-family="${SERIF}" font-style="italic" font-size="16" fill="${LABEL}">${numberSet.size} cards, then it repeats</text>`;
f2 += strip(rowA, numberSet);

f2 += `<text x="32" y="${rowB - 34}" font-family="${SC}" font-size="14" letter-spacing="1.8" fill="${INDIGO}">THE WHEEL</text>`;
f2 += `<text x="${W2 - 32}" y="${rowB - 34}" text-anchor="end" font-family="${SERIF}" font-style="italic" font-size="16" fill="${LABEL}">${wheelSet.size} cards, walking forward</text>`;
f2 += strip(rowB, wheelSet);

f2 += `<text x="${W2 / 2}" y="${H2 - 18}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="16" fill="${CHARCOAL}">Neither runs out. One of them has more room.</text>`;
f2 += `</svg>`;
writeFileSync(new URL("../public/anniversary-two-methods.svg", import.meta.url), f2);

console.log(`wedding-month-wheel.svg    ${daysInMonth} days, ${Object.values(byPosition).filter((v) => v.length > 1).length} positions doubled`);
console.log(`anniversary-two-methods.svg  folded ${numberSet.size} -> {${[...numberSet].sort((a, b) => a - b)}}`);
console.log(`                             wheel  ${wheelSet.size} -> {${[...wheelSet].sort((a, b) => a - b)}}`);
