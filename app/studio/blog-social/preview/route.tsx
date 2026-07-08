// Single-image preview for blog-post social images — owner-only. One flexible route
// (kind + index query params) rather than one route per image, since this content type
// is a small fixed set per post, not a rotating pool.
import { ImageResponse } from "next/og";
import { getBlogSocialContent } from "@/lib/blogSocialContent";
import { ELEMENT_BY_MAJOR, MAJORS } from "@/lib/almanac";
import { requireStudioOwner } from "@/lib/studioAuth";
import {
  renderBlogQuoteBluesky,
  renderBlogQuotePinterest,
  BLUESKY_W,
  BLUESKY_H,
  PIN_W,
  PIN_H,
} from "@/lib/blogQuoteRender";
import { renderBlogWheelDiagram, WIDTH as WHEEL_W, HEIGHT as WHEEL_H } from "@/lib/blogWheelRender";
import { renderBlogMathDiagram, WIDTH as MATH_W, HEIGHT as MATH_H } from "@/lib/blogMathRender";
import { renderBlogShapeTexture, WIDTH as SHAPE_W, HEIGHT as SHAPE_H } from "@/lib/blogShapeTextureRender";
import { renderBlogRankComparison, WIDTH as RANK_W, HEIGHT as RANK_H } from "@/lib/blogRankComparisonRender";
import { renderBlogThreeFaces, WIDTH as FACES_W, HEIGHT as FACES_H } from "@/lib/blogThreeFacesRender";
import { renderBlogGapHolds, WIDTH as GAP_W, HEIGHT as GAP_H } from "@/lib/blogGapHoldsRender";
import { renderBlogNatalChart, WIDTH as NATAL_W, HEIGHT as NATAL_H } from "@/lib/blogNatalChartRender";
import { computeNatalChart, bearingStepsWord } from "@/lib/natalChart";
import { collectiveDayCard, collectiveYear, personalYear } from "@/lib/almanac";
import { getCardBySlug } from "@/lib/cards";
import { loadShareFonts } from "@/lib/ogFonts";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const owner = await requireStudioOwner();
  if (!owner) return new Response("Not found", { status: 404 });

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") ?? "";
  const kind = searchParams.get("kind") ?? "";
  const index = Number(searchParams.get("index") ?? "0");

  const content = getBlogSocialContent(slug);
  if (!content) return new Response("Not found", { status: 404 });
  const element = ELEMENT_BY_MAJOR[content.majorIndex];

  if (kind === "bluesky-quote") {
    const quote = content.blueskyQuotes[index];
    if (!quote) return new Response("Not found", { status: 404 });
    const fonts = await loadShareFonts(`${quote.eyebrow} ${quote.quote} The Tarot Almanac tarotalmanac.com/blog`);
    return new ImageResponse(renderBlogQuoteBluesky(quote, content.majorIndex, element), {
      width: BLUESKY_W,
      height: BLUESKY_H,
      fonts,
    });
  }

  if (kind === "pinterest-quote") {
    const quote = content.pinterestQuotes[index];
    if (!quote) return new Response("Not found", { status: 404 });
    const fonts = await loadShareFonts(`${quote.eyebrow} ${quote.quote} The Tarot Almanac tarotalmanac.com/blog`);
    return new ImageResponse(renderBlogQuotePinterest(quote, content.majorIndex, element), {
      width: PIN_W,
      height: PIN_H,
      fonts,
    });
  }

  if (kind === "wheel" && content.wheel) {
    const fonts = await loadShareFonts(
      `${content.wheel.eyebrow} ${content.wheel.title} ${content.wheel.subtitle} The Tarot Almanac tarotalmanac.com/blog`,
    );
    return new ImageResponse(renderBlogWheelDiagram(content.wheel, content.majorIndex), {
      width: WHEEL_W,
      height: WHEEL_H,
      fonts,
    });
  }

  if (kind === "math" && content.math) {
    const resultName = MAJORS[content.math.resultMajorIndex];
    const fonts = await loadShareFonts(
      `${content.math.eyebrow} ${content.math.dateLabel} ${content.math.steps.join(" ")} ${resultName} The Tarot Almanac tarotalmanac.com/blog`,
    );
    return new ImageResponse(renderBlogMathDiagram(content.math), { width: MATH_W, height: MATH_H, fonts });
  }

  if (kind === "shape-texture" && content.shapeTexture) {
    const card = collectiveDayCard(content.shapeTexture.y, content.shapeTexture.m, content.shapeTexture.d);
    const fonts = await loadShareFonts(
      `${content.shapeTexture.eyebrow} ${content.shapeTexture.dateLabel} The Shape The Texture ${card.majorName} ${card.minorName} The Tarot Almanac tarotalmanac.com/blog`,
    );
    return new ImageResponse(renderBlogShapeTexture(content.shapeTexture), { width: SHAPE_W, height: SHAPE_H, fonts });
  }

  if (kind === "rank-comparison" && content.rankComparison) {
    const cards = content.rankComparison.columns.map((c) => collectiveDayCard(c.y, c.m, c.d));
    const text = content.rankComparison.columns
      .map((c, i) => `${c.dateLabel} ${cards[i].majorName} ${cards[i].minorName}`)
      .join(" ");
    const fonts = await loadShareFonts(
      `${content.rankComparison.eyebrow} ${content.rankComparison.title} ${text} The Tarot Almanac tarotalmanac.com/blog`,
    );
    return new ImageResponse(renderBlogRankComparison(content.rankComparison), { width: RANK_W, height: RANK_H, fonts });
  }

  if (kind === "three-faces" && content.threeFaces) {
    const card = getCardBySlug(content.threeFaces.cardSlug);
    if (!card) return new Response("Not found", { status: 404 });
    const text = [
      content.threeFaces.eyebrow,
      card.name,
      "Gift",
      card.gift.keywords[0],
      "Shadow",
      card.shadow.keywords[0],
      "Reclaiming",
      card.reclaiming.keywords[0],
      content.threeFaces.caption,
      "The Tarot Almanac tarotalmanac.com/blog",
    ].join(" ");
    const fonts = await loadShareFonts(text);
    return new ImageResponse(renderBlogThreeFaces(content.threeFaces, card), { width: FACES_W, height: FACES_H, fonts });
  }

  if (kind === "gap-holds" && content.gapHolds) {
    const g = content.gapHolds;
    const rowText = g.years
      .map((y) => `${y} ${MAJORS[collectiveYear(y)]} ${MAJORS[personalYear(y, g.bm, g.bd)]}`)
      .join(" ");
    const fonts = await loadShareFonts(
      `${g.eyebrow} ${g.title} Year The world's card Gap Your card ${rowText} ${g.caption} The Tarot Almanac tarotalmanac.com/blog 0123456789`,
    );
    return new ImageResponse(renderBlogGapHolds(g), { width: GAP_W, height: GAP_H, fonts });
  }

  if (kind === "natal-chart" && content.natalChart) {
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
    return new ImageResponse(renderBlogNatalChart(n), { width: NATAL_W, height: NATAL_H, fonts });
  }

  return new Response("Not found", { status: 404 });
}
