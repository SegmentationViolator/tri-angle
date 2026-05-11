import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { fadeUp } from '@lib/motion';

interface FadeInProps {
  readonly children: ReactNode;
  readonly delay?: number;
  readonly className?: string;
}

export default function FadeIn({
  children,
  delay = 0,
  className,
}: FadeInProps): JSX.Element {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10%' }}
      variants={fadeUp}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
