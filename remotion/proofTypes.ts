// Serializable props for the BearingProof composition (Scene 4 of the tarot-birth-chart
// pillar video). Like ShortProps, everything the composition needs — the year-by-year
// rows plus each card's pre-parsed Major glyph — is assembled Node-side by
// lib/bearingProofProps.ts (which can touch the sprite file) and passed in as plain JSON,
// because the composition runs in a browser context with no node:fs.
import type { ShortGlyph } from "./types";

export interface ProofCard {
  /** Full Major name, e.g. "The Moon". */
  name: string;
  glyph: ShortGlyph;
}

export interface ProofRow {
  year: number;
  /** The viewer's personal year card. */
  you: ProofCard;
  /** The collective (world's) year card. */
  world: ProofCard;
  /** The fixed gap, mod22(personal - collective) — identical on every row. */
  gap: number;
}

// Optional voice-over sync: when present, the composition plays this audio track and
// drives every beat off these timestamps (seconds) instead of its own synthetic pacing.
// Derived from a scratch VO by transcribing word timings (whisper) and reading off when
// each cue is spoken — see scripts/assembleBearingProof.ts. Re-syncing after a re-record
// is just new numbers here; the composition never changes.
export interface ProofSync {
  /** Filename in remotion/public, e.g. "scene4-vo.m4a". */
  audio: string;
  /** Second each row lands, one per row, in order. */
  rowStarts: number[];
  /** Second the gap column lights up ("look down the last column"). */
  glowStart: number;
  /** Second the napkin shortcut resolves. */
  napkinStart: number;
  /** Total scene length in seconds (usually the VO length plus a short tail). */
  total: number;
}

// A type alias (not an interface) for the same reason ShortProps is: Remotion's
// <Composition> needs props assignable to Record<string, unknown>.
export type BearingProofProps = {
  /** "February 16" — the birthday driving the whole table. */
  dateLabel: string;
  /** The Bearing card name, e.g. "The Moon". */
  bearingName: string;
  /** The Bearing index / the gap that holds, e.g. 18. */
  bearingIndex: number;
  /** The napkin shortcut, e.g. "2 + 16 = 18". */
  napkin: string;
  rows: ProofRow[];
  /** Present only for the VO-synced cut; absent for the silent synthetic-timing POC. */
  sync?: ProofSync;
};
