import { SITE, SEO_LOCALES, SEO_LOCALE_META } from './config';
import type { PageMeta } from './metadata';

/**
 * Gestione del `<head>` SENZA librerie: un'unica lista di tag derivata da
 * `PageMeta`, serializzata in HTML dal pre-rendering e applicata al DOM dal
 * client. Ogni tag gestito porta `data-seo`: il client rimuove e ricrea SOLO
 * quelli, così fra HTML iniziale e DOM dopo la navigazione non esistono mai
 * canonical/description duplicate o contraddittorie.
 */
export type HeadTag =
  | { tag: 'meta'; attrs: Record<string, string> }
  | { tag: 'link'; attrs: Record<string, string> }
  | { tag: 'script'; attrs: Record<string, string>; content: string };

export function buildHeadTags(meta: PageMeta): HeadTag[] {
  const tags: HeadTag[] = [
    { tag: 'meta', attrs: { name: 'description', content: meta.description } },
    { tag: 'meta', attrs: { name: 'robots', content: meta.robots } },
  ];
  if (meta.canonical) {
    tags.push({ tag: 'link', attrs: { rel: 'canonical', href: meta.canonical } });
    for (const alt of meta.alternates) {
      tags.push({ tag: 'link', attrs: { rel: 'alternate', hreflang: alt.hreflang, href: alt.href } });
    }
  }
  const og: [string, string][] = [
    ['og:type', meta.ogType],
    ['og:site_name', SITE.name],
    ['og:title', meta.title],
    ['og:description', meta.description],
    ['og:image', meta.image],
    ['og:image:width', String(SITE.ogImageWidth)],
    ['og:image:height', String(SITE.ogImageHeight)],
    ['og:image:alt', meta.imageAlt],
    ['og:locale', SEO_LOCALE_META[meta.lang].ogLocale],
  ];
  if (meta.canonical) og.splice(4, 0, ['og:url', meta.canonical]);
  for (const [property, content] of og) tags.push({ tag: 'meta', attrs: { property, content } });
  for (const l of SEO_LOCALES) {
    if (l !== meta.lang) {
      tags.push({ tag: 'meta', attrs: { property: 'og:locale:alternate', content: SEO_LOCALE_META[l].ogLocale } });
    }
  }
  const tw: [string, string][] = [
    ['twitter:card', 'summary_large_image'],
    ['twitter:title', meta.title],
    ['twitter:description', meta.description],
    ['twitter:image', meta.image],
  ];
  for (const [name, content] of tw) tags.push({ tag: 'meta', attrs: { name, content } });
  for (const block of meta.jsonLd) {
    tags.push({
      tag: 'script',
      attrs: { type: 'application/ld+json' },
      // `<` escapato: il JSON non può chiudere prematuramente lo <script>.
      content: JSON.stringify(block).replace(/</g, '\\u003c'),
    });
  }
  return tags;
}

const escAttr = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escText = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Serializzazione per il pre-rendering statico. */
export function renderHeadHtml(meta: PageMeta): string {
  const lines = [`<title>${escText(meta.title)}</title>`];
  for (const t of buildHeadTags(meta)) {
    const attrs = Object.entries({ ...t.attrs, 'data-seo': '' })
      .map(([k, v]) => (v === '' ? k : `${k}="${escAttr(v)}"`))
      .join(' ');
    lines.push(t.tag === 'script' ? `<script ${attrs}>${t.content}</script>` : `<${t.tag} ${attrs} />`);
  }
  return lines.join('\n    ');
}

/** Applicazione client (navigazione SPA). Idempotente. */
export function applyHead(meta: PageMeta, htmlLang: string): void {
  if (typeof document === 'undefined') return;
  if (document.title !== meta.title) document.title = meta.title;
  document.documentElement.lang = htmlLang;
  const head = document.head;
  const next = buildHeadTags(meta);
  const existing = Array.from(head.querySelectorAll<HTMLElement>('[data-seo]'));
  // Evita il churn: se i tag coincidono già (es. subito dopo il pre-rendering)
  // non tocchiamo il DOM.
  const signature = (el: Element) =>
    `${el.tagName.toLowerCase()}|${Array.from(el.attributes)
      .filter((a) => a.name !== 'data-seo')
      .map((a) => `${a.name}=${a.value}`)
      .sort()
      .join('&')}|${el.tagName === 'SCRIPT' ? el.textContent : ''}`;
  const wanted = next.map(
    (t) =>
      `${t.tag}|${Object.entries(t.attrs)
        .map(([k, v]) => `${k}=${v}`)
        .sort()
        .join('&')}|${t.tag === 'script' ? t.content : ''}`,
  );
  const current = existing.map(signature);
  if (current.length === wanted.length && current.every((s, i) => s === wanted[i])) return;
  for (const el of existing) el.remove();
  for (const t of next) {
    const el = document.createElement(t.tag);
    for (const [k, v] of Object.entries(t.attrs)) el.setAttribute(k, v);
    el.setAttribute('data-seo', '');
    if (t.tag === 'script') el.textContent = t.content;
    head.appendChild(el);
  }
}
