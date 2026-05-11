import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { easeCinematic, REVEAL_TIMING } from '@lib/motion';

interface Props {
  readonly children: ReactNode;
  readonly className?: string;
  readonly delay?: number;
  readonly duration?: number;
  readonly offset?: number;
}

export default function RevealFade({
  children,
  className,
  delay = REVEAL_TIMING.tagline.delay,
  duration = REVEAL_TIMING.tagline.duration,
  offset = 14,
}: Props): JSX.Element {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: offset }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, ease: easeCinematic, delay }}
    >
      {children}
    </motion.div>
  );
}
