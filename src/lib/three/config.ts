export const GL_CONFIG = {
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance' as const,
  stencil: false,
  depth: true,
} as const;

export const CAMERA_DEFAULTS = {
  position: [0, 0, 4.2] as [number, number, number],
  fov: 38,
  near: 0.1,
  far: 100,
} as const;
