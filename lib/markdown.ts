import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import type { Root, Link, Paragraph } from "mdast";
import type { Plugin } from "unified";

// The authored posts use "#" as a placeholder href for two kinds of links: an
// end-of-post call-to-action ("Find your Bearing →") and inline cross-references
// ("its own piece"). This resolves those placeholders to real site URLs, keyed by
// the link's exact visible text — the prose itself is never touched.
function remarkResolvePlaceholderLinks(linkMap: Record<string, string>): Plugin<[], Root> {
  return () => (tree: Root) => {
    visit(tree, "paragraph", (paragraph: Paragraph) => {
      const soloLink =
        paragraph.children.length === 1 && paragraph.children[0].type === "link"
          ? (paragraph.children[0] as Link)
          : null;

      visit(paragraph, "link", (link: Link) => {
        if (link.url !== "#") return;
        const text = link.children
          .map((c) => ("value" in c ? c.value : ""))
          .join("")
          .trim();
        const resolved = linkMap[text];
        if (resolved) link.url = resolved;

        // A paragraph containing nothing but a single link is the mockups' CTA-button
        // pattern (e.g. "[Find your Bearing →](#)" on its own line). Tag it so it can
        // get the bordered-button treatment instead of a plain inline link.
        if (link === soloLink) {
          link.data = { ...link.data, hProperties: { className: ["body-cta"] } };
        }
      });
    });
  };
}

export async function renderMarkdown(
  source: string,
  linkMap: Record<string, string> = {}
): Promise<string> {
  const file = await remark()
    .use(remarkGfm)
    .use(remarkResolvePlaceholderLinks(linkMap))
    // The posts embed raw HTML (the wheel-diagram <figure><svg>...</svg></figure>
    // blocks); allowDangerousHtml + rehype-raw preserve it. Safe here because the
    // source is our own authored content, never user input.
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(source);
  return String(file);
}
