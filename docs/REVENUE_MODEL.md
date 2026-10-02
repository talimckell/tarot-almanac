# Revenue model — scenarios (built 2026-10-02)

Scenario model, not a forecast. It multiplies three uncertain things — traffic growth × conversion ×
subscription retention — so the bands are enormous (200× between conservative and optimistic at Yr 5).
**Update the assumptions as real conversion/retention data comes in; that's the point of this file.**

Revenue = $12 one-time chart + $7/mo subscription + display ads. (Ads included only to show they never
matter — see the Mediavine verdict at the bottom.)

## Projected annual revenue

| Scenario | Year 1 | Year 3 | Year 5 |
|---|---|---|---|
| Conservative | ~$800 | ~$1,500 | ~$2,300 |
| Realistic | ~$4,600 | ~$18,600 | ~$37,000 |
| Optimistic | ~$38,000 | ~$188,000 | ~$470,000 |

## Assumptions (the levers — argue with these)

| | Monthly sessions Yr1/Yr3/Yr5 | Chart conv. | Sub conv. | Sub retention | Ad RPM |
|---|---|---|---|---|---|
| Conservative | 2k / 4k / 6k | 0.2% | 0.03% | 3 mo | $1.50 |
| Realistic | 5k / 20k / 40k | 0.4% | 0.08% | 5 mo | $1.50 |
| Optimistic | 12k / 60k / 150k | 0.7% | 0.25% | 10 mo | $2.00 |

Funnel math (per month): chart rev = sessions × chart_conv × $12; sub rev = (sessions × sub_conv ×
retention_months) × $7 [active subs via Little's law]; ad rev = sessions × RPM / 1000.

Worked example — Realistic Yr 3 (20k sessions/mo): 80 chart buyers × $12 = $960; 16 new subs → 80
active × $7 = $560; ads $30 → ~$1,550/mo → ~$18,600/yr.

## Honest caveats (2026-10-02)

- **The one real data point sits BELOW conservative.** 1 sale / ~1,000 recent sessions ≈ 0.1% — under
  the 0.2% conservative chart assumption. One sale is too few to estimate a rate, and the funnel is
  being worked on, but don't treat conservative as a hard floor; 0.1% is lower.
- **The subscription is the swing factor AND the least-proven input.** Sub revenue overtakes chart
  revenue as traffic scales (Yr3 Realistic, Yr1 Optimistic). The gap between "side income" and "real
  business" is entirely sub conversion × retention — and we have ~zero proven subscription data. Upside
  lives in the component we know least about. The $12 chart is the more reliable, smaller line.
- **Traffic numbers are plausible but uncertain.** The current trajectory could hit Realistic's traffic;
  whether Yr5 lands at ~$37k or ~$2k is almost entirely a conversion/retention question, not a traffic one.

## What to measure now (replaces chasing the Journey %)

1. **Conversion:** does visitor→purchase climb from ~0.1% toward 0.4%+ as the funnel is worked?
2. **Retention:** does anyone subscribe, and do they stay? A handful of sticky $7/mo subs moves Yr3+ more
   than any traffic gain.

## Mediavine / display-ads verdict: SETTLED NO

Ads are a rounding error in every scenario ($3–300/mo; ~0.8% of revenue even in the $470k optimistic
case). Evidence: Name Report (a normal baby-names niche, not a woo problem) earns **$0.63 RPM / $3.54 a
month on 5,619 sessions** — because high-bounce lookup content earns ~nothing on display ads regardless
of topic, and TA is the same content shape. Worse than pointless: on a conversion-driven site, display
ads clutter the page, cheapen trust, and would likely cannibalize more chart/sub conversion than the
pennies they earn — **net negative.** Don't pursue Mediavine. Track the Journey % only as a
traffic-health proxy, never as a revenue goal.
