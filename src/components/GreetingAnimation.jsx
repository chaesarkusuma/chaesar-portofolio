import { memo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// Each writing system gets a font stack suited to it, with the Fraunces
// display serif used only where it renders well (Latin script); other
// scripts fall back to a clean native sans/serif so weight and proportion
// stay balanced instead of forcing a Latin serif's metrics onto them.
const SCRIPT_FONTS = {
  latin: "'Fraunces', serif",
  jp: "'Noto Sans JP', sans-serif",
  sc: "'Noto Sans SC', sans-serif",
  kr: "'Noto Sans KR', sans-serif",
  ar: "'Noto Naskh Arabic', serif"
}

function GreetingAnimation({ greeting, prefersReducedMotion }) {
  const enterDuration = prefersReducedMotion ? 0.07 : 0.15
  const exitDuration = prefersReducedMotion ? 0.05 : 0.11

  return (
    <div className="relative flex h-[18vh] min-h-[120px] w-full items-center justify-center sm:h-[22vh]">
      <AnimatePresence initial={true}>
        <motion.h1
          key={greeting.text}
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.98 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: enterDuration, ease: [0.22, 1, 0.36, 1] }
          }}
          exit={
            prefersReducedMotion
              ? { opacity: 0, transition: { duration: exitDuration } }
              : {
                  opacity: 0,
                  y: -14,
                  scale: 0.98,
                  transition: { duration: exitDuration, ease: [0.4, 0, 1, 1] }
                }
          }
          lang={greeting.code}
          dir={greeting.dir || 'ltr'}
          style={{
            fontFamily: SCRIPT_FONTS[greeting.script],
            willChange: 'transform, opacity'
          }}
          className="absolute inset-x-0 select-none px-6 text-center text-[clamp(2.75rem,9vw,6rem)] font-normal leading-[1.15] text-paper"
        >
          {greeting.text}
        </motion.h1>
      </AnimatePresence>
    </div>
  )
}

export default memo(GreetingAnimation)
