# Blog repo map — verified file locations & conventions

The exact wiring of the Tarot Almanac blog, surveyed from the live files. Read the
relevant section before you touch that part of the system. **If a file contradicts
this map, the file wins — fix the map in the same run.** When a list here could go
stale (e.g. which render libs exist), the map says so and gives you the `ls`/`grep`
to re-check rather than trusting the list.

Repo root: `~/tarot-almanac`. Run commands from there.

- [Guardrail docs](#guardrail-docs)
- [Posts & the registry](#posts--the-registry)
- [Markdown rendering & inline figures](#markdown-rendering--inline-figures)
- [Illustrations: the render libs](#illustrations-the-render-libs)
- [Social assets & export](#social-assets--export)
- [The engine (for verifying numbers)](#the-engine-for-verifying-numbers)
- [Publish & deploy](#publish--deploy)

---

## Guardrail docs

Source of truth for voice, design, and math. **Not in the repo's `docs/`** — they
live in the Desktop handoff:

```
/Users/talibeesley/Desktop/TarotAlmanac/handoff/docs/
  TAROT_ALMANAC_VOICE_AND_TONE.md    ← the voice, hard rules, blocklist
  TAROT_ALMANAC_DESIGN_SYSTEM.md     ← palette, type, glyph sprite, pips
  TAROT_ALMANAC_CALCULATIONS.md      ← the settled math (verify formulas here)
  TAROT_ALMANAC_SITEMAP.md           ← page map (drifts; verify vs filesystem)
  TAROT_ALMANAC_BLUESKY_VOICE.md     ← social register for Bluesky captions
```

The repo also has its own `~/tarot-almanac/CLAUDE.md` (golden rules) and
`~/tarot-almanac/docs/{ROADMAP.md, social-calendar.md}`. `social-calendar.md` is
the Bluesky series reference; the blog's own idea backlog is `docs/BLOG_IDEAS.md`
(this skill maintains it).

## Posts & the registry

- **Post files:** `content/blog-NN-slug.md`. The leading `# Title` line is stripped
  at render time (`getPostHtml` in `lib/blog.ts`) and shown separately, so keep the
  H1 as the first line. GFM tables and raw HTML both render (see below).
- **Registry:** `lib/blog.ts`, the `BLOG_POSTS: BlogPostMeta[]` array. A post is
  **live** when its entry is uncommented and **dormant** when commented out (the
  `.md` can already exist). `BlogPostMeta` fields:

  ```
  slug, title, eyebrow,
  seoTitle?        // keyword-tuned <title>; falls back to title (~60 chars)
  description      // on-page standfirst; also the meta-description fallback
  metaDescription? // keyword-tuned SERP snippet (~155-160 chars)
  indexTeaser      // shorter blurb for the /blog index
  majorIndex       // 0-21; drives the post's glyph + element color
  file             // "blog-NN-slug.md"
  linkMap          // Record<exactLinkText, url> — resolves the post's "#" hrefs
  ```

- **linkMap / the "#" convention:** in the prose, write every cross-reference and
  the closing CTA as `[exact visible text](#)`. `lib/markdown.ts` rewrites each `#`
  to the URL keyed by that exact text in `linkMap`. A paragraph containing **only**
  a single link gets the `body-cta` button class (the bordered CTA button). So the
  closing `[Open The Tarot Almanac →](#)` on its own line becomes the button; keep
  its text identical to its `linkMap` key.
- To see current live posts and their maps: read `lib/blog.ts`. Dormant scaffolds
  sit at the bottom in a commented block.

## Markdown rendering & inline figures

- `lib/markdown.ts` runs remark → rehype with `remark-gfm`, `allowDangerousHtml`,
  and `rehype-raw`. That means **raw HTML in the `.md` is preserved**, which is how
  inline diagrams work. The source is trusted (authored by us), never user input.
- **Inline static SVG/image figure** (the simplest illustration): drop the asset in
  `public/` and embed:

  ```html
  <figure><img class="diagram" src="/your-diagram.svg" alt="…" /><figcaption>…</figcaption></figure>
  ```

  Example in the wild: `content/blog-04-what-is-a-tarot-bearing.md` embeds
  `/tarot-cycle-gap.svg`. You can also inline a literal `<figure><svg>…</svg></figure>`.

## Illustrations: the render libs

Satori/`next-og`-style React renderers that produce PNGs (social pins and larger
diagrams). The blog family is `lib/blog*Render.tsx`. **Re-list before use** — the
set grows per post:

```bash
ls lib/blog*Render.tsx
```

At survey time it included: `blogWheelRender`, `blogMathRender`,
`blogThreeFacesRender`, `blogNatalChartRender`, `blogRankComparisonRender`,
`blogShapeTextureRender`, `blogQuoteRender` (+ `blogGapHoldsRender`). Shared
helpers: `lib/ogFonts.ts` (Cormorant/Lato loading), `lib/shareGlyph.ts` +
`lib/shareRender.tsx` (the engraved glyph in Satori), `lib/pinterestRender.tsx`
(has `elementColorOnDark()` for WCAG-safe element colors on dark backgrounds).

**Diagram values must resolve live from `lib/almanac.ts`** at render time (pass a
real `y/m/d` and let `collectiveDayCard()` etc. compute the cards), never hand-typed
derived values — that's what keeps a diagram from drifting from the engine.

**Satori gotchas (learned the hard way):**
- `transform: undefined` **crashes** Satori — omit the key entirely instead of
  setting it undefined.
- `<line>` elements and `<g>` style inheritance misbehave; set attributes on each
  shape directly rather than relying on group inheritance. Put digit attributes on
  the element.
- Raw element colors fail contrast on dark backgrounds (ratios ~2); use
  `elementColorOnDark()`.
- Cormorant + Satori has a legacy-TTF spacing quirk around "You"/"Your" (cosmetic,
  unfixed) — don't chase it.

## Social assets & export

- **Content model:** `lib/blogSocialContent.ts`, one entry **keyed by post slug**.
  Holds the **4 Bluesky quote cards** and the **Pinterest** quote/diagram pins.
  Read the interfaces at the top of the file (`BlogQuote`, `BlogPinterestQuote`,
  `BlogWheelDiagram`, `BlogMathExample`, `BlogShapeTextureDiagram`,
  `BlogRankComparison…`) and add types if a new post needs a genuinely new diagram
  shape. Covers the 5 published posts at survey time; new posts append here.
- **Quotes are pulled from the post's own prose**, trimmed only enough to stand
  alone. Do not write new reading copy here (CLAUDE.md rule).
- **Captions:** `lib/blogSocialCaption.ts` appends the URL + hashtag; don't bake
  those into the content file.
- **Bluesky ships as 4 SEPARATE standalone posts, not a carousel** (owner-confirmed).
  Every card + caption must work with none of the other three visible.
- **Pinterest** pins are 1000×1500; each carries its own SEO `pinTitle` /
  `description` / `keywords`.
- **Render/export:** `app/studio/blog-social/preview/route.tsx` renders the images;
  studio routes are owner-gated via `lib/studioAuth.ts`. The established export
  workflow (not an automated tool): assemble an **Artifact gallery** for owner
  review, then copy the PNGs + a `captions.txt` to `~/Downloads` for manual posting.

## The engine (for verifying numbers)

`lib/almanac.ts` is the live engine. Verify any number in a post against it with a
quick node script rather than trusting memory. Key exports: `mod22`,
`collectiveDayCard` (and the personal/collective column functions),
`phaseBand(major)` → `"Initiation"` (0–7) | `"Testing"` (8–14) | `"Reckoning"`
(15–21), `moonFraction`. The Bearing is `mod22(birthMonth + birthDay)`. Card data:
`lib/cards.ts` reads `content/cards/*.json` (all 78) — that's where authored card
essences/meanings come from, to quote verbatim.

## Publish & deploy

1. Uncomment the post's entry in `lib/blog.ts`.
2. Confirm `linkMap` has a key for **every** `#` link in the prose (a missing key
   leaves a dead `#`).
3. Normal deploy: `git add` → commit → push → Vercel (Squarespace DNS).
4. Wire any now-resolvable references from other pages (month pages, natal chart)
   that were waiting on this post to go live.
