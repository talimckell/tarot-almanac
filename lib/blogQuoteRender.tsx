// Big-quote treatment shared by blog-post social images — one line of authored prose as
// the hero, sized well past what looks right in an isolated preview (per the standing
// Pinterest/Bluesky in-feed legibility lesson: bump sizes so text reads at thumbnail
// scale in a scrolling feed, not just at full-size). Two canvases: a 1200x630 landscape
// for Bluesky (lib/shareRender's frame) and a 1000x1500 vertical for Pinterest
// (lib/pinterestRender's frame) — same typographic idea, different aspect ratio.
import type { BlogQuote } from "./blogSocialContent";
import { majorGlyphId } from "./pips";

// Both renders only ever need the eyebrow/quote text — BlogQuote (Bluesky, has a
// `caption`) and BlogPinterestQuote (Pinterest, has pin-copy fields instead) both satisfy
// this narrower shape structurally, so either can be passed in without a cast.
type QuoteText = Pick<BlogQuote, "eyebrow" | "quote">;
import { WIDTH as BLUESKY_W, HEIGHT as BLUESKY_H, COLORS, elementColor, Glyph, ShareCanvas } from "./shareRender";
import { WIDTH as PIN_W, HEIGHT as PIN_H, PinterestCanvas } from "./pinterestRender";
import type { Element } from "./almanac";

// Longer quotes get a smaller size so they still fit without overflowing; short ones get
// pushed big to actually fill the frame instead of floating in white space. Sized to fill
// most of each canvas's content region, not just "look proportionate" in isolation.
function blueskyQuoteSize(quote: string): number {
  if (quote.length <= 45) return 88;
  if (quote.length <= 70) return 68;
  return 52;
}

function pinterestQuoteSize(quote: string): number {
  if (quote.length <= 45) return 130;
  if (quote.length <= 70) return 102;
  return 78;
}

const CTA = "tarotalmanac.com/blog";

export function renderBlogQuoteBluesky(quote: QuoteText, majorIndex: number, element: Element) {
  const color = elementColor(element);
  const size = blueskyQuoteSize(quote.quote);
  return (
    <ShareCanvas cta={CTA}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          gap: 34,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: "Lato",
            fontSize: 24,
            letterSpacing: 2.5,
            textTransform: "uppercase",
            color: COLORS.label,
          }}
        >
          {quote.eyebrow}
        </span>
        <Glyph id={majorGlyphId(majorIndex)} size={68} color={color} />
        <span
          style={{
            fontFamily: "Cormorant",
            fontSize: size,
            lineHeight: 1.15,
            color: COLORS.ink,
            textAlign: "center",
            maxWidth: 1060,
          }}
        >
          {quote.quote}
        </span>
      </div>
    </ShareCanvas>
  );
}

export function renderBlogQuotePinterest(quote: QuoteText, majorIndex: number, element: Element) {
  const color = elementColor(element);
  const size = pinterestQuoteSize(quote.quote);
  return (
    <PinterestCanvas cta={CTA}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          gap: 72,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: "Lato",
            fontSize: 30,
            letterSpacing: 2.5,
            textTransform: "uppercase",
            color: COLORS.label,
          }}
        >
          {quote.eyebrow}
        </span>
        <Glyph id={majorGlyphId(majorIndex)} size={200} color={color} />
        <span
          style={{
            fontFamily: "Cormorant",
            fontSize: size,
            lineHeight: 1.16,
            color: COLORS.ink,
            textAlign: "center",
            maxWidth: 920,
          }}
        >
          {quote.quote}
        </span>
      </div>
    </PinterestCanvas>
  );
}

export { BLUESKY_W, BLUESKY_H, PIN_W, PIN_H };
