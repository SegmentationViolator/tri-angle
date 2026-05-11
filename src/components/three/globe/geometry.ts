import { BufferAttribute, BufferGeometry } from 'three';

interface BuildOptions {
  readonly count: number;
  readonly radius: number;
  readonly mask?: ImageData | null;
  readonly threshold?: number;
  readonly invertMask?: boolean;
}

export function buildDottedGlobe({
  count,
  radius,
  mask,
  threshold = 0.5,
  invertMask = true,
}: BuildOptions): BufferGeometry {
  const phi = Math.PI * (Math.sqrt(5) - 1); // golden angle

  // ── Pass 1 — Generate candidates across the FULL sphere ──
  const oversample = mask ? 4 : 1;
  const samples = count * oversample;

  const candidates: number[] = [];

  for (let i = 0; i < samples; i++) {
    const y = 1 - (i / (samples - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;

    if (mask) {
      const u = 0.5 + Math.atan2(z, x) / (2 * Math.PI);
      const v = 0.5 - Math.asin(y) / Math.PI;
      const px = Math.min(
        mask.width - 1,
        Math.max(0, Math.floor(u * mask.width))
      );
      const py = Math.min(
        mask.height - 1,
        Math.max(0, Math.floor(v * mask.height))
      );
      const idx = (py * mask.width + px) * 4;
      const brightness = mask.data[idx] / 255;

      const isLand = invertMask
        ? brightness < threshold
        : brightness > threshold;
      if (!isLand) continue;
    }

    candidates.push(x * radius, y * radius, z * radius);
  }

  const candidateCount = candidates.length / 3;

  // ── Pass 2 — Evenly sample across the FULL candidate array ──
  // Fractional stride + index lookup = guaranteed even distribution
  // from pole to pole. No early exit, no geographic bias.
  const positions = new Float32Array(Math.min(count, candidateCount) * 3);

  if (candidateCount <= count) {
    // Fewer candidates than requested — use them all
    for (let i = 0; i < candidates.length; i++) {
      positions[i] = candidates[i];
    }
  } else {
    // More candidates than requested — sample evenly across whole array
    const stride = candidateCount / count;
    for (let i = 0; i < count; i++) {
      const srcIdx = Math.floor(i * stride);
      positions[i * 3]     = candidates[srcIdx * 3];
      positions[i * 3 + 1] = candidates[srcIdx * 3 + 1];
      positions[i * 3 + 2] = candidates[srcIdx * 3 + 2];
    }
  }

  const geom = new BufferGeometry();
  geom.setAttribute('position', new BufferAttribute(positions, 3));
  return geom;
}

export async function loadMaskImage(url: string): Promise<ImageData | null> {
  if (typeof document === 'undefined') return null;
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    await img.decode();

    const w = 1024;
    const h = 512;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, w, h);
    return ctx.getImageData(0, 0, w, h);
  } catch {
    return null;
  }
}
