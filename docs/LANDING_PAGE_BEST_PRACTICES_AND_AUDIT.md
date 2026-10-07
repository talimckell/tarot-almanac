# Landing-page best practices + audit of /tarot-birth-chart (2026-10-07)

Two parts: (1) a reusable checklist of landing-page best practices, aesthetic and
conversion, written for this brand; (2) an audit of the current birth-chart landing
page against it, with prioritized fixes.

---

## Part 1 — Landing-page best practices

### A. Message & structure (conversion)
1. **One page, one job, one primary action.** Every section should push toward a single
   CTA (here: build your chart, $12 / subscribe). Secondary links are fine but must not
   compete visually with the primary action.
2. **Lead with the outcome, not the mechanism.** The first thing a visitor reads should
   say what they *get* ("understand why you're the way you are"), not what the thing *is*
   ("a natal chart built from your birthday"). Mechanism comes second.
3. **Value before ask.** Let people experience something real before the paywall. A free,
   personalized moment (see *their* result, not just an example) converts far better than
   a cold "$12 buy" on a page that only shows someone else's result.
4. **Show the product.** A picture of the actual thing beats description. The real artifact,
   above the fold if possible, is the highest-trust element on the page.
5. **Match the visitor's intent and search term.** The H1 and meta should echo the query
   ("tarot birth chart / natal chart"). Keeps SEO and relevance tight.
6. **Repeat the CTA at every decision point.** Top, after the main value payoff, and at the
   close — as real buttons, not just links, so a reader who's convinced never has to hunt.
7. **Handle objections inline.** FAQ / "how it works" / "is this like astrology" answer the
   doubts that stop a purchase, and double as SEO.
8. **Reduce perceived risk.** "Pay once, yours to keep," "no account needed to look,"
   secure-checkout language, and (if offered) a guarantee.

### B. Trust & proof
9. **Social proof near the ask.** Testimonials, counts, ratings — placed at the decision
   point, not only buried at the bottom. Use what's real; don't fabricate volume.
10. **Payment/privacy reassurance** right where money or data is requested (Stripe secured,
    "we never see your card," "your birth date is only used to build your chart").
11. **Credibility cues:** consistent brand, real author/voice, no stock-photo filler.

### C. Aesthetic & UX
12. **Clear visual hierarchy:** one dominant headline, one dominant button, generous
    whitespace, a deliberate reading path. The eye should always know where to go next.
13. **Break up long prose.** Walls of text lose readers; use the product visual, grouped
    value props, iconography, and short scannable blocks.
14. **Consistent, on-brand components.** One button style, one input style, design-system
    color/type throughout. No native/system controls that break the look.
15. **Above-the-fold earns the scroll.** The first screen should carry the hook, the proof-
    of-product, and the primary CTA — enough that someone who never scrolls still gets it.
16. **Mobile-first.** Tap targets, stacked layout, no horizontal scroll, controls that work
    in in-app webviews (selects, not native date pickers).
17. **Fast + accessible:** real text (not images of text), labelled controls, legible
    contrast, no layout shift.

### D. Measurement
18. **One primary conversion event**, instrumented, with CTA placements distinguished (we
    already pass a `location` on checkout forms). Watch which placement drives intent.

---

## Part 2 — Audit of /tarot-birth-chart

### What the page does well
- **SEO-tight**: keyword-aligned H1/meta/canonical, plus Article + FAQPage + Service
  structured data. Strong foundation; it's already climbing (~pos 12 and rising).
- **Shows the real product**: the live `ChartDiagram` (two columns + central Bearing) is a
  distinctive, high-trust visual and the page's best asset.
- **Benefit-led body copy** in Tali's voice ("It explains you," "It makes sense of your
  contradictions"). Objection-handling FAQ. Clean, on-brand aesthetic.
- **CTAs now repeat** as real buttons at three decision points (hero, after value props,
  close), consistent `.btn-primary` / inverted variant. (Fixed 2026-10-07.)
- **Trust/risk** language present: "Secured by Stripe · Pay once, yours to keep," a real
  testimonial, a free full-sample link.
- **Mobile-safe**, on-brand components throughout.

### Gaps, highest-impact first

**1. No value-first, personalized moment (biggest lever).**
The page shows *someone else's* example chart (Feb 16 1984) and jumps straight to "$12
build." The sibling pages (`/tarot-birth-card`, `/personal-year-card`) put a *free instant
calculator* above the fold and convert curiosity into engagement first. We now have the
infrastructure to do the same for charts: the no-auth `/chart` preview (enter birthday →
see YOUR locked chart, Bearing named, six positions locked). 
→ **Recommend:** put a birthday entry right in/under the hero ("See your own chart free —
no account"), flowing into the `/chart` preview. Let them meet *their* chart, then the $12
unlock is a warm ask, not a cold one. This is the single change most likely to move
conversion.

**2. Hero is text-only; the product sits below the fold.**
The strongest asset (the chart diagram) is one screen down. Above the fold is glyph +
headline + button only.
→ **Recommend:** bring the product into the first screen — either the live preview from #1,
or a scaled chart visual beside/under the hook so the first screen proves what they get.

**3. Hero subhead leads with mechanism, not outcome.**
"a natal chart, built from your birthday" describes; it doesn't sell the payoff.
→ **Recommend:** lead with the outcome, e.g. "Seven cards from your birthday that explain
why you're the way you are." Keep "built from your birthday / no birth time" as the second
line.

**4. Social proof is thin and low.**
One testimonial, near the bottom. (n=1 is the real constraint — don't fabricate.)
→ **Recommend:** move the one testimonial up near the hero or the first CTA as well, and as
more reviews come in, add a second near the primary button. A single honest quote at the
decision point beats a wall of invented ones.

**5. Long single-column prose in the middle.**
"What your birth chart gives you" (6 props) and "What each position means" (7 positions)
are text-heavy.
→ **Recommend:** make the six value props scannable (short cards / icons / the engraved
glyphs), and consider pairing the position explanations with the diagram positions visually.

**6. Risk reversal could be stronger.**
"Pay once, yours to keep" is good; there's no guarantee.
→ **Recommend (optional):** if you're comfortable offering it, a simple "not what you
hoped? email us" line lowers the bar. Skip if it doesn't fit the brand.

### Suggested priority order
1. Add the free personalized chart preview entry in the hero (value-first). *(High effort,
   highest payoff — leverages the `/chart` preview we just built.)*
2. Bring the product visual / preview above the fold. *(Pairs with #1.)*
3. Rewrite the hero subhead to lead with the outcome. *(Low effort.)*
4. Add/raise a testimonial near the primary CTA. *(Low effort.)*
5. Make the value-props section scannable. *(Medium.)*

### Not recommended
- Fabricated review counts, star ratings, or urgency/scarcity timers — off-brand and
  risky. Grow proof honestly.
- More competing CTAs or a second offer on the page — keep the one job.
