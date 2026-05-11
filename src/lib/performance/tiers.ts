export type Tier = 'low' | 'medium' | 'high';

export interface TierPreset {
  readonly tier: Tier;
  readonly dpr: readonly [number, number];
  readonly globePoints: number;
  readonly globeRadius: number;
  readonly atmosphere: boolean;
  readonly parallax: boolean;
}

export const TIER_PRESETS: Readonly<Record<Tier, TierPreset>> = {
  low: {
    tier: 'low',
    dpr: [1, 1.25],
    globePoints: 4500,
    globeRadius: 1.6,
    atmosphere: false,
    parallax: false,
  },
  medium: {
    tier: 'medium',
    dpr: [1, 1.5],
    globePoints: 9000,
    globeRadius: 1.7,
    atmosphere: true,
    parallax: true,
  },
  high: {
    tier: 'high',
    dpr: [1, 2],
    globePoints: 16000,
    globeRadius: 1.75,
    atmosphere: true,
    parallax: true,
  },
};

interface NavigatorWithMemory extends Navigator {
  readonly deviceMemory?: number;
}

let cached: Tier | null = null;
let listenersBound = false;
let pendingRaf: number | null = null;

function invalidate(): void {
  if (pendingRaf !== null) cancelAnimationFrame(pendingRaf);
  pendingRaf = requestAnimationFrame(() => {
    cached = null;
    pendingRaf = null;
  });
}

function ensureListeners(): void {
  if (listenersBound || typeof window === 'undefined') return;
  listenersBound = true;
  window.addEventListener('resize', invalidate, { passive: true });
  window.addEventListener('orientationchange', invalidate, { passive: true });
}

export function detectTier(): Tier {
  ensureListeners();
  if (cached) return cached;
  if (typeof window === 'undefined') return 'high';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return (cached = 'low');

  const nav = navigator as NavigatorWithMemory;
  const memory = nav.deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 4;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const narrow = window.innerWidth < 768;

  if (coarse || narrow || memory <= 2 || cores <= 2) cached = 'low';
  else if (memory <= 4 || cores <= 4) cached = 'medium';
  else cached = 'high';

  return cached;
}

export function getPreset(tier: Tier = detectTier()): TierPreset {
  return TIER_PRESETS[tier];
}
