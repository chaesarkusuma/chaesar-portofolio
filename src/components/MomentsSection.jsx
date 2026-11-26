import { memo, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { GALLERY_PHOTOS } from '../data/portfolioData.js'

const LAYER_BASE_WINDOWS = {
  1: [0.04, 0.16, 0.25, 0.44],
  2: [0.24, 0.38, 0.48, 0.68],
  3: [0.46, 0.6, 0.7, 0.89]
}

const INTRA_LAYER_STEP = 0.035

function getPhotoScrollRange(layer, slotInLayer) {
  const [enter, focusStart, focusEnd, exit] =
    LAYER_BASE_WINDOWS[layer] || LAYER_BASE_WINDOWS[2]
  const offset = (slotInLayer || 0) * INTRA_LAYER_STEP
  return [
    Math.min(0.82, enter + offset),
    Math.min(0.86, focusStart + offset),
    Math.min(0.91, focusEnd + offset),
    Math.min(0.98, exit + offset)
  ]
}

/**
 * GPU-composited floating photo card driving Z-axis depth fly-through strictly
 * with transform (translate3d + scale + rotate) and opacity—avoiding dynamic
 * per-frame CSS blur() filters—while releasing GPU layers on hidden waves.
 */
function CollagePhotoCard({ photo, scrollYProgress, prefersReducedMotion }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isRendered, setIsRendered] = useState(false)
  const [isInteractive, setIsInteractive] = useState(false)

  const range = getPhotoScrollRange(photo.layer, photo.slotInLayer)
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
    prefersReducedMotion ? [1, 1, 1, 1] : [0.7, 1, 1.06, 1.42]
  )

  const x = useTransform(
    scrollYProgress,
    range,
    prefersReducedMotion
      ? ['0vw', '0vw', '0vw', '0vw']
      : [photo.enterX || '0vw', '0vw', '0vw', photo.exitX]
  )

  const y = useTransform(
    scrollYProgress,
    range,
    prefersReducedMotion
      ? ['0vh', '0vh', '0vh', '0vh']
      : [photo.enterY || '0vh', '0vh', '0vh', photo.exitY]
  )

  const rotate = useTransform(
    scrollYProgress,
    range,
    prefersReducedMotion
      ? [photo.baseRotate, photo.baseRotate, photo.baseRotate, photo.baseRotate]
      : [photo.baseRotate * 0.65, photo.baseRotate, photo.baseRotate, photo.exitRotate]
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
          rotate,
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
              ? undefined
              : {
                  scale: isHovered ? 1.08 : 1,
                  rotate: isHovered ? -photo.baseRotate * 0.85 : 0,
                  y: isHovered ? -8 : 0
                }
          }
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`relative overflow-hidden rounded-2xl border bg-[#111216] shadow-[0_14px_34px_rgba(0,0,0,0.58)] transition-colors duration-300 ${
            isHovered ? 'border-white/35' : 'border-white/10'
          } ${photo.sizeClass}`}
        >
          <img
            src={photo.src}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
            draggable={false}
            className={`h-full w-full select-none object-cover ${photo.objectPosition || 'object-center'}`}
          />
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/[0.05] transition-opacity duration-300 ${
              isHovered ? 'opacity-40' : 'opacity-80'
            }`}
          />
        </motion.figure>
      </motion.div>
    </div>
  )
}

/**
 * Floating Photo Collage / Moments (#moments):
 * Sticky viewport over the continuous 3D topographic contour canvas with a 300vh
 * scroll track. Waves relay along the Z-axis using pure transform + opacity.
 */
function MomentsSection() {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.8', 'end end']
  })

  const headingOpacity = useTransform(
    scrollYProgress,
    [0.04, 0.16, 0.78, 0.96],
    [0, 1, 1, 0]
  )
  const headingY = useTransform(
    scrollYProgress,
    [0.04, 0.16, 0.78, 0.96],
    prefersReducedMotion ? [0, 0, 0, 0] : [16, 0, 0, -24]
  )

  return (
    <section
      id="moments"
      ref={sectionRef}
      aria-label="Moments Photo Collage"
      className="relative z-10 h-[300vh] w-full"
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <motion.div
          style={{
            opacity: headingOpacity,
            y: headingY
          }}
          className="pointer-events-none absolute inset-x-0 top-[10.5vh] z-40 text-center sm:top-[11vh]"
        >
          <p className="font-mono text-[10px] tracking-[0.3em] text-[#7D7D7D] sm:text-xs">
            MOMENTS &amp; MEMORIES
          </p>
        </motion.div>

        <div className="relative h-full w-full max-w-[1160px] px-4">
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
