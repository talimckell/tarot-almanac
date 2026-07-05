// Plain constants only — no server-only imports (node:fs via shareGlyph.ts) — so this can
// be safely imported by client components (CollectiveStudio.tsx) without pulling the whole
// rendering chain into the browser bundle. campaignRender.tsx imports from here too.
export const TREATMENT_COUNT = 4;
export const TREATMENT_NAMES = ["affirmation", "essence", "keywords", "collective"] as const;
