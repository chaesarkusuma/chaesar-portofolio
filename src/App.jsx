import { useCallback, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import CustomCursor from './components/CustomCursor.jsx'
import IntroLoader from './components/IntroLoader.jsx'
import LandingPage from './components/LandingPage.jsx'

export default function App() {
  const [finished, setFinished] = useState(false)
  const lenisRef = useRef(null)
  const finishedRef = useRef(false)
  const syncLoopRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 1,
      respectReducedMotion: true
    })

    lenisRef.current = lenis
    if (!finishedRef.current) {
      lenis.stop()
    }

    let rafId = null

    const raf = (time) => {
      lenis.raf(time)
      if (finishedRef.current && document.visibilityState !== 'hidden') {
        rafId = requestAnimationFrame(raf)
      } else {
        rafId = null
      }
    }

    const syncLoop = () => {
      const shouldRun = finishedRef.current && document.visibilityState !== 'hidden'
      if (shouldRun && rafId === null) {
        rafId = requestAnimationFrame(raf)
      } else if (!shouldRun && rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
    }

    syncLoopRef.current = syncLoop
    document.addEventListener('visibilitychange', syncLoop)
    syncLoop()

    return () => {
      syncLoopRef.current = null
      document.removeEventListener('visibilitychange', syncLoop)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  useEffect(() => {
    finishedRef.current = finished
    if (finished && lenisRef.current) {
      lenisRef.current.start()
      syncLoopRef.current?.()
    }
  }, [finished])

  const scrollTo = useCallback((target, options = {}) => {
    const lenis = lenisRef.current
    const targetId = typeof target === 'string' ? target.replace(/^#/, '') : ''
    const targetEl =
      typeof target === 'string'
        ? targetId
          ? document.getElementById(targetId)
          : null
        : target

    if (target !== 0 && !targetEl) return

    if (lenis) {
      lenis.scrollTo(target === '#home' || target === 0 ? 0 : targetEl, {
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        ...options
      })
    } else if (targetEl instanceof Element) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  return (
    <div className="relative min-h-screen w-full bg-ink">
      <LandingPage isVisible={finished} onScrollTo={scrollTo} />

      {/* IntroLoader stays mounted until its own exit transition completes,
          then fades cleanly into the landing page underneath. */}
      <IntroLoader onFinish={() => setFinished(true)} />
      <CustomCursor />
    </div>
  )
}
