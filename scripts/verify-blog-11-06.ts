// Throwaway verification for blog-11 (personal year number) and blog-06 (2027 year card).
// Run: npx tsx scripts/verify-blog-11-06.ts
import {
  MAJORS,
  mod22,
  sumDigits,
  collectiveYear,
  collectiveMonth,
  personalYear,
  bearingIndex,
  phaseBand,
} from "../lib/almanac";

const name = (i: number) => `${MAJORS[i]} (${i})`;

// ── numerology comparison helpers ────────────────────────────────────────────
const reduce1to9 = (n: number): number => {
  while (n > 9) n = String(n).split("").reduce((a, c) => a + Number(c), 0);
  return n;
};
// Standard personal year: reduce birth month, birth day, and the calendar year,
// then reduce the sum. No master numbers held at the personal-year level.
const numerologyPersonalYear = (y: number, bm: number, bd: number) =>
  reduce1to9(reduce1to9(bm) + reduce1to9(bd) + reduce1to9(y));

console.log("=== sumDigits / collective year ===");
for (const y of [2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031]) {
  console.log(y, "sumDigits", sumDigits(y), "collective year card", name(collectiveYear(y)));
}

console.log("\n=== 2027 collective months (scaffold table check) ===");
for (let m = 1; m <= 12; m++) console.log(m, name(collectiveMonth(2027, m)));

console.log("\n=== March 15 walked across years (blog-10's example birthday) ===");
const [BM, BD] = [3, 15];
console.log("Bearing", name(bearingIndex(BM, BD)));
for (let y = 2024; y <= 2032; y++) {
  const py = personalYear(y, BM, BD);
  console.log(
    y,
    "almanac:", name(py).padEnd(24),
    "numerology:", numerologyPersonalYear(y, BM, BD),
    "→ major", name(numerologyPersonalYear(y, BM, BD)),
    "| band", phaseBand(py),
    "| PY - bearing =", mod22(py - bearingIndex(BM, BD))
  );
}

console.log("\n=== nine-year repeat check (numerology) for March 15 ===");
const seq: number[] = [];
for (let y = 2026; y <= 2044; y++) seq.push(numerologyPersonalYear(y, BM, BD));
console.log(seq.join(" "));
console.log("2026 == 2035?", numerologyPersonalYear(2026, BM, BD) === numerologyPersonalYear(2035, BM, BD));

console.log("\n=== almanac personal year repeat check for March 15 (next 30 yrs) ===");
const first = personalYear(2026, BM, BD);
const repeats: number[] = [];
for (let y = 2027; y <= 2060; y++) if (personalYear(y, BM, BD) === first) repeats.push(y);
console.log("2026 card", name(first), "recurs in", repeats.join(", "));

console.log("\n=== does every birthday's PY sit sumDigits(Y) past its Bearing? ===");
let ok = true;
for (let bm = 1; bm <= 12; bm++)
  for (let bd = 1; bd <= 31; bd++)
    for (const y of [2026, 2027, 2030]) {
      if (personalYear(y, bm, bd) !== mod22(bearingIndex(bm, bd) + sumDigits(y))) ok = false;
      // and the gap to the collective year card is always the Bearing
      if (mod22(personalYear(y, bm, bd) - collectiveYear(y)) !== bearingIndex(bm, bd)) ok = false;
    }
console.log("PY = Bearing + sumDigits(Y), and PY - collective year = Bearing:", ok);

console.log("\n=== 2027: is every personal year card exactly opposite the Bearing? ===");
const dists = new Set<number>();
for (let bm = 1; bm <= 12; bm++)
  for (let bd = 1; bd <= 31; bd++) {
    const b = bearingIndex(bm, bd);
    const py = personalYear(2027, bm, bd);
    const raw = mod22(py - b);
    dists.add(Math.min(raw, 22 - raw));
  }
console.log("distinct distances between Bearing and 2027 personal year:", [...dists]);

console.log("\n=== 2027 spot checks: personal year for a few birthdays ===");
for (const [bm, bd] of [[3, 15], [4, 7], [1, 1], [12, 25], [7, 4], [6, 11]] as const) {
  console.log(
    `${bm}/${bd}`,
    "bearing", name(bearingIndex(bm, bd)).padEnd(24),
    "2026", name(personalYear(2026, bm, bd)).padEnd(24),
    "2027", name(personalYear(2027, bm, bd))
  );
}

console.log("\n=== how many distinct cards can a numerology personal year reach? ===");
const reach = new Set<number>();
for (let bm = 1; bm <= 12; bm++)
  for (let bd = 1; bd <= 31; bd++)
    for (let y = 2000; y <= 2100; y++) reach.add(numerologyPersonalYear(y, bm, bd));
console.log([...reach].sort((a, b) => a - b).join(", "), "→", reach.size, "cards");

console.log("\n=== April 7 example from the calculations doc (PY 2026 = World) ===");
console.log("April 7, 2026 →", name(personalYear(2026, 4, 7)));

console.log("\n=== ADDENDUM: reach + repeat, almanac vs numerology, March 15 ===");
const almReach = new Set<number>();
const numReach = new Set<number>();
for (let y = 2000; y <= 2099; y++) {
  almReach.add(personalYear(y, BM, BD));
  numReach.add(numerologyPersonalYear(y, BM, BD));
}
console.log("almanac distinct cards 2000-2099:", almReach.size, "→", [...almReach].sort((a,b)=>a-b).join(","));
console.log("numerology distinct 2000-2099:", numReach.size);
console.log("\nalmanac sequence 2020-2041 (March 15):");
for (let y = 2020; y <= 2041; y++) process.stdout.write(`${y}:${MAJORS[personalYear(y, BM, BD)]}  `);
console.log("\n\nlifetime reach for a person born 1990, ages 0-90 (March 15 1990):");
const life = new Set<number>();
for (let y = 1990; y <= 2080; y++) life.add(personalYear(y, BM, BD));
console.log(life.size, "of 22 distinct year cards");
const lifeNum = new Set<number>();
for (let y = 1990; y <= 2080; y++) lifeNum.add(numerologyPersonalYear(y, BM, BD));
console.log(lifeNum.size, "of 22 for numerology");
console.log("\ndecade-turn check 2029→2030 for several birthdays:");
for (const [bm, bd] of [[3,15],[4,7],[12,25]] as const)
  console.log(`${bm}/${bd}`, MAJORS[personalYear(2029, bm, bd)], "→", MAJORS[personalYear(2030, bm, bd)]);
