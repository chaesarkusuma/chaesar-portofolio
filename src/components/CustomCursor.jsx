import { useEffect, useRef, useState } from 'react'

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, label, h1[aria-label="Portfolio"]'

/**
 * Minimal dark-space pixel-art custom cursor:
 * - Precision white pixel crosshair (+) with subtle glow at exact pointer coords.
 * - Smoothly trailing thin ring outline that expands into pixel corner brackets ([ ])
 *   when hovering interactive targets (CHAESAR headline, nav, buttons, links).
 * - Uses direct DOM transform: translate3d with auto-idle rAF (zero React re-renders
 *   on pointer move) and disables itself completely on touch / coarse-pointer devices.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const rootRef = useRef(null)
  const crosshairRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    const coarsePointerQuery = window.matchMedia('(pointer: coarse)')

    const checkEnabled = () => finePointerQuery.matches && !coarsePointerQuery.matches
    setEnabled(checkEnabled())

    const handleMediaChange = () => setEnabled(checkEnabled())
    finePointerQuery.addEventListener('change', handleMediaChange)
    coarsePointerQuery.addEventListener('change', handleMediaChange)

    return () => {
      finePointerQuery.removeEventListener('change', handleMediaChange)
      coarsePointerQuery.removeEventListener('change', handleMediaChange)
    }
  }, [])

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove('custom-cursor-active')
      return undefined
    }

    const root = rootRef.current
    const crosshair = crosshairRef.current
    const ring = ringRef.current
    if (!root || !crosshair || !ring) return undefined

    document.documentElement.classList.add('custom-cursor-active')

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    let targetX = -100
    let targetY = -100
    let ringX = -100
    let ringY = -100
    let initialized = false
    let visible = false
    let hovering = false
    let pressed = false
    let rafId = null
    let lastTime = 0

    const setHoverState = (nextHover) => {
      if (nextHover === hovering) return
      hovering = nextHover
      root.dataset.hover = nextHover ? 'true' : 'false'
    }

    const setVisibleState = (nextVisible) => {
      if (nextVisible === visible) return
      visible = nextVisible
      root.dataset.visible = nextVisible ? 'true' : 'false'
    }

    const setPressedState = (nextPressed) => {
      if (nextPressed === pressed) return
      pressed = nextPressed
      root.dataset.pressed = nextPressed ? 'true' : 'false'
    }

    const renderFrame = (now) => {
      const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 1 / 60
      lastTime = now

      if (reducedMotionQuery.matches) {
        ringX = targetX
        ringY = targetY
      } else {
        // Frame-rate independent exponential smoothing (~0.18 at 60fps)
        const ease = 1 - Math.exp(-12.5 * dt)
        ringX += (targetX - ringX) * ease
        ringY += (targetY - ringY) * ease
      }

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`

      const dx = Math.abs(targetX - ringX)
      const dy = Math.abs(targetY - ringY)
      if (dx > 0.08 || dy > 0.08) {
        rafId = requestAnimationFrame(renderFrame)
      } else {
        ringX = targetX
        ringY = targetY
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
        rafId = null
        lastTime = 0
      }
    }

    const scheduleLoop = () => {
      if (rafId === null) {
        lastTime = 0
        rafId = requestAnimationFrame(renderFrame)
      }
    }

    const handlePointerMove = (event) => {
      if (event.pointerType === 'touch') {
        setVisibleState(false)
        setHoverState(false)
        return
      }

      targetX = event.clientX
      targetY = event.clientY

      if (!initialized) {
        initialized = true
        ringX = targetX
        ringY = targetY
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
      }

      crosshair.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`
      setVisibleState(true)

      const isInteractive =
        event.target instanceof Element && Boolean(event.target.closest(INTERACTIVE_SELECTOR))
      setHoverState(isInteractive)

      scheduleLoop()
    }

    const handlePointerDown = (event) => {
      if (event.pointerType === 'touch') return
      setPressedState(true)
    }

    const handlePointerUp = () => {
      setPressedState(false)
    }

    const handleMouseLeave = () => {
      setVisibleState(false)
      setHoverState(false)
      setPressedState(false)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerdown', handlePointerDown, { passive: true })
    window.addEventListener('pointerup', handlePointerUp, { passive: true })
    document.documentElement.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('blur', handleMouseLeave)

    return () => {
      document.documentElement.classList.remove('custom-cursor-active')
      if (rafId !== null) cancelAnimationFrame(rafId)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('blur', handleMouseLeave)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      ref={rootRef}
      data-visible="false"
      data-hover="false"
      data-pressed="false"
      className="custom-cursor-root pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
      aria-hidden="true"
    >
      {/* Trailing ring / interactive corner brackets */}
      <div ref={ringRef} className="custom-cursor-ring-wrap">
        <div className="custom-cursor-ring-inner">
          {/* Idle thin ring outline */}
          <svg
            viewBox="0 0 32 32"
            className="custom-cursor-ring-svg"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="16"
              cy="16"
              r="13.5"
              stroke="rgba(245, 245, 245, 0.36)"
              strokeWidth="1"
            />
          </svg>

          {/* Hover corner brackets [ ] */}
          <svg
            viewBox="0 0 40 40"
            shapeRendering="crispEdges"
            className="custom-cursor-brackets-svg"
            fill="none"
            aria-hidden="true"
          >
            {/* Top-left bracket */}
            <path d="M9 1 H1 V9" stroke="rgba(245, 245, 245, 0.85)" strokeWidth="1.25" />
            {/* Top-right bracket */}
            <path d="M31 1 H39 V9" stroke="rgba(245, 245, 245, 0.85)" strokeWidth="1.25" />
            {/* Bottom-left bracket */}
            <path d="M1 31 V39 H9" stroke="rgba(245, 245, 245, 0.85)" strokeWidth="1.25" />
            {/* Bottom-right bracket */}
            <path d="M39 31 V39 H31" stroke="rgba(245, 245, 245, 0.85)" strokeWidth="1.25" />
          </svg>
        </div>
      </div>

      {/* Exact-position white pixel crosshair (+) with soft glow */}
      <div ref={crosshairRef} className="custom-cursor-crosshair-wrap">
        <svg
          width="13"
          height="13"
          viewBox="0 0 13 13"
          shapeRendering="crispEdges"
          className="custom-cursor-crosshair-svg"
          aria-hidden="true"
        >
          <rect x="6" y="1" width="1" height="4" fill="#F5F5F5" fillOpacity="0.88" />
          <rect x="6" y="8" width="1" height="4" fill="#F5F5F5" fillOpacity="0.88" />
          <rect x="1" y="6" width="4" height="1" fill="#F5F5F5" fillOpacity="0.88" />
          <rect x="8" y="6" width="4" height="1" fill="#F5F5F5" fillOpacity="0.88" />
          <rect x="6" y="6" width="1" height="1" fill="#FFFFFF" />
        </svg>
      </div>
    </div>
  )
}
