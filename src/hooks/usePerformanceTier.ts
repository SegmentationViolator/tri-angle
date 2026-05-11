import { useMemo } from 'react';
import { detectTier, getPreset, type TierPreset } from '@lib/performance';

export function usePerformanceTier(): TierPreset {
  return useMemo(() => getPreset(detectTier()), []);
}
