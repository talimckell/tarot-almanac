// Suit-level light/shadow, one plain-language line each, so a reader who knows nothing
// about tarot learns what a suit is when their week or month runs heavy on it. Synthesized
// from each suit's own authored minor cards (the essence + gift/shadow keywords across all
// fourteen) and blessed by Tali — not generic RWS. Element↔suit is the fixed system map:
// Fire→Wands, Water→Cups, Air→Swords, Earth→Pentacles (see lib/almanac.ts SUIT_BY_ELEMENT).
export interface SuitMeaning {
  element: string;
  light: string;
  shadow: string;
}

export const SUIT_MEANINGS: Record<string, SuitMeaning> = {
  Wands: {
    element: "fire",
    light:
      "Wands are the suit of fire: drive, creative spark, the will to begin things and push them forward. At their best they are momentum, vision, and the healthy friction of testing your strength against something.",
    shadow:
      "Their shadow is fire that scatters or scorches: burnout, pointless conflict, moving too fast to think, all spark and no follow-through.",
  },
  Cups: {
    element: "water",
    light:
      "Cups are the suit of water: feeling, connection, and imagination. At their best they are love and belonging, following the heart, and the courage to dream.",
    shadow:
      "Their shadow is water that pools or floods: escapism, fantasy over substance, clinging to the familiar, drifting into dissatisfaction.",
  },
  Swords: {
    element: "air",
    light:
      "Swords are the suit of air: thought, truth, and the clarity of a decision made. At their best they are honest perception, discernment, and the nerve to name what is real.",
    shadow:
      "Their shadow is air turned cold or cutting: bitterness, isolation behind walls, overthinking, truth used as a weapon.",
  },
  Pentacles: {
    element: "earth",
    light:
      "Pentacles are the suit of earth: the body, work, money, everything you build with your hands. At their best they are stability, craft, and the slow abundance of steady effort.",
    shadow:
      "Their shadow is earth turned heavy or hollow: greed, status obsession, scarcity thinking, security that has hardened into a cage.",
  },
};
