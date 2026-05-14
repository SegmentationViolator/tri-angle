import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  readonly children: ReactNode;
  readonly className?: string;
  readonly stagger?: number;
  readonly delay?: number;
  readonly as?: 'div' | 'section' | 'aside' | 'ol' | 'ul';
}

const MOTION_TAG = {
  div: motion.div,
  section: motion.section,
  aside: motion.aside,
  ol: motion.ol,
  ul: motion.ul,
} as const;

const STATIC_TAG = {
  div: 'div',
  section: 'section',
  aside: 'aside',
  ol: 'ol',
  ul: 'ul',
} as const;

/**
 * Single hydration boundary that staggers the reveal of its children.
 * Per-child motion is defined by <RevealItem>. Children opt in by
 * being a <RevealItem> (or any motion element using the same variant keys).
 */
export default function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  as = 'div',
}: Props): JSX.Element {
  const reduced = useReducedMotion();

  if (reduced) {
    const Static = STATIC_TAG[as];
    return <Static className={className}>{children}</Static>;
  }

  const Tag = MOTION_TAG[as];

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
