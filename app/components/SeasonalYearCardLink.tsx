import Link from "next/link";
import { seasonalYearPost } from "@/lib/yearCard";

// Seasonal cross-link to the upcoming-year explainer post. Renders nothing outside
// its window (see lib/yearCard.ts seasonalYearPost). Anchor text deliberately carries
// the "<year> tarot year card" phrase, pointing high-traffic surfaces at the page-1
// blog during the year-ahead search spike. `className`/`style` let each surface place
// it in its own type scale.
export default function SeasonalYearCardLink({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const post = seasonalYearPost();
  if (!post) return null;
  return (
    <p className={className} style={style}>
      Looking ahead? The collective card for {post.year} is {post.card}.{" "}
      <Link href={post.href} style={{ color: "var(--indigo)" }}>
        See the {post.year} tarot year card &rarr;
      </Link>
    </p>
  );
}
