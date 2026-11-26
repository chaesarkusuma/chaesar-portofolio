import { memo, useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  )
}

function ChevronIcon({ direction }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction === 'prev' ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  )
}

function ExternalArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17L17 7" />
      <path d="M9 7h8v8" />
    </svg>
  )
}

/**
 * Full-size Lightbox viewer for inspecting real certificate images/PDFs
 * and detailed project showcases with keyboard navigation.
 */
function FolderLightbox({ items, activeIndex, category, onChangeIndex, onClose }) {
  const prefersReducedMotion = useReducedMotion()
  const isOpen = activeIndex !== null && items[activeIndex]
  const current = isOpen ? items[activeIndex] : null
  const isProject = category === 'projects'
  const actionHref = current ? (isProject ? current.codeUrl || current.repoUrl : current.image) : null
  const actionLabel = isProject ? 'Open Code' : 'Open Original'

  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      } else if (event.key === 'ArrowRight') {
        onChangeIndex((activeIndex + 1) % items.length)
      } else if (event.key === 'ArrowLeft') {
        onChangeIndex((activeIndex - 1 + items.length) % items.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, activeIndex, items.length, onChangeIndex, onClose])

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.12 : 0.22 }}
          onClick={onClose}
          data-lenis-prevent
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-8"
        >
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 14 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: prefersReducedMotion ? 0.12 : 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(event) => event.stopPropagation()}
            className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#0C0D11]/95 shadow-[0_30px_90px_rgba(0,0,0,0.9)]"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3.5 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <span className="shrink-0 rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-0.5 font-mono text-[11px] text-[#D4D6DC]">
                  {activeIndex + 1} / {items.length}
                </span>
                <p className="truncate font-sans text-sm font-bold text-[#F5F5F5] sm:text-base">
                  {current.title}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {items.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => onChangeIndex((activeIndex - 1 + items.length) % items.length)}
                      aria-label="Previous item"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-[#D4D6DC] transition-colors hover:border-white/35 hover:text-white"
                    >
                      <ChevronIcon direction="prev" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onChangeIndex((activeIndex + 1) % items.length)}
                      aria-label="Next item"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-[#D4D6DC] transition-colors hover:border-white/35 hover:text-white"
                    >
                      <ChevronIcon direction="next" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close preview"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-[#D4D6DC] transition-colors hover:border-white/35 hover:text-white"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            {/* Full-Size Media Body */}
            <div className="flex flex-1 items-center justify-center overflow-auto bg-[#07080B] p-4 sm:p-6">
              {current.image && current.mediaType === 'image' ? (
                <img
                  src={current.image}
                  alt={current.title}
                  decoding="async"
                  className="max-h-[65vh] w-auto max-w-full rounded-xl object-contain shadow-[0_12px_40px_rgba(0,0,0,0.65)]"
                />
              ) : current.image && current.mediaType === 'pdf' ? (
                <iframe
                  src={current.image}
                  title={current.title}
                  className="h-[62vh] w-full rounded-xl border border-white/10 bg-white"
                />
              ) : (
                <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-gradient-to-br from-[#171A24] via-[#101218] to-[#0A0B0E] p-6 sm:p-8">
                  <span
                    className="inline-block rounded-full px-3 py-1 font-mono text-[11px] font-semibold text-[#080808]"
                    style={{ backgroundColor: current.accent }}
                  >
                    {current.badgeText || current.category}
                  </span>
                  <h3 className="mt-4 font-sans text-2xl font-extrabold text-white sm:text-3xl">
                    {current.title}
                  </h3>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-[#A3A6AE]">
                    {current.summary}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {current.stack?.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-white/15 bg-white/[0.05] px-2.5 py-1 font-mono text-xs text-[#E4E4E7]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Metadata */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-3.5 sm:px-6">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-[#9A9CA3]">
                {category === 'certificates' ? (
                  <>
                    <span>{current.issuer}</span>
                    <span className="text-white/25">&bull;</span>
                    <span>{current.category}</span>
                    {current.credentialId && (
                      <>
                        <span className="text-white/25">&bull;</span>
                        <span className="text-[#D4D6DC]">{current.credentialId}</span>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <span>{current.category}</span>
                    <span className="text-white/25">&bull;</span>
                    <span>{current.year}</span>
                  </>
                )}
              </div>

              {actionHref && (
                <a
                  href={actionHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-3.5 py-1.5 font-sans text-xs font-semibold text-white transition-colors hover:border-white/35 hover:bg-white/[0.12]"
                >
                  <span>{actionLabel}</span>
                  <ExternalArrowIcon />
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default memo(FolderLightbox)
