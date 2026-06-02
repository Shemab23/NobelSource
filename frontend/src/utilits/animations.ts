import { type Variants } from "framer-motion";

export const fadeUp: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 , transition: { duration: 0.8, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.4},scale: 0.6 }
};

export const fadeIn: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1},
    exit: { opacity: 0}
};

export const Swap: Variants = {
    initial: { opacity: 0,y: 10},
    animate: { opacity: 1, y:0 , transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.5} }
};

export const heartBeat: Variants = {
    animate:{
        scale: [0.8,1 , 1.05,1.1,1.05,1,0.8],
        transition:{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
        }
    }
}


export const staggerContainer: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Each child waits 0.1s before starting
      delayChildren: 0.3,   // Wait for the card to settle
    },
  },
};


export const slideInRight: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
};


export const modalSpring: Variants = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 300 }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 10,
    transition: { duration: 0.2 }
  }
};

export const modalPop: Variants = {
  initial: { scale: 0.9, y: 20, opacity: 0 },
  animate: {
    scale: 1,
    y: 0,
    opacity: 1,
    transition: { type: "spring", damping: 25, stiffness: 300 }
  },
  exit: {
    scale: 0.9,
    y: 20,
    opacity: 0,
    transition: { duration: 0.2 }
  }
};
