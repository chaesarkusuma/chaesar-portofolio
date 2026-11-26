import { memo, useCallback, useEffect, useRef, useState } from 'react'

const ANIMATION_CONFIG = {
  SMOOTH_TAU: 0.25,
  MIN_COPIES: 3,
  COPY_HEADROOM: 2
}

/**
 * React Bits-style LogoLoop: seamless continuous horizontal marquee with
 * automatic copy sizing, transparent CSS edge fade masks, and smooth
 * exponential deceleration on hover.
 */
function LogoLoop({
  logos,
  speed = 46,
  hoverSpeed = 0,
  ariaLabel = 'Technology stack'
}) {
  const containerRef = useRef(null)
  const trackRef = useRef(null)
  const seqRef = useRef(null)

  const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES)

  const seqWidthRef = useRef(0)
  const offsetRef = useRef(0)
  const velocityRef = useRef(speed)
  const isHoveredRef = useRef(false)
  const isInViewRef = useRef(false)
  const rafRef = useRef(null)
  const lastTimestampRef = useRef(null)

  const updateDimensions = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth ?? 0
    const sequenceWidth = seqRef.current?.getBoundingClientRect().width ?? 0
    if (sequenceWidth <= 0) return

    seqWidthRef.current = sequenceWidth
    const copiesNeeded =
      Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM
    setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded))
  }, [])

  useEffect(() => {
    const container = containerRef.current
    const seq = seqRef.current
    if (!container || !seq) return undefined

    updateDimensions()

    const resizeObserver = new ResizeObserver(updateDimensions)
    resizeObserver.observe(container)
    resizeObserver.observe(seq)

    return () => resizeObserver.disconnect()
  }, [updateDimensions, logos])

  useEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return undefined

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const step = (timestamp) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp
      }

      const deltaTime = Math.min(Math.max(0, timestamp - lastTimestampRef.current) / 1000, 0.05)
      lastTimestampRef.current = timestamp

      const targetVelocity = isHoveredRef.current ? hoverSpeed : speed
      const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU)
      velocityRef.current += (targetVelocity - velocityRef.current) * easingFactor

      const seqWidth = seqWidthRef.current
      if (seqWidth > 0) {
        offsetRef.current = (offsetRef.current + velocityRef.current * deltaTime) % seqWidth
        if (offsetRef.current < 0) offsetRef.current += seqWidth
        track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`
      }

      if (isInViewRef.current && !reducedMotionQuery.matches) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        rafRef.current = null
      }
    }

    const startLoop = () => {
      if (reducedMotionQuery.matches) {
        offsetRef.current = 0
        track.style.transform = 'translate3d(0, 0, 0)'
        return
      }
      if (rafRef.current === null && isInViewRef.current) {
        lastTimestampRef.current = null
        rafRef.current = requestAnimationFrame(step)
      }
    }

    const stopLoop = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      lastTimestampRef.current = null
    }

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        isInViewRef.current = Boolean(entries[0]?.isIntersecting)
        if (isInViewRef.current) {
          startLoop()
        } else {
          stopLoop()
        }
      },
      { threshold: 0.05 }
    )
    intersectionObserver.observe(container)

    const handleMotionChange = () => {
      if (reducedMotionQuery.matches) {
        stopLoop()
        track.style.transform = 'translate3d(0, 0, 0)'
      } else {
        startLoop()
      }
    }
    reducedMotionQuery.addEventListener('change', handleMotionChange)

    return () => {
      stopLoop()
      intersectionObserver.disconnect()
      reducedMotionQuery.removeEventListener('change', handleMotionChange)
    }
  }, [speed, hoverSpeed])

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={ariaLabel}
      onPointerEnter={(event) => {
        if (event.pointerType !== 'touch') {
          isHoveredRef.current = true
        }
      }}
      onPointerLeave={() => {
        isHoveredRef.current = false
      }}
      style={{
        maskImage:
          'linear-gradient(to right, transparent 0%, black 11%, black 89%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0%, black 11%, black 89%, transparent 100%)'
      }}
      className="relative w-full overflow-hidden py-4"
    >
      <div
        ref={trackRef}
        className="flex w-max items-center will-change-transform"
      >
        {Array.from({ length: copyCount }, (_, copyIndex) => (
          <ul
            key={copyIndex}
            ref={copyIndex === 0 ? seqRef : undefined}
            aria-hidden={copyIndex > 0}
            className="flex shrink-0 items-center"
          >
            {logos.map(({ name, Icon }) => (
              <li key={`${copyIndex}-${name}`} className="mr-12 shrink-0 sm:mr-20">
                <div
                  title={name}
                  aria-label={name}
                  className="logo-loop-icon flex items-center justify-center py-3"
                >
                  <Icon />
                </div>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}

export default memo(LogoLoop)
