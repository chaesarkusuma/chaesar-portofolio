import { memo, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { GALLERY_PHOTOS } from '../data/portfolioData.js'

const LAYER_REVEAL_WINDOWS = {
  1: [0.04, 0.2],
  2: [0.12, 0.28],
  3: [0.2, 0.36]
}

const INTRA_LAYER_STEP = 0.03
const EXPLODE_START = 0.56

function getPhotoScrollRange(photo) {
  const [enter, focusStart] =
    LAYER_REVEAL_WINDOWS[photo.layer] || LAYER_REVEAL_WINDOWS[2]
  const stagger = (photo.slotInLayer || 0) * INTRA_LAYER_STEP
  return [
    Math.min(0.4, enter + stagger),
    Math.min(0.46, focusStart + stagger),
    EXPLODE_START,
    photo.exitEnd || 0.94
  ]
}

/**
 * GPU-accelerated scrapbook card:
 * 1) Staggered entrance (scale 0.78 -> 1, opacity 0 -> 1) into centered cluster
 * 2) Dwell state with subtle corner overlap and interactive hover lift (z-50, scale 1.05, rotate 0)
 * 3) Scroll-driven 3D parallax scatter/explode radially outward (scale 1 -> 1.15..1.25, opacity 1 -> 0)
 */
function CollagePhotoCard({ photo, scrollYProgress, prefersReducedMotion }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isRendered, setIsRendered] = useState(false)
  const [isInteractive, setIsInteractive] = useState(false)

  const range = getPhotoScrollRange(photo)
  const opacity = useTransform(scrollYProgress, range, [0, 1, 1, 0])

  useMotionValueEvent(opacity, 'change', (latest) => {
    const visible = latest > 0.01
    const interactive = latest > 0.25

    setIsRendered((prev) => (prev === visible ? prev : visible))
    setIsInteractive((prev) => {
      if (prev === interactive) return prev
      if (!interactive) setIsHovered(false)
      return interactive
    })
  })

  const scrollScale = useTransform(
    scrollYProgress,
    range,
    prefersReducedMotion ? [1, 1, 1, 1] : [0.78, 1, 1, photo.exitScale || 1.2]
  )

  const x = useTransform(
    scrollYProgress,
    range,
    prefersReducedMotion ? ['0vw', '0vw', '0vw', '0vw'] : ['0vw', '0vw', '0vw', photo.exitX]
  )

  const y = useTransform(
    scrollYProgress,
    range,
    prefersReducedMotion ? ['0vh', '0vh', '0vh', '0vh'] : ['4vh', '0vh', '0vh', photo.exitY]
  )

  const scrollTwist = useTransform(
    scrollYProgress,
    range,
    prefersReducedMotion ? [0, 0, 0, 0] : [0, 0, 0, photo.exitTwist || 0]
  )

  return (
    <div
      style={{
        left: photo.left,
        top: photo.top,
        zIndex: isHovered ? 50 : photo.zIndex,
        visibility: isRendered ? 'visible' : 'hidden',
        pointerEvents: isInteractive ? 'auto' : 'none'
      }}
      className="absolute -translate-x-1/2 -translate-y-1/2"
    >
      <motion.div
        style={{
          x,
          y,
          scale: scrollScale,
          rotate: scrollTwist,
          opacity,
          willChange: isRendered ? 'transform, opacity' : 'auto'
        }}
        className="transform-gpu"
      >
        <motion.figure
          onPointerEnter={(event) => {
            if (event.pointerType !== 'touch' && isInteractive) {
              setIsHovered(true)
            }
          }}
          onPointerLeave={() => setIsHovered(false)}
          animate={
            prefersReducedMotion
              ? { rotate: photo.baseRotate || 0 }
              : {
                  scale: isHovered ? 1.05 : 1,
                  rotate: isHovered ? 0 : photo.baseRotate || 0,
                  y: isHovered ? -6 : 0
                }
          }
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={`relative overflow-hidden rounded-2xl border bg-[#111216] shadow-2xl transition-colors duration-300 ${
            isHovered ? 'border-white/40' : 'border-white/15'
          } ${photo.sizeClass}`}
        >
          <img
            src={photo.src}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="h-full w-full select-none object-cover object-center"
          />
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/[0.06] transition-opacity duration-300 ${
              isHovered ? 'opacity-25' : 'opacity-75'
            }`}
          />
        </motion.figure>
      </motion.div>
    </div>
  )
}

/**
 * Moments & Memories (#moments): Scroll-Driven Exploding Scrapbook Collage.
 * Renders a sticky viewport over a 180vh scroll stage: photos stagger in to a
 * tight centered cluster, support interactive hover focus, then explode radially
 * outward at varied 3D parallax speeds before Contact (#contact).
 */
function MomentsSection() {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.85', 'end end']
  })

  const headingOpacity = useTransform(
    scrollYProgress,
    [0.04, 0.18, 0.62, 0.85],
    [0, 1, 1, 0]
  )
  const headingY = useTransform(
    scrollYProgress,
    [0.04, 0.18, 0.62, 0.85],
    prefersReducedMotion ? [0, 0, 0, 0] : [16, 0, 0, -24]
  )

  return (
    <section
      id="moments"
      ref={sectionRef}
      aria-label="Moments Photo Collage"
      className="relative z-10 min-h-[180vh] h-[180vh] w-full"
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden px-4">
        <motion.div
          style={{
            opacity: headingOpacity,
            y: headingY
          }}
          className="pointer-events-none absolute inset-x-0 top-[9.5vh] z-40 text-center sm:top-[10.5vh]"
        >
          <p className="font-mono text-[10px] tracking-[0.3em] text-[#7D7D7D] sm:text-xs">
            MOMENTS &amp; MEMORIES
          </p>
        </motion.div>

        {/* Compact centered cluster box leaving wide empty space on left & right sides */}
        <div className="relative h-[450px] w-[345px] sm:h-[520px] sm:w-[560px] lg:h-[600px] lg:w-[740px]">
          {GALLERY_PHOTOS.map((photo) => (
            <CollagePhotoCard
              key={photo.id}
              photo={photo}
              scrollYProgress={scrollYProgress}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default memo(MomentsSection)
