// Single source of truth for the cross-links every studio page shows at the top ("jump to
// another tool"). Before this, each new board meant hand-editing every existing page's link
// list — with 12 suit-based Pinterest boards still to come, add one entry here instead.
export interface StudioLink {
  href: string;
  label: string;
}

export const STUDIO_LINKS: StudioLink[] = [
  { href: "/studio/collective", label: "Collective Studio" },
  { href: "/studio/birthday-bearings", label: "Birthday Bearings Studio" },
  { href: "/studio/reclaimed-reversals", label: "Reclaimed Reversals Studio" },
  { href: "/studio/pinterest-birthday", label: "Pinterest: Birthday Board" },
  { href: "/studio/major-gift", label: "Pinterest: Major Gift Board" },
  { href: "/studio/major-shadow", label: "Pinterest: Major Shadow Board" },
  { href: "/studio/major-reclaimed", label: "Pinterest: Major Reclaimed Board" },
  { href: "/studio/cups-gift", label: "Pinterest: Cups Gift Board" },
  { href: "/studio/cups-shadow", label: "Pinterest: Cups Shadow Board" },
  { href: "/studio/cups-reclaimed", label: "Pinterest: Cups Reclaimed Board" },
  { href: "/studio/wands-gift", label: "Pinterest: Wands Gift Board" },
  { href: "/studio/wands-shadow", label: "Pinterest: Wands Shadow Board" },
  { href: "/studio/wands-reclaimed", label: "Pinterest: Wands Reclaimed Board" },
  { href: "/studio/swords-gift", label: "Pinterest: Swords Gift Board" },
  { href: "/studio/swords-shadow", label: "Pinterest: Swords Shadow Board" },
  { href: "/studio/swords-reclaimed", label: "Pinterest: Swords Reclaimed Board" },
  { href: "/studio/pentacles-gift", label: "Pinterest: Pentacles Gift Board" },
  { href: "/studio/pentacles-shadow", label: "Pinterest: Pentacles Shadow Board" },
  { href: "/studio/pentacles-reclaimed", label: "Pinterest: Pentacles Reclaimed Board" },
];
