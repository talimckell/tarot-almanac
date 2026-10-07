import Link from "next/link";

// Reusable "build your chart" CTA for the birth-chart landing page. One button
// style (the design-system .btn-primary) used at every decision point on the
// page, so the CTA is obvious and consistent wherever a reader stops.
export default function ChartCtaButton({
  label = "Build your birth chart · $12 →",
  sub,
  margin = "10px 0 4px",
  variant = "primary",
}: {
  label?: string;
  sub?: React.ReactNode;
  margin?: string;
  variant?: "primary" | "onDark";
}) {
  return (
    <div style={{ textAlign: "center", margin }}>
      <Link href="/chart" className={variant === "onDark" ? "btn-on-dark" : "btn-primary"}>
        {label}
      </Link>
      {sub && (
        <p className="dates" style={{ marginTop: 10 }}>
          {sub}
        </p>
      )}
    </div>
  );
}
