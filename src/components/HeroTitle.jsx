import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const TARGET = 'Portfolio'
const TARGET_CHARS = TARGET.split('')
const UPPER_GLYPHS = 'BCDFHJKLPRSTVXYZ023456789'
const LOWER_GLYPHS = 'bcdefhjklnoprstuvxz023456789*'
const NARROW_GLYPHS = 'ijlftr1*+'
const SCRAMBLE_DURATION_MS = 320
const STEP_INTERVAL_MS = 32
const GLITCH_DURATION_MS = 240
const ENTRANCE_EASE = [0.16, 1, 0.3, 1]
const HIDDEN_STATE = { opacity: 0, y: 24, filter: 'blur(8px)' }
const VISIBLE_STATE = { opacity: 1, y: 0, filter: 'blur(0px)' }
const REDUCED_HIDDEN_STATE = { opacity: 0 }
const REDUCED_VISIBLE_STATE = { opacity: 1 }

function getScrambleGlyph(targetChar) {
  const pool =
    targetChar === targetChar.toUpperCase()
      ? UPPER_GLYPHS
      : targetChar === 'i' || targetChar === 'l'
        ? NARROW_GLYPHS
        : LOWER_GLYPHS
  return pool[Math.floor(Math.random() * pool.length)]
}

/**
 * Centered hero headline with staggered character-by-character entrance reveal
 * (rise + fade + unblur), followed seamlessly by subtle continuous vertical
 * levitation and retro scramble + chromatic shift micro-interaction on hover.
 */
function HeroTitle({ isVisible = true }) {
  const prefersReducedMotion = useReducedMotion()
  const [chars, setChars] = useState(TARGET_CHARS)
  const [isGlitching, setIsGlitching] = useState(false)
  const [isEntranceDone, setIsEntranceDone] = useState(false)
  const intervalRef = useRef(null)
  const glitchTimerRef = useRef(null)
  const activeRef = useRef(false)

  const clearTimers = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (glitchTimerRef.current !== null) {
      window.clearTimeout(glitchTimerRef.current)
      glitchTimerRef.current = null
    }
    activeRef.current = false
  }, [])

  useEffect(() => clearTimers, [clearTimers])

  const triggerInteraction = useCallback(() => {
    if (!isEntranceDone || activeRef.current || prefersReducedMotion) return

    activeRef.current = true
    setIsGlitching(true)

    glitchTimerRef.current = window.setTimeout(() => {
      setIsGlitching(false)
    }, GLITCH_DURATION_MS)

    const startTime = performance.now()
    intervalRef.current = window.setInterval(() => {
      const elapsed = performance.now() - startTime
      const progress = Math.min(elapsed / SCRAMBLE_DURATION_MS, 1)
      const lockedCount = Math.floor(progress * TARGET_CHARS.length)

      if (progress >= 1) {
        clearTimers()
        setChars(TARGET_CHARS)
        return
      }

      setChars(
        TARGET_CHARS.map((targetChar, index) => {
          if (index < lockedCount) return targetChar
          return getScrambleGlyph(targetChar)
        })
      )
    }, STEP_INTERVAL_MS)
  }, [clearTimers, isEntranceDone, prefersReducedMotion])

  const hiddenState = prefersReducedMotion ? REDUCED_HIDDEN_STATE : HIDDEN_STATE
  const visibleState = prefersReducedMotion ? REDUCED_VISIBLE_STATE : VISIBLE_STATE

  return (
    <div className={`${isEntranceDone ? 'hero-levitate ' : ''}my-1.5 sm:my-2.5`}>
      <h1
        aria-label={TARGET}
        onMouseEnter={triggerInteraction}
        onFocus={triggerInteraction}
        tabIndex={0}
        style={{ fontFamily: "'Lazy Arie', serif" }}
        className={`cursor-default select-none py-0.5 text-center text-[clamp(2.85rem,11.2vw,8.25rem)] font-normal leading-[1.15] text-[#DCDCDC] focus:outline-none sm:py-1 ${
          isGlitching ? 'hero-chromatic-glitch' : ''
        }`}
      >
        {TARGET_CHARS.map((targetChar, index) => (
          <span
            key={index}
            className="relative inline-block tracking-normal [&:not(:last-child)]:mr-[0.025em]"
            aria-hidden="true"
          >
            {/* Invisible reference glyph preserves exact kerning & width with zero jitter */}
            <span className="invisible">{targetChar}</span>
            <motion.span
              initial={hiddenState}
              animate={isVisible ? visibleState : hiddenState}
              transition={{
                duration: prefersReducedMotion ? 0.2 : 0.9,
                delay: prefersReducedMotion ? 0 : 0.12 + index * 0.05,
                ease: ENTRANCE_EASE
              }}
              onAnimationComplete={
                index === TARGET_CHARS.length - 1
                  ? () => {
                      if (isVisible) setIsEntranceDone(true)
                    }
                  : undefined
              }
              className={`absolute inset-0 flex items-center justify-center ${
                isEntranceDone ? '' : 'will-change-[transform,opacity,filter]'
              }`}
            >
              {chars[index]}
            </motion.span>
          </span>
        ))}
      </h1>
    </div>
  )
}

export default memo(HeroTitle)
