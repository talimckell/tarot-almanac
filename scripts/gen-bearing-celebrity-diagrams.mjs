// Generates the blog-15 figures (the celebrity-Bearings post):
//   public/bearing-wrap.svg   — February 20 sums to 22, runs the whole ring and lands
//                               back on the Fool at zero.
//   public/bearing-spread.svg — how the 366 calendar days divide across the 22 Bearings,
//                               one dot per day. The Hanged One is widest, the Fool and
//                               the Magician narrowest.
//
// Every number is resolved LIVE from lib/almanac.ts and lib/birthday.ts, so neither
// picture can drift from the engine. Palette, fonts and row grammar match
// public/life-path-ceiling.svg and public/birth-year-century.svg.
//
// SIZING. .body figure img.diagram caps at 420px (app/blog/[slug]/page.module.css), so
// the canvas width sets the on-screen type size. Both render at 520 wide (420/520 = 0.81),
// following the blog-13 lesson: check them rasterized at 420px, never at full size.
//
//   node scripts/gen-bearing-celebrity-diagrams.mjs
//
import { writeFileSync } from "node:fs";
import { MAJORS, bearingIndex } from "../lib/almanac.ts";
import { allBirthdays, formatBirthdayLabel } from "../lib/birthday.ts";

// --- Palette / type (matched to the sibling figures) -----------------------
const INDIGO = "#1e3a58", WARM = "#b8a890", VELLUM = "#e8e0d0";
const LABEL = "#5f5648", CHARCOAL = "#4a3e30", STONE = "#f6f2eb";
const SERIF = "'Cormorant',Georgia,serif";
const SC = "'Cormorant SC',Georgia,serif";
const FONTS = `<defs><style>@import url("https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,500;1,400&amp;family=Cormorant+SC:wght@400;500&amp;family=Lato:wght@300;400&amp;display=swap");</style></defs>`;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ==========================================================================
// Figure 1 — the wrap
// ==========================================================================
{
  const BM = 2, BD = 20;
  const sum = BM + BD;                    // 22
  const landed = bearingIndex(BM, BD);    // resolved, not asserted
  const W = 520, H = 470;
  const CX = 260, CY = 262, R = 150;

  // 22 nodes, zero at the top, clockwise
  const pt = (i, r = R) => {
    const a = (i / 22) * Math.PI * 2 - Math.PI / 2;
    return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
  };
  const f = (n) => Math.round(n * 100) / 100;

  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="`
    + `The twenty-two Major Arcana arranged in a ring, the Fool at zero at the top and the World at `
    + `twenty-one just before it. A line sweeps clockwise from zero all the way around the ring and `
    + `returns to zero, marking the twenty-two steps that a February 20 birthday counts out. The `
    + `starting and finishing card are the same card, the Fool.">${FONTS}\n`;

  s += `<text x="${CX}" y="34" text-anchor="middle" font-family="${SC}" font-size="15" letter-spacing="2.5" fill="${LABEL}">ALL THE WAY AROUND</text>`;
  s += `<text x="${CX}" y="61" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="17" fill="${CHARCOAL}">February 20 counts ${sum} steps and arrives where it started.</text>`;

  // the sweep: a near-complete circle, drawn just inside the ring
  const [sx, sy] = pt(0, R - 30);
  const [ex, ey] = pt(21.35, R - 30);
  s += `<path d="M ${f(sx)} ${f(sy)} A ${R - 30} ${R - 30} 0 1 1 ${f(ex)} ${f(ey)}" fill="none" stroke="${INDIGO}" stroke-width="1.3" stroke-dasharray="4 3"/>`;
  // arrowhead pointing back into zero
  const [ax, ay] = pt(21.55, R - 30);
  s += `<path d="M ${f(ax - 5)} ${f(ay - 6)} L ${f(ax + 4)} ${f(ay - 1)} L ${f(ax - 3)} ${f(ay + 5)} Z" fill="${INDIGO}"/>`;

  for (let i = 0; i < 22; i++) {
    const [x, y] = pt(i);
    const isEnd = i === landed;
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="${isEnd ? 15 : 11}" fill="${isEnd ? INDIGO : "none"}" stroke="${isEnd ? INDIGO : WARM}" stroke-width="${isEnd ? 1.4 : 1.2}"/>`;
    s += `<text x="${f(x)}" y="${f(y)}" text-anchor="middle" dominant-baseline="central" font-family="${SERIF}" font-size="${isEnd ? 14 : 12}" fill="${isEnd ? STONE : WARM}">${i}</text>`;
  }

  // the two facts, inside the ring
  s += `<text x="${CX}" y="${CY - 16}" text-anchor="middle" font-family="${SERIF}" font-size="21" fill="${CHARCOAL}">${BM} + ${BD} = ${sum}</text>`;
  s += `<text x="${CX}" y="${CY + 14}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="16" fill="${INDIGO}">${esc(MAJORS[landed])}</text>`;

  // caption under the ring
  s += `<text x="${CX}" y="${H - 34}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="14" fill="${LABEL}">There are twenty-two cards, and the first one is numbered zero.</text>`;
  s += `<text x="${CX}" y="${H - 14}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="14" fill="${LABEL}">A sum of ${sum} lands on the card it set out from.</text>`;
  s += `\n</svg>\n`;
  writeFileSync(new URL("../public/bearing-wrap.svg", import.meta.url), s);
  console.log(`bearing-wrap.svg — ${formatBirthdayLabel(BM, BD)} → ${MAJORS[landed]} (sum ${sum})`);
}

// ==========================================================================
// Figure 2 — the spread
// ==========================================================================
{
  const days = allBirthdays();
  const counts = Array.from({ length: 22 }, () => 0);
  for (const { m, d } of days) counts[bearingIndex(m, d)]++;
  const max = Math.max(...counts), min = Math.min(...counts);
  const total = days.reduce((a) => a + 1, 0);

  const W = 520;
  const ROW0 = 132, PITCH = 21;
  const H = ROW0 + 22 * PITCH + 56;
  const NUM_X = 24, NAME_X = 36, LANE = 196;
  const DOT = 13.4, R = 4.2;

  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="`
    + `Twenty-two rows, one for each Major Arcana card from the Fool to the World. Each row carries `
    + `one dot for every calendar date whose birth month plus birth day lands on that card. The rows `
    + `are widest in the middle of the deck, where the Hanged One holds ${max} days, and narrowest at `
    + `the two ends, where the Fool and the Magician hold ${min} days each. All ${total} days of the `
    + `year are accounted for.">${FONTS}\n`;

  s += `<text x="${W / 2}" y="34" text-anchor="middle" font-family="${SC}" font-size="15" letter-spacing="2.5" fill="${LABEL}">HOW THE YEAR DIVIDES</text>`;
  s += `<text x="${W / 2}" y="61" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="17" fill="${CHARCOAL}">${total} birthdays across twenty-two Bearings, one dot a day.</text>`;
  s += `<text x="${W / 2}" y="84" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="14" fill="${LABEL}">A month and a day rarely add to very little, or to very much.</text>`;
  s += `<path d="M ${NUM_X} 104 L ${W - 24} 104" stroke="${WARM}" stroke-width="1"/>`;
  s += `<text x="${NUM_X}" y="122" font-family="${SC}" font-size="11" letter-spacing="1.8" fill="${WARM}">CARD</text>`;
  s += `<text x="${LANE}" y="122" font-family="${SC}" font-size="11" letter-spacing="1.8" fill="${WARM}">DAYS OF THE YEAR</text>`;

  for (let i = 0; i < 22; i++) {
    const y = ROW0 + i * PITCH;
    const n = counts[i];
    const extreme = n === max || n === min;
    const ink = extreme ? INDIGO : WARM;
    s += `<text x="${NUM_X}" y="${y}" dominant-baseline="central" font-family="${SERIF}" font-size="12" fill="${WARM}">${i}</text>`;
    s += `<text x="${NAME_X}" y="${y}" dominant-baseline="central" font-family="${SERIF}" font-size="${extreme ? 15 : 14}" fill="${extreme ? CHARCOAL : LABEL}">${esc(MAJORS[i])}</text>`;
    for (let k = 0; k < n; k++) {
      s += `<circle cx="${LANE + 4 + k * DOT}" cy="${y}" r="${R}" fill="${ink}"/>`;
    }
    if (extreme) {
      s += `<text x="${LANE + 4 + n * DOT + 6}" y="${y}" dominant-baseline="central" font-family="${SERIF}" font-size="13" fill="${INDIGO}">${n}</text>`;
    }
  }

  const fool = MAJORS[0], mag = MAJORS[1], hang = MAJORS[12];
  s += `<text x="${NUM_X}" y="${H - 28}" font-family="${SERIF}" font-style="italic" font-size="13" fill="${LABEL}">Widest: ${esc(hang)}, ${max} days. Narrowest: ${esc(fool)} and ${esc(mag)}, ${min} each.</text>`;
  s += `<text x="${NUM_X}" y="${H - 10}" font-family="${SERIF}" font-style="italic" font-size="13" fill="${LABEL}">Every date in the year is on this chart exactly once.</text>`;
  s += `\n</svg>\n`;
  writeFileSync(new URL("../public/bearing-spread.svg", import.meta.url), s);
  console.log(`bearing-spread.svg — max ${max} (${MAJORS[counts.indexOf(max)]}), min ${min}, total ${counts.reduce((a, b) => a + b, 0)}`);
}
