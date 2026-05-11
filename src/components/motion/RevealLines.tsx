import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { useMemo } from 'react';
import { easeCinematic, REVEAL_TIMING } from '@lib/motion';

type AllowedTag = 'h1' | 'h2' | 'h3' | 'p';

interface Props {
  readonly lines: readonly string[];
  readonly as?: AllowedTag;
  readonly className?: string;
  readonly lineClassName?: string;
  readonly innerClassName?: string;
  readonly delay?: number;
  readonly stagger?: number;
  readonly duration?: number;
  /** Unique key. When provided, animation plays only once per session. */
  readonly playKey?: string;
}

// Module-level registry — survives React remounts within the session.
const playedKeys = new Set<string>();

const MOTION_TAG = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
} as const;

export default function RevealLines({
  lines,
  as = 'h1',
  className,
  lineClassName,
  innerClassName,
  delay = REVEAL_TIMING.delayBase,
  stagger = REVEAL_TIMING.stagger,
  duration = REVEAL_TIMING.duration,
  playKey,
}: Props): JSX.Element {
  const reduced = useReducedMotion();
  const Tag = as;

  // Determine if animation should skip (already played or reduced motion)
  const skipAnimation = useMemo(() => {
    if (reduced) return true;
    if (playKey && playedKeys.has(playKey)) return true;
    return false;
  }, [reduced, playKey]);

  // Mark as played on mount
  if (playKey && !playedKeys.has(playKey)) {
    playedKeys.add(playKey);
  }

  if (skipAnimation) {
    return (
      <Tag className={className}>
        {lines.map((line, i) => (
          <span key={i} className={lineClassName}>
            <span className={innerClassName}>{line}</span>
          </span>
        ))}
      </Tag>
    );
  }

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  const line: Variants = {
    hidden: { y: '115%', opacity: 0 },
    visible: {
      y: '0%',
      opacity: 1,
      transition: { duration, ease: easeCinematic },
    },
  };

  const MotionTag = MOTION_TAG[as];

  return (
    <MotionTag
      className={className}
      initial="hidden"
      animate="visible"
      variants={container}
    >
      {lines.map((text, i) => (
        <span key={i} className={lineClassName}>
          <motion.span className={innerClassName} variants={line}>
            {text}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
