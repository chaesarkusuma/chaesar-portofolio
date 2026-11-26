import { memo, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import SpotlightCard from './SpotlightCard.jsx'
import TopographicBackground from './TopographicBackground.jsx'
import EducationSection from './EducationSection.jsx'
import LogoLoop from './LogoLoop.jsx'
import ProjectSection from './ProjectSection.jsx'
import MomentsSection from './MomentsSection.jsx'
import ContactSection from './ContactSection.jsx'
import { TECH_STACK_LOGOS } from './TechLogos.jsx'

function ShareIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  )
}

function StarSolidIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.92 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.08-1.01L12 2z" />
    </svg>
  )
}

function FolderIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
    </svg>
  )
}

function CertificateIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="5" />
      <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
    </svg>
  )
}

function BookmarkIcon({ filled }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
  )
}

/**
 * About Me section (#about): 2-column dark-mode layout pairing editorial
 * introduction + quote card on the left with a React Bits-style SpotlightCard
 * developer profile on the right.
 */
function AboutSection({ onSelectNav, onScrollTo }) {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef(null)
  const contentRef = useRef(null)
  const [bookmarked, setBookmarked] = useState(false)
  const [copied, setCopied] = useState(false)

  const { scrollYProgress: bgScrollProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.96', 'start 0.25']
  })
  const bgOpacity = useTransform(bgScrollProgress, [0, 0.8], [0, 1])

  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ['start 0.9', 'start 0.42']
  })

  const leftOpacity = useTransform(scrollYProgress, [0, 0.78], [0, 1])
  const leftY = useTransform(
    scrollYProgress,
    [0, 0.92],
    prefersReducedMotion ? [0, 0] : [36, 0]
  )
  const leftScale = useTransform(
    scrollYProgress,
    [0, 0.92],
    prefersReducedMotion ? [1, 1] : [0.95, 1]
  )

  const cardOpacity = useTransform(scrollYProgress, [0.08, 0.88], [0, 1])
  const cardY = useTransform(
    scrollYProgress,
    [0.08, 1],
    prefersReducedMotion ? [0, 0] : [48, 0]
  )
  const cardScale = useTransform(
    scrollYProgress,
    [0.08, 1],
    prefersReducedMotion ? [1, 1] : [0.94, 1]
  )

  const introHidden = prefersReducedMotion
    ? { opacity: 0 }
    : { opacity: 0, y: 28, scale: 0.97 }
  const introVisible = prefersReducedMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0, scale: 1 }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Chaesar Kusuma — Full-Stack Developer',
          url: window.location.href
        })
        return
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href)
      }
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      // Ignore share cancellation
    }
  }

  const handleContactClick = (event) => {
    event.preventDefault()
    onSelectNav?.('CONTACT')
    if (onScrollTo) {
      onScrollTo('#contact')
    } else {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div ref={sectionRef} className="relative z-20 w-full overflow-x-clip bg-ink">
      {/* Shared sticky full-viewport 3D topographic contour backdrop across About -> Logo Loop -> Project */}
      <motion.div
        style={{
          opacity: bgOpacity,
          willChange: 'opacity'
        }}
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div
          className="sticky top-0 h-screen w-full overflow-hidden"
          style={{
            maskImage:
              'linear-gradient(to bottom, transparent 0%, black 18%, black 90%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, black 18%, black 90%, transparent 100%)'
          }}
        >
          <TopographicBackground containerRef={sectionRef} />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_55%_at_30%_50%,rgba(8,8,8,0.58)_0%,rgba(8,8,8,0)_100%)]" />
        </div>
      </motion.div>

      <section id="about" aria-labelledby="about-intro-heading" className="relative z-10 w-full">

      {/* Stage 1: Centered "About Me" Intro Title inside the contour field */}
      <div className="relative z-10 flex w-full items-center justify-center px-5 pb-10 pt-[32vh] sm:pb-24 sm:pt-[38vh]">
        <motion.h2
          id="about-intro-heading"
          initial={introHidden}
          whileInView={introVisible}
          viewport={{ once: false, amount: 0.45 }}
          transition={{ duration: prefersReducedMotion ? 0.2 : 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="text-center font-sans text-5xl font-extrabold tracking-tight text-[#F5F5F5] sm:text-6xl lg:text-[4.25rem]"
        >
          About Me
        </motion.h2>
      </div>

      {/* Stage 2: Main 2-column About Me content */}
      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex w-full max-w-6xl items-center px-5 pb-10 pt-4 sm:px-10 sm:pb-12 sm:pt-10 lg:px-14"
      >
        <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left Column: About Me Copy & Quote */}
        <motion.div
          style={{
            opacity: leftOpacity,
            y: leftY,
            scale: leftScale,
            willChange: 'transform, opacity'
          }}
          className="lg:col-span-7"
        >
          <p className="font-mono text-[11px] tracking-[0.28em] text-[#7D7D7D] sm:text-xs">
            ABOUT ME
          </p>

          <h2
            id="about-heading"
            className="mt-4 font-sans text-[1.9rem] font-extrabold leading-[1.12] tracking-tight text-[#F5F5F5] sm:mt-5 sm:text-[2.7rem] lg:text-[2.95rem]"
          >
            Hi, I&apos;m <span className="whitespace-nowrap">Chaesar Kusuma</span>
          </h2>

          <p className="mt-5 max-w-[540px] font-sans text-[15px] leading-[1.75] text-[#A3A3A3] sm:mt-6 sm:text-base">
            Software Engineering vocational high school student with a passion for full-stack
            development and modern UI. Focused on building clean, responsive, and visually
            compelling websites to deliver an optimal digital experience.
          </p>

          <blockquote className="mt-6 max-w-[540px] rounded-2xl border border-white/[0.09] bg-white/[0.03] px-5 py-4 font-sans text-[13.5px] italic leading-relaxed text-[#9A9A9A] sm:mt-7 sm:px-6 sm:py-5 sm:text-[14.5px]">
            &ldquo;Turning ideas into clean, modern, and meaningful digital experiences.&rdquo;
          </blockquote>
        </motion.div>

        {/* Right Column: React Bits-style SpotlightCard */}
        <motion.div
          style={{
            opacity: cardOpacity,
            y: cardY,
            scale: cardScale,
            willChange: 'transform, opacity'
          }}
          className="flex w-full justify-center lg:col-span-5 lg:justify-end"
        >
          <SpotlightCard
            spotlightColor="rgba(255, 255, 255, 0.15)"
            className="w-full max-w-[380px]"
          >
            {/* Top row: circular avatar + share icon */}
            <div className="flex items-start justify-between">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white/[0.12] bg-[#18191C] sm:h-[72px] sm:w-[72px]">
                <img
                  src="/profile.jpg"
                  alt="Chaesar Kusuma"
                  width={72}
                  height={72}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  style={{ transformOrigin: '51% 50%' }}
                  className="h-full w-full scale-[2.55] select-none object-cover object-[51%_50%]"
                />
              </div>

              <button
                type="button"
                onClick={handleShare}
                aria-label={copied ? 'Link copied' : 'Share profile'}
                title={copied ? 'Link copied' : 'Share profile'}
                className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#96989E] transition-colors hover:bg-white/[0.06] hover:text-[#F5F5F5]"
              >
                <ShareIcon />
                {copied && (
                  <span className="absolute -bottom-6 right-0 whitespace-nowrap rounded bg-[#1D1E22] px-2 py-0.5 font-mono text-[10px] text-[#E4E4E7]">
                    Copied
                  </span>
                )}
              </button>
            </div>

            {/* Name & Role */}
            <div className="mt-5">
              <h3 className="font-sans text-[22px] font-bold tracking-tight text-[#F5F5F5] sm:text-2xl">
                Chaesar Kusuma
              </h3>
              <p className="mt-1 font-sans text-sm font-normal text-[#8E9299]">
                Full-Stack Developer
              </p>
            </div>

            {/* Skill Badges */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/[0.08] bg-white/[0.05] px-3.5 py-1 font-sans text-xs font-medium text-[#DCDCE0]">
                React
              </span>
              <span className="rounded-full border border-white/[0.08] bg-white/[0.05] px-3.5 py-1 font-sans text-xs font-medium text-[#DCDCE0]">
                Laravel
              </span>
            </div>

            {/* 3-Column Stats */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-[#F5F5F5]">
                  <StarSolidIcon />
                  <span className="font-sans text-[15px] font-semibold">4.5</span>
                </div>
                <p className="mt-1 font-sans text-xs text-[#7E828A]">Rating</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-[#F5F5F5]">
                  <FolderIcon />
                  <span className="font-sans text-[15px] font-semibold">15+</span>
                </div>
                <p className="mt-1 font-sans text-xs text-[#7E828A]">Project</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-[#F5F5F5]">
                  <CertificateIcon />
                  <span className="font-sans text-[15px] font-semibold">6+</span>
                </div>
                <p className="mt-1 font-sans text-xs text-[#7E828A]">Certificate</p>
              </div>
            </div>

            {/* Bottom Actions: Contact Me + Bookmark */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="#contact"
                onClick={handleContactClick}
                className="flex h-12 flex-1 items-center justify-center rounded-full border border-white/[0.1] bg-[#1C1D20] font-sans text-sm font-semibold text-[#F5F5F5] transition-colors hover:border-white/[0.22] hover:bg-[#25272B]"
              >
                Contact Me
              </a>

              <button
                type="button"
                onClick={() => setBookmarked((prev) => !prev)}
                aria-pressed={bookmarked}
                aria-label="Bookmark profile"
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  bookmarked
                    ? 'border-white/30 bg-white/[0.12] text-[#FFFFFF]'
                    : 'border-white/[0.1] bg-[#1C1D20] text-[#D4D4D8] hover:border-white/[0.22] hover:bg-[#25272B] hover:text-white'
                }`}
              >
                <BookmarkIcon filled={bookmarked} />
              </button>
            </div>
          </SpotlightCard>
        </motion.div>
        </div>
      </div>

      {/* Stage 3: Education Timeline */}
      <EducationSection />

        {/* Stage 4: Seamless Tech Stack Logo Loop sub-section sharing the 3D contour canvas */}
        <div
          aria-label="Technology Stack"
          className="relative z-10 mx-auto w-full max-w-6xl px-5 py-20 sm:px-10 sm:py-28 lg:px-14"
        >
          <LogoLoop logos={TECH_STACK_LOGOS} speed={46} hoverSpeed={0} />
        </div>
      </section>

      {/* Project Section (#project) seamlessly continuing on the same 3D contour canvas */}
      <ProjectSection />

      {/* Moments / Floating Photo Collage (#moments) on the same continuous contour canvas */}
      <MomentsSection />

      {/* Contact (#contact) & Copyright Footer sharing the same 3D contour canvas */}
      <ContactSection />
    </div>
  )
}

export default memo(AboutSection)
