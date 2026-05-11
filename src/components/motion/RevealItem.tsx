import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';
import { easeCinematic } from '@lib/motion';

interface Props {
  readonly children: ReactNode;
  readonly className?: string;
  readonly as?: 'div' | 'li' | 'p' | 'h2' | 'h3';
  readonly offset?: number;
  readonly duration?: number;
}

const MOTION_TAG = {
  div: motion.div,
  li: motion.li,
  p: motion.p,
  h2: motion.h2,
  h3: motion.h3,
} as const;

const itemVariants = (offset: number, duration: number): Variants => ({
  hidden: { opacity: 0, y: offset },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration, ease: easeCinematic },
  },
});

export default function RevealItem({
  children,
  className,
  as = 'div',
  offset = 18,
  duration = 0.85,
}: Props): JSX.Element {
  const Tag = MOTION_TAG[as];

  return (
    <Tag className={className} variants={itemVariants(offset, duration)}>
      {children}
    </Tag>
  );
}
