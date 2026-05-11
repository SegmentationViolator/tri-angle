import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { easeCinematic } from '@lib/motion';

interface Props {
  readonly children: ReactNode;
  readonly className?: string;
  readonly delay?: number;
  readonly duration?: number;
  readonly offset?: number;
}

export default function RevealOnScroll({
  children,
  className,
  delay = 0,
  duration = 0.9,
  offset = 18,
}: Props): JSX.Element {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px -15% 0px' }}
      transition={{ duration, ease: easeCinematic, delay }}
    >
      {children}
    </motion.div>
  );
}
