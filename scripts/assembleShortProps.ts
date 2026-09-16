// One-off props assembly for the DailyCard Remotion composition (the month batch is
// scripts/renderShortsMonth.ts; both share lib/shortProps.ts). Run with:
//   npm run short:props                         -> today
//   npm run short:props -- 2026-08-01           -> a specific date
//   npm run short:props -- 2026-08-01 --sample  -> also refresh remotion/sample-props.json
// Then render:
//   npm run short:render -- --props=remotion/props/<date>.json out/<date>.mp4
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildShortProps } from "../lib/shortProps";

const dateArg = process.argv.find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a));
const now = new Date();
const [y, m, d] = dateArg ? dateArg.split("-").map(Number) : [now.getFullYear(), now.getMonth() + 1, now.getDate()];

const { props } = buildShortProps(y, m, d);

const key = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
const outDir = join(process.cwd(), "remotion", "props");
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, `${key}.json`);
writeFileSync(outPath, JSON.stringify(props, null, 2));
console.log(`wrote ${outPath} — ${props.minorName} (${props.element}), treatment ${props.treatment}`);

if (process.argv.includes("--sample")) {
  const samplePath = join(process.cwd(), "remotion", "sample-props.json");
  writeFileSync(samplePath, JSON.stringify(props, null, 2));
  console.log(`refreshed ${samplePath}`);
}
