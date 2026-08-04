// Generates the two blog-11 figures (the personal year number post):
//   public/year-card-derivation.svg — the wheel of twenty-two, showing a year card
//     built as Bearing + the world's card. March 15: Bearing 18 → +10 → the Lovers.
//   public/year-card-gap-holds.svg — four consecutive years, the collective card and
//     March 15's card side by side, with the gap sitting at 18 every time.
//
// Every card index is resolved LIVE from lib/almanac.ts, so neither picture can drift
// from the engine. Palette, fonts and type sizes match public/life-path-ceiling.svg and
// public/personal-month-loop-vs-walk.svg (figure text must read at ~680px wide).
//
//   node scripts/gen-personal-year-diagrams.mjs
//
import { writeFileSync } from "node:fs";
import { MAJORS, personalYear, collectiveYear, bearingIndex, mod22 } from "../lib/almanac.ts";

const BM = 3, BD = 15;

// --- Palette / type (matched to the sibling figures) -----------------------
const INDIGO = "#1e3a58", STONE = "#f6f2eb", WARM = "#b8a890";
const LABEL = "#5f5648", CHARCOAL = "#4a3e30", FIRE = "#b83820";
const SERIF = "'Cormorant',Georgia,serif";
const SC = "'Cormorant SC',Georgia,serif";
const FONTS = `<defs><style>@import url("https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,500;1,400&amp;family=Cormorant+SC:wght@400;500&amp;family=Lato:wght@300;400&amp;display=swap");</style></defs>`;

const short = (i) => MAJORS[i].replace(/^The /, "");

// ===========================================================================
// Figure 1 — the derivation, on the wheel
// ===========================================================================
{
  const Y = 2026;
  const bearing = bearingIndex(BM, BD);        // 18, the Moon
  const world = collectiveYear(Y);             // 10, Wheel of Fortune
  const mine = personalYear(Y, BM, BD);        // 6, the Lovers
  const steps = mod22(mine - bearing);         // 10, the rotation the year applies

  const W = 720, H = 592;
  const cx = 360, cy = 288, R = 142, NODE = 15;
  const ang = (i) => (-90 + i * (360 / 22)) * (Math.PI / 180);
  const px = (i, r = R) => cx + Math.cos(ang(i)) * r;
  const py = (i, r = R) => cy + Math.sin(ang(i)) * r;

  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="The twenty-two Major Arcana arranged in a circle. The Wheel of Fortune at ten is marked as the card everyone shares in 2026. The Moon at eighteen is marked as the Bearing for a March 15 birthday. A dashed arc runs ten steps clockwise from the Moon, past the top of the wheel, to the Lovers at six, which is that birthday's 2026 card. The distance from the Wheel of Fortune to the Lovers is eighteen steps, the same as the Bearing.">`;
  s += FONTS;
  s += `<text x="${W / 2}" y="34" text-anchor="middle" font-family="${SC}" font-size="18" letter-spacing="2.8" fill="${LABEL}">WHERE A YEAR CARD COMES FROM</text>`;
  s += `<text x="${W / 2}" y="63" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="20" fill="${CHARCOAL}">Your Bearing, advanced by the card the world is under.</text>`;

  // The rotation arc runs INSIDE the ring so it can't collide with the callouts,
  // bearing -> mine, clockwise.
  const AR = R - 44;
  const largeArc = steps > 11 ? 1 : 0;
  s += `<path d="M ${px(bearing, AR)} ${py(bearing, AR)} A ${AR} ${AR} 0 ${largeArc} 1 ${px(mine, AR)} ${py(mine, AR)}" fill="none" stroke="${FIRE}" stroke-width="1.6" stroke-dasharray="4 3"/>`;
  // Arrowhead at the landing end, rotated onto the clockwise tangent. The glyph points
  // DOWN in local coords (apex at the origin, arms rising), and rotating by the node's
  // own angle lands it on the tangent.
  const tang = -90 + mine * (360 / 22);
  s += `<g transform="translate(${px(mine, AR)} ${py(mine, AR)}) rotate(${tang})"><path d="M -6 -8 L 0 0 L 6 -8" fill="none" stroke="${FIRE}" stroke-width="1.6"/></g>`;
  const midAng = ang(bearing + steps / 2);
  s += `<text x="${cx + Math.cos(midAng) * (AR - 40)}" y="${cy + Math.sin(midAng) * (AR - 40)}" text-anchor="middle" dominant-baseline="central" font-family="${SERIF}" font-style="italic" font-size="19" fill="${FIRE}">+${steps} steps</text>`;

  // the ring
  for (let i = 0; i <= 21; i++) {
    const isWorld = i === world, isMine = i === mine, isBear = i === bearing;
    const fill = isWorld ? INDIGO : isMine ? FIRE : "none";
    const stroke = isWorld ? INDIGO : isMine ? FIRE : isBear ? CHARCOAL : WARM;
    const tfill = isWorld || isMine ? STONE : isBear ? CHARCOAL : WARM;
    s += `<circle cx="${px(i)}" cy="${py(i)}" r="${isBear ? NODE : isWorld || isMine ? NODE : NODE - 1}" fill="${fill}" stroke="${stroke}" stroke-width="${isBear ? 2 : 1.3}"/>`;
    s += `<text x="${px(i)}" y="${py(i)}" text-anchor="middle" dominant-baseline="central" font-family="${SERIF}" font-size="15" fill="${tfill}">${i}</text>`;
  }

  // Callouts sit outside the ring, anchored away from the centre so the text runs
  // outward rather than back across the nodes.
  const callout = (i, line1, line2, color) => {
    const dx = Math.cos(ang(i)), dy = Math.sin(ang(i));
    const r = R + 26;
    let tx = px(i, r), ty = py(i, r);
    let anchor = "middle";
    if (dx < -0.32) { anchor = "end"; tx -= 6; }
    else if (dx > 0.32) { anchor = "start"; tx += 6; }
    // Vertical: lift the two-line block above the node in the top half, drop it below
    // in the bottom half, so it never sits on the ring.
    const lift = dy < 0 ? -14 : 20;
    ty += lift;
    let out = `<text x="${tx}" y="${ty}" text-anchor="${anchor}" font-family="${SC}" font-size="13.5" letter-spacing="1.4" fill="${color}">${line1}</text>`;
    out += `<text x="${tx}" y="${ty + 22}" text-anchor="${anchor}" font-family="${SERIF}" font-style="italic" font-size="19" fill="${color}">${line2}</text>`;
    return out;
  };
  s += callout(world, "EVERYONE, 2026", short(world), INDIGO);
  s += callout(bearing, "YOUR BEARING", short(bearing), CHARCOAL);
  s += callout(mine, "YOUR 2026 CARD", short(mine), FIRE);

  s += `<text x="${W / 2}" y="${H - 52}" text-anchor="middle" font-family="${SERIF}" font-size="19" fill="${CHARCOAL}">${bearing} + ${world} = ${bearing + world}, which wraps to ${mine}.</text>`;
  s += `<text x="${W / 2}" y="${H - 22}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="18" fill="${LABEL}">And from ${short(world)} round to ${short(mine)} is ${mod22(mine - world)} steps: the Bearing again.</text>`;
  s += `</svg>`;

  writeFileSync(new URL("../public/year-card-derivation.svg", import.meta.url), s);
  console.log("wrote public/year-card-derivation.svg");
  console.log(`  bearing ${bearing} ${MAJORS[bearing]} | world ${world} ${MAJORS[world]} | mine ${mine} ${MAJORS[mine]} | rotation +${steps}`);
  console.log(`  gap world→mine = ${mod22(mine - world)} (should equal the Bearing ${bearing})`);
}

// ===========================================================================
// Figure 2 — the gap holds, four years running
// ===========================================================================
{
  const YEARS = [2025, 2026, 2027, 2028];
  const bearing = bearingIndex(BM, BD);
  const rows = YEARS.map((y) => ({
    y,
    world: collectiveYear(y),
    mine: personalYear(y, BM, BD),
    gap: mod22(personalYear(y, BM, BD) - collectiveYear(y)),
  }));

  const W = 720, H = 400;
  const colY = 250, colM = 470, rowTop = 150, rowH = 58;
  const node = (cx, cy, i, filled, color) => {
    let o = `<circle cx="${cx}" cy="${cy}" r="15" fill="${filled ? color : "none"}" stroke="${color}" stroke-width="1.4"/>`;
    o += `<text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central" font-family="${SERIF}" font-size="15" fill="${filled ? STONE : color}">${i}</text>`;
    return o;
  };

  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Four rows, one for each year from 2025 to 2028. Each row shows the Major Arcana card everyone shares that year, the card a March 15 birthday carries that year, and the distance between them. The two cards change every year. The distance is eighteen steps in all four rows, which is that birthday's Bearing.">`;
  s += FONTS;
  s += `<text x="${W / 2}" y="34" text-anchor="middle" font-family="${SC}" font-size="18" letter-spacing="2.8" fill="${LABEL}">THE GAP DOESN'T MOVE</text>`;
  s += `<text x="${W / 2}" y="63" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="20" fill="${CHARCOAL}">Four years running, for the same March 15 birthday.</text>`;

  s += `<text x="86" y="118" font-family="${SC}" font-size="14" letter-spacing="1.6" fill="${LABEL}">YEAR</text>`;
  s += `<text x="${colY}" y="118" text-anchor="middle" font-family="${SC}" font-size="14" letter-spacing="1.6" fill="${INDIGO}">EVERYONE'S CARD</text>`;
  s += `<text x="${colM}" y="118" text-anchor="middle" font-family="${SC}" font-size="14" letter-spacing="1.6" fill="${FIRE}">MARCH 15'S CARD</text>`;
  s += `<text x="646" y="118" text-anchor="middle" font-family="${SC}" font-size="14" letter-spacing="1.6" fill="${LABEL}">APART</text>`;
  s += `<line x1="60" y1="130" x2="${W - 48}" y2="130" stroke="${WARM}" stroke-width="1"/>`;

  rows.forEach((r, idx) => {
    const cy = rowTop + idx * rowH;
    s += `<text x="86" y="${cy}" dominant-baseline="central" font-family="${SERIF}" font-size="20" fill="${CHARCOAL}">${r.y}</text>`;
    s += node(colY - 74, cy, r.world, true, INDIGO);
    s += `<text x="${colY - 52}" y="${cy}" dominant-baseline="central" font-family="${SERIF}" font-style="italic" font-size="18" fill="${LABEL}">${short(r.world)}</text>`;
    s += node(colM - 74, cy, r.mine, true, FIRE);
    s += `<text x="${colM - 52}" y="${cy}" dominant-baseline="central" font-family="${SERIF}" font-style="italic" font-size="18" fill="${LABEL}">${short(r.mine)}</text>`;
    s += `<text x="646" y="${cy}" text-anchor="middle" dominant-baseline="central" font-family="${SERIF}" font-size="21" fill="${CHARCOAL}">${r.gap}</text>`;
    if (idx < rows.length - 1) s += `<line x1="60" y1="${cy + rowH / 2}" x2="${W - 48}" y2="${cy + rowH / 2}" stroke="${WARM}" stroke-width="0.6" stroke-opacity="0.55"/>`;
  });

  // the constant column, bracketed
  const bTop = rowTop - 22, bBot = rowTop + (rows.length - 1) * rowH + 22;
  s += `<path d="M 686 ${bTop} L 694 ${bTop} L 694 ${bBot} L 686 ${bBot}" fill="none" stroke="${CHARCOAL}" stroke-width="1.3"/>`;
  s += `<text x="704" y="${(bTop + bBot) / 2}" text-anchor="middle" dominant-baseline="central" transform="rotate(90 704 ${(bTop + bBot) / 2})" font-family="${SC}" font-size="14" letter-spacing="1.8" fill="${CHARCOAL}">THE BEARING</text>`;

  s += `<text x="${W / 2}" y="${H - 22}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="18.5" fill="${CHARCOAL}">Both cards move every year. The ${bearing} steps between them never do.</text>`;
  s += `</svg>`;

  writeFileSync(new URL("../public/year-card-gap-holds.svg", import.meta.url), s);
  console.log("wrote public/year-card-gap-holds.svg");
  rows.forEach((r) => console.log(`  ${r.y}: world ${r.world} ${MAJORS[r.world]} | mine ${r.mine} ${MAJORS[r.mine]} | gap ${r.gap}`));
}
