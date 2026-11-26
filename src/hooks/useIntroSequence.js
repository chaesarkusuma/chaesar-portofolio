import { useEffect, useMemo, useRef, useState } from 'react'
import { useMotionValue } from 'framer-motion'

// Each greeting carries its own script and BCP-47 language code so
// typography and directional layout adapt cleanly per writing system.
const GREETINGS = [
  { text: 'Hello', lang: 'English', code: 'en', script: 'latin' },
  { text: 'Hola', lang: 'Spanish', code: 'es', script: 'latin' },
  { text: 'Bonjour', lang: 'French', code: 'fr', script: 'latin' },
  { text: 'Ciao', lang: 'Italian', code: 'it', script: 'latin' },
  { text: 'Hallo', lang: 'German', code: 'de', script: 'latin' },
  { text: 'Olá', lang: 'Portuguese', code: 'pt', script: 'latin' },
  { text: 'こんにちは', lang: 'Japanese', code: 'ja', script: 'jp' },
  { text: '你好', lang: 'Chinese', code: 'zh-CN', script: 'sc' },
  { text: '안녕하세요', lang: 'Korean', code: 'ko', script: 'kr' },
  { text: 'مرحباً', lang: 'Arabic', code: 'ar', script: 'ar', dir: 'rtl' },
  { text: 'Halo', lang: 'Indonesian', code: 'id', script: 'latin' }
]

const STEP_MS = 230
const HOLD_MS = 240 // pause once progress hits 100% before signalling completion
const FONT_WARM_TIMEOUT_MS = 220

const FONT_SPECS = [
  { family: '400 48px "Fraunces"', text: 'HelloHolaBonjourCiaoHalloOlá' },
  { family: '500 14px "Inter"', text: 'LOADING 0123456789%' },
  { family: '400 48px "Noto Sans JP"', text: 'こんにちは' },
  { family: '400 48px "Noto Sans SC"', text: '你好' },
  { family: '400 48px "Noto Sans KR"', text: '안녕하세요' },
  { family: '400 48px "Noto Naskh Arabic"', text: 'مرحباً' }
]

function preloadIntroFonts(timeoutMs) {
  if (typeof document === 'undefined' || !document.fonts?.load) {
    return Promise.resolve()
  }

  // Warm landing fonts quietly in the background so the Hero view appears
  // crisp immediately once the intro sequence finishes.
  void document.fonts.load('400 13px "JetBrains Mono"', 'HOME PROJECT ABOUT CONTACT BUILD LEARN GROW')

  const loads = Promise.allSettled(
    FONT_SPECS.map(({ family, text }) => document.fonts.load(family, text))
  )
  const timeout = new Promise((resolve) => window.setTimeout(resolve, timeoutMs))

  return Promise.race([loads, timeout])
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  )

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)
    const listener = (event) => setReduced(event.matches)
    query.addEventListener('change', listener)
    return () => query.removeEventListener('change', listener)
  }, [])

  return reduced
}

/**
 * Pre-warms all script fonts before starting a single rAF clock so greetings,
 * GPU progress bar (MotionValue), and percentage stay smoothly synchronized
 * from the very first page load without triggering needless React re-renders.
 */
export function useIntroSequence({ onComplete } = {}) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const totalSteps = GREETINGS.length
  const stepDuration = prefersReducedMotion ? 140 : STEP_MS
  const holdDuration = prefersReducedMotion ? 150 : HOLD_MS
  const totalDuration = useMemo(() => totalSteps * stepDuration, [totalSteps, stepDuration])

  const [isReady, setIsReady] = useState(false)
  const [index, setIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const progressValue = useMotionValue(0)

  const startRef = useRef(null)
  const frameRef = useRef(null)
  const timeoutRef = useRef(null)
  const lastIndexRef = useRef(0)
  const lastPctRef = useRef(0)
  const completedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    let cancelled = false
    completedRef.current = false
    lastIndexRef.current = 0
    lastPctRef.current = 0
    progressValue.set(0)
    setIndex(0)
    setProgress(0)

    const tick = (now) => {
      if (cancelled) return
      if (startRef.current === null) {
        startRef.current = now
      }

      const elapsed = now - startRef.current
      const ratio = Math.min(elapsed / totalDuration, 1)

      progressValue.set(ratio)

      const nextPct = Math.round(ratio * 100)
      if (nextPct !== lastPctRef.current) {
        lastPctRef.current = nextPct
        setProgress(nextPct)
      }

      const nextIndex = Math.min(Math.floor(elapsed / stepDuration), totalSteps - 1)
      if (nextIndex !== lastIndexRef.current) {
        lastIndexRef.current = nextIndex
        setIndex(nextIndex)
      }

      if (ratio < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else if (!completedRef.current) {
        completedRef.current = true
        timeoutRef.current = window.setTimeout(() => {
          if (!cancelled) {
            setIsComplete(true)
            onCompleteRef.current?.()
          }
        }, holdDuration)
      }
    }

    const warmTimeout = prefersReducedMotion ? 100 : FONT_WARM_TIMEOUT_MS
    preloadIntroFonts(warmTimeout).then(() => {
      if (cancelled) return
      // Wait two animation frames after fonts settle so initial paint commits
      // smoothly before the clock starts advancing from 0%.
      frameRef.current = requestAnimationFrame(() => {
        if (cancelled) return
        setIsReady(true)
        startRef.current = null
        frameRef.current = requestAnimationFrame(tick)
      })
    })

    return () => {
      cancelled = true
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
      }
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [totalDuration, stepDuration, totalSteps, holdDuration, prefersReducedMotion, progressValue])

  return {
    greeting: GREETINGS[index],
    index,
    total: totalSteps,
    progress,
    progressValue,
    isReady,
    isComplete,
    prefersReducedMotion
  }
}
