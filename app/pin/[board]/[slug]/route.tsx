// Public (no auth) image endpoint for Pinterest's bulk-upload CSV — its "Media URL" /
// "Image URL" column needs a real, fetchable URL, and the studio's own preview/batch
// routes are owner-gated (Pinterest's bulk uploader can't authenticate to fetch them).
// This is safe to expose unauthenticated because every board built so far renders
// already-public information (birthdays, card meanings) that's freely visible elsewhere
// on the site (e.g. /birthday/[slug], /tarot/[slug]) — there's nothing gated to leak.
//
// One dispatcher route for all boards rather than one route per board, since the shape
// (look up content by board+slug, render, return PNG) is identical each time — adding a
// new board here is one more `case`, not a whole new route file. Extend this switch when
// adding each of the remaining ~13 boards.
import { ImageResponse } from "next/og";
import { getCardBySlug } from "@/lib/cards";
import { parseBirthdaySlug } from "@/lib/birthday";
import { assembleBirthdayBearingDay } from "@/lib/birthdayCampaignContent";
import { renderPinterestBirthday, WIDTH as BIRTHDAY_W, HEIGHT as BIRTHDAY_H } from "@/lib/pinterestBirthdayRender";
import { renderMajorGift, WIDTH as GIFT_W, HEIGHT as GIFT_H } from "@/lib/majorGiftRender";
import { renderMajorShadow, WIDTH as SHADOW_W, HEIGHT as SHADOW_H } from "@/lib/majorShadowRender";
import { renderMajorReclaimed, WIDTH as RECLAIMED_W, HEIGHT as RECLAIMED_H } from "@/lib/majorReclaimedRender";
import { loadShareFonts } from "@/lib/ogFonts";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ board: string; slug: string }> }) {
  const { board, slug } = await params;

  if (board === "birthday-tarot-card") {
    const md = parseBirthdaySlug(slug);
    if (!md) return new Response("Not found", { status: 404 });
    const day = assembleBirthdayBearingDay({ y: 2000, m: md.m, d: md.d });
    const text = [
      `If your birthday is ${day.dateLabel}`,
      "Your Tarot Bearing Card is",
      day.bearingName,
      day.opening,
      `Everyone born on ${day.dateLabel} shares this Tarot Bearing.`,
      "The Tarot Almanac",
      "tarotalmanac.com/birthday",
    ].join(" ");
    const fonts = await loadShareFonts(text);
    return new ImageResponse(renderPinterestBirthday(day), { width: BIRTHDAY_W, height: BIRTHDAY_H, fonts });
  }

  if (board === "major-gift") {
    const card = getCardBySlug(slug);
    if (!card || card.arcana !== "major") return new Response("Not found", { status: 404 });
    const text = [
      "Tarot Card Meaning Upright",
      card.name,
      card.gift.keywords.join(" "),
      "tarotalmanac.com/tarot",
      "The Tarot Almanac",
    ].join(" ");
    const fonts = await loadShareFonts(text);
    return new ImageResponse(renderMajorGift(card), { width: GIFT_W, height: GIFT_H, fonts });
  }

  if (board === "major-shadow") {
    const card = getCardBySlug(slug);
    if (!card || card.arcana !== "major") return new Response("Not found", { status: 404 });
    const text = [
      "Tarot Card Meaning Shadow",
      card.name,
      card.shadow.keywords.join(" "),
      "tarotalmanac.com/tarot",
      "The Tarot Almanac",
    ].join(" ");
    const fonts = await loadShareFonts(text);
    return new ImageResponse(renderMajorShadow(card), { width: SHADOW_W, height: SHADOW_H, fonts });
  }

  if (board === "major-reclaimed") {
    const card = getCardBySlug(slug);
    if (!card || card.arcana !== "major") return new Response("Not found", { status: 404 });
    const text = [
      "Tarot Card Meaning Reclaimed Reversal",
      card.name,
      card.reclaiming.keywords.join(" "),
      "tarotalmanac.com/tarot",
      "The Tarot Almanac",
    ].join(" ");
    const fonts = await loadShareFonts(text);
    return new ImageResponse(renderMajorReclaimed(card), { width: RECLAIMED_W, height: RECLAIMED_H, fonts });
  }

  return new Response("Not found", { status: 404 });
}
