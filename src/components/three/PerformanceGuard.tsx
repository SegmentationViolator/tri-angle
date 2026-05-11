import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { scrollEmitter } from '@lib/lenis';

interface Props {
  readonly active: boolean;
}

export default function PerformanceGuard({ active }: Props): null {
  const setFrameloop = useThree((s) => s.setFrameloop);
  const invalidate = useThree((s) => s.invalidate);

  // Lock frameloop ON once at mount. Never toggle.
  useEffect(() => {
    setFrameloop(active ? 'always' : 'never');
    invalidate();
  }, [active, setFrameloop, invalidate]);

  // Kick the loop on every scroll event — prevents browser RAF throttling
  // from leaving the canvas frozen after scrolling.
  useEffect(() => {
    const unsub = scrollEmitter.on(() => {
      invalidate();
    });
    return () => {
      unsub();
    };
  }, [invalidate]);

  // Kick again whenever the window resizes — canvas can miss a tick.
  useEffect(() => {
    const onResize = (): void => invalidate();
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, [invalidate]);

  return null;
}
