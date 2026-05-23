interface YouTubeEmbedProps {
  /** URL completo YouTube (watch, youtu.be, embed, shorts) o id a 11 caratteri. */
  url: string;
  title?: string;
}

/** Estrae l'id video da vari formati di link YouTube (o da un id nudo). */
export function parseYouTubeId(input: string): string | null {
  const value = input.trim();
  if (/^[\w-]{11}$/.test(value)) return value;
  try {
    const u = new URL(value);
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') {
      const id = u.pathname.slice(1);
      return /^[\w-]{11}$/.test(id) ? id : null;
    }
    if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      const v = u.searchParams.get('v');
      if (v && /^[\w-]{11}$/.test(v)) return v;
      const m = u.pathname.match(/\/(?:embed|shorts|v)\/([\w-]{11})/);
      if (m) return m[1];
    }
  } catch {
    /* non è un URL valido */
  }
  return null;
}

/** Player YouTube responsive (16:9). Fallback a link esterno se l'id non è valido. */
export function YouTubeEmbed({ url, title }: YouTubeEmbedProps) {
  const id = parseYouTubeId(url);

  if (!id) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer noopener"
        className="chip hover:border-chakra-500/70 hover:text-white"
      >
        YouTube ↗
      </a>
    );
  }

  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-lg border border-ink-600/60 bg-black">
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title ?? 'YouTube'}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
