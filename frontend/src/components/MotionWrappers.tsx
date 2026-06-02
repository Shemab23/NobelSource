import { motion, AnimatePresence } from "framer-motion"
import {
  fadeUp,
  heartBeat,
  Swap,
  staggerContainer,
  slideInRight,
  modalSpring,
  fadeIn,
  modalPop,
} from "@/utilits/animations"

interface Props {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

// Wrapper for general elements that pop up
export const Reveal = ({ children, className }: Props) => (
  <motion.div
    variants={fadeUp}
    initial="initial"
    animate="animate"
    exit="exit"
    className={className}
  >
    {children}
  </motion.div>
)

// Wrapper for text that swaps (like Slogans)
export const ItemSwap = ({
  children,
  itemKey,
  className,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: Props & { itemKey: any }) => (
  <div className={`relative ${className}`}>
    <AnimatePresence mode="wait">
      <motion.div
        key={itemKey}
        variants={Swap}
        initial="initial"
        animate="animate"
        exit="exit"
        className="absolute inset-0"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  </div>
)

// Wrapper for the pulsing logo
export const Pulse = ({ children, className }: Props) => (
  <motion.div variants={heartBeat} animate="animate" className={className}>
    {children}
  </motion.div>
)

// Wrap the whole form in this
export const StaggeredForm = ({ children, className }: Props) => (
  <motion.div
    variants={staggerContainer}
    initial="initial"
    animate="animate"
    className={className}
  >
    {children}
  </motion.div>
)

// Wrap each Label/Input pair or Button in this
export const FormItem = ({ children, className }: Props) => (
  <motion.div variants={slideInRight} className={className}>
    {children}
  </motion.div>
)

// High-end Modal transition
export const ModalWrapper = ({ children, className }: Props) => (
  <motion.div
    variants={modalSpring}
    initial="initial"
    animate="animate"
    exit="exit"
    className={className}
  >
    {children}
  </motion.div>
)

// The Dark Backdrop
export const Overlay = ({ children, className, onClick }: Props) => (
  <motion.div
    variants={fadeIn}
    initial="initial"
    animate="animate"
    exit="exit"
    onClick={onClick}
    className={`fixed inset-0 z-100 flex items-center justify-center p-4 ${className}`}
  >
    {children}
  </motion.div>
)

// The actual Terms Card
export const ModalCard = ({ children, className }: Props) => (
  <motion.div
    variants={modalPop}
    initial="initial"
    animate="animate"
    exit="exit"
    // Stop click-propagation so clicking the card doesn't trigger the overlay's onClick
    onClick={(e) => e.stopPropagation()}
    className={className}
  >
    {children}
  </motion.div>
)
