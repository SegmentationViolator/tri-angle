import { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';

interface Props {
  readonly active: boolean;
}

export default function PerformanceGuard({ active }: Props): null {
  const setFrameloop = useThree((s) => s.setFrameloop);
  const invalidate = useThree((s) => s.invalidate);

  const [tabVisible, setTabVisible] = useState<boolean>(() =>
    typeof document === 'undefined' ? true : !document.hidden
  );

  useEffect(() => {
    const onVisibility = (): void => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    const shouldRun = active && tabVisible;
    setFrameloop(shouldRun ? 'always' : 'never');
    if (shouldRun) invalidate();
  }, [active, tabVisible, setFrameloop, invalidate]);

  return null;
}
