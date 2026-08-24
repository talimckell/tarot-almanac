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
  // Published 2026-08-04, from the long-dormant scaffold. Went live early on purpose:
  // the 2027 SERP already has competitors indexed, and docs/SEARCH_PERFORMANCE.md shows
  // new pages taking ~3 weeks to reach page one, so this wants runway before the
  // Nov–Jan seasonal spike rather than the original mid-October target.
  //
  // Numbers node-verified against lib/almanac.ts (scripts/verify-blog-11-06.ts):
  // collective 2027 = Justice (11); the twelve collective month cards match the
  // table exactly; the decade walk Emperor 2020 → Death 2029 → Hierophant 2030;
  // Justice years are 9 apart (2009, 2018, 2027, 2036); every birthday's 2027
  // personal card sits exactly 11 steps from its Bearing (the wheel's half-turn,
  // checked across all 12×31 birthdays); March 15 → Bearing the Moon → 2027 Chariot.
  // Card copy (essence, gift, shadow, reclaiming, skills, the collective-year read)
  // is lifted from content/cards/justice.json, not newly written.
  // Two inline figures, public/2027-month-walk.svg and public/2027-half-turn.svg,
  // generated by scripts/gen-2027-diagrams.mjs (values resolved live from the engine).
  // No social assets: lib/blogSocialContent.ts has no entry for this post, by decision.
  {
    slug: "2027-tarot-year-card",
    section: "your-cards",
    title: "Your 2027 Tarot Year Card",
    seoTitle: "Your 2027 Tarot Year Card: The Year of Justice",
    metaDescription:
      "The tarot card for 2027 is Justice. What a Justice year asks of everyone, the card for each month, and how to find your own personal 2027 card from your birthday.",
    eyebrow: "Tarot Numerology",
    description:
      "The card everyone shares in 2027 is Justice. What a reckoning year asks of all of us, the twelve collective month cards it sets in advance, and how to find your own 2027 card from your birthday.",
    indexTeaser:
      "2027's collective card is Justice. What a reckoning year asks, the twelve month cards it sets in advance, and where your own birthday lands in it.",
    majorIndex: 11, // Justice — drives the glyph + element color
    file: "blog-06-2027-tarot-year-card.md",
    linkMap: {
      "How Tarot Numerology Works": "/blog/how-tarot-numerology-works",
      "the Major Arcana's three stages": "/blog/major-arcana-three-stages",
      // Reciprocal, added when blog-12 went live: this post's one-sentence 11/2 aside is that post at length.
      "keeps eleven as a master number and reads it as an 11/2 year": "/blog/2027-universal-year-number",
      "your Bearing": "/bearing",
      "your personal year number": "/blog/personal-year-number-tarot",
      "What Is Tarot Numerology?": "/blog/what-is-tarot-numerology",
      "Find your 2027 card →": "/personal-year-card",
    },
  },
  // DRAFTED 2026-08-17, NOT PUBLISHED — commented out pending the Illustrate and Review gates.
  //
  // Owner decisions, 2026-08-17: majorIndex 2 (the High Priestess) and section "your-cards",
  // both confirmed. The glyph is a deliberate DUPLICATE — blog-02 also runs majorIndex 2 — and
  // it's the first repeated glyph on the index. It reads fine because the two sit in different
  // sections (blog-02 under "Start here", this under "Find your own cards"), so they never
  // render adjacent. Don't "fix" this later by reassigning one of them.
  //
  // Voice: this is the first post written in THE BLOG REGISTER (the historian's mode with
  // contractions), settled here and written up in the voice doc + the blog skill's Write stage.
  //
  // The numerology-door sibling of blog-06, running the same anti-cannibalization split the
  // series already uses: blog-06 owns the CARD term ("2027 tarot year card"); this owns the NUMBER term
  // ("universal year number 2027" / "2027 numerology"), which is a separate SERP occupied by
  // numato / elunara / tisyasetu / lunary, none of whom show the arithmetic. Keep this post's
  // seoTitle, H1 and slug off "2027 tarot year card", and keep blog-06's off "universal year".
  // blog-06 already touches the 11/2 question in ONE sentence; this post is that sentence at
  // full length. Don't re-do Justice's reading or the month table here.
  //
  // Numbers node-verified against lib/almanac.ts (scratchpad script, 2026-08-17):
  // sumDigits(2027) = 11 and collectiveYear(2027) = 11 = Justice; MAJORS[2] = the High
  // Priestess; the 2020s table row by row (2020-2025 all sum to 9 or less so both systems
  // agree, 2026-2029 sum to 10/11/12/13 and diverge, 2030 rejoins at 5 = the Hierophant);
  // 164 of the 201 years from 1900 to 2100 have a digit sum above 9; the seven digit-sum-22
  // years since 1900 are 1939/1948/1957/1966/1975/1984/1993 and every one wraps to 0, the
  // Fool; March 15's Bearing is the Moon (18), its 2027 Almanac card is the Chariot (7), and
  // its folded numerology personal year for 2027 is 2. Card copy for Justice and the High
  // Priestess is quoted from content/cards/{justice,high-priestess}.json, not newly written.
  //
  // No figures yet (Illustrate is the next gate) and no lib/blogSocialContent.ts entry yet.
  // On publish: wire a reciprocal link from blog-06 and from blog-11, both of which currently
  // carry the 11/2 point in passing.
  {
    slug: "2027-universal-year-number",
    section: "your-cards",
    title: "The 2027 Universal Year Number and Its Tarot Card",
    seoTitle: "2027 Numerology: Universal Year Number and Its Tarot Card",
    metaDescription:
      "The universal year number for 2027 is 11, and numerology folds it to a 2. On the wheel of twenty-two it stays eleven and lands on Justice. What the fold costs.",
    eyebrow: "Tarot Numerology",
    description:
      "Every year has a number everyone shares, and 2027's is eleven. Numerology names eleven a master number and then reads it as a two. The wheel of twenty-two keeps it at eleven, which is where Justice sits, and those are two very different years.",
    indexTeaser:
      "2027's universal year number is eleven. Numerology reads it as a two; the wheel of twenty-two keeps it at eleven, where Justice sits. Two very different years out of one sum.",
    majorIndex: 2, // The High Priestess — the card the fold hands you instead of Justice
    file: "blog-12-2027-universal-year-number.md",
    linkMap: {
      "reverse twice": "/blog/the-shadow-and-the-reclaiming",
      "your personal year number": "/blog/personal-year-number-tarot",
      "your Bearing": "/blog/what-is-a-tarot-bearing",
      "The 2027 tarot year card": "/blog/2027-tarot-year-card",
      "why reduction can only reach half the deck": "/blog/what-is-tarot-numerology",
      "See where 2027 puts you →": "/personal-year-card",
    },
  },
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
      // Reciprocal, added when blog-13 went live: the birth year's own card.
      "a card of its own": "/blog/birth-year-tarot-card",
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
  // Published 2026-08-04. Third in the
  // numerology-sibling series (blog-09 life path → blog-10 personal month → this).
  // Same anti-cannibalization split: the /personal-year-card HUB owns "personal year
  // card" / calculator intent, this post owns the NUMEROLOGY head term "personal year
  // number" and the loop-vs-wheel comparison at full length. Keep seoTitle/H1/slug off
  // the hub's phrasing, and off "2027", which belongs to blog-06.
  //
  // Placed before blog-10 so the index reads year → month.
  //
  // Numbers node-verified against lib/almanac.ts (scripts/verify-blog-11-06.ts) for
  // March 15: numerology personal year 2026 = 1 → the Magician, and the 1-9 sequence
  // repeats exactly every nine years (2026 = 2035); the Almanac's 2026 card is the
  // Lovers, walking Chariot/Strength/Hermit 2027-29, then the decade turn puts 2030
  // back on the Magician; over a 90-year life the wheel reaches all 22 cards and the
  // number reaches 9. The Bearing identity (personal year = Bearing + collective year
  // card, so the gap to the collective column is always the Bearing) was checked
  // across all 12×31 birthdays for 2026, 2027 and 2030.
  //
  // Two inline figures, public/year-card-derivation.svg and public/year-card-gap-holds.svg,
  // generated by scripts/gen-personal-year-diagrams.mjs (values resolved live from the
  // engine). No social assets: lib/blogSocialContent.ts has no entry for this post,
  // by decision.
  //
  // Reciprocal link wired: /personal-year-card's "Related:" line points here, matching
  // the way /personal-month-card points at blog-10.
  {
    slug: "personal-year-number-tarot",
    section: "your-cards",
    title: "Your Personal Year Number and Your Tarot Card",
    seoTitle: "Your Personal Year Number and Your Tarot Card",
    metaDescription:
      "Your personal year number folds to one digit, so it reaches only nine tarot cards and repeats every nine years. How tarot numerology reads all twenty-two instead.",
    eyebrow: "Tarot Numerology",
    description:
      "The number numerology sets for your year, and the tarot card it points to. Why a single digit walks the same nine cards for life, and how the Almanac reads your year across the whole wheel of twenty-two instead.",
    indexTeaser:
      "Your personal year number points to a tarot card, but a single digit reaches only nine of them and repeats every nine years. How the Almanac reads your year across all twenty-two instead.",
    majorIndex: 20, // Judgement — one of the cards a reduced personal year can never reach
    file: "blog-11-personal-year-number-tarot.md",
    linkMap: {
      "why reduction can only reach half the deck": "/blog/what-is-tarot-numerology",
      "Your life path number": "/blog/life-path-number-tarot",
      "the wheel of twenty-two": "/blog/how-tarot-numerology-works",
      "Bearing": "/blog/what-is-a-tarot-bearing",
      "The 2027 year card": "/blog/2027-tarot-year-card",
      // Reciprocal, added when blog-12 went live: where the world's number for a year comes from.
      "The card everybody shares": "/blog/2027-universal-year-number",
      // Reciprocal, added when blog-13 went live: the collective card of your birth year.
      "the one you were born in": "/blog/birth-year-tarot-card",
      "personal month card": "/personal-month-card",
      "Find your year card →": "/personal-year-card",
    },
  },
  // Published 2026-08-24. Owner picked the topic from docs/BLOG_IDEAS.md (2026-08-24 scout
  // run), where it ranked second behind the personal-day post.
  //
  // Fourth in the numerology-sibling series (blog-09 life path → blog-10 personal month →
  // blog-11 personal year → this). Enters on the BIRTH-YEAR term, which no hub of ours claims:
  // /birthday/[month-day] is month-and-day only, and the birth year otherwise appears only
  // inside the natal chart. So there is no hub to cannibalize here; the CTA goes to
  // /tarot-birth-chart, the page that actually consumes the birth year, NOT /personal-year-card
  // (that hub is blog-11's) and NOT /bearing (blog-04's).
  //
  // Distinct ground from its siblings, deliberately: this is the only post about a COLLECTIVE
  // card. The others read your personal column; this one reads the year itself, which the natal
  // chart already carries as the "the world that caught you / your inheritance" position
  // (lib/chartReadings.ts → natalCollectiveYear). Don't let it drift onto the Bearing's ground.
  //
  // SERP note: Parade owns this term and its neighbours (birth year, birth date, birth month,
  // birth-month minor arcana, soul card by month), syndicated to Yahoo/MSN. Their pages fold the
  // year to a digit. The draft attributes the fold as the general published rule rather than
  // quoting any outlet, because parade.com 403s on fetch and an unverified attribution isn't
  // worth the risk.
  //
  // Numbers node-verified against lib/almanac.ts (scratchpad script, 2026-08-24):
  // the 1986-1995 table row by row (1989 sum 27 → the Hierophant, 1990 sum 19 → the Sun,
  // 1992 → the World, 1993 sum 22 → the Fool, 1994 → the Magician); the 89→90 tail drop is
  // 17 → 9, a fall of 8, and mod22(-8) = 14, so the Hierophant-to-Sun jump is 14 steps and the
  // Lovers-to-Sun distance is 13; birth years 1925-2025 reach ALL 22 Majors with none missing,
  // where the fold reaches 9; Death is 1930 and the Tower is 1933/1942/1951/1960 in that range;
  // the seven Fool years since 1900 are 1939/1948/1957/1966/1975/1984/1993 and NO year from
  // 1994 to 2099 has a digit sum of 22 (the 2000s top out at 20, in 2099).
  // Card copy in the "belongs to the year" section is quoted verbatim from the natalCollectiveYear
  // position readings in content/cards/{sun,fool,world}.json, not newly written.
  //
  // majorIndex 0 (the Fool) is a deliberate DUPLICATE — blog-07 also runs 0 — on the same
  // reasoning already used for blog-02/blog-12: the two sit in different index sections
  // ("ideas" vs "your-cards"), so they never render adjacent. The Fool is the post's own subject
  // (the rarest birth-year card, seven years, ended 1993).
  //
  // One inline figure, public/birth-year-century.svg, generated by
  // scripts/gen-birth-year-century.mjs (counts resolved live from the engine). Its canvas is
  // 520 wide, NOT the siblings' 720: .diagram caps at 420px, so a narrower canvas is what makes
  // the type read at blog width. Check any future figure rasterized at 420px, not at full size.
  // No lib/blogSocialContent.ts entry, matching blog-06 and blog-11.
  //
  // STILL OWED: reciprocal links from blog-09 and blog-11, and a "Related" line from
  // /tarot-birth-chart. All three need new anchor text inside authored prose, so they are Tali's
  // call, not a mechanical edit.
  {
    slug: "birth-year-tarot-card",
    section: "your-cards",
    title: "The Card of the Year You Were Born",
    seoTitle: "Your Birth Year Tarot Card: The World That Caught You",
    metaDescription:
      "The tarot card for the year you were born, kept whole instead of folded to one digit. Why 1989 and 1990 land fourteen cards apart, and which years land on the Fool.",
    eyebrow: "Tarot Numerology",
    description:
      "The year you were born has a card, and it's the one card in your chart you had no hand in. Why folding it to a single digit hands a hundred years of birth years to nine cards, and what the whole wheel does with them instead.",
    indexTeaser:
      "The year you were born has its own card, shared with everyone who arrived in it. Why folding it to one digit reaches nine cards, and what the wheel of twenty-two finds instead.",
    majorIndex: 0, // The Fool — the rarest birth-year card, seven years, none since 1993
    file: "blog-13-birth-year-tarot-card.md",
    linkMap: {
      "your personal year number": "/blog/personal-year-number-tarot",
      "why reduction can only reach half the deck": "/blog/what-is-tarot-numerology",
      "the wheel of twenty-two": "/blog/how-tarot-numerology-works",
      "Your Bearing": "/blog/what-is-a-tarot-bearing",
      "your natal chart": "/blog/the-tarot-natal-chart",
      "See the year that caught you →": "/tarot-birth-chart",
    },
  },
  // Published 2026-07-28. Sibling of blog-09 (life-path): enters through the NUMEROLOGY
  // head term "personal month number", NOT the "personal month card" term. The split is
  // deliberate anti-cannibalization: the /personal-month-card HUB owns "personal month
  // tarot card / calculator / card of the month" and answers the reduce-to-one-digit
  // comparison in an FAQ row; this post owns that comparison at full length (the
  // nine-card loop vs. the 22-card walk), the way blog-08 took the Personality/Soul
  // method intent the /tarot-birth-card hub only had in an FAQ. Keep seoTitle/H1/slug
  // off the hub's "personal month card" phrasing.
  // Numbers node-verified against lib/almanac.ts (Mar 15, 2026: year card the Lovers;
  // Aug month card Temperance #14; the wheel walks 12 distinct Majors, the numerology
  // number loops through 9 and repeats from September). Inline figure
  // public/personal-month-loop-vs-walk.svg, generated by scripts/gen-personal-month-diagram.mjs.
  // Reciprocal link wired: the /personal-month-card hub's "Related" line links here
  // ("your personal month number, explained"); this post's CTA links back to the hub.
  {
    slug: "personal-month-number-tarot",
    section: "your-cards",
    title: "Your Personal Month Number and Your Tarot Card",
    seoTitle: "Your Personal Month Number and Your Tarot Card",
    metaDescription:
      "Your personal month number folds to one digit, reaching only nine tarot cards and repeating within the year. How tarot numerology reads all twenty-two instead.",
    eyebrow: "Tarot Numerology",
    description:
      "The number numerology sets for your month, and the tarot card it points to. Why a single digit walks a nine-card loop, and how the Almanac reads your month across the whole wheel of twenty-two instead.",
    indexTeaser:
      "Your personal month number points to a tarot card, but a single digit reaches only nine of them and repeats. How the Almanac reads your month across all twenty-two instead.",
    majorIndex: 14, // Temperance — the month card the reduced method can never reach
    file: "blog-10-personal-month-number-tarot.md",
    linkMap: {
      "your life path number": "/blog/life-path-number-tarot",
      "why reduction can only reach half the deck": "/blog/what-is-tarot-numerology",
      "the wheel of twenty-two": "/blog/how-tarot-numerology-works",
      "your personal year card": "/personal-year-card",
      "Find your month card →": "/personal-month-card",
    },
  },
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
