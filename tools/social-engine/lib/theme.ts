/**
 * Brand tokens for the videos — the SAME palette as the public site
 * (`tailwind.config.js`: ink / sharingan; `SITE.themeColor` #070709) and the
 * AniMapVerse mark (black · white · red). Blue (`chakra`) is not used: on the
 * site it is reserved for UI states (active tab, focus), not for the brand.
 */
export const COLORS = {
  ink950: '#070709',
  ink900: '#0c0d11',
  ink800: '#13151b',
  ink700: '#1c1f28',
  ink600: '#262a36',
  ink500: '#3a3f4f',
  ink400: '#5b6275',
  ink300: '#8a90a3',
  ink200: '#b6bbcb',
  ink100: '#e4e7f0',
  white: '#ffffff',
  red500: '#e10b0b',
  red600: '#b00808',
  red700: '#7d0606',
} as const;

export const FONTS = {
  display: '"Cinzel", Georgia, serif',
  sans: '"Inter", system-ui, sans-serif',
  mono: '"JetBrains Mono", monospace',
} as const;

/** Safe area for vertical platforms: their UI covers the top/bottom edges and the right rail. */
export const SAFE = { top: 150, bottom: 300, side: 72 } as const;
