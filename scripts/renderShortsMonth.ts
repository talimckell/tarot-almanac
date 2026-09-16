// Month-batch renderer for the daily collective-card Shorts (see /remotion). Bundles
// the composition once, then renders one MP4 per day plus a captions.txt into
// ~/Downloads/collective-shorts-YYYY-MM/ (matching how the Pinterest/blog studio tools
// deliver batches). Upload stays manual via YouTube Studio's scheduler; the same 9:16
// files work for Reels/TikTok/Pinterest video pins.
//
//   npm run short:month -- 2026-08              -> the whole month
//   npm run short:month -- 2026-08 --from=5 --to=9   -> a day range (testing)
import { mkdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { buildShortProps } from "../lib/shortProps";
import { captionForTreatment } from "../lib/campaignCaption";
import { TREATMENT_NAMES } from "../lib/campaignTreatments";

const ymArg = process.argv.find((a) => /^\d{4}-\d{2}$/.test(a));
if (!ymArg) {
  console.error("usage: npm run short:month -- YYYY-MM [--from=D] [--to=D]");
  process.exit(1);
}
const [y, m] = ymArg.split("-").map(Number);
const daysInMonth = new Date(y, m, 0).getDate();
const flag = (name: string) => {
  const raw = process.argv.find((a) => a.startsWith(`--${name}=`));
  return raw ? Number(raw.split("=")[1]) : undefined;
};
const from = flag("from") ?? 1;
const to = flag("to") ?? daysInMonth;

const outDir = join(homedir(), "Downloads", `collective-shorts-${ymArg}`);
mkdirSync(outDir, { recursive: true });

async function main() {
  console.log(`bundling composition…`);
  const serveUrl = await bundle({
    entryPoint: join(process.cwd(), "remotion", "index.ts"),
    publicDir: join(process.cwd(), "remotion", "public"),
  });

  const captions: string[] = [];
  for (let d = from; d <= to; d++) {
    const key = `${ymArg}-${String(d).padStart(2, "0")}`;
    const { props, day } = buildShortProps(y, m, d);
    const started = Date.now();
    const composition = await selectComposition({ serveUrl, id: "DailyCard", inputProps: props });
    const outputLocation = join(outDir, `${key}.mp4`);
    await renderMedia({ composition, serveUrl, codec: "h264", inputProps: props, outputLocation });
    const secs = ((Date.now() - started) / 1000).toFixed(0);
    console.log(`${key}.mp4 — ${props.minorName} (${props.element}), ${TREATMENT_NAMES[props.treatment]} treatment, ${composition.durationInFrames} frames, ${secs}s`);

    captions.push(
      [
        `${key}.mp4 — ${props.minorName} · ${TREATMENT_NAMES[props.treatment]} treatment`,
        `Title: ${props.minorName} — Today's Collective Card, ${props.dateLabel}`,
        `Caption:`,
        captionForTreatment(day, props.treatment),
      ].join("\n"),
    );
  }

  writeFileSync(join(outDir, "captions.txt"), captions.join("\n\n---\n\n") + "\n");
  console.log(`\n${to - from + 1} videos + captions.txt in ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
