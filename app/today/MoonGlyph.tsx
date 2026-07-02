// The moon's illuminated silhouette at an exact fraction through the synodic month,
// ported from today-new-layout.html's moonSVG() — a continuous phase, not snapped to
// the 8 discrete labels used elsewhere (e.g. the homepage's "today's entry" card).
export default function MoonGlyph({ frac }: { frac: number }) {
  const r = 10;
  const theta = frac * 2 * Math.PI;
  const f = (1 - Math.cos(theta)) / 2;
  const waxing = frac < 0.5;
  const rx = (r * Math.abs(Math.cos(theta))).toFixed(3);
  const gibbous = f > 0.5;
  const sweepOuter = waxing ? 1 : 0;
  const sweepTerm = waxing ? (gibbous ? 1 : 0) : gibbous ? 0 : 1;

  return (
    <svg viewBox="0 0 22 22" aria-hidden="true">
      <circle cx="11" cy="11" r="10" fill="var(--indigo)" />
      {f > 0.98 && <circle cx="11" cy="11" r="10" fill="var(--warm-stone)" />}
      {f >= 0.02 && f <= 0.98 && (
        <path
          d={`M11 1 A10 10 0 0 ${sweepOuter} 11 21 A${rx} 10 0 0 ${sweepTerm} 11 1 Z`}
          fill="var(--warm-stone)"
        />
      )}
    </svg>
  );
}
