// A per-Bearing version of the blog's "Tarot Cycle" wheel (public/tarot-cycle-gap.svg),
// generated instead of copied so it can highlight this page's own Bearing number and
// distance band (min(B, 22-B)) rather than always illustrating the Moon example.
// Position math verified against the static SVG's own coordinates.
const CENTER = 250;
const RING_R = 180;
const ARC_R = 202;
const LABEL_R = 222;

function pointOnRing(index: number, radius: number) {
  const angle = ((-90 + index * (360 / 22)) * Math.PI) / 180;
  return { x: CENTER + radius * Math.cos(angle), y: CENTER + radius * Math.sin(angle) };
}

export default function TarotCycleGap({ bearingIndex }: { bearingIndex: number }) {
  const hasGap = bearingIndex !== 0;
  const distance = Math.min(bearingIndex, 22 - bearingIndex);

  // The short-way arc between position 0 and the Bearing: direct if the Bearing is
  // in the first half of the wheel, wrapping past 21 back to 0 otherwise.
  const arcStartIdx = bearingIndex <= 11 ? 0 : bearingIndex;
  const arcEndIdx = bearingIndex <= 11 ? bearingIndex : 22; // index 22 shares position 0's angle
  const arcStart = pointOnRing(arcStartIdx, ARC_R);
  const arcEnd = pointOnRing(arcEndIdx, ARC_R);
  const labelPoint = pointOnRing((arcStartIdx + arcEndIdx) / 2, LABEL_R);

  return (
    <svg
      viewBox="0 0 500 500"
      role="img"
      aria-label={
        hasGap
          ? `The 22-card wheel showing this Bearing ${distance} step${distance === 1 ? "" : "s"} from the Fool at the in-step point.`
          : "The 22-card wheel showing this Bearing at the Fool, with no gap to the in-step point."
      }
    >
      <circle cx={CENTER} cy={CENTER} r={RING_R} fill="none" stroke="var(--warm-stone)" strokeWidth={1} />

      {hasGap && (
        <>
          <path
            d={`M ${arcStart.x.toFixed(1)} ${arcStart.y.toFixed(1)} A ${ARC_R} ${ARC_R} 0 0 1 ${arcEnd.x.toFixed(1)} ${arcEnd.y.toFixed(1)}`}
            fill="none"
            stroke="var(--indigo)"
            strokeWidth={2}
            strokeDasharray="2 5"
            strokeLinecap="round"
          />
          <text
            x={labelPoint.x.toFixed(1)}
            y={labelPoint.y.toFixed(1)}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="var(--serif)"
            fontStyle="italic"
            fontSize={15}
            fill="var(--indigo)"
          >
            {distance} step{distance === 1 ? "" : "s"}
          </text>
        </>
      )}

      {Array.from({ length: 22 }).map((_, i) => {
        const p = pointOnRing(i, RING_R);
        const isBearing = i === bearingIndex;
        const isInStep = i === 0 && !isBearing;
        const r = isBearing ? 13 : isInStep ? 11 : 8;
        return (
          <g key={i}>
            <circle
              cx={p.x.toFixed(1)}
              cy={p.y.toFixed(1)}
              r={r}
              fill={isBearing ? "var(--indigo)" : isInStep ? "var(--warm-stone)" : "none"}
              stroke={isInStep ? "var(--warm-stone)" : "var(--indigo)"}
              strokeWidth={1.2}
            />
            <text
              x={p.x.toFixed(1)}
              y={p.y.toFixed(1)}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="var(--serif)"
              fontSize={isBearing || isInStep ? 13 : 11}
              fill={isBearing ? "var(--stone)" : isInStep ? "var(--ink)" : "var(--label)"}
            >
              {i}
            </text>
          </g>
        );
      })}

      <text x={CENTER} y={234} textAnchor="middle" fontFamily="var(--serif-sc)" fontSize={17} letterSpacing={2.5} fill="var(--label)">
        THE TAROT CYCLE
      </text>
      <text x={CENTER} y={258} textAnchor="middle" fontFamily="var(--serif)" fontStyle="italic" fontSize={17} fill="var(--charcoal)">
        {hasGap ? "your gap, measured" : "no gap at all"}
      </text>
      <text x={CENTER} y={280} textAnchor="middle" fontFamily="var(--serif)" fontStyle="italic" fontSize={17} fill="var(--charcoal)">
        {hasGap ? "to the in-step point" : "you meet the world directly"}
      </text>
    </svg>
  );
}
