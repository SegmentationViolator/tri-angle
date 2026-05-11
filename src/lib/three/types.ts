import type { ReactNode } from 'react';

export interface SceneProps {
  readonly children?: ReactNode;
}

export interface StageProps {
  readonly className?: string;
  readonly eventSource?: 'self' | 'document';
}
