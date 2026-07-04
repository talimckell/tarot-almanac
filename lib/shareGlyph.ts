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
  const re = /([a-zA-Z-]+)="([^"]*)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(attrString))) {
    attrs[ATTR_MAP[m[1]] ?? m[1]] = m[2];
  }
  return attrs;
}

let cache: Map<string, GlyphData> | null = null;

function loadSprite(): Map<string, GlyphData> {
  if (cache) return cache;
  const svg = readFileSync(join(process.cwd(), "public", "major-arcana-icons.svg"), "utf-8");
  const parsed = new Map<string, GlyphData>();
  const symbolRe = /<symbol id="([^"]+)" viewBox="([^"]+)">([\s\S]*?)<\/symbol>/g;
  let sm: RegExpExecArray | null;
  while ((sm = symbolRe.exec(svg))) {
    const [, id, viewBox, inner] = sm;
    const shapes: GlyphShape[] = [];
    const elRe = /<(path|circle|line|rect|ellipse|polygon|polyline)\s+([^>]*?)\/?>/g;
    let em: RegExpExecArray | null;
    while ((em = elRe.exec(inner))) {
      const [, tag, attrString] = em;
      shapes.push({ tag: tag as GlyphShape["tag"], attrs: parseAttrs(attrString) });
    }
    parsed.set(id, { viewBox, shapes });
  }
  cache = parsed;
  return parsed;
}

export function getGlyph(id: string): GlyphData | undefined {
  return loadSprite().get(id);
}
