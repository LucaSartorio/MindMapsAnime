import type { MouseEvent, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface CardLinkProps {
  /** Pagina SEO dell'entità (URL reale, crawlabile). */
  href: string;
  /** Azione "in-app" al click semplice (di norma: apre la scheda modale). */
  onOpen: () => void;
  className?: string;
  children: ReactNode;
  'aria-label'?: string;
}

/**
 * Card di archivio come VERO link (`<a href>`) senza cambiare la UX: il click
 * semplice apre la scheda sopra la pagina come prima, mentre crawler,
 * Ctrl/⌘-click, click centrale e "apri in nuova scheda" raggiungono la pagina
 * dell'entità. Progressive enhancement: senza JS è un normale link.
 */
export function CardLink({ href, onOpen, className, children, ...rest }: CardLinkProps) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    onOpen();
  };
  return (
    <Link to={href} onClick={onClick} className={className} {...rest}>
      {children}
    </Link>
  );
}
