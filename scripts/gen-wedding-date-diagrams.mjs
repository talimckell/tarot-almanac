// Generates the blog-14 figures (the wedding-date / any-date post):
//   public/anniversary-walk.svg — sixteen anniversaries of 14 June 2014, each shown twice:
//     where the folded date lands on a nine-slot track, and where the same date lands on
//     the wheel of twenty-two. The thirteen cards the fold can never name are tinted.
//   public/date-to-card.svg — the three-step derivation, 14 June 2014 to the Hierophant.
//
// Every digit and card index is resolved LIVE from lib/almanac.ts, so neither picture can
// drift from the engine. Palette, fonts and row grammar match public/birth-year-century.svg
// and public/life-path-ceiling.svg.
//
// SIZING. .body figure img.diagram caps at 420px (app/blog/[slug]/page.module.css), so the
// canvas width sets the on-screen type size. Both canvases are 520 wide, matching blog-13
// (420/520 = 0.81) rather than the 720-wide older siblings, which read too small at blog
// width. Check these rasterized at 420px, never at full size.
//
//   node scripts/gen-wedding-date-diagrams.mjs
//
import { writeFileSync } from "node:fs";
import { MAJORS, collectiveDayCard, sumDigits, collectiveYear, collectiveMonth } from "../lib/almanac.ts";

const BY = 2014, BMO = 6, BD = 14;   // the worked wedding date, 14 June 2014
const FROM = 2014, TO = 2029;

// --- Palette / type (matched to the sibling figures) -----------------------
const INDIGO = "#1e3a58", STONE = "#f6f2eb", WARM = "#b8a890", VELLUM = "#e8e0d0";
const LABEL = "#5f5648", CHARCOAL = "#4a3e30", FIRE = "#b83820";
const SERIF = "'Cormorant',Georgia,serif";
const SC = "'Cormorant SC',Georgia,serif";
const SANS = "'Lato',system-ui,sans-serif";
const FONTS = `<defs><style>@import url("https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,500;1,400&amp;family=Cormorant+SC:wght@400;500&amp;family=Lato:wght@300;400&amp;display=swap");</style></defs>`;

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const fold = (n) => { while (n > 9) n = sumDigits(n); return n; };
const foldDate = (y, m, d) => fold(sumDigits(m) + sumDigits(d) + sumDigits(y));

// --- Data, straight off the engine ----------------------------------------
const rows = [];
for (let y = FROM; y <= TO; y++) {
  rows.push({ y, digit: foldDate(y, BMO, BD), major: collectiveDayCard(y, BMO, BD).major });
}
// The nine cards a folded digit can name are 1..9, the Magician to the Hermit.
const reachable = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
const unreachable = Array.from({ length: 22 }, (_, i) => i).filter((i) => !reachable.has(i));

// ===========================================================================
// Figure 1 — the anniversary walk
// ===========================================================================
{
  const W = 520;
  const ROW0 = 172, PITCH = 22;
  const H = ROW0 + rows.length * PITCH + 116;

  const YEAR_X = 40;
  const FA = 68, FPITCH = 12.4;            // fold track, 9 slots
  const WA = 208, WPITCH = 13.2;           // wheel track, 22 slots
  const fx = (d) => FA + (d - 1) * FPITCH; // digits run 1..9
  const wx = (i) => WA + i * WPITCH;       // cards run 0..21
  const RULE_Y = 156;

  const first = rows[0], ninth = rows.find((r) => r.y === 2023), split = rows.find((r) => r.y === 2029);

  const ALT = `Sixteen rows, one for each anniversary of 14 June from ${FROM} to ${TO}. `
    + `Each row marks two positions: where the date lands when folded to a single digit, on a `
    + `track of nine slots, and where the same date lands on the wheel of twenty-two. The folded `
    + `marker steps forward one slot a year and returns to its starting slot every nine years. `
    + `The wheel marker also steps forward, but thirteen of its slots are tinted as cards a `
    + `folded digit can never name, and in 2029 the marker sits inside that tinted band, on `
    + `Justice at eleven.`;

  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(ALT)}">${FONTS}`;

  s += `<text x="${W / 2}" y="32" text-anchor="middle" font-family="${SC}" font-size="16" letter-spacing="2.4" fill="${LABEL}">SIXTEEN ANNIVERSARIES</text>`;
  s += `<text x="${W / 2}" y="60" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="17" fill="${CHARCOAL}">Every 14 June from ${FROM} to ${TO}, placed twice.</text>`;

  // The tinted band: the thirteen cards outside a folded digit's reach.
  const bandTop = 150, bandBot = ROW0 + rows.length * PITCH - 8;
  for (const i of unreachable) {
    s += `<rect x="${wx(i) - WPITCH / 2}" y="${bandTop}" width="${WPITCH}" height="${bandBot - bandTop}" fill="${VELLUM}" opacity="0.55"/>`;
  }

  // Lane headers
  s += `<text x="${FA - 6}" y="120" font-family="${SERIF}" font-style="italic" font-size="17" fill="${LABEL}">folded to a digit</text>`;
  s += `<text x="${FA - 6}" y="140" font-family="${SC}" font-size="13" letter-spacing="1.2" fill="${LABEL}">9 SLOTS</text>`;
  s += `<text x="${WA - 6}" y="120" font-family="${SERIF}" font-style="italic" font-size="17" fill="${INDIGO}">on the wheel</text>`;
  s += `<text x="${WA - 6}" y="140" font-family="${SC}" font-size="13" letter-spacing="1.2" fill="${INDIGO}">22 SLOTS</text>`;
  // The tint needs naming where it starts, or it reads as decoration.
  s += `<text x="${W - 14}" y="140" text-anchor="end" font-family="${SERIF}" font-style="italic" font-size="14.5" fill="${LABEL}">shaded: the 13 a digit can\u2019t name</text>`;
  s += `<path d="M ${FA - 10} ${RULE_Y} L ${fx(9) + 8} ${RULE_Y}" stroke="${WARM}" stroke-width="1"/>`;
  s += `<path d="M ${WA - 10} ${RULE_Y} L ${wx(21) + 8} ${RULE_Y}" stroke="${WARM}" stroke-width="1"/>`;

  // Rows
  for (let r = 0; r < rows.length; r++) {
    const { y, digit, major } = rows[r];
    const cy = ROW0 + r * PITCH;
    const marked = y === 2023 || y === 2029;

    s += `<text x="${YEAR_X}" y="${cy}" text-anchor="end" dominant-baseline="central" font-family="${SERIF}" font-size="15" fill="${marked ? CHARCOAL : WARM}">${y}</text>`;

    // fold track: empty slots, then the landing
    for (let d = 1; d <= 9; d++) {
      if (d === digit) continue;
      s += `<circle cx="${fx(d)}" cy="${cy}" r="1.5" fill="${WARM}" opacity="0.5"/>`;
    }
    s += `<circle cx="${fx(digit)}" cy="${cy}" r="4.4" fill="none" stroke="${LABEL}" stroke-width="1.4"/>`;

    // wheel track
    for (let i = 0; i <= 21; i++) {
      if (i === major) continue;
      s += `<circle cx="${wx(i)}" cy="${cy}" r="1.5" fill="${WARM}" opacity="0.5"/>`;
    }
    const hot = y === 2029;
    s += `<circle cx="${wx(major)}" cy="${cy}" r="4.6" fill="${hot ? FIRE : INDIGO}"/>`;
  }

  // The two moments that carry the argument, set under the figure rather than beside the
  // rows: both marked years sit mid-track, so a right-hand callout would cross the wheel.
  const foot = ROW0 + rows.length * PITCH + 28;
  const lower = (n) => n.replace(/^The /, "the ");
  const footLine = (i, text, color) =>
    `<text x="${YEAR_X - 26}" y="${foot + i * 22}" font-family="${SANS}" font-weight="300" font-size="15" fill="${color}">${esc(text)}</text>`;
  s += footLine(0, "The digit returns to its slot every nine years, exactly.", LABEL);
  s += footLine(1, `${first.y} and ${ninth.y} both land on ${lower(MAJORS[first.major])}.`, LABEL);
  s += footLine(2, `${split.y} lands on ${lower(MAJORS[split.major])}, card ${split.major}. No folded digit reaches it.`, FIRE);

  s += `</svg>`;
  writeFileSync(new URL("../public/anniversary-walk.svg", import.meta.url), s);
  console.log(`wrote public/anniversary-walk.svg  ${W}x${H}  (renders at ${(420 / W).toFixed(2)} scale)`);
  console.log(`  ${first.y} ${MAJORS[first.major]} / digit ${first.digit} | ${ninth.y} ${MAJORS[ninth.major]} / digit ${ninth.digit} | ${split.y} ${MAJORS[split.major]} / digit ${split.digit}`);
  console.log(`  unreachable by the fold: ${unreachable.length} cards`);
}

// ===========================================================================
// Figure 2 — how one date becomes one card
// ===========================================================================
{
  const W = 520, H = 292;
  const yearSum = sumDigits(BY);
  const afterMonth = yearSum + BMO;
  const afterDay = afterMonth + BD;
  const landed = collectiveDayCard(BY, BMO, BD).major;
  const wrapped = afterDay - 22;

  // The engine, checked: the walk must arrive where collectiveDayCard does.
  if (wrapped !== landed) throw new Error(`walk ${wrapped} != engine ${landed}`);
  if (collectiveYear(BY) !== yearSum) throw new Error("year sum drifted from collectiveYear");
  if (collectiveMonth(BY, BMO) !== afterMonth) throw new Error("month sum drifted from collectiveMonth");

  const ALT = `A four-step arithmetic walk. The digits of 2014 add to seven. Adding the month, `
    + `six, gives thirteen. Adding the day, fourteen, gives twenty-seven. Twenty-seven is past `
    + `the end of a twenty-two card wheel, so it comes around to five, the Hierophant.`;

  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(ALT)}">${FONTS}`;
  s += `<text x="${W / 2}" y="32" text-anchor="middle" font-family="${SC}" font-size="16" letter-spacing="2.4" fill="${LABEL}">ONE DATE, ONE CARD</text>`;
  s += `<text x="${W / 2}" y="60" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="17" fill="${CHARCOAL}">14 June 2014, kept whole.</text>`;

  const steps = [
    { label: "the year's digits", op: "2 + 0 + 1 + 4", val: yearSum },
    { label: "add the month", op: `${yearSum} + ${BMO}`, val: afterMonth },
    { label: "add the day", op: `${afterMonth} + ${BD}`, val: afterDay },
  ];

  const COL = [78, 218, 358];
  const ROW = 122;
  steps.forEach((st, i) => {
    const x = COL[i];
    s += `<text x="${x}" y="${ROW - 34}" text-anchor="middle" font-family="${SC}" font-size="13" letter-spacing="1.1" fill="${LABEL}">${esc(st.label.toUpperCase())}</text>`;
    s += `<text x="${x}" y="${ROW - 12}" text-anchor="middle" font-family="${SANS}" font-weight="300" font-size="14.5" fill="${WARM}">${esc(st.op)}</text>`;
    s += `<circle cx="${x}" cy="${ROW + 22}" r="21" fill="none" stroke="${INDIGO}" stroke-width="1.3"/>`;
    s += `<text x="${x}" y="${ROW + 22}" text-anchor="middle" dominant-baseline="central" font-family="${SERIF}" font-size="21" fill="${INDIGO}">${st.val}</text>`;
    if (i < steps.length - 1) {
      s += `<path d="M ${x + 28} ${ROW + 22} L ${COL[i + 1] - 30} ${ROW + 22}" stroke="${WARM}" stroke-width="1"/>`;
      s += `<path d="M ${COL[i + 1] - 36} ${ROW + 17} L ${COL[i + 1] - 30} ${ROW + 22} L ${COL[i + 1] - 36} ${ROW + 27}" fill="none" stroke="${WARM}" stroke-width="1"/>`;
    }
  });

  // The wrap, on its own line so the "past the end" step reads as a step.
  const WY = ROW + 104;
  s += `<path d="M ${COL[2]} ${ROW + 46} L ${COL[2]} ${WY - 16}" stroke="${FIRE}" stroke-width="1.2" stroke-dasharray="4 3"/>`;
  s += `<text x="${COL[2] - 12}" y="${WY - 30}" text-anchor="end" font-family="${SERIF}" font-style="italic" font-size="16.5" fill="${FIRE}">past the end of the wheel, so ${afterDay} − 22</text>`;
  s += `<circle cx="${COL[2]}" cy="${WY + 6}" r="21" fill="${FIRE}"/>`;
  s += `<text x="${COL[2]}" y="${WY + 6}" text-anchor="middle" dominant-baseline="central" font-family="${SERIF}" font-size="21" fill="${STONE}">${landed}</text>`;
  s += `<text x="${COL[2] - 32}" y="${WY + 6}" text-anchor="end" dominant-baseline="central" font-family="${SERIF}" font-size="22" fill="${CHARCOAL}">${esc(MAJORS[landed])}</text>`;

  s += `</svg>`;
  writeFileSync(new URL("../public/date-to-card.svg", import.meta.url), s);
  console.log(`wrote public/date-to-card.svg  ${W}x${H}  (renders at ${(420 / W).toFixed(2)} scale)`);
  console.log(`  ${yearSum} -> ${afterMonth} -> ${afterDay} -> ${landed} ${MAJORS[landed]}  (engine agrees)`);
}
