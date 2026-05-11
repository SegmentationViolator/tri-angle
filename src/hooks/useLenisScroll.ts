import { useEffect } from 'react';
import { scrollEmitter, type LenisScrollPayload } from '@lib/lenis';

export function useLenisScroll(
  callback: (payload: LenisScrollPayload) => void
): void {
  useEffect(() => {
    const unsub = scrollEmitter.on(callback);
    return () => {
      unsub();
    };
  }, [callback]);
}
