import { useEffect, useRef } from 'react';
import { scrollEmitter } from '@lib/lenis';

interface Props {
  readonly targetSelector: string;
}

export default function StageScroll({ targetSelector }: Props): null {
  const target = useRef<HTMLElement | null>(null);

  useEffect(() => {
    target.current = document.querySelector<HTMLElement>(targetSelector);
    if (!target.current) return;

    const unsub = scrollEmitter.on(({ scroll }) => {
      if (!target.current) return;
      const heroHeight = window.innerHeight;
      // Start fade at 30% scrolled, complete at 85%
      const raw = (scroll / heroHeight - 0.3) / 0.55;
      const exit = Math.max(0, Math.min(1, raw));
      target.current.style.setProperty('--stage-exit', exit.toString());
    });

    return () => {
      unsub();
    };
  }, [targetSelector]);

  return null;
}
