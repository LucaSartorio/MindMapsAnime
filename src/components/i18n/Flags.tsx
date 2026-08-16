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

export function JapanFlag(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 30 20" preserveAspectRatio="none" aria-hidden {...props}>
      <rect width="30" height="20" fill="#ffffff" />
      <circle cx="15" cy="10" r="6" fill="#bc002d" />
    </svg>
  );
}

export function FranceFlag(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 3 2" preserveAspectRatio="none" aria-hidden {...props}>
      <rect width="3" height="2" fill="#ffffff" />
      <rect width="1" height="2" x="0" fill="#002395" />
      <rect width="1" height="2" x="2" fill="#ed2939" />
    </svg>
  );
}

export function GermanyFlag(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 3 3" preserveAspectRatio="none" aria-hidden {...props}>
      <rect width="3" height="1" y="0" fill="#000000" />
      <rect width="3" height="1" y="1" fill="#dd0000" />
      <rect width="3" height="1" y="2" fill="#ffce00" />
    </svg>
  );
}

export function SpainFlag(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 3 2" preserveAspectRatio="none" aria-hidden {...props}>
      <rect width="3" height="2" fill="#aa151b" />
      <rect width="3" height="1" y="0.5" fill="#f1bf00" />
    </svg>
  );
}
