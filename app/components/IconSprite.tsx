import { readFileSync } from "node:fs";
import { join } from "node:path";

// Inlines the Major Arcana + suit glyph sprite once, in-document, so <use href="#ma-0">
// works everywhere (cross-file <use> into an external .svg has spotty Safari support).
// Source of truth: public/major-arcana-icons.svg.
export default function IconSprite() {
  const svg = readFileSync(join(process.cwd(), "public", "major-arcana-icons.svg"), "utf-8");
  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
}
