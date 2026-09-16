// Pure design-token module: the share-image palette + element mapping with no Node
// dependencies, so browser-bundled consumers (the Remotion compositions in /remotion)
// can import it directly. lib/shareRender.tsx re-exports everything here, so existing
// imports are unaffected — this is the single source for these values.
export const COLORS = {
  stone: "#f6f2eb",
  vellum: "#e8e0d0",
  warmStone: "#b8a890",
  label: "#5f5648",
  charcoal: "#4a3e30",
  ink: "#2e2418",
  indigo: "#1e3a58",
  indigoMid: "#2e5478",
  fire: "#b4371f",
  water: "#2a5c7a",
  air: "#785e19",
  earth: "#3a5a38",
} as const;

export type ElementName = "fire" | "water" | "air" | "earth";

export function elementColor(el: ElementName): string {
  return COLORS[el];
}
