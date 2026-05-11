import Lenis from 'lenis';
import { scrollEmitter, tickEmitter } from './events';

interface BootOptions {
  readonly duration?: number;
  readonly lerp?: number;
}

let lenis: Lenis | null = null;
let rafId: number | null = null;
let booted = false;

function shouldDisable(): boolean {
  if (typeof window === 'undefined') return true;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touchOnly = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  return reduced || touchOnly;
}

export function boot(options: BootOptions = {}): Lenis | null {
  if (booted) return lenis;
  booted = true;

  if (shouldDisable()) {
    window.addEventListener(
      'scroll',
      () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        scrollEmitter.emit({
          scroll: window.scrollY,
          velocity: 0,
          direction: 0,
          progress: max > 0 ? window.scrollY / max : 0,
        });
      },
      { passive: true }
    );
    return null;
  }

  lenis = new Lenis({
    duration: options.duration ?? 1.1,
    lerp: options.lerp ?? 0.1,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    autoRaf: false,
  });

  lenis.on('scroll', (e: Lenis) => {
    scrollEmitter.emit({
      scroll: e.scroll,
      velocity: e.velocity,
      direction: e.direction as 1 | -1 | 0,
      progress: e.progress,
    });
  });

  const raf = (time: number): void => {
    lenis?.raf(time);
    tickEmitter.emit(time);
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame(raf);

  return lenis;
}

export function getInstance(): Lenis | null {
  return lenis;
}

export function destroy(): void {
  if (rafId !== null) cancelAnimationFrame(rafId);
  lenis?.destroy();
  lenis = null;
  rafId = null;
  booted = false;
  scrollEmitter.clear();
  tickEmitter.clear();
}
