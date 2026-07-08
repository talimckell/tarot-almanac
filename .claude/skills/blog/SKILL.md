---
name: blog
description: >
  Run the Tarot Almanac blog production pipeline for tarotalmanac.com. Use this
  whenever the user wants to plan, research, draft, illustrate, review, or ship a
  blog post, including choosing the next topic, doing keyword/SEO research,
  writing a post in Tali's voice, making a post's Bluesky/Pinterest social images,
  or registering/publishing an entry in lib/blog.ts. Trigger even when the user
  doesn't say "skill": e.g. "draft this blog post", "what should the next post
  be?", "make the social images for the Bearing post", "add illustrations to the
  three-stages piece", or any reference to content/blog-*.md or the dormant blog
  scaffolds. This is the source of truth for how the blog gets made, so prefer it
  over improvising the process.
---

# The Tarot Almanac blog pipeline

A blog post moves through six stages, in order, with a **hard stop for the owner
(Tali) between each one**. The stages are: Account, Search, Write, Illustrate,
Review, Post. You can enter at any stage the user names ("just make the social
images for post 5" starts at Illustrate), but never skip a gate silently: if you
start mid-pipeline, say which earlier stages you're assuming are done.

Two things govern everything below and override any instinct to move fast:

- **Verify against the actual files, never against docs or memory.** The sitemap,
  this skill, and half-remembered facts all drift. Before claiming a post exists,
  a formula is X, or a file lives at path Y, open it. This has burned the project
  repeatedly; it is the project's first golden rule.
- **Never invent card, Bearing, or reading copy.** Blog *prose* is authored fresh
  in Tali's voice. But card meanings, essences, and Bearing readings are Tali's
  work: quote them verbatim from `content/cards/*.json` or the card's own fields,
  never generate new ones. Social quotes come from the post's own prose, lightly
  trimmed to stand alone, not newly written.

Exact paths, entry shapes, and conventions live in
[references/repo-map.md](references/repo-map.md). Read it before touching files;
it is the verified survey so you don't re-derive the codebase each run. If
anything there contradicts the actual file, the file wins, and fix the map.

The repo is `~/tarot-almanac`. The guardrail docs (voice, design, calculations)
live in the Desktop handoff, path in the repo map. Confirm they still exist before
quoting them.

---

## Stage 1 — Account

Before deciding anything, take stock of what already exists, so a new post fills a
real gap instead of duplicating one.

- Read `lib/blog.ts`: which posts are **published** (uncommented entries) and which
  are **scaffolded but dormant** (commented-out entries with a matching
  `content/blog-*.md`). List them for the user.
- Skim the published posts' topics and their `seoTitle`/`linkMap` so you know what
  ground and which keywords are already covered, and what these posts could link
  *to* a new one.
- Open the guardrail docs (voice, design system, calculations) so the later stages
  are held to them. Do not proceed on memory of what they say.

Report the current state plainly, then move to Search.

## Stage 2 — Search (topic selection + SEO)

Ahrefs is not connected, so keyword work is done through the live web.

- Maintain **`docs/BLOG_IDEAS.md`**, a ranked backlog. If it doesn't exist, create
  it (format below). Each entry: candidate title, the search intent it serves, the
  head term + a couple of long-tail/question phrasings, a rough read on
  competition and content-gap, which existing posts would link to it, and a
  priority. Dormant scaffolds already in `lib/blog.ts` belong here too, marked
  in-flight.
- Use `WebSearch` to survey the real SERP for candidate topics and for the chosen
  post's terms: what ranks, the "People also ask" style questions, and how
  competitors frame the subject (their vocabulary matters for topical coverage).
  This is exactly the sweep that surfaced "three rows of seven / Outer-Inner-
  Spiritual World" for the arcana-stages post; acknowledging the standard framing
  is often worth a sentence, both for readers and for search.
- Thread the cornerstone term **"tarot numerology"** through titles and metas; it
  is the SEO spine of the whole site.
- **Gate:** bring the ranked backlog and your recommended next topic (or, if the
  topic is already chosen, the proposed `seoTitle`/`metaDescription` and the
  competitive-framing notes) to the owner and get a decision before writing.

`docs/BLOG_IDEAS.md` entry format:

```markdown
## [Working title]
- Status: idea | in-flight | published
- Intent: what the searcher wants
- Head term: the main phrase (+ 2-3 long-tail / question variants)
- Competition & gap: who ranks, what's missing we can own
- Internal links: existing posts that would point here
- Priority: high | medium | low — one line why
```

## Stage 3 — Write

Draft the prose fresh, in Tali's voice, held to the voice doc. The hard,
near-absolute rules (the reliable AI tells) are: **no em-dashes in prose** and
**no "not X but Y" / "isn't about X, it's about Y" seesaws.** Beyond those: stay
concrete over abstract (show with a lived, bodily example, never define in the
air), vary sentence length, break the rule-of-three drumbeat, drop the
signposting and the tidy-bow endings, and honor the forbidden-phrase blocklist and
AI-vocab watchlist in the voice doc. Write first in the voice, then do a review
pass against the rules; applied as a generation straitjacket they make copy
stilted.

- **Verify every number.** Any formula, card name, band, or date in the post must
  match the calculations doc and the live engine. Don't trust a worked example
  from memory; run a quick node check against `lib/almanac.ts` (`mod22`,
  `collectiveDayCard`, `phaseBand`, the Bearing formula). A miscount is a
  correctness bug, not a stylistic quibble.
- **Length:** match the sibling posts, roughly 1,000-1,600 words unless the topic
  argues otherwise.
- **Links:** write cross-references and the closing CTA as `[exact text](#)`, then
  register each exact link text in the entry's `linkMap` so it resolves. A
  paragraph that is nothing but a single link renders as the CTA button.
- **Register the entry** in `lib/blog.ts` (see repo map for the shape): `slug`,
  `title`, `seoTitle` (≈60 chars, leads with the fatedness/clarity and the head
  term), `metaDescription` (~155-160 chars), `description` (the on-page
  standfirst), `indexTeaser` (shorter, for the index), `majorIndex`, `file`,
  `linkMap`. New posts start **commented out**; publishing is a later, deliberate
  step.

## Stage 4 — Illustrate

Produce **2-3 figures per post**, chosen so each one also earns its place as a
social asset. Decide **per figure** which of two paths fits; a post can mix them.

**Schematic-diagram path (default, reuses infrastructure).** Best when the point
is a structure the reader can check: a wheel, a band arc, a math walk, a
comparison. These live inline in the post as `<figure>` blocks and double as
Pinterest diagram pins. Reuse the existing render family rather than inventing a
look: `lib/blog*Render.tsx`, with diagram values **resolved live from
`lib/almanac.ts`** so the picture can never drift from what the engine computes.
Mind the documented Satori gotchas (see repo map) — `transform: undefined` crashes
it, `<line>` and `<g>` inheritance misbehave, element colors need
`elementColorOnDark()` on dark backgrounds.

**Pictorial / artistic path.** Best when the point is atmosphere or an archetype a
schematic can't carry. This is not schematic and not yet a wired production line,
so produce a **detailed on-brand art brief**: subject and composition, the
engraved / woodcut register of the glyph sprite, the stone / vellum / indigo
palette plus the relevant element color, aspect ratios for both the inline figure
and the social crops, and a note on how it'll be made. Keep it in the design
system; don't introduce new tokens.

**Wire the social assets** into `lib/blogSocialContent.ts`: one entry keyed by the
post slug, holding the 4 standalone Bluesky quote cards and the Pinterest
quote/diagram pins. Quotes are pulled from the post's own prose, trimmed only
enough to stand alone. Captions go through `lib/blogSocialCaption.ts`. Remember
Bluesky ships as **4 separate standalone posts, not a carousel**, so each card and
caption must work with none of the others present.

## Stage 5 — Review (owner gate)

Hand the owner the whole package and **stop.** Do not proceed to Post on your own.

- The draft prose (rendered readably; the owner reads for voice, not diffs).
- An **Artifact gallery** of the images/diagrams so they can be eyeballed
  together, plus any art briefs for the pictorial path.
- The proposed `seoTitle` / `metaDescription` / captions.
- A short note of anything you're unsure about or any place you had to bend a rule.

Apply redlines, then re-present. Only a clear owner approval moves things forward.

## Stage 6 — Post (hand-off, not auto-post)

Assemble the ready-to-ship bundle and hand it to the owner. **Do not auto-post to
Bluesky, Pinterest, or anywhere** — social posting is outward-facing and stays a
human action, matching the current manual flow.

- To publish the post itself: uncomment its entry in `lib/blog.ts`, confirm the
  `linkMap` resolves every `#`, and follow the repo's normal deploy
  (`git add` → commit → push → Vercel).
- For social: export the images and copy the PNGs plus a `captions.txt` to
  `~/Downloads` (the studio/blog-social tooling in the repo map), and tell the
  owner exactly what posts where.
- If any earlier post references this topic (e.g. a month page or the natal chart
  pointing at "Initiation / Testing / Reckoning"), note those so their `#` links
  can be wired to the now-live post.

---

## Notes

- The whole thing is gated on purpose. Speed is not the goal; a correct, in-voice,
  verified post that the owner has actually approved is. When in doubt, stop and
  ask rather than push through a gate.
- If a stage reveals the repo map is stale, fix the map in the same run. It is only
  useful if it stays true.
