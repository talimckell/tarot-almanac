// Props assembly for the BearingProof composition (Scene 4 of the tarot-birth-chart
// pillar video). Writes a checked-in sample so `npm run short:studio` previews the scene
// with no assembly step, mirroring scripts/assembleShortProps.ts. Run with:
//   npm run proof:props                 -> Feb 16, the script's year set
//   npm run proof:props -- 2 16 1984 2024 2025 2026 2030
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildBearingProof } from "../lib/bearingProofProps";
import type { ProofSync } from "../remotion/proofTypes";

// VO sync cues for the Feb-16 scratch take (remotion/public/scene4-vo.m4a), read off the
// whisper word-timestamp transcript: the second each row is spoken, when "look down the
// last column" lands, and when the napkin arithmetic resolves. Re-record → re-transcribe →
// swap these numbers; nothing else changes. Only valid for the default 5-year set.
const SCENE4_SYNC: ProofSync = {
  audio: "scene4-vo.m4a",
  rowStarts: [10.6, 18.0, 27.9, 31.4, 35.6],
  glowStart: 40.0,
  napkinStart: 66.0,
  total: 86.0,
};

const sync = process.argv.includes("--sync");
const nums = process.argv.slice(2).filter((a) => /^\d+$/.test(a)).map(Number);
const [bm, bd, ...years] = nums.length >= 3 ? nums : [2, 16, 1984, 2024, 2025, 2026, 2030];

const props = buildBearingProof(bm, bd, years);
if (sync) {
  if (SCENE4_SYNC.rowStarts.length !== props.rows.length) {
    throw new Error(`sync has ${SCENE4_SYNC.rowStarts.length} row cues but chart has ${props.rows.length} rows`);
  }
  props.sync = SCENE4_SYNC;
}

const fileName = sync ? "bearing-proof-synced.json" : "bearing-proof-props.json";
const outPath = join(process.cwd(), "remotion", fileName);
writeFileSync(outPath, JSON.stringify(props, null, 2));

console.log(`wrote ${outPath}${sync ? " (VO-synced)" : ""}`);
console.log(`Bearing: ${props.bearingName} (${props.bearingIndex}) — ${props.napkin}`);
for (const r of props.rows) {
  console.log(`  ${r.year}: you ${r.you.name} · world ${r.world.name} · gap ${r.gap}`);
}
