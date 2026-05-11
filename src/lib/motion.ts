import type { Transition, Variants } from 'framer-motion';

export const easeCinematic: Transition['ease'] = [0.22, 1, 0.36, 1];
export const easeSoft: Transition['ease'] = [0.32, 0.72, 0, 1];
export const easeOutExpo: Transition['ease'] = [0.16, 1, 0.3, 1];
export const easeOutQuart: Transition['ease'] = [0.25, 1, 0.5, 1];
export const easeInOutQuart: Transition['ease'] = [0.76, 0, 0.24, 1];

export const REVEAL_TIMING = {
  delayBase: 0.18,
  stagger: 0.11,
  duration: 0.95,
  tagline: { delay: 0.55, duration: 0.9 },
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: easeCinematic },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: easeOutQuart },
  },
};

export const stagger = (delay = 0.08): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: delay },
  },
});
