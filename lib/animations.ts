import type { Variants } from "framer-motion";

export const SPRING = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: SPRING },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.7, ease: SPRING },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

export const lineReveal: Variants = {
  hidden: { scaleX: 0, originX: "0%" },
  visible: {
    scaleX: 1,
    transition: { duration: 0.5, ease: SPRING },
  },
};

export const iconPop: Variants = {
  hidden: { scale: 0.4, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 350, damping: 22 },
  },
};

export const listItem: Variants = {
  hidden: { opacity: 0, x: -14 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: SPRING },
  },
};

export const ctaContainer: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: SPRING,
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

export const defaultViewport = { once: true, margin: "-80px" } as const;
