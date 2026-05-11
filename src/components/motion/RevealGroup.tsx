import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';
import { easeCinematic } from '@lib/motion';

interface Props {
  readonly children: ReactNode;
  readonly className?: string;
  readonly stagger?: number;
  readonly delay?: number;
  readonly duration?: number;
  readonly offset?: number;
  readonly as?: 'div' | 'section' | 'aside' | 'ol' | 'ul';
}

const MOTION_TAG = {
  div: motion.div,
  section: motion.section,
  aside: motion.aside,
  ol: motion.ol,
  ul: motion.ul,
} as const;

/**
 * Single hydration boundary that reveals every direct child with a
 * staggered upward fade. Children opt in by adding `data-reveal`.
 */
export default function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  duration = 0.85,
  offset = 18,
  as = 'div',
}: Props): JSX.Element {
  const reduced = useReducedMotion();
  const Tag = MOTION_TAG[as];

  if (reduced) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10% 0px -15% 0px' }}
      variants={container}
    >
      {children}
    </Tag>
  );
}
