import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { renderMarkdown } from "./markdown";

/** The three journey sections the /blog index groups posts under, in order:
 * foundations → ideas → your-cards. See BLOG_SECTIONS for labels and intros. */
export type BlogSection = "foundations" | "ideas" | "your-cards";

export interface BlogSectionMeta {
  key: BlogSection;
  /** Section header shown on the index. */
  label: string;
  /** One-sentence intro under the header (authored by Tali). */
  intro: string;
}

/** Ordered. The index renders sections top-to-bottom in this order; posts sit
 * under their `section` in BLOG_POSTS array order. */
export const BLOG_SECTIONS: BlogSectionMeta[] = [
  {
    key: "foundations",
    label: "Start here",
    intro:
      "New here? Start with what tarot numerology is, and what you can learn about how your birthday influences your orientation to the world.",
  },
  {
    key: "ideas",
    label: "The ideas underneath",
    intro:
      "A card contains multitudes: a gift, a shadow, a reclaiming, a small piece of a larger narrative. Let’s dive in.",
  },
  {
    key: "your-cards",
    label: "Find your own cards",
    intro:
      "The day you were born, all of your cards were set. Discover what they are, and what that means for how you move through life. Remember, the cards may be set, but what you do with them isn’t.",
  },
];

export interface BlogPostMeta {
  slug: string;
  title: string;
  /** Which journey section this post sits under on the /blog index. */
  section: BlogSection;
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
    section: "foundations",
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
    section: "foundations",
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
    section: "ideas",
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
  // ─── DRAFT, NOT PUBLISHED ─────────────────────────────────────────────────
  // Scaffold for content/blog-06-2027-tarot-year-card.md. Nothing renders, links,
  // or indexes while this stays commented out. Write the prose (and the standfirst
  // marked below), then uncomment to publish. Aim to go live by mid-October 2026.
  // {
  //   slug: "2027-tarot-year-card",
  //   section: "your-cards",
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
  // Published 2026-07-08. Also the link target for "Initiation / Testing / Reckoning"
  // on the month page and natal chart — still to wire those references as links.
  {
    slug: "major-arcana-three-stages",
    section: "ideas",
    title: "The Major Arcana in Three Stages",
    seoTitle: "The Fool's Journey: The Major Arcana in Three Stages",
    metaDescription:
      "The 22 Major Arcana run in three stages of the Fool's Journey: Initiation (0-7), Testing (8-14), Reckoning (15-21). Why the stage your card sits in colors the reading.",
    eyebrow: "Tarot Numerology",
    description:
      "The twenty-two Major Arcana are one story, the Fool's Journey, told in three movements: Initiation, Testing, Reckoning. What each stage means, and why the one your card sits in changes how it reads.",
    indexTeaser:
      "The Fool's Journey moves in three stages: Initiation, Testing, Reckoning. What each means, and why your card's stage colors the reading.",
    majorIndex: 0, // The Fool — the journey's starting point
    file: "blog-07-major-arcana-three-stages.md",
    linkMap: {
      "How Tarot Numerology Works": "/blog/how-tarot-numerology-works",
      "the deck": "/tarot",
      "Open The Tarot Almanac →": "/today",
    },
  },
  // Published 2026-07-13. Numbers verified against the engine; two inline figures in
  // public/ (birthcard-vs-bearing, soul-card-ceiling).
  //
  // SEO SPLIT (2026-07-20): this post used to open its seoTitle on the bare head term
  // "tarot birth card", which put it in a two-horse race with /tarot-birth-card — GSC
  // showed both indexed and both stuck at pos 80-87 on the same query. The head term and
  // calculator intent belong to /tarot-birth-card. This post takes the method-comparison
  // intent (Personality/Soul, Mary Greer, "why is my birth card different"), which the
  // hub only answers in an FAQ row. Keep the two titles off each other.
  {
    slug: "tarot-birth-card",
    section: "your-cards",
    title: "What Is Your Tarot Birth Card?",
    seoTitle: "Personality & Soul Cards: How the Birth Card Method Works",
    metaDescription:
      "How the Personality and Soul cards are calculated, why reducing your birthdate leaves out half the deck, and how the Almanac's method differs. The calculator lives on the birth card page.",
    eyebrow: "Tarot Numerology",
    description:
      "The card your birthday hands you for life. How the standard Personality and Soul card calculation works, and why the Almanac reads your birthday a different way.",
    indexTeaser:
      "The card your birthday points to for life. How the Personality and Soul cards are found, and why the Almanac reads yours differently.",
    majorIndex: 19, // The Sun — the birth-card number (the 19 → Sun/Wheel/Magician case)
    file: "blog-08-tarot-birth-card.md",
    linkMap: {
      "why reduction can only reach half the deck": "/blog/what-is-tarot-numerology",
      "the wheel of twenty-two": "/blog/how-tarot-numerology-works",
      "your Bearing": "/blog/what-is-a-tarot-bearing",
      "your natal chart": "/blog/the-tarot-natal-chart",
      "Find your Bearing →": "/bearing",
    },
  },
  // Drafted 2026-07-17. Targets the adjacent "life path number tarot" audience and
  // bridges to the birth-card post and the Bearing. Numbers verified against the
  // engine (life path 1-9 → Majors 1-9, 8 = Strength; master 11 → Justice; Bearing
  // March 3 = the Lovers). Inline figure /life-path-ceiling.svg produced 2026-07-20,
  // built as a matched sibling of soul-card-ceiling.svg.
  {
    slug: "life-path-number-tarot",
    section: "your-cards",
    title: "Your Life Path Number and Your Tarot Card",
    seoTitle: "Your Life Path Number and Your Tarot Birth Card",
    metaDescription:
      "Your life path number maps to a tarot card, but that reduction reaches only nine of the twenty-two Majors. How it works, and the card the Almanac reads instead.",
    eyebrow: "Tarot Numerology",
    description:
      "The number numerology folds your whole birthday down to, and the tarot card it points to. Why a single digit reaches only the first nine Majors, and how the Almanac reads your birthday instead.",
    indexTeaser:
      "Your life path number points to a tarot card. Why a single digit reaches only the first nine Majors, and how the Almanac reads your birthday instead.",
    majorIndex: 9, // The Hermit — the last card a single-digit life path can reach
    file: "blog-09-life-path-number-tarot.md",
    linkMap: {
      "why reduction can only reach half the deck": "/blog/what-is-tarot-numerology",
      "tarot birth card": "/blog/tarot-birth-card",
      "the wheel of twenty-two": "/blog/how-tarot-numerology-works",
      "your Bearing": "/blog/what-is-a-tarot-bearing",
      "your natal chart": "/blog/the-tarot-natal-chart",
      "Find your Bearing →": "/bearing",
    },
  },
  // Bearing and natal chart close the "your-cards" section on the index, after the
  // birth-card / life-path pair — the finale escalates to the full seven-card chart.
  {
    slug: "what-is-a-tarot-bearing",
    section: "your-cards",
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
    section: "your-cards",
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
  // Scaffold for content/blog-10-personal-month-number-tarot.md. Drafted 2026-07-27.
  // Sibling of blog-09 (life-path): enters through the NUMEROLOGY head term
  // "personal month number", NOT the "personal month card" term. That split is
  // deliberate and anti-cannibalization: the /personal-month-card HUB already owns
  // "personal month tarot card / calculator / card of the month" and answers the
  // reduce-to-one-digit comparison in an FAQ row. This post owns that comparison at
  // full length (the nine-card loop vs. the 22-card walk), the way blog-08 took the
  // Personality/Soul method intent the /tarot-birth-card hub only had in an FAQ.
  // Keep this seoTitle/H1/slug off the hub's "personal month card" phrasing.
  // Numbers node-verified against lib/almanac.ts (Mar 15, 2026: year card the Lovers;
  // Aug month card Temperance #14; the wheel walks 12 distinct Majors, the numerology
  // number loops through 9 and repeats from September).
  // Inline figure: public/personal-month-loop-vs-walk.svg, GENERATED by
  // scripts/gen-personal-month-diagram.mjs (highlighted sets resolved live from the
  // engine, so the picture can't drift). Same visual family as life-path-ceiling.svg.
  // RECIPROCAL LINK (wire at publish): add a link from /personal-month-card (the FAQ
  // "Why isn't it just a number from one to nine?" answer, or the Related line) to
  // /blog/personal-month-number-tarot, so hub and post point at each other. Not added
  // to the live hub yet because the /blog route 404s until this entry is uncommented.
  // {
  //   slug: "personal-month-number-tarot",
  //   section: "your-cards",
  //   title: "Your Personal Month Number and Your Tarot Card",
  //   seoTitle: "Your Personal Month Number and Your Tarot Card",
  //   metaDescription:
  //     "Your personal month number folds to one digit, reaching only nine tarot cards and repeating within the year. How tarot numerology reads all twenty-two instead.",
  //   eyebrow: "Tarot Numerology",
  //   description:
  //     "The number numerology sets for your month, and the tarot card it points to. Why a single digit walks a nine-card loop, and how the Almanac reads your month across the whole wheel of twenty-two instead.",
  //   indexTeaser:
  //     "Your personal month number points to a tarot card, but a single digit reaches only nine of them and repeats. How the Almanac reads your month across all twenty-two instead.",
  //   majorIndex: 14, // Temperance — the month card the reduced method can never reach
  //   file: "blog-10-personal-month-number-tarot.md",
  //   linkMap: {
  //     "your life path number": "/blog/life-path-number-tarot",
  //     "why reduction can only reach half the deck": "/blog/what-is-tarot-numerology",
  //     "the wheel of twenty-two": "/blog/how-tarot-numerology-works",
  //     "your personal year card": "/personal-year-card",
  //     "Find your month card →": "/personal-month-card",
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
