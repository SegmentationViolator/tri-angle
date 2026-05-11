import { Canvas } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import Scene from './Scene';
import PerformanceGuard from './PerformanceGuard';
import { useInView } from '@hooks/useInView';
import { useReducedMotion } from '@hooks/useReducedMotion';
import { usePerformanceTier } from '@hooks/usePerformanceTier';
import { GL_CONFIG, CAMERA_DEFAULTS } from '@lib/three/config';
import styles from './Stage.module.scss';

export default function Stage(): JSX.Element {
  const [ref, inView] = useInView<HTMLDivElement>(0);
  const reducedMotion = useReducedMotion();
  const preset = usePerformanceTier();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const active = inView && !reducedMotion;

  return (
    <div ref={ref} className={styles.stage}>
      <Canvas
        ref={canvasRef}
        className={styles.canvas}
        dpr={[preset.dpr[0], preset.dpr[1]]}
        gl={GL_CONFIG}
        camera={CAMERA_DEFAULTS}
        frameloop="never"
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
