/**
 * Server statico LOCALE che emula la semantica di Vercel su `dist/`, per
 * testare status HTTP e redirect reali (cosa che `vite preview` non fa: serve
 * index.html con 200 per QUALSIASI path, nascondendo i soft-404).
 *
 * Emula: `redirects` di vercel.json (incl. `has` host/header), `cleanUrls`,
 * `trailingSlash: false` (308), `404.html` con status 404, `headers`.
 *
 *   npm run preview:static            # http://localhost:4173
 *   PORT=4180 npm run preview:static
 */
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const PORT = Number(process.env.PORT ?? 4173);

interface Has {
  type: 'host' | 'header';
  key?: string;
  value: string;
}
interface Redirect {
  source: string;
  destination: string;
  permanent?: boolean;
  has?: Has[];
}
interface HeaderRule {
  source: string;
  headers: { key: string; value: string }[];
}
const cfg = JSON.parse(readFileSync(join(ROOT, 'vercel.json'), 'utf8')) as {
  redirects?: Redirect[];
  headers?: HeaderRule[];
};

/** path-to-regexp minimale: `:param`, `:param*`, gruppi `(...)`. */
function compile(source: string): { re: RegExp; names: string[] } {
  const names: string[] = [];
  let pattern = '';
  for (let i = 0; i < source.length; ) {
    const rest = source.slice(i);
    const star = /^\/:([A-Za-z]+)\*/.exec(rest);
    const param = /^:([A-Za-z]+)/.exec(rest);
    if (star) {
      names.push(star[1]);
      pattern += '(?:/(.*))?';
      i += star[0].length;
    } else if (param) {
      names.push(param[1]);
      pattern += '([^/]+)';
      i += param[0].length;
    } else if (source[i] === '(') {
      const end = source.indexOf(')', i);
      pattern += source.slice(i, end + 1);
      i = end + 1;
    } else {
      pattern += source[i].replace(/[.+?^${}|[\]\\]/g, '\\$&');
      i++;
    }
  }
  return { re: new RegExp(`^${pattern}$`), names };
}

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

function resolveFile(path: string): string | undefined {
  const clean = decodeURIComponent(path);
  const candidates = clean === '/' ? ['/index.html'] : [clean, `${clean}.html`, `${clean}/index.html`];
  for (const c of candidates) {
    const f = join(DIST, c);
    if (f.startsWith(DIST) && existsSync(f) && statSync(f).isFile()) return f;
  }
  return undefined;
}

createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host}`);
  const path = url.pathname;
  const host = (req.headers.host ?? '').split(':')[0];

  for (const rule of cfg.headers ?? []) {
    if (compile(rule.source).re.test(path)) for (const h of rule.headers) res.setHeader(h.key, h.value);
  }

  for (const r of cfg.redirects ?? []) {
    const { re, names } = compile(r.source);
    const m = re.exec(path);
    if (!m) continue;
    const ok = (r.has ?? []).every((h) =>
      h.type === 'host'
        ? host === h.value
        : new RegExp(h.value).test(String(req.headers[(h.key ?? '').toLowerCase()] ?? '')),
    );
    if (!ok) continue;
    let dest = r.destination;
    names.forEach((n, i) => {
      dest = dest.replace(`/:${n}*`, m[i + 1] ? `/${m[i + 1]}` : '').replace(`:${n}`, m[i + 1] ?? '');
    });
    res.writeHead(r.permanent === false ? 307 : 308, { Location: dest + url.search });
    return res.end();
  }

  if (path.length > 1 && path.endsWith('/')) {
    res.writeHead(308, { Location: path.replace(/\/+$/, '') + url.search });
    return res.end();
  }
  if (path.endsWith('.html') || path.endsWith('/index')) {
    res.writeHead(308, { Location: path.replace(/(\/index)?\.html$|\/index$/, '') || '/' });
    return res.end();
  }

  const file = resolveFile(path);
  if (file) {
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
    return res.end(readFileSync(file));
  }
  res.writeHead(404, { 'Content-Type': TYPES['.html'] });
  res.end(readFileSync(join(DIST, '404.html')));
}).listen(PORT, () => console.log(`[serve-static] http://localhost:${PORT} (semantica Vercel su dist/)`));
