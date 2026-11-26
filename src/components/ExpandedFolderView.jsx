import { memo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

function BackArrowIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  )
}

function ExpandIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 3h6v6" />
      <path d="M9 21H3v-6" />
      <path d="M21 3l-7 7" />
      <path d="M3 21l7-7" />
    </svg>
  )
}

function ProjectCardThumbnail({ project }) {
  if (project.image && project.mediaType === 'image') {
    return (
      <img
        src={project.image}
        alt={project.title}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-500 group-hover/item:scale-[1.04]"
      />
    )
  }

  return (
    <div className="relative flex h-full w-full flex-col justify-between bg-gradient-to-br from-[#171A24] via-[#101218] to-[#0A0B0E] p-4 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white/25" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
        </div>
        <span
          className="rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#080808]"
          style={{ backgroundColor: project.accent }}
        >
          {project.badgeText}
        </span>
      </div>

      <div
        className="my-auto rounded-xl border border-white/10 p-3.5"
        style={{
          background: `linear-gradient(135deg, ${project.accent}22 0%, rgba(255,255,255,0.02) 100%)`
        }}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
          {project.category}
        </p>
        <p className="mt-1 font-sans text-lg font-bold tracking-tight text-white">
          {project.title}
        </p>
      </div>

      <div className="flex items-center justify-between font-mono text-[10px] text-white/50">
        <span>Click to Preview</span>
        <span>{project.year}</span>
      </div>
    </div>
  )
}

function CertificateCardThumbnail({ cert }) {
  if (cert.image && cert.mediaType === 'image') {
    return (
      <img
        src={cert.image}
        alt={cert.title}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover/item:scale-[1.04]"
      />
    )
  }

  return (
    <div className="relative flex h-full w-full flex-col justify-between bg-gradient-to-br from-[#F8FAFC] via-[#EEF2F6] to-[#DCE4F0] p-4 text-center text-[#0F172A]">
      <div className="flex items-center justify-between">
        <div
          className="h-1.5 flex-1 rounded-full"
          style={{ backgroundColor: cert.accent || '#38BDF8' }}
        />
        <span className="ml-2 rounded bg-[#0F172A] px-2 py-0.5 font-mono text-[9px] font-bold text-white">
          PDF
        </span>
      </div>
      <div className="my-auto px-2">
        <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#475569]">
          {cert.issuer}
        </p>
        <p className="mt-1.5 line-clamp-2 font-sans text-sm font-extrabold leading-snug text-[#0F172A]">
          {cert.title}
        </p>
      </div>
      <div className="flex items-center justify-between font-mono text-[9px] text-[#64748B]">
        <span className="truncate">{cert.fileName}</span>
        <span>Click to View</span>
      </div>
    </div>
  )
}

/**
 * Animated expanded showcase drawer sliding out beneath the open folder,
 * with reverse-collapse Back to Folder action and click-to-lightbox preview.
 */
function ExpandedFolderView({
  activeFolder,
  projects,
  certificates,
  onSwitchFolder,
  onClose,
  onSelectItem
}) {
  const prefersReducedMotion = useReducedMotion()
  const isProjects = activeFolder === 'projects'
  const items = isProjects ? projects : certificates

  return (
    <motion.div
      key={activeFolder}
      initial={
        prefersReducedMotion
          ? { opacity: 0 }
          : { opacity: 0, y: -24, scale: 0.97 }
      }
      animate={
        prefersReducedMotion
          ? { opacity: 1 }
          : { opacity: 1, y: 0, scale: 1 }
      }
      exit={
        prefersReducedMotion
          ? { opacity: 0 }
          : { opacity: 0, y: -20, scale: 0.97 }
      }
      transition={{ duration: prefersReducedMotion ? 0.16 : 0.44, ease: [0.16, 1, 0.3, 1] }}
      className="mt-14 w-full rounded-3xl border border-white/15 bg-[#0D0E13]/[0.93] p-5 shadow-[0_16px_44px_rgba(0,0,0,0.55)] backdrop-blur-sm sm:mt-16 sm:p-8"
    >
      {/* Expanded Folder Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onSwitchFolder('projects')}
            className={`rounded-full px-4 py-1.5 font-sans text-xs font-semibold transition-colors sm:text-sm ${
              isProjects
                ? 'bg-[#F5F5F5] text-[#080808]'
                : 'border border-white/15 bg-white/[0.04] text-[#A1A5AE] hover:text-white'
            }`}
          >
            Projects ({projects.length})
          </button>
          <button
            type="button"
            onClick={() => onSwitchFolder('certificates')}
            className={`rounded-full px-4 py-1.5 font-sans text-xs font-semibold transition-colors sm:text-sm ${
              !isProjects
                ? 'bg-[#F5F5F5] text-[#080808]'
                : 'border border-white/15 bg-white/[0.04] text-[#A1A5AE] hover:text-white'
            }`}
          >
            Certificates ({certificates.length})
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 font-sans text-xs font-semibold text-[#EAECEF] transition-colors hover:border-white/35 hover:bg-white/[0.1] hover:text-white sm:text-sm"
        >
          <BackArrowIcon />
          <span>Back to Folder</span>
        </button>
      </div>

      {/* Cards Sliding Out into Responsive Grid */}
      <div
        className={`mt-6 grid grid-cols-1 gap-5 ${
          isProjects ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4'
        }`}
      >
        {items.map((item, index) => (
          <motion.button
            key={item.id}
            type="button"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.95 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0.12 : 0.42,
              delay: prefersReducedMotion ? 0 : Math.min(index * 0.045, 0.3),
              ease: [0.16, 1, 0.3, 1]
            }}
            onClick={() => onSelectItem(index)}
            className="group/item flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#13151C]/90 text-left transition-colors hover:border-white/30"
          >
            <div
              className={`relative w-full overflow-hidden border-b border-white/[0.08] ${
                isProjects ? 'aspect-[16/10]' : 'aspect-[16/11]'
              }`}
            >
              {isProjects ? (
                <ProjectCardThumbnail project={item} />
              ) : (
                <CertificateCardThumbnail cert={item} />
              )}

              <span className="pointer-events-none absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover/item:opacity-100">
                <ExpandIcon />
              </span>
            </div>

            <div className="flex flex-1 flex-col p-4">
              {isProjects ? (
                <>
                  <h3 className="font-sans text-base font-bold text-[#F5F5F5]">{item.title}</h3>
                  <p className="mt-1.5 flex-1 font-sans text-xs leading-relaxed text-[#9A9CA3]">
                    {item.summary}
                  </p>
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {item.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-[#D4D6DC]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-2 font-mono text-[10px] text-[#8E9299]">
                    <span className="truncate">{item.issuer}</span>
                    <span className="shrink-0">{item.year}</span>
                  </div>
                  <h3 className="mt-1.5 line-clamp-2 font-sans text-sm font-bold leading-snug text-[#F5F5F5]">
                    {item.title}
                  </h3>
                </>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

export default memo(ExpandedFolderView)
