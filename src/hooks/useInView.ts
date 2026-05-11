import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

export function useInView<T extends HTMLElement>(
  threshold = 0
): readonly [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState<boolean>(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      { threshold }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}
