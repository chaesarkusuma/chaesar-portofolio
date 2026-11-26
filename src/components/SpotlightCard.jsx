import { useRef, useState } from 'react'

/**
 * React Bits-style SpotlightCard: tracks cursor coordinates via cached bounding rect
 * and CSS custom properties (--mouse-x, --mouse-y) with lightweight backdrop blur.
 */
export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(255, 255, 255, 0.15)'
}) {
  const divRef = useRef(null)
  const rectRef = useRef(null)
  const [isFocused, setIsFocused] = useState(false)
  const [opacity, setOpacity] = useState(0)

  const syncRect = () => {
    if (divRef.current) {
      rectRef.current = divRef.current.getBoundingClientRect()
    }
  }

  const handleMouseMove = (event) => {
    if (!divRef.current || isFocused) return
    if (!rectRef.current) syncRect()
    const rect = rectRef.current
    if (!rect) return
    divRef.current.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`)
    divRef.current.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`)
  }

  const handleFocus = () => {
    setIsFocused(true)
    setOpacity(0.6)
  }

  const handleBlur = () => {
    setIsFocused(false)
    setOpacity(0)
  }

  const handleMouseEnter = () => {
    syncRect()
    setOpacity(0.65)
  }

  const handleMouseLeave = () => {
    rectRef.current = null
    setOpacity(0)
  }

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ '--spotlight-color': spotlightColor }}
      className={`relative overflow-hidden rounded-3xl border border-white/[0.1] bg-[#111214]/[0.94] p-7 shadow-[0_14px_40px_rgba(0,0,0,0.48)] backdrop-blur-sm sm:p-8 ${className}`}
    >
      {/* Interior radial cursor spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background:
            'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--spotlight-color), transparent 40%)'
        }}
      />

      {/* Thin cursor-tracking border highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] p-px transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background:
            'radial-gradient(320px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.45), transparent 45%)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude'
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  )
}
