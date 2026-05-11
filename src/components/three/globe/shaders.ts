export const pointsVertex = /* glsl */ `
  uniform float uSize;
  uniform float uPixelRatio;

  varying float vFacing;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vec3 viewDir = normalize(cameraPosition - worldPos.xyz);
    vec3 worldNormal = normalize((modelMatrix * vec4(position, 0.0)).xyz);
    vFacing = dot(worldNormal, viewDir);

    vec4 mvPosition = viewMatrix * worldPos;
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = uSize * uPixelRatio * (18.0 / -mvPosition.z);
  }
`;

export const pointsFragment = /* glsl */ `
  precision mediump float;

  uniform vec3 uColor;
  uniform vec3 uColorEdge;
  uniform float uOpacity;

  varying float vFacing;

  void main() {
    // Discard back-facing hemisphere
    if (vFacing < -0.02) discard;

    // Crisp round point — solid core, minimal edge smoothing
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);

    // Sharp circle with just enough AA (~1px at typical sizes)
    float alpha = 1.0 - smoothstep(0.42, 0.50, d);
    if (alpha <= 0.0) discard;

    // Front-face color intensity
    float facing = smoothstep(-0.02, 0.55, vFacing);
    vec3 color = mix(uColorEdge, uColor, facing);

    gl_FragColor = vec4(color, alpha * facing * uOpacity);
  }
`;

export const atmosphereVertex = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const atmosphereFragment = /* glsl */ `
  precision highp float;

  uniform vec3 uColor;
  uniform float uIntensity;

  varying vec3 vNormal;

  void main() {
    float rim = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
    gl_FragColor = vec4(uColor, rim * uIntensity);
  }
`;
