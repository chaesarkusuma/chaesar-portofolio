import { useEffect, useRef, useState } from 'react'
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import PixelSkyBackground, { PixelCrossStar } from './PixelSkyBackground.jsx'
import OrbitalAvatar from './OrbitalAvatar.jsx'
import HeroTitle from './HeroTitle.jsx'
import PillNav from './PillNav.jsx'
import AboutSection from './AboutSection.jsx'

const NAV_ITEMS = [
  { label: 'HOME', href: '#home' },
  { label: 'ABOUT', href: '#about' },
  { label: 'PROJECT', href: '#project' },
  { label: 'CONTACT', href: '#contact' }
]

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  )
}

function ArrowDownIcon() {
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
      <path d="M12 5v14" />
      <path d="M6 13l6 6 6-6" />
    </svg>
  )
}

/**
 * KUSUMA Landing Page: preserves the pixel-art composition, headline split
 * around the central avatar, monochrome palette, and quiet night sky.
 */
export default function LandingPage({ isVisible, onScrollTo }) {
  const [activeNav, setActiveNav] = useState('HOME')
  const prefersReducedMotion = useReducedMotion()
  const homeSectionRef = useRef(null)
  const skyRef = useRef(null)

  const { scrollYProgress: homeScrollProgress } = useScroll({
    target: homeSectionRef,
    offset: ['start start', 'end start']
  })

  const heroScale = useTransform(
    homeScrollProgress,
    [0, 0.88],
    prefersReducedMotion ? [1, 1] : [1, 1.32]
  )
  const heroY = useTransform(
    homeScrollProgress,
    [0, 0.88],
    prefersReducedMotion ? ['0vh', '0vh'] : ['0vh', '16vh']
  )
  const heroBlurPx = useTransform(
    homeScrollProgress,
    [0, 0.85],
    prefersReducedMotion ? [0, 0] : [0, 14]
  )
  const heroFilter = useMotionTemplate`blur(${heroBlurPx}px)`
  const heroOpacity = useTransform(homeScrollProgress, [0, 0.8], [1, 0])

  const footerOpacity = useTransform(homeScrollProgress, [0, 0.42], [1, 0])
  const footerY = useTransform(
    homeScrollProgress,
    [0, 0.42],
    prefersReducedMotion ? [0, 0] : [0, 20]
  )

  useEffect(() => {
    if (!isVisible) return undefined

    const homeEl = document.getElementById('home')
    const aboutEl = document.getElementById('about')
    const projectEl = document.getElementById('project')
    const contactEl = document.getElementById('contact')
    if (!homeEl || !aboutEl || !projectEl || !contactEl) return undefined

    const setSafeNav = (next) => {
      setActiveNav((prev) => (prev === next ? prev : next))
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (entry.target.id === 'home') setSafeNav('HOME')
            if (entry.target.id === 'about') setSafeNav('ABOUT')
            if (entry.target.id === 'project') setSafeNav('PROJECT')
            if (entry.target.id === 'contact') setSafeNav('CONTACT')
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )

    // Cull fixed Hero SVG nebula/star compositing once scrolled cleanly past Hero
    const skyObserver = new IntersectionObserver(
      (entries) => {
        const isNearHero = Boolean(entries[0]?.isIntersecting)
        const skyEl = skyRef.current
        if (!skyEl) return
        skyEl.style.visibility = isNearHero ? 'visible' : 'hidden'
        skyEl.classList.toggle('pixel-sky-paused', !isNearHero)
      },
      { rootMargin: '50% 0px 50% 0px', threshold: 0 }
    )

    observer.observe(homeEl)
    observer.observe(aboutEl)
    observer.observe(projectEl)
    observer.observe(contactEl)
    skyObserver.observe(homeEl)
    return () => {
      observer.disconnect()
      skyObserver.disconnect()
    }
  }, [isVisible])

  const handleScrollToAbout = (event) => {
    event.preventDefault()
    setActiveNav('ABOUT')
    if (onScrollTo) {
      onScrollTo('#about')
    } else {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const supportHidden = prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }
  const supportVisible = prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }

  return (
    <div
      className={`relative z-0 w-full overflow-x-clip bg-ink text-paper transition-opacity duration-[380ms] ease-out ${
        isVisible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-hidden={!isVisible}
    >
      <PixelSkyBackground skyRef={skyRef} />

      {/* Floating Centered Pill Navigation Bar */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-30 flex w-full items-center justify-center px-2.5 pt-4 sm:px-6 sm:pt-7">
        <PillNav
          items={NAV_ITEMS}
          activeItem={activeNav}
          onSelect={setActiveNav}
          onScrollTo={onScrollTo}
        />
      </header>

      {/* Primary Page Sections */}
      <main>
        {/* First Screen: Hero Section */}
        <section
          id="home"
          ref={homeSectionRef}
          className="relative flex min-h-screen w-full flex-col justify-between"
        >
          <div className="h-[52px] sm:h-[72px]" aria-hidden="true" />

          {/* Main Centerpiece Hero with scroll-linked zoom, blur & fade */}
          <motion.div
            style={{
              scale: heroScale,
              y: heroY,
              filter: prefersReducedMotion ? undefined : heroFilter,
              opacity: heroOpacity,
              willChange: 'transform, opacity, filter'
            }}
            className="relative z-20 flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-8"
          >
        <div className="flex flex-col items-center">
          <div className="inline-flex flex-col items-stretch">
            {/* Top label row aligned with headline edges */}
            <motion.div
              initial={supportHidden}
              animate={isVisible ? supportVisible : supportHidden}
              transition={{
                duration: prefersReducedMotion ? 0.15 : 0.7,
                delay: prefersReducedMotion ? 0 : 0.92,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="mb-1 flex w-full items-baseline justify-between gap-4 font-mono text-[9px] tracking-[0.16em] text-[#B8B8B8] sm:mb-2 sm:text-[11px] md:text-[12px]"
            >
              <span>JUNIOR DEVELOPER</span>
              <span className="shrink-0"></span>
            </motion.div>

            {/* Unified centered headline with orbital ring behind */}
            <OrbitalAvatar>
              <HeroTitle isVisible={isVisible} />
            </OrbitalAvatar>
          </div>

          {/* BUILD ✦ LEARN ✦ GROW */}
          <motion.p
            initial={supportHidden}
            animate={isVisible ? supportVisible : supportHidden}
            transition={{
              duration: prefersReducedMotion ? 0.15 : 0.7,
              delay: prefersReducedMotion ? 0 : 1.02,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="mt-6 flex items-center gap-3 font-mono text-[10px] tracking-[0.26em] text-[#C0C0C0] sm:mt-8 sm:gap-5 sm:text-[12px] md:text-[13px]"
          >
            <span>BUILD</span>
            <PixelCrossStar size={9} className="opacity-85" />
            <span>LEARN</span>
            <PixelCrossStar size={9} className="opacity-85" />
            <span>GROW</span>
          </motion.p>
        </div>
        </motion.div>

      {/* Bottom Bar */}
      <motion.footer
        style={{
          opacity: footerOpacity,
          y: footerY,
          willChange: 'transform, opacity'
        }}
        className="relative z-20 grid w-full grid-cols-2 items-end px-5 pb-5 sm:grid-cols-3 sm:px-10 sm:pb-7 lg:px-14"
      >
        {/* Bottom-left terminal greeting */}
        <p className="hidden items-center justify-self-start font-mono text-[11px] tracking-[0.04em] text-[#6D6D6D] sm:flex md:text-xs">
          <span className="mr-1 text-[#9A9A9A]">]</span>
          <span className="mr-2 text-[#9A9A9A]">&gt;</span>
          <span>Welcome to my portfolio...</span>
        </p>

        {/* Bottom-center scroll cue */}
        <div className="flex flex-col items-center justify-self-start sm:justify-self-center">
          <a
            href="#about"
            onClick={handleScrollToAbout}
            aria-label="Scroll down"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-white/25 bg-[#0A0A0A]/60 text-[#A8A8A8] transition-colors hover:border-white/50 hover:text-paper"
          >
            <ArrowDownIcon />
          </a>
          <span className="mt-2 font-mono text-[9px] tracking-[0.24em] text-[#6A6A6A] sm:text-[10px]">
            SCROLL DOWN
          </span>
        </div>

        {/* Bottom-right social icon buttons */}
        <div className="flex items-center gap-2 justify-self-end sm:gap-2.5">
          <a
            href="https://github.com/chaesarkusuma"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-white/25 bg-[#0A0A0A]/80 text-[#D0D0D0] transition-colors hover:border-white/55 hover:text-paper sm:h-10 sm:w-10"
          >
            <GitHubIcon />
          </a>
          <a
            href="https://www.instagram.com/chaesarkusumaa/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            title="Instagram"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-white/25 bg-[#0A0A0A]/80 text-[#D0D0D0] transition-colors hover:border-white/55 hover:text-paper sm:h-10 sm:w-10"
          >
            <InstagramIcon />
          </a>
          <a
            href="mailto:chaesarkusuma14@gmail.com"
            aria-label="Email"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-white/25 bg-[#0A0A0A]/80 text-[#D0D0D0] transition-colors hover:border-white/55 hover:text-paper sm:h-10 sm:w-10"
          >
            <MailIcon />
          </a>
        </div>
      </motion.footer>
        </section>

        {/* Pitch-black transition buffer separating Hero warp from About topographic terrain */}
        <div
          className="relative z-10 h-[42vh] w-full bg-gradient-to-b from-transparent via-[#080808] via-25% to-[#080808] sm:h-[46vh]"
          aria-hidden="true"
        />

        {/* Second Screen: About Me Section */}
        <AboutSection onSelectNav={setActiveNav} onScrollTo={onScrollTo} />
      </main>
    </div>
  )
}
