import type { SVGProps } from 'react';

/**
 * Icone social inline (nessuna dipendenza esterna, coerente con il resto
 * del progetto che usa SVG/unicode). `currentColor` per ereditare il tema.
 */

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function DiscordIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M19.54 5.34A16.3 16.3 0 0 0 15.4 4.1a11.5 11.5 0 0 0-.53 1.07 15 15 0 0 0-4.74 0A11 11 0 0 0 9.6 4.1a16.3 16.3 0 0 0-4.15 1.24C2.84 9.2 2.13 12.95 2.49 16.65a16.4 16.4 0 0 0 5 2.52c.4-.55.76-1.13 1.06-1.74a10.6 10.6 0 0 1-1.67-.8c.14-.1.28-.21.41-.32a11.7 11.7 0 0 0 10.02 0c.13.11.27.22.41.32-.53.31-1.09.58-1.67.8.31.61.66 1.19 1.06 1.74a16.3 16.3 0 0 0 5-2.52c.42-4.29-.71-8.01-2.97-11.31ZM9.35 14.4c-.99 0-1.8-.91-1.8-2.02 0-1.12.79-2.03 1.8-2.03 1.02 0 1.83.92 1.81 2.03 0 1.11-.8 2.02-1.81 2.02Zm5.31 0c-.99 0-1.8-.91-1.8-2.02 0-1.12.79-2.03 1.8-2.03 1.02 0 1.83.92 1.81 2.03 0 1.11-.79 2.02-1.81 2.02Z" />
    </svg>
  );
}

export function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817-5.97 6.817H1.674l7.73-8.835L1.254 2.25h6.83l4.713 6.231 5.447-6.231Zm-1.16 17.52h1.833L7.084 4.126H5.117L17.084 19.77Z" />
    </svg>
  );
}
