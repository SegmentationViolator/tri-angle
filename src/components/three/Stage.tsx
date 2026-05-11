import { Canvas } from '@react-three/fiber';
import { Suspense, useMemo, useRef } from 'react';
import Scene from './Scene';
import PerformanceGuard from './PerformanceGuard';
import { useReducedMotion } from '@hooks/useReducedMotion';
import { usePerformanceTier } from '@hooks/usePerformanceTier';
import { GL_CONFIG, CAMERA_DEFAULTS } from '@lib/three/config';
import styles from './Stage.module.scss';

export default function Stage(): JSX.Element {
  const reducedMotion = useReducedMotion();
  const preset = usePerformanceTier();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Freeze DPR as primitive tuple — prevents array-identity re-mounts
  const dpr = useMemo<[number, number]>(
    () => [preset.dpr[0], preset.dpr[1]],
    // Intentionally mount-once — DPR changes handled via uniform update in Globe
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const active = !reducedMotion;

  return (
    <div className={styles.stage}>
      <Canvas
        ref={canvasRef}
        className={styles.canvas}
        dpr={dpr}
        gl={GL_CONFIG}
        camera={CAMERA_DEFAULTS}
        frameloop="always"
        resize={{ debounce: 200, scroll: false, offsetSize: true }}
        aria-hidden="true"
      >
        <PerformanceGuard active={active} />
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
