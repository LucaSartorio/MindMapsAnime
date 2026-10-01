import { Img, staticFile } from 'remotion';
import { COLORS, FONTS } from '../lib/theme';

/** The AniMapVerse mark (`public/icon-512.png`, the site's own logo) + wordmark. */
export function BrandMark({ size = 52, wordmark = true, color = COLORS.ink100 }: { size?: number; wordmark?: boolean; color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.3 }}>
      <Img src={staticFile('icon-512.png')} style={{ width: size, height: size, objectFit: 'contain' }} />
      {wordmark && (
        <span style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: size * 0.6, color, letterSpacing: '0.01em' }}>
          AniMapVerse
        </span>
      )}
    </div>
  );
}
