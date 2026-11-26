import { memo, useState } from 'react'
import { LayoutGroup, motion } from 'framer-motion'

const SMOOTH_CURVE = 'cubic-bezier(0.16, 1, 0.3, 1)'

/**
 * Floating dark-mode Pill Nav inspired by React Bits PillNav:
 * - Left circular avatar badge (rounded-full) with 1.5s 360deg hover spin
 * - Right capsule container (rounded-full) with 1.55s rising dome hover fill,
 *   1.45s roll-over label animation, and a smoothly sliding active dot indicator.
 */
function PillNav({ items, activeItem, onSelect, onScrollTo }) {
  const [hoveredItem, setHoveredItem] = useState(null)
  const [isLogoHovered, setIsLogoHovered] = useState(false)

  const handleNavigate = (event, item) => {
    onSelect(item.label)
    const targetId = item.href.replace(/^#/, '')
    const targetEl = targetId ? document.getElementById(targetId) : null
    event.preventDefault()

    if (targetEl && onScrollTo) {
      onScrollTo(item.href)
    } else if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav
      aria-label="Primary"
      className="pointer-events-auto flex max-w-full items-center gap-1.5 sm:gap-2.5"
    >
      {/* Left Logo Circle */}
      <a
        href={items[0].href}
        onClick={(event) => handleNavigate(event, items[0])}
        onPointerEnter={(event) => {
          if (event.pointerType !== 'touch') {
            setIsLogoHovered(true)
          }
        }}
        onPointerLeave={() => setIsLogoHovered(false)}
        onFocus={() => setIsLogoHovered(true)}
        onBlur={() => setIsLogoHovered(false)}
        aria-label="Home"
        style={{
          transitionProperty: 'transform, border-color',
          transitionDuration: '1500ms',
          transitionTimingFunction: SMOOTH_CURVE
        }}
        className={`flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-[#111214]/[0.92] shadow-[0_8px_24px_rgba(0,0,0,0.4)] backdrop-blur-sm focus:outline-none focus-visible:border-white/40 sm:h-11 sm:w-11 ${
          isLogoHovered ? 'scale-105 border-white/30' : 'scale-100 border-white/[0.12]'
        }`}
      >
        <img
          src="/avatar.png"
          alt="Avatar"
          width={32}
          height={32}
          decoding="async"
          draggable={false}
          style={{
            transform: isLogoHovered
              ? 'translate3d(0, 3%, 0) rotate(360deg) scale(1.05)'
              : 'translate3d(0, 3%, 0) rotate(0deg) scale(1)',
            transitionProperty: 'transform',
            transitionDuration: '1500ms',
            transitionTimingFunction: SMOOTH_CURVE
          }}
          className="pixelated h-7 w-7 select-none object-contain will-change-transform sm:h-8 sm:w-8"
        />
      </a>

      {/* Right Pill Container */}
      <LayoutGroup id="pill-nav-group">
        <ul className="flex items-center rounded-full border border-white/[0.12] bg-[#111214]/[0.92] p-1 shadow-[0_8px_24px_rgba(0,0,0,0.4)] backdrop-blur-sm sm:gap-0.5 sm:p-1.5">
          {items.map((item) => {
            const isActive = activeItem === item.label
            const isHovered = hoveredItem === item.label

            return (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={(event) => handleNavigate(event, item)}
                  onPointerEnter={(event) => {
                    if (event.pointerType !== 'touch') {
                      setHoveredItem(item.label)
                    }
                  }}
                  onPointerLeave={() => setHoveredItem(null)}
                  onFocus={() => setHoveredItem(item.label)}
                  onBlur={() => setHoveredItem(null)}
                  aria-current={isActive ? 'page' : undefined}
                  className="relative isolate flex transform-gpu items-center justify-center overflow-hidden rounded-full px-2.5 pb-[9px] pt-2 font-mono text-[9.5px] font-medium tracking-[0.08em] focus:outline-none sm:px-5 sm:pb-[10px] sm:pt-2 sm:text-[11px] sm:tracking-[0.18em]"
                >
                  {/* Rising dome pill fill from bottom (1.55s) */}
                  <span
                    aria-hidden="true"
                    style={{
                      transitionProperty: 'transform',
                      transitionDuration: '1550ms',
                      transitionTimingFunction: SMOOTH_CURVE
                    }}
                    className={`pointer-events-none absolute bottom-0 left-1/2 aspect-square w-[165%] -translate-x-1/2 rounded-full bg-[#F2F2F2] will-change-transform ${
                      isHovered ? 'translate-y-[42%] scale-100' : 'translate-y-[74%] scale-[0.45]'
                    }`}
                  />

                  {/* Roll-over text stack (1.45s) */}
                  <span className="relative z-10 block h-[1.25em] overflow-hidden leading-[1.25em]">
                    <span
                      style={{
                        transitionProperty: 'transform, opacity',
                        transitionDuration: '1450ms',
                        transitionTimingFunction: SMOOTH_CURVE
                      }}
                      className={`block will-change-transform ${
                        isActive ? 'text-[#F2F2F2]' : 'text-[#8C8C8C]'
                      } ${isHovered ? '-translate-y-[105%] opacity-0' : 'translate-y-0 opacity-100'}`}
                    >
                      {item.label}
                    </span>
                    <span
                      aria-hidden="true"
                      style={{
                        transitionProperty: 'transform, opacity',
                        transitionDuration: '1450ms',
                        transitionTimingFunction: SMOOTH_CURVE
                      }}
                      className={`absolute inset-x-0 top-0 block text-[#0A0A0A] will-change-transform ${
                        isHovered ? 'translate-y-0 opacity-100' : 'translate-y-[105%] opacity-0'
                      }`}
                    >
                      {item.label}
                    </span>
                  </span>

                  {/* Sliding active dot at bottom inside the active capsule */}
                  {isActive && (
                    <motion.span
                      layoutId="pill-nav-active-dot"
                      transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.8 }}
                      style={{
                        transitionProperty: 'background-color',
                        transitionDuration: '1100ms',
                        transitionTimingFunction: SMOOTH_CURVE
                      }}
                      className={`pointer-events-none absolute bottom-[3px] left-1/2 z-20 h-[3.5px] w-[3.5px] -translate-x-1/2 rounded-full ${
                        isHovered ? 'bg-[#0A0A0A]' : 'bg-[#F5F5F5]'
                      }`}
                    />
                  )}
                </a>
              </li>
            )
          })}
        </ul>
      </LayoutGroup>
    </nav>
  )
}

export default memo(PillNav)
