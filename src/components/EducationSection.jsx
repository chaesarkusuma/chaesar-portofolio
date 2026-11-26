import { memo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const EDUCATION_ITEMS = [
  {
    id: 1,
    number: '1',
    institution: 'IDN Boarding School',
    logo: '/logos/idn.png',
    logoBgClass: 'border-white/15 bg-white/[0.06] p-1.5',
    period: '2025 – Present',
    title: 'Vocational High School',
    location: 'Bogor',
    badge: 'SMA'
  },
  {
    id: 2,
    number: '2',
    institution: 'INTERNATIONAL PROGRAM ICBS RIAU',
    logo: '/logos/icbs.jpg',
    logoBgClass: 'border-white/20 bg-white/95 p-1',
    period: '2022 – 2025',
    title: 'Junior High School',
    location: 'Riau',
    badge: 'SMP'
  }
]

const TRANSITION_STYLE = {
  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
}

/**
 * Vertical Education timeline with hover-driven focus: item 1 (IDN Boarding School)
 * is active by default with a glowing white number badge while item 2 stays muted;
 * hovering or focusing item 2 shifts the active highlight to it until pointer exit.
 */
function EducationSection() {
  const prefersReducedMotion = useReducedMotion()
  const [hoveredId, setHoveredId] = useState(null)
  const activeId = hoveredId ?? EDUCATION_ITEMS[0].id

  const hidden = prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }
  const visible = prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }

  return (
    <motion.div
      initial={hidden}
      whileInView={visible}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: prefersReducedMotion ? 0.2 : 0.75, ease: [0.16, 1, 0.3, 1] }}
      aria-labelledby="education-heading"
      className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-6 pt-12 sm:px-10 sm:pb-10 sm:pt-16 lg:px-14"
    >
      <h2
        id="education-heading"
        className="mb-10 font-sans text-2xl font-extrabold tracking-tight text-[#F5F5F5] sm:mb-12 sm:text-3xl"
      >
        Education
      </h2>

      <ol
        onPointerLeave={() => setHoveredId(null)}
        className="relative flex flex-col gap-10 sm:gap-12"
      >
        {EDUCATION_ITEMS.map((item, index) => {
          const isActive = activeId === item.id
          const isLast = index === EDUCATION_ITEMS.length - 1

          return (
            <li
              key={item.id}
              onPointerEnter={(event) => {
                if (event.pointerType !== 'touch') {
                  setHoveredId(item.id)
                }
              }}
              onPointerLeave={() => setHoveredId(null)}
              onFocus={() => setHoveredId(item.id)}
              onBlur={() => setHoveredId(null)}
              onPointerUp={(event) => {
                if (event.pointerType === 'touch') {
                  setHoveredId((prev) => (prev === item.id ? null : item.id))
                }
              }}
              tabIndex={0}
              className="relative flex items-start gap-5 focus:outline-none sm:gap-7"
            >
              {/* Timeline Number Circle + Vertical Connector Line */}
              <div className="relative flex shrink-0 flex-col items-center">
                <span
                  style={{
                    ...TRANSITION_STYLE,
                    backgroundColor: isActive ? '#ffffff' : 'rgba(14, 15, 18, 0.92)',
                    borderColor: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.15)',
                    color: isActive ? '#080808' : 'rgba(255, 255, 255, 0.35)',
                    boxShadow: isActive
                      ? '0 0 24px rgba(255, 255, 255, 0.45), 0 0 8px rgba(255, 255, 255, 0.65)'
                      : 'none'
                  }}
                  className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border font-sans text-sm font-bold sm:h-12 sm:w-12 sm:text-base"
                >
                  {item.number}
                </span>

                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-12 h-[calc(100%+2.5rem)] w-px bg-white/15 sm:h-[calc(100%+3rem)]"
                  />
                )}
              </div>

              {/* Entry Details (active row at full 1.0 brightness, inactive row muted at 0.32) */}
              <div
                style={{
                  ...TRANSITION_STYLE,
                  opacity: isActive ? 1 : 0.32
                }}
                className="min-w-0 flex-1 pt-0.5"
              >
                {/* Row 1: Logo + Institution Name + Year Badge */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3.5">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border sm:h-11 sm:w-11 ${item.logoBgClass}`}
                    >
                      <img
                        src={item.logo}
                        alt={`${item.institution} logo`}
                        width={40}
                        height={40}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className="h-full w-full select-none object-contain"
                      />
                    </div>
                    <h3 className="font-sans text-base font-bold tracking-tight text-[#F5F5F5] sm:text-lg">
                      {item.institution}
                    </h3>
                  </div>

                  <span className="shrink-0 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1 font-mono text-[11px] text-[#D4D6DC] sm:text-xs">
                    {item.period}
                  </span>
                </div>

                {/* Row 2: Main Level Heading */}
                <p className="mt-2.5 font-sans text-xl font-extrabold tracking-tight text-[#F5F5F5] sm:text-2xl">
                  {item.title}
                </p>

                {/* Row 3: Location • Badge */}
                <div className="mt-2 flex flex-wrap items-center gap-2.5 font-sans text-xs text-[#B4B7BF] sm:text-sm">
                  <span>{item.location}</span>
                  <span aria-hidden="true" className="text-white/35">
                    &bull;
                  </span>
                  <span className="rounded-md border border-white/15 bg-white/[0.04] px-2.5 py-0.5 font-sans text-[11px] font-medium text-[#E4E4E7] sm:text-xs">
                    {item.badge}
                  </span>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </motion.div>
  )
}

export default memo(EducationSection)
