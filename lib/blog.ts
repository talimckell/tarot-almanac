import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { renderMarkdown } from "./markdown";

export interface BlogPostMeta {
  slug: string;
  title: string;
  eyebrow: string;
  /** Optional keyword-tuned <title> tag; falls back to `title`. Lets the meta
   * title carry search terms without changing the on-page H1. */
  seoTitle?: string;
  /** Used as both the meta description and the post-page standfirst. */
  description: string;
  /** Optional keyword-tuned meta description; falls back to `description`. Lets
   * the SERP snippet carry search terms without changing the visible standfirst. */
  metaDescription?: string;
  /** Shorter blurb shown on the /blog index; distinct authored copy where it exists. */
  indexTeaser: string;
  /** Major Arcana index — drives the glyph and its element color. */
  majorIndex: number;
  file: string;
  /** Resolves this post's "#" placeholder links, keyed by exact link text. */
  linkMap: Record<string, string>;
}

// Only posts with authored content in /content are listed here, in the same
// order as the index mockup.
export const BLOG_POSTS: BlogPostMeta[] = [
  {
    slug: "what-is-tarot-numerology",
    title: "What Is Tarot Numerology?",
    // Keyword-tuned meta tags (title/description below stay as the visible H1/standfirst).
    seoTitle: "What Is Tarot Numerology, and Why Your Birth Card Differs",
    metaDescription:
      "Tarot numerology turns your birthday into a tarot card with arithmetic, not a shuffle. How the method works, and why your birth card can differ from other calculators.",
    eyebrow: "Tarot Numerology",
    // No distinct standfirst/meta-description authored separately — reusing the
    // index teaser rather than writing new copy.
    description:
      "The idea underneath the whole Almanac: a date becomes a card through arithmetic, not a shuffle. Start here.",
    indexTeaser:
      "The idea underneath the whole Almanac: a date becomes a card through arithmetic, not a shuffle. Start here.",
    majorIndex: 10, // Wheel of Fortune
    file: "blog-01-what-is-tarot-numerology.md",
    linkMap: {
      "Calculate your reading in The Tarot Almanac →": "/today",
    },
  },
  {
    slug: "how-tarot-numerology-works",
    // The index mockup shortens this to "How Tarot Numerology Works" in the entry
    // list; using the full authored title (matching the post's own H1) everywhere
    // for consistency rather than reproducing that one-off truncation.
    title: "How Tarot Numerology Works: The Complete Formula",
    seoTitle: "How Tarot Numerology Works: Year, Month & Day Card Formula",
    metaDescription:
      "How to calculate your tarot year card, month card, and day card by hand. The full tarot numerology formula, from the wheel of twenty-two to the day's minor, with worked examples.",
    eyebrow: "Tarot Numerology",
    description:
      "The full method, shown plainly. The wheel of twenty-two, the mod-22 math, and how any date resolves to a card you can check yourself.",
    indexTeaser:
      "The full method, shown plainly. The wheel of twenty-two, the mod-22 math, and how any date resolves to a card you can check yourself.",
    majorIndex: 2, // The High Priestess
    file: "blog-02-how-tarot-numerology-works.md",
    linkMap: {
      "What Is Tarot Numerology?": "/blog/what-is-tarot-numerology",
      "Open The Tarot Almanac →": "/today",
    },
  },
  {
    slug: "the-shadow-and-the-reclaiming",
    // Same truncation-vs-full-title situation as above.
    title: "The Shadow and the Reclaiming: Why a Reversed Card Has Two Meanings",
    seoTitle: "Reversed Tarot Card Meanings: The Shadow and the Reclaiming",
    metaDescription:
      "What a reversed tarot card actually means. Every card has three faces: the gift, the shadow (a strength gone wrong), and the reclaiming (a story you can refuse).",
    eyebrow: "Tarot Numerology",
    description:
      "Why every card has three faces, not two. What a reversed card actually means, and the difference between a gift distorted and a story refused.",
    indexTeaser:
      "Why every card has three faces, not two. What a reversed card actually means, and the difference between a gift distorted and a story refused.",
    majorIndex: 18, // The Moon
    file: "blog-03-the-shadow-and-the-reclaiming.md",
    linkMap: {
      "the full deck": "/tarot",
      "how the Almanac turns a date into a card": "/blog/what-is-tarot-numerology",
    },
  },
  {
    slug: "what-is-a-tarot-bearing",
    title: "What Is a Tarot Bearing?",
    seoTitle: "What Is a Tarot Bearing? Your Lifelong Tarot Birth Card",
    metaDescription:
      "Your tarot Bearing is the birth card you carry your whole life, set by your birthday: the fixed distance between you and the world. What it is, and how to find yours.",
    eyebrow: "Tarot Numerology",
    description:
      "Your Bearing is the one tarot card you carry your whole life, the fixed distance between you and the world. Here is what it is and how to find yours.",
    indexTeaser:
      "Your Bearing is the one card you carry your whole life, the fixed distance between you and the world. What it is, and how to find yours.",
    majorIndex: 17, // The Star
    file: "blog-04-what-is-a-tarot-bearing.md",
    linkMap: {
      "Find your Bearing →": "/bearing",
    },
  },
  {
    slug: "the-tarot-natal-chart",
    title: "Your Tarot Natal Chart",
    // Keyword-tuned meta tags: catch "tarot birth chart" (the commoner phrasing)
    // alongside "natal chart," without touching the visible H1/standfirst.
    seoTitle: "Your Tarot Natal Chart (a Tarot Birth Chart)",
    metaDescription:
      "Your tarot natal chart, or tarot birth chart, is seven cards read from your birthday: the self you arrived as, the world that met you, and the Bearing that ties them together.",
    eyebrow: "Tarot Numerology",
    // No distinct standfirst/meta-description was authored separately for this post
    // (unlike the Bearing post) — reusing the index teaser rather than writing new copy.
    description:
      "The whole picture: seven cards built from your birthday, the self you came in as and the world that caught you, and the Bearing that ties them together.",
    indexTeaser:
      "The whole picture: seven cards built from your birthday, the self you came in as and the world that caught you, and the Bearing that ties them together.",
    majorIndex: 21, // The World
    file: "blog-05-the-tarot-natal-chart.md",
    linkMap: {
      "here": "/blog/what-is-a-tarot-bearing",
      "its own piece": "/blog/what-is-a-tarot-bearing",
      "Build your natal chart in the Tarot Almanac →": "/tarot-birth-chart",
    },
  },
  // ─── DRAFT, NOT PUBLISHED ─────────────────────────────────────────────────
  // Scaffold for content/blog-06-2027-tarot-year-card.md. Nothing renders, links,
  // or indexes while this stays commented out. Write the prose (and the standfirst
  // marked below), then uncomment to publish. Aim to go live by mid-October 2026.
  // {
  //   slug: "2027-tarot-year-card",
  //   title: "Your 2027 Tarot Year Card",
  //   seoTitle: "Your 2027 Tarot Year Card: The Year of Justice",
  //   metaDescription:
  //     "The tarot card for 2027 is Justice. What a Justice year asks of everyone, the card for each month, and how to find your own personal 2027 card from your birthday.",
  //   eyebrow: "Tarot Numerology",
  //   // STANDFIRST — write in voice before publishing (doubles as the meta fallback):
  //   description: "[standfirst: the card everyone shares in 2027 is Justice — write in voice]",
  //   indexTeaser: "[index blurb: shorter than the standfirst — write in voice]",
  //   majorIndex: 11, // Justice — drives the glyph + element color
  //   file: "blog-06-2027-tarot-year-card.md",
  //   linkMap: {
  //     "How Tarot Numerology Works": "/blog/how-tarot-numerology-works",
  //     "What Is Tarot Numerology?": "/blog/what-is-tarot-numerology",
  //     "Open The Tarot Almanac →": "/today",
  //   },
  // },
  // ─── DRAFT, NOT PUBLISHED ─────────────────────────────────────────────────
  // Scaffold for content/blog-07-major-arcana-three-stages.md. Dormant until
  // uncommented. Also the link target for "Initiation / Testing / Reckoning"
  // used on the month page and natal chart — wire those as links once it's live.
  // {
  //   slug: "major-arcana-three-stages",
  //   title: "The Major Arcana in Three Stages",
  //   seoTitle: "The Three Stages of the Major Arcana: Initiation, Testing, Reckoning",
  //   metaDescription:
  //     "The 22 Major Arcana move through three stages of the Fool's Journey: Initiation (0-7), Testing (8-14), and Reckoning (15-21). What each stage means and why it colors a reading.",
  //   eyebrow: "Tarot Numerology",
  //   description: "[standfirst: the Fool's Journey in three movements — write in voice]",
  //   indexTeaser: "[index blurb — write in voice]",
  //   majorIndex: 0, // The Fool — the journey's starting point
  //   file: "blog-07-major-arcana-three-stages.md",
  //   linkMap: {
  //     "How Tarot Numerology Works": "/blog/how-tarot-numerology-works",
  //     "the deck": "/tarot",
  //     "Open The Tarot Almanac →": "/today",
  //   },
  // },
];

export function getPostMeta(slug: string): BlogPostMeta | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export async function getPostHtml(meta: BlogPostMeta): Promise<string> {
  const source = await readFile(join(process.cwd(), "content", meta.file), "utf-8");
  // Strip the leading "# Title" — it's rendered separately in the post header.
  const body = source.replace(/^#\s+.*\n+/, "");
  return renderMarkdown(body, meta.linkMap);
}
