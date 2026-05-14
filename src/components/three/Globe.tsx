import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  Color,
  Group,
  MathUtils,
  NormalBlending,
  Points,
  ShaderMaterial,
  type BufferGeometry,
} from 'three';
import { usePerformanceTier } from '@hooks/usePerformanceTier';
import { useReducedMotion } from '@hooks/useReducedMotion';
import Atmosphere from './globe/Atmosphere';
import { buildDottedGlobe, loadMaskImage } from './globe/geometry';
import { pointsFragment, pointsVertex } from './globe/shaders';

const MASK_URL = '/textures/earth-map.webp';
const ROTATION_SPEED = 0.45;
const PARALLAX_STRENGTH = 0.2;
const PARALLAX_LERP = 0.4;
const BASE_X = 2.4;
const BASE_Y = -0.2

interface Anchor {
  readonly x: number;
  readonly y: number;
  readonly scale: number;
}

export default function Globe(): JSX.Element {
  const preset = usePerformanceTier();
  const reducedMotion = useReducedMotion();

  const groupRef = useRef<Group>(null);
  const pointsRef = useRef<Points>(null);

  const [mask, setMask] = useState<ImageData | null>(null);
  const [maskLoaded, setMaskLoaded] = useState<boolean>(false);

  const [anchor, setAnchor] = useState<Anchor>({
    x: BASE_X,
    y: BASE_Y,
    scale: 1,
  });

  // Load mask once
  useEffect(() => {
    let alive = true;
    loadMaskImage(MASK_URL).then((m) => {
      if (!alive) return;
      setMask(m);
      setMaskLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  // Responsive anchor
  useEffect(() => {
    const compute = (): void => {
      const w = window.innerWidth;
      if (w < 768) {
        setAnchor({ x: 1.2, y: 0.8, scale: 0.65 });
      } else if (w < 1200) {
        setAnchor({ x: 1.8, y: 0, scale: 0.85 });
      } else {
        setAnchor({ x: BASE_X, y: BASE_Y, scale: 1 });
      }
    };
    compute();
    window.addEventListener('resize', compute, { passive: true });
    return () => window.removeEventListener('resize', compute);
  }, []);

  const geometry = useMemo<BufferGeometry | null>(() => {
    if (!maskLoaded) return null;
    return buildDottedGlobe({
      count: preset.globePoints,
      radius: preset.globeRadius,
      mask,
    });
  }, [maskLoaded, mask, preset.globePoints, preset.globeRadius]);

  const pointsMaterial = useMemo(
  () =>
    new ShaderMaterial({
      vertexShader: pointsVertex,
      fragmentShader: pointsFragment,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: NormalBlending,
      uniforms: {
        uSize: { value: 1.6 },
        uPixelRatio: {
          value:
            typeof window !== 'undefined'
              ? Math.min(window.devicePixelRatio, preset.dpr[1])
              : 1.5,
        },
        uOpacity: { value: 1.0 },
        uColor: { value: new Color('#e6122e') },
        uColorEdge: { value: new Color('#3a0510') },
      },
    }),
  [preset.dpr]
);

  const target = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!preset.parallax || reducedMotion) return;
    const onMove = (e: PointerEvent): void => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * PARALLAX_STRENGTH;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * PARALLAX_STRENGTH;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [preset.parallax, reducedMotion]);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    if (!reducedMotion) {
      group.rotation.y = state.clock.elapsedTime * ROTATION_SPEED;
    }

    if (preset.parallax && !reducedMotion) {
      group.rotation.x = MathUtils.lerp(
        group.rotation.x,
        target.current.y,
        PARALLAX_LERP
      );
      group.position.x = MathUtils.lerp(
        group.position.x,
        anchor.x + target.current.x * 0.4,
        PARALLAX_LERP
      );
      group.position.y = MathUtils.lerp(
        group.position.y,
        anchor.y + target.current.y * -0.3,
        PARALLAX_LERP
      );
    }
  });

  useEffect(() => {
    return () => {
      geometry?.dispose();
      pointsMaterial.dispose();
    };
  }, [geometry, pointsMaterial]);

  if (!geometry) return <group />;

  return (
    <group
      ref={groupRef}
      rotation={[0.35, -0.4, 0.08]}
      position={[anchor.x, anchor.y, 0]}
      scale={anchor.scale}
    >
      <points ref={pointsRef} geometry={geometry} material={pointsMaterial} />
      {preset.atmosphere && <Atmosphere radius={preset.globeRadius * 1.18} />}
    </group>
  );
}
