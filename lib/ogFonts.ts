// Loads Google Fonts as raw TTF bytes for next/og's ImageResponse (Satori needs real
// font binaries, not the CSS `next/font` wiring the rest of the app uses). Google's CSS2
// endpoint serves woff2 to modern user agents but falls back to truetype for older ones
// (Satori can't parse woff2), so a bare fetch with no browser UA gets a ttf link.
async function loadGoogleFont(family: string, weight: number, text: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const match = /src: url\(([^)]+)\) format\('(opentype|truetype)'\)/.exec(css);
  if (!match) throw new Error(`ogFonts: no truetype source found for ${family} ${weight}`);
  const res = await fetch(match[1]);
  if (!res.ok) throw new Error(`ogFonts: failed to fetch font binary for ${family} ${weight}`);
  return res.arrayBuffer();
}

export interface OgFont {
  name: string;
  data: ArrayBuffer;
  weight: 300 | 400 | 500 | 600 | 700;
  style: "normal" | "italic";
}

// `text` should be the actual glyphs a given share card renders, so Google only sends the
// subset needed — keep it tight per-card rather than requesting a whole alphabet.
export async function loadShareFonts(text: string): Promise<OgFont[]> {
  const [cormorantSemibold, latoRegular, latoBold] = await Promise.all([
    loadGoogleFont("Cormorant", 600, text),
    loadGoogleFont("Lato", 400, text),
    loadGoogleFont("Lato", 700, text),
  ]);
  return [
    { name: "Cormorant", data: cormorantSemibold, weight: 600, style: "normal" },
    { name: "Lato", data: latoRegular, weight: 400, style: "normal" },
    { name: "Lato", data: latoBold, weight: 700, style: "normal" },
  ];
}
