import type { Variants, Transition } from 'framer-motion';

// Page-level transitions (router navigation)
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const pageTransitionConfig: Transition = {
  duration: 0.3,
  ease: [0.25, 0.46, 0.45, 0.94],
};

// Form swap transitions (login form <-> forgot password)
export const formSwapVariants: Variants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

export const formSwapTransition: Transition = {
  duration: 0.25,
  ease: 'easeInOut',
};

// Step transitions for registration wizard
export const stepForwardVariants: Variants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

export const stepBackwardVariants: Variants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
};

export const stepTransition: Transition = {
  duration: 0.3,
  ease: [0.25, 0.46, 0.45, 0.94],
};

// Success checkmark
export const successCheckVariants: Variants = {
  initial: { scale: 0, rotate: -180 },
  animate: { scale: 1, rotate: 0 },
};

export const successCheckTransition: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 15,
  delay: 0.1,
};

// Staggered children (for role cards, trust badges)
export const staggerContainer: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.05 } },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};
