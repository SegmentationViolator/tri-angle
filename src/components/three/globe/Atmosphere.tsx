import { useEffect, useMemo } from 'react';
import { AdditiveBlending, BackSide, Color, ShaderMaterial } from 'three';
import { atmosphereFragment, atmosphereVertex } from './shaders';

interface Props {
  readonly radius: number;
}

export default function Atmosphere({ radius }: Props): JSX.Element {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: atmosphereVertex,
        fragmentShader: atmosphereFragment,
        transparent: true,
        depthWrite: false,
        side: BackSide,
        blending: AdditiveBlending,
        uniforms: {
          uColor: { value: new Color('#5a0817') },
          uIntensity: { value: 0.16 },
        },
      }),
    []
  );

  useEffect(() => () => material.dispose(), [material]);

  return (
    <mesh scale={radius}>
      <sphereGeometry args={[1, 48, 48]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
