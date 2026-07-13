import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "../../components/SiteNav";
import Footer from "../../components/Footer";
import { BLOG_POSTS, getPostMeta, getPostHtml } from "../../../lib/blog";
import { SITE_URL } from "../../../lib/site";
import styles from "./page.module.css";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = getPostMeta(slug);
  if (!meta) return {};
  const title = `${meta.seoTitle ?? meta.title} | The Tarot Almanac`;
  const description = meta.metaDescription ?? meta.description;
  const url = `${SITE_URL}/blog/${meta.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article" },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = getPostMeta(slug);
  if (!meta) notFound();

  const html = await getPostHtml(meta);
  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== meta.slug);

  return (
    <>
      <SiteNav />

      <article className={styles.article}>
        <div className={styles.crumb}>
          <Link href="/how-it-works">How it works</Link> &nbsp;/&nbsp;{" "}
          <Link href="/blog">The Blog</Link>
        </div>

        <header className={styles.postHead}>
          <svg className={styles.postMark} viewBox="0 0 56 56" width="34" height="34" aria-hidden="true">
            <path d="M28 7 L32.5 23.5 L49 28 L32.5 32.5 L28 49 L23.5 32.5 L7 28 L23.5 23.5 Z" fill="var(--indigo)" />
          </svg>
          <span className={styles.postEyebrow}>{meta.eyebrow}</span>
          <h1>{meta.title}</h1>
          <p className={styles.postStandfirst}>{meta.description}</p>
        </header>

        <div className={styles.body} dangerouslySetInnerHTML={{ __html: html }} />

        <div className={styles.endmark}>
          <svg viewBox="0 0 56 56" fill="currentColor" width="13" height="13">
            <path d="M28 7 L32.5 23.5 L49 28 L32.5 32.5 L28 49 L23.5 32.5 L7 28 L23.5 23.5 Z" />
          </svg>
        </div>

        {otherPosts.length > 0 && (
          <div className={styles.keep}>
            <div className={styles.keepH}>Keep reading</div>
            {otherPosts.map((p) => (
              <Link className={styles.keepPost} href={`/blog/${p.slug}`} key={p.slug}>
                <span className={styles.kt}>{p.title}</span>
                <span className={styles.kd}>{p.indexTeaser}</span>
              </Link>
            ))}
          </div>
        )}

        <div className={styles.postCapture}>
          <div className={styles.pcText}>
            <div className={styles.pcH}>New pieces, now and then</div>
            <div className={styles.pcSub}>A note when there&rsquo;s something new worth reading, free on Substack.</div>
          </div>
          <a
            className={styles.pcBtn}
            href="https://tarotalmanac.substack.com/subscribe"
            target="_blank"
            rel="noopener noreferrer"
          >
            Subscribe on Substack
          </a>
        </div>
      </article>

      <Footer />
    </>
  );
}
