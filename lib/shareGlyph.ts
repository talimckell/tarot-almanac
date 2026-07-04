// Parses public/major-arcana-icons.svg into plain data (viewBox + element list) so
// share-image routes (next/og's ImageResponse, rendered by Satori) can draw each glyph
// as a self-contained <svg>. Satori doesn't resolve <use href="#id">/<symbol> the way a
// browser does, so every glyph needs its own inlined shapes — this is the one place that
// parsing happens, read once and cached the same way app/components/IconSprite.tsx reads
// the sprite for the live DOM.
import { readFileSync } from "node:fs";
import { join } from "node:path";

export interface GlyphShape {
  tag: "path" | "circle" | "line" | "rect" | "ellipse" | "polygon" | "polyline";
  attrs: Record<string, string>;
}

export interface GlyphData {
  viewBox: string;
  shapes: GlyphShape[];
}

const ATTR_MAP: Record<string, string> = {
  "stroke-width": "strokeWidth",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "fill-rule": "fillRule",
};

function parseAttrs(attrString: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  // Attribute names can contain digits (x1, y1, x2, y2) — excluding them silently dropped
  // every <line> coordinate, which is why line-based glyphs rendered blank.
  const re = /([a-zA-Z][a-zA-Z0-9-]*)="([^"]*)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(attrString))) {
    attrs[ATTR_MAP[m[1]] ?? m[1]] = m[2];
  }
  return attrs;
}

const SHAPE_TAGS = new Set(["path", "circle", "line", "rect", "ellipse", "polygon", "polyline"]);

let cache: Map<string, GlyphData> | null = null;

// Some symbols wrap their shapes in a <g> that carries the shared presentation attributes
// (stroke, stroke-width, ...). Walk the markup in order, keeping a stack of group attrs,
// so each shape inherits them (its own attrs win). Without this, grouped glyphs — e.g. the
// Star (ma-17) — parse as shapes with no stroke and render invisibly.
function parseInner(inner: string): GlyphShape[] {
  const shapes: GlyphShape[] = [];
  const groupStack: Record<string, string>[] = [];
  const tokenRe = /<(\/?)([a-zA-Z]+)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)>/g;
  let tk: RegExpExecArray | null;
  while ((tk = tokenRe.exec(inner))) {
    const [, closing, tag, attrString] = tk;
    if (tag === "g") {
      if (closing) groupStack.pop();
      else groupStack.push(parseAttrs(attrString));
      continue;
    }
    if (!SHAPE_TAGS.has(tag)) continue;
    const merged: Record<string, string> = {};
    for (const g of groupStack) Object.assign(merged, g);
    Object.assign(merged, parseAttrs(attrString));
    // Satori doesn't render <line> — rewrite each as an equivalent stroked <path> (which
    // it does render). fill:none keeps the zero-area path from picking up a default fill.
    if (tag === "line") {
      const { x1, y1, x2, y2, ...rest } = merged;
      shapes.push({ tag: "path", attrs: { d: `M${x1} ${y1} L${x2} ${y2}`, fill: "none", ...rest } });
      continue;
    }
    shapes.push({ tag: tag as GlyphShape["tag"], attrs: merged });
  }
  return shapes;
}

function loadSprite(): Map<string, GlyphData> {
  if (cache) return cache;
  const svg = readFileSync(join(process.cwd(), "public", "major-arcana-icons.svg"), "utf-8");
  const parsed = new Map<string, GlyphData>();
  const symbolRe = /<symbol id="([^"]+)" viewBox="([^"]+)">([\s\S]*?)<\/symbol>/g;
  let sm: RegExpExecArray | null;
  while ((sm = symbolRe.exec(svg))) {
    const [, id, viewBox, inner] = sm;
    parsed.set(id, { viewBox, shapes: parseInner(inner) });
  }
  cache = parsed;
  return parsed;
}

export function getGlyph(id: string): GlyphData | undefined {
  return loadSprite().get(id);
}
