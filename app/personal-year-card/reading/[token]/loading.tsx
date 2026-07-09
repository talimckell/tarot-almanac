import SiteNav from "../../../components/SiteNav";
import Footer from "../../../components/Footer";
import "../../styles.css";

// Shown while the reading generates on first view (one AI call, ~30-45s), then never again.
export default function Loading() {
  return (
    <>
      <SiteNav />
      <main className="pyc-wrap" style={{ textAlign: "center", paddingTop: 120 }}>
        <p className="pyc-eyebrow">Reading the year</p>
        <h1 className="pyc-h1" style={{ marginBottom: 18 }}>Weaving your reading</h1>
        <p className="pyc-lede" style={{ margin: "0 auto" }}>
          The cards are set. We&rsquo;re writing the year around them, which takes a moment. This page
          will fill in on its own.
        </p>
      </main>
      <Footer />
    </>
  );
}
