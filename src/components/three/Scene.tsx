import { Suspense } from 'react';
import Globe from './Globe';
import type { SceneProps } from '@lib/three/types';

export default function Scene({ children }: SceneProps): JSX.Element {
  return (
    <>
      <Suspense fallback={null}>
        <Globe />
      </Suspense>
      {children}
    </>
  );
}
