// Node-side props assembly for the BearingProof Remotion composition (Scene 4 of the
// tarot-birth-chart pillar video). Runs the real engine (lib/almanac) so the animated
// table can never drift from the math, and parses each Major glyph out of the sprite
// (lib/shareGlyph) the same way lib/shortProps.ts does for the daily Shorts. The
// composition itself gets plain JSON — no filesystem, no engine calls in the browser.
import { collectiveYear, personalYear, bearingIndex, mod22, MAJORS } from "./almanac";
import { majorGlyphId } from "./pips";
import { getGlyph } from "./shareGlyph";
import type { BearingProofProps, ProofRow } from "../remotion/proofTypes";
import type { ShortGlyph } from "../remotion/types";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function majorGlyph(major: number): ShortGlyph {
  const glyph = getGlyph(majorGlyphId(major));
  if (!glyph) throw new Error(`No sprite glyph found for Major ${major}`);
  return glyph;
}

// bm/bd = birth month/day. `years` is the set of years the table walks through — the
// script uses 1984 (birth year), then 2024, 2025, 2026, 2030 to show the gap holding as
// both cards move. The Bearing gap = mod22(personal - collective) = bm + bd, wrapped, so
// it's identical on every row by construction; we still compute it per row so the number
// on screen comes from the engine, not a constant typed in here.
export function buildBearingProof(bm: number, bd: number, years: number[]): BearingProofProps {
  const bIdx = bearingIndex(bm, bd);

  const rows: ProofRow[] = years.map((y) => {
    const cy = collectiveYear(y);
    const py = personalYear(y, bm, bd);
    return {
      year: y,
      you: { name: MAJORS[py], glyph: majorGlyph(py) },
      world: { name: MAJORS[cy], glyph: majorGlyph(cy) },
      gap: mod22(py - cy),
    };
  });

  return {
    dateLabel: `${MONTHS[bm - 1]} ${bd}`,
    bearingName: MAJORS[bIdx],
    bearingIndex: bIdx,
    napkin: `${bm} + ${bd} = ${bm + bd}`,
    rows,
  };
}
