import { AnimatePresence, motion } from 'framer-motion'
import { useIntroSequence } from '../hooks/useIntroSequence.js'
import BackgroundEffects from './BackgroundEffects.jsx'
import GreetingAnimation from './GreetingAnimation.jsx'
import ProgressBar from './ProgressBar.jsx'

/**
 * CHAESAR — Multilingual Intro Experience.
 *
 * Drop this component at the root of a page, above your real content.
 * It pre-warms fonts, plays all 11 greetings smoothly, then calls `onFinish`
 * once and fades itself out.
 */
export default function IntroLoader({ onFinish }) {
  const {
    greeting,
    progress,
    progressValue,
    isReady,
    isComplete,
    prefersReducedMotion
  } = useIntroSequence({
    onComplete: onFinish
  })

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          key="chaesar-intro"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-ink py-[8vh] sm:py-[10vh]"
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.12 : 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          <BackgroundEffects prefersReducedMotion={prefersReducedMotion} />

          <motion.div
            className="relative z-10 flex w-full flex-col items-center justify-center gap-8 px-6 sm:gap-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: isReady ? 1 : 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {isReady ? (
              <GreetingAnimation greeting={greeting} prefersReducedMotion={prefersReducedMotion} />
            ) : (
              <div className="h-[18vh] min-h-[120px] w-full sm:h-[22vh]" aria-hidden="true" />
            )}
            <ProgressBar
              progress={progress}
              progressValue={progressValue}
              prefersReducedMotion={prefersReducedMotion}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
