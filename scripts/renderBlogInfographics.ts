// Exporter: render every blog-post Pinterest infographic to PNGs + a captions.txt in
// ~/Downloads/blog-pinterest-infographics, bypassing the owner-gated
// /studio/blog-social/preview route. The element + font wiring below mirrors that route
// exactly (kind for kind), so what ships here is what the route would serve. Posts can have
// more than one diagram; each present diagram field is rendered as its own pin.
//   Run: npx tsx scripts/renderBlogInfographics.ts
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { BLOG_SOCIAL } from "../lib/blogSocialContent";
import { MAJORS, ELEMENT_BY_MAJOR, collectiveDayCard, collectiveYear, personalYear } from "../lib/almanac";
import { getCardBySlug } from "../lib/cards";
import { computeNatalChart, bearingStepsWord } from "../lib/natalChart";
import { loadShareFonts } from "../lib/ogFonts";
import { renderBlogWheelDiagram } from "../lib/blogWheelRender";
import { renderBlogMathDiagram } from "../lib/blogMathRender";
import { renderBlogShapeTexture } from "../lib/blogShapeTextureRender";
import { renderBlogRankComparison } from "../lib/blogRankComparisonRender";
import { renderBlogThreeFaces } from "../lib/blogThreeFacesRender";
import { renderBlogGapHolds } from "../lib/blogGapHoldsRender";
import { renderBlogNatalChart } from "../lib/blogNatalChartRender";
import { renderBlogThreeStages } from "../lib/blogThreeStagesRender";

const OUT_DIR = join(homedir(), "Downloads", "blog-pinterest-infographics");
const SITE = "https://www.tarotalmanac.com/blog";
const PIN_W = 1000;
const PIN_H = 1500;

// Post order (matches the blog index), so the folder + captions read top to bottom.
const SLUG_ORDER = [
  "what-is-tarot-numerology",
  "how-tarot-numerology-works",
  "the-shadow-and-the-reclaiming",
  "what-is-a-tarot-bearing",
  "the-tarot-natal-chart",
  "major-arcana-three-stages",
  "tarot-birth-card",
  "life-path-number-tarot",
  "2027-tarot-year-card",
  "personal-year-number-tarot",
  "personal-month-number-tarot",
];

// Which diagram fields to look for, in a fixed render order per post.
const KINDS = [
  "wheel",
  "math",
  "shapeTexture",
  "rankComparison",
  "threeFaces",
  "gapHolds",
  "natalChart",
  "threeStages",
] as const;

type Built = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  element: any;
  fonts: Awaited<ReturnType<typeof loadShareFonts>>;
  pin: { pinTitle: string; description: string; keywords: string };
  kindLabel: string;
};

async function build(content: (typeof BLOG_SOCIAL)[string], kind: string): Promise<Built | null> {
  if (kind === "wheel" && content.wheel) {
    const w = content.wheel;
    const fonts = await loadShareFonts(`${w.eyebrow} ${w.title} ${w.subtitle} The Tarot Almanac tarotalmanac.com/blog`);
    return { element: renderBlogWheelDiagram(w, content.majorIndex), fonts, pin: w, kindLabel: "wheel" };
  }
  if (kind === "math" && content.math) {
    const m = content.math;
    const resultName = MAJORS[m.resultMajorIndex];
    const fonts = await loadShareFonts(
      `${m.eyebrow} ${m.dateLabel} ${m.steps.join(" ")} ${resultName} The Tarot Almanac tarotalmanac.com/blog`,
    );
    return { element: renderBlogMathDiagram(m), fonts, pin: m, kindLabel: "math" };
  }
  if (kind === "shapeTexture" && content.shapeTexture) {
    const s = content.shapeTexture;
    const card = collectiveDayCard(s.y, s.m, s.d);
    const fonts = await loadShareFonts(
      `${s.eyebrow} ${s.dateLabel} The Shape The Texture ${card.majorName} ${card.minorName} The Tarot Almanac tarotalmanac.com/blog`,
    );
    return { element: renderBlogShapeTexture(s), fonts, pin: s, kindLabel: "shape-texture" };
  }
  if (kind === "rankComparison" && content.rankComparison) {
    const rc = content.rankComparison;
    const cards = rc.columns.map((c) => collectiveDayCard(c.y, c.m, c.d));
    const text = rc.columns.map((c, i) => `${c.dateLabel} ${cards[i].majorName} ${cards[i].minorName}`).join(" ");
    const fonts = await loadShareFonts(`${rc.eyebrow} ${rc.title} ${text} The Tarot Almanac tarotalmanac.com/blog`);
    return { element: renderBlogRankComparison(rc), fonts, pin: rc, kindLabel: "rank-comparison" };
  }
  if (kind === "threeFaces" && content.threeFaces) {
    const tf = content.threeFaces;
    const card = getCardBySlug(tf.cardSlug);
    if (!card) throw new Error(`three-faces: no card ${tf.cardSlug}`);
    const text = [
      tf.eyebrow,
      card.name,
      "Gift",
      card.gift.keywords[0],
      "Shadow",
      card.shadow.keywords[0],
      "Reclaiming",
      card.reclaiming.keywords[0],
      tf.caption,
      "The Tarot Almanac tarotalmanac.com/blog",
    ].join(" ");
    const fonts = await loadShareFonts(text);
    return { element: renderBlogThreeFaces(tf, card), fonts, pin: tf, kindLabel: "three-faces" };
  }
  if (kind === "gapHolds" && content.gapHolds) {
    const g = content.gapHolds;
    const rowText = g.years.map((y) => `${y} ${MAJORS[collectiveYear(y)]} ${MAJORS[personalYear(y, g.bm, g.bd)]}`).join(" ");
    const fonts = await loadShareFonts(
      `${g.eyebrow} ${g.title} Year The world's card Gap Your card ${rowText} ${g.caption} The Tarot Almanac tarotalmanac.com/blog 0123456789`,
    );
    return { element: renderBlogGapHolds(g), fonts, pin: g, kindLabel: "gap-holds" };
  }
  if (kind === "natalChart" && content.natalChart) {
    const n = content.natalChart;
    const chart = computeNatalChart(n.by, n.bm, n.bd);
    const names = [
      chart.personalYear.name,
      chart.personalMonth.name,
      chart.collectiveYear.name,
      chart.collectiveMonth.name,
      chart.personalDayMinor.minorName,
      chart.collectiveDayMinor.minorName,
      chart.bearing.name,
    ].join(" ");
    const fonts = await loadShareFonts(
      `${n.eyebrow} ${n.title} Born January February March April May June July August September October November December You The World Year Month Day the core inner life the surface The Bearing ${bearingStepsWord(chart.bearing.major)} steps at every layer ${names} ${n.caption} The Tarot Almanac tarotalmanac.com/blog 0123456789,`,
    );
    return { element: renderBlogNatalChart(n), fonts, pin: n, kindLabel: "natal-chart" };
  }
  if (kind === "threeStages" && content.threeStages) {
    const st = content.threeStages;
    const fonts = await loadShareFonts(
      `${st.eyebrow} ${st.title} Initiation Testing Reckoning Cards The Tarot Almanac tarotalmanac.com/blog 0123456789–`,
    );
    return { element: renderBlogThreeStages(st), fonts, pin: st, kindLabel: "three-stages" };
  }
  return null;
}

async function main() {
  rmSync(OUT_DIR, { recursive: true, force: true });
  mkdirSync(OUT_DIR, { recursive: true });
  const captions: string[] = [];

  for (const slug of SLUG_ORDER) {
    const content = BLOG_SOCIAL[slug];
    if (!content) throw new Error(`no blog social content for ${slug}`);
    const present = KINDS.filter((k) => (content as Record<string, unknown>)[k]);

    for (const kind of present) {
      const built = await build(content, kind);
      if (!built) continue;
      const multi = present.length > 1;
      const fileName = multi ? `${slug}--${built.kindLabel}.png` : `${slug}-infographic.png`;
      const img = new ImageResponse(built.element, { width: PIN_W, height: PIN_H, fonts: built.fonts });
      const buf = Buffer.from(await img.arrayBuffer());
      writeFileSync(join(OUT_DIR, fileName), buf);
      console.log(`wrote ${fileName} (${(buf.length / 1024).toFixed(0)} KB)`);

      captions.push(
        [
          `POST: ${content.postTitle}`,
          `IMAGE: ${fileName}`,
          `PINTEREST TITLE: ${built.pin.pinTitle}`,
          `DESCRIPTION: ${built.pin.description}`,
          `KEYWORDS/TAGS: ${built.pin.keywords}`,
          `DESTINATION URL: ${SITE}/${slug}`,
        ].join("\n"),
      );
    }
  }

  const captionsPath = join(OUT_DIR, "captions.txt");
  writeFileSync(captionsPath, captions.join("\n\n----------------------------------------\n\n") + "\n");
  console.log(`\nwrote ${captions.length} pins + ${captionsPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
