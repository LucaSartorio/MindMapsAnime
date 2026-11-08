/**
 * Dimensioni intrinseche di un'immagine lette dall'intestazione del file, senza
 * dipendenze (PNG, JPEG, WebP lossy/lossless/esteso, SVG con `viewBox` o
 * `width`/`height`). Usato dai test per verificare che le mappe servite abbiano le
 * proporzioni del loro piano viewBox (PERF-02): un'immagine con un altro rapporto
 * d'aspetto sposterebbe tutti i pin.
 */
export interface ImageSize {
  format: 'png' | 'jpeg' | 'webp' | 'svg';
  width: number;
  height: number;
}

export function imageSize(buf: Buffer): ImageSize | undefined {
  // PNG: firma + chunk IHDR.
  if (buf.length >= 24 && buf.readUInt32BE(0) === 0x89504e47 && buf.toString('ascii', 12, 16) === 'IHDR') {
    return { format: 'png', width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  // JPEG: scorre i marker fino a un SOFn (escluse DHT C4, JPG C8, DAC CC).
  if (buf.length >= 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) return undefined;
      const marker = buf[i + 1];
      if (marker === 0xff) {
        i++;
        continue;
      }
      const len = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { format: 'jpeg', height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      }
      i += 2 + len;
    }
    return undefined;
  }
  // WebP: contenitore RIFF con chunk VP8 / VP8L / VP8X.
  if (buf.length >= 30 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = buf.toString('ascii', 12, 16);
    if (chunk === 'VP8 ') {
      return { format: 'webp', width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    }
    if (chunk === 'VP8L') {
      const b = buf.readUInt32LE(21);
      return { format: 'webp', width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 };
    }
    if (chunk === 'VP8X') {
      return { format: 'webp', width: buf.readUIntLE(24, 3) + 1, height: buf.readUIntLE(27, 3) + 1 };
    }
    return undefined;
  }
  // SVG: viewBox del tag radice, altrimenti width/height numerici.
  const head = buf.toString('utf8', 0, Math.min(buf.length, 4096));
  const svg = /<svg\b[^>]*>/i.exec(head)?.[0];
  if (svg) {
    const vb = /viewBox\s*=\s*["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(svg);
    if (vb) return { format: 'svg', width: Number(vb[1]), height: Number(vb[2]) };
    const w = /\bwidth\s*=\s*["']([\d.]+)/i.exec(svg);
    const h = /\bheight\s*=\s*["']([\d.]+)/i.exec(svg);
    if (w && h) return { format: 'svg', width: Number(w[1]), height: Number(h[1]) };
  }
  return undefined;
}
