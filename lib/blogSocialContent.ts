// Content for blog-post social images (Bluesky quote cards + Pinterest quote/diagram
// pins) — one entry per published post, keyed by slug. Every quote/caption is pulled or
// lightly trimmed straight from the post's own authored prose (content/blog-*.md);
// nothing here is newly written reading copy, per CLAUDE.md's rule against inventing new
// site copy — only the connecting words needed to make a trimmed line stand on its own.
// Fixed, one-time sets (not a rotating/random pool like the card boards), so no DB
// usage-tracking is needed — these render the same way every time.
//
// Each of the 4 Bluesky quotes ships as its own SEPARATE post (not a 4-image carousel —
// confirmed with the owner), so every one of them, and its caption, must stand fully on
// its own without depending on the other three. The 4 Pinterest images are independent
// pins by platform convention regardless (Pinterest doesn't really have a "read these
// together" format).
export interface BlogQuote {
  eyebrow: string;
  quote: string;
  /** The actual Bluesky post text that accompanies this image — standalone, doesn't
   * assume the reader has seen the other 3 quotes. URL + hashtag appended by
   * lib/blogSocialCaption.ts, not baked in here. */
  caption: string;
}

export interface BlogPinterestCopy {
  /** Pinterest's own SEO title field (distinct from `title`/`quote` used elsewhere for
   * on-image text, since the wheel diagram already has its own on-image `title`). */
  pinTitle: string;
  description: string;
  keywords: string;
}

export interface BlogPinterestQuote extends BlogPinterestCopy {
  eyebrow: string;
  quote: string;
}

export interface BlogMathExample extends BlogPinterestCopy {
  eyebrow: string;
  dateLabel: string;
  steps: string[];
  resultMajorIndex: number;
}

export interface BlogWheelDiagram extends BlogPinterestCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
}

// Post 2's own diagram types — a day's Major "shape" resolving to a Minor "texture", and
// a two-date comparison showing the rank moves freely rather than climbing. Genuinely
// different visual concepts from post 1's wheel/wrap-math, so distinct types rather than
// forcing every post into the same diagram shape. y/m/d are real dates, resolved through
// lib/almanac.ts's own collectiveDayCard() at render time — not hand-typed derived
// values — so the diagram can never drift from what the live engine actually computes.
export interface BlogShapeTextureDiagram extends BlogPinterestCopy {
  eyebrow: string;
  dateLabel: string;
  y: number;
  m: number;
  d: number;
  caption: string;
}

export interface BlogRankComparisonColumn {
  dateLabel: string;
  y: number;
  m: number;
  d: number;
}

export interface BlogRankComparisonDiagram extends BlogPinterestCopy {
  eyebrow: string;
  title: string;
  columns: [BlogRankComparisonColumn, BlogRankComparisonColumn];
}

// Post 3's own diagram type — one real card's three faces (Gift/Shadow/Reclaiming) shown
// side by side. cardSlug is looked up through lib/cards.ts's getCardBySlug() at render
// time, so the keywords/name shown are always the actual authored card data, never
// hand-retyped. Reuses the site's own established visual convention for "reclaiming"
// (180°-rotated glyph, from the Bluesky/Pinterest Reclaimed Reversals campaigns) rather
// than inventing a new one, for consistency across the whole site's visual language.
export interface BlogThreeFacesDiagram extends BlogPinterestCopy {
  eyebrow: string;
  cardSlug: string;
  caption: string;
}

// Post 4's own diagram type — the Bearing's whole point made visual: the gap between the
// world's year card and yours stays the same number across every year, even as both cards
// change. bm/bd are a real birthday (the post's own February 16 → Moon example); every
// row's two card names and the gap are computed live through lib/almanac.ts's
// collectiveYear()/personalYear() at render time, never hand-typed, so the table can't
// drift from the engine. (Verified: the five rows resolve to Fool/Moon, Strength/Emperor,
// Hermit/Hierophant, Wheel/Lovers, Hierophant/Magician — gap 18 every time.)
export interface BlogGapHoldsDiagram extends BlogPinterestCopy {
  eyebrow: string;
  title: string;
  bearingLabel: string; // the Bearing this birthday lands on, e.g. "The Moon"
  bm: number;
  bd: number;
  years: number[];
  caption: string;
}

// Post 5's own diagram type — the seven-card natal chart itself, worked from one real
// birth date (the post's own February 16, 1984 example). Every one of the seven cards,
// including the two Minor day positions and the Bearing, is computed live through
// lib/natalChart.ts's computeNatalChart() at render time, so the grid can never drift
// from the engine or from the post's worked numbers. (Verified: Fool/Moon, High
// Priestess/Judgement, Three of Cups/Queen of Wands, Bearing the Moon.)
export interface BlogNatalChartDiagram extends BlogPinterestCopy {
  eyebrow: string;
  title: string;
  by: number;
  bm: number;
  bd: number;
  caption: string;
}

export interface BlogSocialContent {
  slug: string;
  postTitle: string;
  majorIndex: number; // the post's own glyph (lib/blog.ts BlogPostMeta.majorIndex) — reused as this post's visual thread
  blueskyQuotes: BlogQuote[];
  pinterestQuotes: BlogPinterestQuote[];
  // Post-specific diagram slots — which ones are present varies per post, since each
  // post's best visual is drawn from its own content rather than a forced template.
  wheel?: BlogWheelDiagram;
  math?: BlogMathExample;
  shapeTexture?: BlogShapeTextureDiagram;
  rankComparison?: BlogRankComparisonDiagram;
  threeFaces?: BlogThreeFacesDiagram;
  gapHolds?: BlogGapHoldsDiagram;
  natalChart?: BlogNatalChartDiagram;
}

export const BLOG_SOCIAL: Record<string, BlogSocialContent> = {
  "what-is-tarot-numerology": {
    slug: "what-is-tarot-numerology",
    postTitle: "What Is Tarot Numerology?",
    majorIndex: 10, // Wheel of Fortune
    blueskyQuotes: [
      {
        eyebrow: "What Is Tarot Numerology?",
        quote: "Turning a date into a tarot card with arithmetic instead of a shuffle.",
        caption:
          "Tarot numerology turns a date into a tarot card with arithmetic instead of a shuffle. Same input, same card, every time — no draw, because there's no shuffle to draw from.",
      },
      {
        eyebrow: "The Promise",
        quote: "Same input, same card, every time. No shuffle, no drift.",
        caption:
          "The idea behind The Tarot Almanac: a date runs through a fixed calculation and lands on a card. Same input, same card, every time — no shuffle, no drift, nothing left to chance.",
      },
      {
        eyebrow: "Two Ways to Read a Date",
        quote: "Reduction reads your character. The wheel reads where you are right now.",
        caption:
          "Traditional numerology reduces a date to a symbol and asks what it says about your character. The Tarot Almanac's wheel instead tells you where you stand right now, today.",
      },
      {
        eyebrow: "Why You Can Check It",
        quote: "The math is published, so you never have to take a reading on faith.",
        caption:
          "Nothing about The Tarot Almanac's tarot numerology is secret. The full calculation is published, so no reading ever has to be taken on faith — check it yourself, at your kitchen table.",
      },
    ],
    pinterestQuotes: [
      {
        eyebrow: "The Wheel, Not a List",
        quote: "A date shouldn't reduce to a card. It should tell you where on the wheel you're standing.",
        pinTitle: "Tarot Numerology: The Wheel, Not a List",
        description:
          "Tarot numerology turns a date into a tarot card with arithmetic, not a shuffle. A date shouldn't reduce to a card, it should tell you where on the wheel of the Major Arcana you're standing.",
        keywords: "tarot numerology, major arcana wheel, tarot birth card",
      },
      {
        eyebrow: "Every Card Becomes Available",
        quote: "Nothing gets collapsed down to a handful of survivors, and the sequence stays intact.",
        pinTitle: "Why Tarot Numerology Uses the Whole Deck",
        description:
          "Traditional numerology's reduction method only ever reaches about half the Major Arcana. The Tarot Almanac's wheel method keeps every card in play, and keeps the deck's own sequence intact.",
        keywords: "tarot numerology, major arcana, tarot card meanings",
      },
    ],
    wheel: {
      eyebrow: "How Tarot Numerology Works",
      title: "The Major Arcana are a wheel, not a list.",
      subtitle: "Zero through twenty-one, and then around again.",
      pinTitle: "Tarot Numerology: The Major Arcana Wheel",
      description:
        "The 22 Major Arcana aren't a list to look up, they're a wheel: zero through twenty-one, and then around again. A date doesn't reduce to a card, it locates you on the wheel.",
      keywords: "tarot numerology, major arcana wheel, tarot card meanings",
    },
    math: {
      eyebrow: "A Worked Example",
      dateLabel: "November 19",
      steps: ["11 + 19 = 30", "30 − 22 = 8"],
      resultMajorIndex: 8, // Strength
      pinTitle: "How to Calculate Your Tarot Numerology Card",
      description:
        "A worked example of tarot numerology's wheel method: November 19 adds to 30, wraps around the 22-card wheel to 8, and lands on Strength. The full formula, explained.",
      keywords: "tarot numerology, tarot calculation, tarot birth card",
    },
  },
  "how-tarot-numerology-works": {
    slug: "how-tarot-numerology-works",
    postTitle: "How Tarot Numerology Works: The Complete Formula",
    majorIndex: 2, // The High Priestess
    blueskyQuotes: [
      {
        eyebrow: "How Tarot Numerology Works",
        quote: "Every card comes from arithmetic you can do yourself, with no step hidden.",
        caption:
          "Every card The Tarot Almanac shows you comes from arithmetic you can do yourself, with no step hidden and no number pulled out of the air. Here's the whole formula, start to finish.",
      },
      {
        eyebrow: "Shape and Texture",
        quote: "The Major Arcana are the shape of a day. The Minor Arcana are its texture.",
        caption:
          "In The Tarot Almanac's system, the Major Arcana are the shape of a day, the archetype it belongs to. The Minor Arcana are its texture, the specific grain of how that shape shows up.",
      },
      {
        eyebrow: "The Master Number",
        quote: "Eleven is the one number in this system that refuses to reduce.",
        caption:
          "The day's Minor rank steps forward by eleven, tarot numerology's own master number, the one value that resists reduction. It's also why every one of the 56 Minors eventually comes up.",
      },
      {
        eyebrow: "Why It's Published",
        quote: "The math being open is what makes it trustworthy.",
        caption:
          "Most divination keeps its method behind a curtain, because the mystery is the product. The Tarot Almanac runs the other way — the math is open, so no reading has to be taken on faith.",
      },
    ],
    pinterestQuotes: [
      {
        eyebrow: "No Randomness Anywhere",
        quote: "A handful of small additions, one wrap, and one step for the rank.",
        pinTitle: "How Tarot Numerology's Formula Actually Works",
        description:
          "The Tarot Almanac's entire tarot numerology system: a handful of small additions, one wrap around the 22-card wheel, and one step for the day's rank. No randomness anywhere in it.",
        keywords: "tarot numerology, tarot formula, tarot calculation",
      },
      {
        eyebrow: "Every Rank Comes Up",
        quote: "Eleven shares no factor with fourteen, so stepping by it reaches every rank in turn.",
        pinTitle: "Why Tarot Numerology's Day Card Uses Eleven",
        description:
          "The day's Minor rank steps forward by eleven. Because eleven shares no factor with fourteen, stepping by it reaches every one of the 14 ranks in turn, so all 56 Minors become reachable.",
        keywords: "tarot numerology, minor arcana, tarot card meanings",
      },
    ],
    shapeTexture: {
      eyebrow: "How the Day Card Works",
      dateLabel: "June 8, 2026",
      y: 2026,
      m: 6,
      d: 8,
      caption: "A High Priestess day always carries a Cups texture — the shape decides the suit.",
      pinTitle: "Tarot Numerology: Shape Decides the Suit",
      description:
        "Every day has a shape (its Major Arcana) and a texture (its Minor). The shape's element always decides the texture's suit — a High Priestess day is always a Cups day, whatever the exact card.",
      keywords: "tarot numerology, minor arcana, tarot day card",
    },
    rankComparison: {
      eyebrow: "The Rank Moves Freely",
      title: "Different suits, different ranks, no climb between them.",
      columns: [
        { dateLabel: "June 8", y: 2026, m: 6, d: 8 },
        { dateLabel: "June 9", y: 2026, m: 6, d: 9 },
      ],
      pinTitle: "Tarot Numerology: The Rank Doesn't Climb",
      description:
        "Two consecutive days, two completely different textures: June 8 reads Three of Cups, June 9 reads King of Pentacles. The rank moves with the date, not on a predictable march.",
      keywords: "tarot numerology, minor arcana, tarot card meanings",
    },
  },
  "the-shadow-and-the-reclaiming": {
    slug: "the-shadow-and-the-reclaiming",
    postTitle: "The Shadow and the Reclaiming: Why a Reversed Card Has Two Meanings",
    majorIndex: 18, // The Moon
    blueskyQuotes: [
      {
        eyebrow: "Why Reversals Get Split",
        quote: "“The good thing, but less of it” is not how the hard parts of a life actually work.",
        caption:
          "Most tarot treats a reversed card as the upright meaning, just weakened. The Tarot Almanac splits it in two instead, because that thin convention was never how the hard parts of a life actually work.",
      },
      {
        eyebrow: "Three Faces, Not Two",
        quote: "Every card has three faces: the Gift, the Shadow, and the Reclaiming.",
        caption:
          "In The Tarot Almanac, every card carries three faces: the Gift, its upright meaning; the Shadow, that gift turned against itself; and the Reclaiming, a refusal of a story you were handed.",
      },
      {
        eyebrow: "What the Shadow Really Is",
        quote: "The Shadow is the honest naming of how a strength becomes a problem.",
        caption:
          "A card's Shadow isn't a different card, or the absence of its gift. It's that same gift, curdled — the honest naming of how a strength becomes a problem when it turns against itself.",
      },
      {
        eyebrow: "The Card Is Fixed. You Move.",
        quote: "The card is fixed. The three faces are fixed. What moves is you, standing in front of it.",
        caption:
          "The Tarot Almanac never tells you which face is true today — it can't know that. The card is fixed, its three faces are fixed. What moves is you, recognizing which one you're living.",
      },
    ],
    pinterestQuotes: [
      {
        eyebrow: "Warnings and Liberations",
        quote: "Some reversals are warnings. Others are liberations.",
        pinTitle: "Why Tarot Reversals Aren't Just “Bad”",
        description:
          "Reversed tarot cards aren't just weakened versions of the upright meaning. Some reversals are warnings, the Shadow. Others are liberations, the Reclaiming. The Tarot Almanac names both.",
        keywords: "tarot reversed meanings, tarot shadow work, reversed tarot card",
      },
      {
        eyebrow: "Not the Same Direction",
        quote: "The Shadow looks inward at how you might be hurting yourself. The Reclaiming looks outward at a story you can refuse.",
        pinTitle: "The Shadow vs. the Reclaiming in Tarot",
        description:
          "Every reversed tarot card in The Tarot Almanac has two distinct faces. The Shadow looks inward, at how a gift turns against itself. The Reclaiming looks outward, at a story you're allowed to refuse.",
        keywords: "tarot shadow work, tarot reversed meanings, reversed tarot card",
      },
      {
        eyebrow: "A Reversal Isn't Worse",
        quote: "A reversal isn't a worse card. It's the same card, showing you a face it doesn't show first.",
        pinTitle: "What a Reversed Tarot Card Really Means",
        description:
          "A reversed tarot card isn't a worse version of the upright meaning. It's the same card, showing you a face it doesn't show first — the Shadow or the Reclaiming instead of the Gift.",
        keywords: "reversed tarot card, tarot shadow work, tarot card meanings",
      },
    ],
    threeFaces: {
      eyebrow: "The Three Faces, One Card",
      cardSlug: "ace-of-cups",
      caption: "The card names the three faces. Your life names which one you're living.",
      pinTitle: "The Three Faces of Every Tarot Card",
      description:
        "Every card in The Tarot Almanac has three faces: the Gift (its upright meaning), the Shadow (that gift turned against itself), and the Reclaiming (a story you're allowed to refuse). Here they are on the Ace of Cups.",
      keywords: "tarot shadow work, reversed tarot card, tarot card meanings",
    },
  },
  "what-is-a-tarot-bearing": {
    slug: "what-is-a-tarot-bearing",
    postTitle: "What Is a Tarot Bearing?",
    majorIndex: 17, // The Star
    blueskyQuotes: [
      {
        eyebrow: "What Is a Tarot Bearing?",
        quote: "Your Bearing is the distance between the world's card and yours. And that distance never changes.",
        caption:
          "Every day the world gets a tarot card, and you get your own, drawn from your birthday meeting that date. Your Bearing is the distance between them, and it holds from the day you're born to the end of your life.",
      },
      {
        eyebrow: "Orientation, Not Personality",
        quote: "A Bearing describes how you're aimed, not whether you're good.",
        caption:
          "Your Bearing isn't a card about you alone. It's a card about you and the world, the standing relationship between the two of you. That's why it's an orientation and not a personality test.",
      },
      {
        eyebrow: "Your Birthday Is the Gap",
        quote: "Your Bearing is your birthday, and your birthday is the gap.",
        caption:
          "It works out on a napkin: add your birth month and birth day, wrap around the wheel of twenty-two if you pass the end. The year cancels out when you measure the distance, so what's left is just your birthday.",
      },
      {
        eyebrow: "It Holds for Good",
        quote: "The world keeps turning the wheel. You keep your angle on it.",
        caption:
          "Wherever your Bearing falls, it was set the day you arrived and it holds for good. The world cycles through the whole deck and you cycle right alongside it, holding the same distance the entire way.",
      },
    ],
    pinterestQuotes: [
      {
        eyebrow: "Different Angles, Same World",
        quote: "Different distances from the same center, different angles on the same world.",
        pinTitle: "Every Tarot Bearing Is a Different Angle on the World",
        description:
          "Your tarot Bearing is the fixed distance between your card and the world's, and no two are better or worse. They're just different distances from the same center, different angles on the same world.",
        keywords: "tarot bearing, tarot numerology, tarot birth card",
      },
      {
        eyebrow: "The Bearing With No Gap",
        quote: "There's one Bearing with no gap at all: the Fool. The rarest on the wheel.",
        pinTitle: "The Rarest Tarot Bearing: The Fool",
        description:
          "Every tarot Bearing is a fixed distance between you and the world, except one. The Fool, at zero, is the Bearing with no gap at all: you stand right inside your moment. Only a handful of birthdays land there.",
        keywords: "tarot bearing, the fool tarot, tarot numerology",
      },
    ],
    gapHolds: {
      eyebrow: "Watch the Gap Hold",
      title: "Both cards change every year. The gap doesn't.",
      bearingLabel: "The Moon",
      bm: 2,
      bd: 16,
      years: [1984, 2024, 2025, 2026, 2030],
      caption: "A February 16 birthday holds an eighteen-step gap from the world, every year of a life. That gap is the Moon. That gap is the Bearing.",
      pinTitle: "Your Tarot Bearing Is the Gap That Never Changes",
      description:
        "The world's tarot year card changes every year, and yours changes right alongside it, but the gap between them stays exactly the same. That unchanging distance is your Bearing. Here it is holding at eighteen for a February 16 birthday.",
      keywords: "tarot bearing, tarot numerology, tarot birth card",
    },
    math: {
      eyebrow: "Your Birthday Is the Gap",
      dateLabel: "February 16",
      steps: ["2 + 16 = 18"],
      resultMajorIndex: 18, // The Moon
      pinTitle: "How to Calculate Your Tarot Bearing",
      description:
        "Your tarot Bearing works out on a napkin: add your birth month and birth day, wrap around the 22-card wheel if you pass the end. February 16 gives 2 plus 16, which is 18, the Moon.",
      keywords: "tarot bearing, tarot numerology, tarot calculation",
    },
  },
  "the-tarot-natal-chart": {
    slug: "the-tarot-natal-chart",
    postTitle: "Your Tarot Natal Chart",
    majorIndex: 21, // The World
    blueskyQuotes: [
      {
        eyebrow: "Your Tarot Natal Chart",
        quote: "The daily card is about a day. This is about a life.",
        caption:
          "Astrology gives you a birth chart. Tarot numerology gives you the same kind of thing, built from your birthday instead of the stars. It's the deepest reading the Almanac does: the daily card is about a day, this is about a life.",
      },
      {
        eyebrow: "Two Sides, Three Layers",
        quote: "One side is the self you arrived as. The other is the room you arrived in.",
        caption:
          "The chart is a small grid: two sides and three layers. One side is the self you arrived as, the other is the world you were born into. The year is the ground note, the month one layer in, the day the surface.",
      },
      {
        eyebrow: "It Lines Up With Astrology",
        quote: "Your year is your sun. Your month is your moon. Your day is your rising.",
        caption:
          "If you know your astrology, the chart lines up almost too neatly. Your year card is your core nature, your sun. Your month card is your inner life, your moon. Your day card is how you meet a room, your rising.",
      },
      {
        eyebrow: "You Can Check the Whole Thing",
        quote: "Your sun sign needed an astronomer. Your tarot natal chart just needs your birthday.",
        caption:
          "Seven cards, one birthday, nothing hidden. Every card comes from your birth date and one move you repeat: add, and wrap around the wheel if you pass 22. Your sun sign needed an astronomer. This just needs your birthday.",
      },
    ],
    pinterestQuotes: [
      {
        eyebrow: "A Sentence, Then a Paragraph",
        quote: "A single card is a sentence. The chart is a paragraph.",
        pinTitle: "How to Read a Whole Tarot Natal Chart",
        description:
          "A single tarot card is a sentence. The natal chart is a paragraph. The pleasure of it is how the seven cards talk to each other: a Moon core meeting a Fool world, the steady Majors with the real weather tucked into the Minor days.",
        keywords: "tarot natal chart, tarot numerology, tarot birth chart",
      },
      {
        eyebrow: "Who You Are, and How It Feels",
        quote: "The Majors tell you who someone is. The Minor day cards tell you what it feels like to be them.",
        pinTitle: "Why Two Cards in Your Tarot Chart Are Minors",
        description:
          "In a tarot natal chart, the four Major positions give you the architecture of a person. The two Minor day cards carry the daily weather. The Majors tell you who someone is; the Minor days tell you what it feels like to be them.",
        keywords: "tarot natal chart, minor arcana, tarot card meanings",
      },
      {
        eyebrow: "It Was Always There",
        quote: "None of it was drawn for you. It was sitting in your birthday the whole time.",
        pinTitle: "Your Tarot Natal Chart Was in Your Birthday All Along",
        description:
          "Nothing in a tarot natal chart is drawn or shuffled for you. All seven cards were sitting in your birthday the whole time, waiting for someone to do the arithmetic. Your birthday and a few minutes is all it takes.",
        keywords: "tarot natal chart, tarot numerology, tarot birth chart",
      },
    ],
    natalChart: {
      eyebrow: "One Real Chart, Worked Through",
      title: "Seven cards, one birthday, nothing hidden.",
      by: 1984,
      bm: 2,
      bd: 16,
      caption: "Your side and the world's sit eighteen steps apart at every layer. That constant, the gap that never moves, is the Bearing.",
      pinTitle: "What a Tarot Natal Chart Actually Looks Like",
      description:
        "A real tarot natal chart worked all the way through, for someone born February 16, 1984. Seven cards from one birthday: your core, inner life, and surface beside the world's, with the Bearing holding the gap at every layer.",
      keywords: "tarot natal chart, tarot birth chart, tarot numerology",
    },
  },

  "major-arcana-three-stages": {
    slug: "major-arcana-three-stages",
    postTitle: "The Major Arcana in Three Stages",
    majorIndex: 0, // The Fool — the journey's starting point
    blueskyQuotes: [
      {
        eyebrow: "The Fool's Journey",
        quote: "The 22 Major Arcana aren't 22 separate ideas. They're one story, told in order.",
        caption:
          "The 22 Major Arcana aren't 22 separate ideas. They're one story told in order, the Fool's Journey, and it moves in three stages: Initiation, Testing, Reckoning.",
      },
      {
        eyebrow: "Three Movements",
        quote: "First you become someone. Then that someone gets tested. Then you reckon with what it was.",
        caption:
          "The whole arc of the Major Arcana in one breath: first you become someone, then that someone gets tested by everything you can't control, then you come out the far side and reckon with what the journey was.",
      },
      {
        eyebrow: "The Testing Stage",
        quote: "The Major Arcana has a middle stretch that exists to test you.",
        caption:
          "The 22 tarot Major Arcana move in three stages. The middle one, Strength through Temperance, is Testing: the stretch where the self you built meets everything you can't control. A card that lands here is asking what you're made of.",
      },
      {
        eyebrow: "Orientation, Not Verdict",
        quote: "The card fixes where you're standing. What you do there is still yours.",
        caption:
          "In The Tarot Almanac, a date always lands on the same card, no shuffle, and every card sits in one stage of the Fool's Journey. That stage is orientation, a way to know where you're standing. It's no verdict on how your day goes. The card fixes the spot; what you do there is still yours.",
      },
    ],
    pinterestQuotes: [
      {
        eyebrow: "The Tarot Wheel in Three Stages",
        quote: "The 22 tarot Major Arcana are one story, and it runs in three stages: Initiation, Testing, Reckoning.",
        pinTitle: "The Tarot Wheel in Three Stages (The Fool's Journey)",
        description:
          "The 22 Major Arcana move through three stages of the Fool's Journey: Initiation (cards 0-7), Testing (8-14), and Reckoning (15-21). What each stage means, and why the one your card sits in colors a reading.",
        keywords: "fools journey, major arcana stages, tarot wheel",
      },
      {
        eyebrow: "The Testing Stage",
        quote: "The middle of the tarot's Major Arcana, Strength through Temperance, is where the self meets what tries it.",
        pinTitle: "The Testing Stage of the Major Arcana",
        description:
          "In the Fool's Journey, the Major Arcana's middle seven cards, Strength through Temperance, are the Testing stage, where the self you built meets what it can't control. Why a card here asks what you're made of.",
        keywords: "tarot testing stage, major arcana meaning, fools journey",
      },
    ],
  },

  "tarot-birth-card": {
    slug: "tarot-birth-card",
    postTitle: "What Is Your Tarot Birth Card?",
    majorIndex: 19, // The Sun — the birth-card number (the 19 → Sun/Wheel/Magician case)
    blueskyQuotes: [
      {
        eyebrow: "What Is Your Tarot Birth Card?",
        quote: "Your birthday is a fixed thing, so the card it points to should be fixed too.",
        caption:
          "A tarot birth card is the Major Arcana card set by your birthday, yours for life. Your birthday is a fixed thing, so the card it points to should be fixed too. No shuffle, no draw, the same answer every time you ask.",
      },
      {
        eyebrow: "The Soul Card's Ceiling",
        quote: "Your Soul card can only ever be one of the first nine. The whole back half of the deck is out of reach.",
        caption:
          "The usual method reduces your number to a single digit to find your Soul card, so it can only ever be one of the first nine Major Arcana. The Tower, the Star, the Moon, the World: none of them can be your Soul card.",
      },
      {
        eyebrow: "Why Birth Cards Feel Like Sun Signs",
        quote: "It rounds a world of people off toward a short list of types.",
        caption:
          "Because the calculation reduces every birthday toward the small end of the deck, it sorts everyone into a short list of types. That's why tarot birth cards can start to feel like sun signs: everyone slots into one of a handful.",
      },
      {
        eyebrow: "Portrait, or Angle",
        quote: "The Personality and Soul cards ask what kind of person you are. The Bearing asks where you stand.",
        caption:
          "There are two ways to read the card in your birthday. The Personality and Soul cards ask what kind of person you are, and answer from a short list. The Bearing asks where you stand in relation to the world, and answers with any card on the wheel. One is a portrait. The other is an angle.",
      },
    ],
    pinterestQuotes: [
      {
        eyebrow: "The Soul Card's Ceiling",
        quote: "Your Soul card can only ever be one of the first nine cards. The back half of the deck can't reach it.",
        pinTitle: "Why Your Tarot Soul Card Is Always One of Nine",
        description:
          "The standard tarot birth card method reduces your number to a single digit to find your Soul card, so it can only ever be one of the first nine Major Arcana. The Wheel of Fortune through the World can never be your Soul card.",
        keywords: "tarot birth card, tarot soul card, tarot personality card",
      },
      {
        eyebrow: "Two Ways to Read Your Birthday",
        quote: "One is a portrait. The other is an angle.",
        pinTitle: "Tarot Birth Card vs. Your Bearing",
        description:
          "Your tarot Personality and Soul cards ask what kind of person you are, from a short list of types. The Almanac's Bearing asks where you stand in relation to the world, and can be any of the 22 Major Arcana. One is a portrait, the other an angle.",
        keywords: "tarot birth card, tarot bearing, tarot numerology",
      },
    ],
    math: {
      eyebrow: "One Card From Your Birthday",
      dateLabel: "June 11",
      steps: ["6 + 11 = 17"],
      resultMajorIndex: 17, // The Star
      pinTitle: "How the Almanac Reads Your Birthday",
      description:
        "Instead of reducing your whole birthdate, the Almanac adds just your birth month and day and wraps around the 22-card wheel. June 11 gives 6 plus 11, which is 17, the Star.",
      keywords: "tarot birth card, tarot bearing, tarot numerology",
    },
  },
};

export function getBlogSocialContent(slug: string): BlogSocialContent | undefined {
  return BLOG_SOCIAL[slug];
}
