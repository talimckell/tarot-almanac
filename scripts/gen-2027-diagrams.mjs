// Generates the two blog-06 figures (the 2027 year card post):
//   public/2027-month-walk.svg — the twenty-two card strip with 2027's twelve collective
//     month cards filled, running 12 → 21 and then wrapping to 0 and 1.
//   public/2027-half-turn.svg — the wheel of twenty-two with three birthdays drawn as
//     chords. Because 2027's card is eleven, exactly half the wheel, every birthday's
//     personal card is a straight line across the centre from its Bearing.
//
// Card indices come LIVE from lib/almanac.ts. Palette, fonts and type sizes match
// public/personal-month-loop-vs-walk.svg and public/life-path-ceiling.svg.
//
//   node scripts/gen-2027-diagrams.mjs
//
import { writeFileSync } from "node:fs";
import { MAJORS, collectiveMonth, collectiveYear, personalYear, bearingIndex, mod22 } from "../lib/almanac.ts";

const Y = 2027;

const INDIGO = "#1e3a58", STONE = "#f6f2eb", WARM = "#b8a890";
const LABEL = "#5f5648", CHARCOAL = "#4a3e30", FIRE = "#b83820";
const SERIF = "'Cormorant',Georgia,serif";
const SC = "'Cormorant SC',Georgia,serif";
const FONTS = `<defs><style>@import url("https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,500;1,400&amp;family=Cormorant+SC:wght@400;500&amp;family=Lato:wght@300;400&amp;display=swap");</style></defs>`;
const MONTH_ABBR = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const short = (i) => MAJORS[i].replace(/^The /, "");

// ===========================================================================
// Figure 1 — the twelve months walking the strip, and wrapping
// ===========================================================================
{
  const yearCard = collectiveYear(Y);                                   // 11, Justice
  const months = Array.from({ length: 12 }, (_, m) => collectiveMonth(Y, m + 1));
  const monthAt = new Map();                                            // card index -> month label
  months.forEach((c, m) => monthAt.set(c, MONTH_ABBR[m]));

  const W = 720, H = 430;
  const x = (i) => 48 + i * 29.714286;
  const row = 258;

  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="The twenty-two Major Arcana in a row, numbered zero to twenty-one. Justice at eleven is ringed as the card for 2027. The twelve collective month cards are filled: January at the Hanged One, twelve, running forward one card a month to October at the World, twenty-one. An arc then runs back to the start, where November fills the Fool at zero and December the Magician at one.">`;
  s += FONTS;
  s += `<text x="${W / 2}" y="34" text-anchor="middle" font-family="${SC}" font-size="18" letter-spacing="2.8" fill="${LABEL}">2027, MONTH BY MONTH</text>`;
  s += `<text x="${W / 2}" y="63" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="20" fill="${CHARCOAL}">Twelve months from a year that starts past the middle of the deck.</text>`;

  // The wrap arc, above the strip, from the World back round to the Fool.
  const xEnd = x(21), xStart = x(0);
  s += `<text x="${(xEnd + xStart) / 2}" y="${row - 152}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="18" fill="${FIRE}">the deck runs out in October, so November starts it over</text>`;
  s += `<path d="M ${xEnd} ${row - 58} C ${xEnd} ${row - 136}, ${xStart} ${row - 136}, ${xStart} ${row - 58}" fill="none" stroke="${FIRE}" stroke-width="1.5" stroke-dasharray="4 3"/>`;
  s += `<path d="M ${xStart - 5} ${row - 66} L ${xStart} ${row - 56} L ${xStart + 5} ${row - 66}" fill="none" stroke="${FIRE}" stroke-width="1.5"/>`;

  // Month labels above each filled cell. Cells are only ~30px apart, so the labels
  // alternate between two rows rather than running into each other.
  for (let i = 0; i <= 21; i++) {
    if (!monthAt.has(i)) continue;
    s += `<text x="${x(i)}" y="${row - (i % 2 ? 42 : 24)}" text-anchor="middle" font-family="${SC}" font-size="13" fill="${INDIGO}">${monthAt.get(i)}</text>`;
  }

  // The strip.
  for (let i = 0; i <= 21; i++) {
    const filled = monthAt.has(i);
    if (filled) {
      s += `<circle cx="${x(i)}" cy="${row}" r="13" fill="${INDIGO}" stroke="${INDIGO}" stroke-width="1.2"/>`;
      s += `<text x="${x(i)}" y="${row}" text-anchor="middle" dominant-baseline="central" font-family="${SERIF}" font-size="15" fill="${STONE}">${i}</text>`;
    } else {
      s += `<circle cx="${x(i)}" cy="${row}" r="12" fill="none" stroke="${WARM}" stroke-width="1.2"/>`;
      s += `<text x="${x(i)}" y="${row}" text-anchor="middle" dominant-baseline="central" font-family="${SERIF}" font-size="14" fill="${WARM}">${i}</text>`;
    }
  }
  // The year's own card, ringed.
  s += `<circle cx="${x(yearCard)}" cy="${row}" r="16.5" fill="none" stroke="${FIRE}" stroke-width="1.8"/>`;
  s += `<text x="${x(yearCard)}" y="${row + 34}" text-anchor="middle" font-family="${SC}" font-size="13" letter-spacing="1.4" fill="${FIRE}">THE YEAR</text>`;
  s += `<text x="${x(yearCard)}" y="${row + 54}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="18" fill="${FIRE}">Justice</text>`;

  // End labels.
  s += `<text x="${x(0)}" y="${row + 34}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="17" fill="${LABEL}">Fool</text>`;
  s += `<text x="${x(21)}" y="${row + 34}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="17" fill="${LABEL}">World</text>`;

  // Reckoning band bracket, cards 15-21. The label is short enough to stay centred
  // under the bracket without running off the right edge.
  const bL = x(15) - 15, bR = x(21) + 15, bY = row + 68;
  s += `<path d="M ${bL} ${bY} L ${bL} ${bY + 8} L ${bR} ${bY + 8} L ${bR} ${bY}" fill="none" stroke="${WARM}" stroke-width="1.2"/>`;
  s += `<text x="${(bL + bR) / 2}" y="${bY + 30}" text-anchor="middle" font-family="${SC}" font-size="13" letter-spacing="1.4" fill="${LABEL}">THE RECKONING STRETCH</text>`;

  s += `<text x="${W / 2}" y="${H - 16}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="18.5" fill="${CHARCOAL}">April through October, seven months of it, the most a year can hold.</text>`;
  s += `</svg>`;

  writeFileSync(new URL("../public/2027-month-walk.svg", import.meta.url), s);
  console.log("wrote public/2027-month-walk.svg");
  console.log("  year card:", yearCard, MAJORS[yearCard]);
  console.log("  months:", months.map((c, m) => `${MONTH_ABBR[m]} ${c}`).join(" "));
}

// ===========================================================================
// Figure 2 — the half-turn: every birthday lands straight across the wheel
// ===========================================================================
{
  const BIRTHDAYS = [
    { bm: 3, bd: 15, label: "March 15" },
    { bm: 1, bd: 1, label: "January 1" },
    { bm: 12, bd: 25, label: "December 25" },
  ];
  const rot = collectiveYear(Y);                       // 11: the rotation the year applies

  const W = 720, H = 648;
  const cx = 360, cy = 292, R = 148, NODE = 15;
  const ang = (i) => (-90 + i * (360 / 22)) * (Math.PI / 180);
  const px = (i, r = R) => cx + Math.cos(ang(i)) * r;
  const py = (i, r = R) => cy + Math.sin(ang(i)) * r;

  const rows = BIRTHDAYS.map((b) => {
    const bear = bearingIndex(b.bm, b.bd);
    const mine = personalYear(Y, b.bm, b.bd);
    return { ...b, bear, mine, gap: mod22(mine - bear) };
  });

  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="The twenty-two Major Arcana arranged in a circle. Three birthdays are drawn as straight lines through the centre of the wheel, each joining a Bearing card to that birthday's 2027 card: March 15 from the Moon at eighteen to the Chariot at seven, January 1 from the High Priestess at two to Death at thirteen, and December 25 from the Devil at fifteen to the Emperor at four. Each line passes through the middle, because eleven steps is exactly half of twenty-two.">`;
  s += FONTS;
  s += `<text x="${W / 2}" y="34" text-anchor="middle" font-family="${SC}" font-size="18" letter-spacing="2.8" fill="${LABEL}">2027 STANDS EVERYONE ACROSS THE WHEEL</text>`;
  s += `<text x="${W / 2}" y="63" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="20" fill="${CHARCOAL}">Eleven steps is half of twenty-two, so the move is a straight line.</text>`;

  // Chords first, so the nodes sit on top of them.
  const CHORD = [FIRE, INDIGO, "#3a5a38"];
  rows.forEach((r, i) => {
    s += `<line x1="${px(r.bear)}" y1="${py(r.bear)}" x2="${px(r.mine)}" y2="${py(r.mine)}" stroke="${CHORD[i]}" stroke-width="1.6" stroke-opacity="0.85"/>`;
  });

  // The ring. Any node that is somebody's Bearing or somebody's 2027 card gets marked.
  const bearOf = new Map(), mineOf = new Map();
  rows.forEach((r, i) => { bearOf.set(r.bear, i); mineOf.set(r.mine, i); });
  for (let i = 0; i <= 21; i++) {
    const isB = bearOf.has(i), isM = mineOf.has(i);
    const color = isB ? CHORD[bearOf.get(i)] : isM ? CHORD[mineOf.get(i)] : WARM;
    s += `<circle cx="${px(i)}" cy="${py(i)}" r="${isB || isM ? NODE : NODE - 1}" fill="${isM ? color : STONE}" stroke="${color}" stroke-width="${isB || isM ? 1.8 : 1.2}"/>`;
    s += `<text x="${px(i)}" y="${py(i)}" text-anchor="middle" dominant-baseline="central" font-family="${SERIF}" font-size="15" fill="${isM ? STONE : color}">${i}</text>`;
  }

  // A single legend block under the wheel, rather than crowding the ring with labels.
  const lx = 118, ly = H - 116;
  s += `<text x="${lx}" y="${ly - 26}" font-family="${SC}" font-size="13" letter-spacing="1.4" fill="${LABEL}">OPEN CIRCLE, THE BEARING · FILLED, THE 2027 CARD</text>`;
  rows.forEach((r, i) => {
    const y = ly + i * 26;
    s += `<line x1="${lx}" y1="${y - 5}" x2="${lx + 26}" y2="${y - 5}" stroke="${CHORD[i]}" stroke-width="1.6"/>`;
    s += `<text x="${lx + 38}" y="${y}" font-family="${SERIF}" font-size="18.5" fill="${CHARCOAL}">${r.label}: ${short(r.bear)} <tspan fill="${LABEL}">(${r.bear})</tspan> to ${short(r.mine)} <tspan fill="${LABEL}">(${r.mine})</tspan>, ${r.gap} steps</text>`;
  });

  s += `<text x="${W / 2}" y="${H - 16}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="18" fill="${LABEL}">Every birthday makes the same line. Only where it sits changes.</text>`;
  s += `</svg>`;

  writeFileSync(new URL("../public/2027-half-turn.svg", import.meta.url), s);
  console.log("wrote public/2027-half-turn.svg");
  console.log("  rotation:", rot);
  rows.forEach((r) => console.log(`  ${r.label}: bearing ${r.bear} ${MAJORS[r.bear]} → 2027 ${r.mine} ${MAJORS[r.mine]} (gap ${r.gap})`));
}
