import type { SVGProps } from 'react';

/**
 * Bandiere come SVG inline: si vedono identiche su tutti i sistemi operativi,
 * inclusi quelli (es. Windows) che non disegnano le emoji-bandiera.
 */

export function ItalyFlag(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 3 2" preserveAspectRatio="none" aria-hidden {...props}>
      <rect width="3" height="2" fill="#ffffff" />
      <rect width="1" height="2" x="0" fill="#009246" />
      <rect width="1" height="2" x="2" fill="#ce2b37" />
    </svg>
  );
}

export function UkFlag(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="none" aria-hidden {...props}>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#ffffff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#c8102e" strokeWidth="4" />
      <path d="M30,0 V30 M0,15 H60" stroke="#ffffff" strokeWidth="10" />
      <path d="M30,0 V30 M0,15 H60" stroke="#c8102e" strokeWidth="6" />
    </svg>
  );
}
