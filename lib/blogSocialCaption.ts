// Caption composers for blog-post social images — Bluesky post text and Pinterest pin
// copy. Each Bluesky quote ships as its own standalone post (not a carousel), so its
// caption is authored to stand alone rather than referencing the other 3.
import { SITE_URL } from "./site";
import { truncateField, TITLE_MAX, DESCRIPTION_MAX, type PinterestPinCopy } from "./pinterestPinCopy";
import type { BlogQuote, BlogPinterestCopy, BlogSocialContent } from "./blogSocialContent";

const BLUESKY_MAX = 300;
const HASHTAG = "#tarotsky";

function truncate(text: string, budget: number): string {
  if (text.length <= budget) return text;
  return `${text.slice(0, Math.max(0, budget - 1)).trimEnd()}…`;
}

export function blogPostUrl(slug: string): string {
  return `${SITE_URL}/blog/${slug}`;
}

export function captionForBlogQuote(content: BlogSocialContent, quote: BlogQuote): string {
  const url = blogPostUrl(content.slug);
  const tail = `\n\n${url} ${HASHTAG}`;
  const room = BLUESKY_MAX - tail.length;
  const body = truncate(quote.caption, Math.max(room, 40));
  return `${body}${tail}`;
}

const PINTEREST_BOARD_NAME = "Tarot Numerology Explained"; // PLACEHOLDER — confirm this
// matches the exact board title in the owner's real Pinterest account (case-sensitive)
// before any bulk upload, same requirement as every card-meaning board.

export function pinterestCopyForBlogItem(
  content: BlogSocialContent,
  item: BlogPinterestCopy,
  altText: string,
): PinterestPinCopy {
  return {
    title: truncateField(item.pinTitle, TITLE_MAX),
    description: truncateField(item.description, DESCRIPTION_MAX),
    destinationUrl: blogPostUrl(content.slug),
    altText,
    boardName: PINTEREST_BOARD_NAME,
    keywords: item.keywords,
  };
}
