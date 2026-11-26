import { memo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import InteractiveFolder from './InteractiveFolder.jsx'
import ExpandedFolderView from './ExpandedFolderView.jsx'
import FolderLightbox from './FolderLightbox.jsx'
import { CERTIFICATES_DATA, PROJECTS_DATA } from '../data/portfolioData.js'

/**
 * Project & Certificates showcase (#project) positioned seamlessly below the
 * Logo Loop over the shared 3D topographic contour backdrop.
 */
function ProjectSection() {
  const prefersReducedMotion = useReducedMotion()
  const [openFolder, setOpenFolder] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const hidden = prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 26 }
  const visible = prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }

  const activeItems = openFolder === 'projects' ? PROJECTS_DATA : CERTIFICATES_DATA

  const handleToggleFolder = (folderKey) => {
    setLightboxIndex(null)
    setOpenFolder((prev) => (prev === folderKey ? null : folderKey))
  }

  const handleCloseFolder = () => {
    setLightboxIndex(null)
    setOpenFolder(null)
  }

  return (
    <section
      id="project"
      aria-labelledby="project-heading"
      className="relative z-10 mx-auto flex min-h-[72vh] w-full max-w-6xl flex-col justify-center px-5 pb-24 pt-20 sm:min-h-[78vh] sm:px-10 sm:pb-32 sm:pt-28 lg:px-14"
    >
      <motion.div
        initial={hidden}
        whileInView={visible}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: prefersReducedMotion ? 0.2 : 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <p className="font-mono text-[11px] tracking-[0.28em] text-[#7D7D7D] sm:text-xs">
          MY WORK
        </p>
        <h2
          id="project-heading"
          className="mt-3 font-sans text-3xl font-extrabold tracking-tight text-[#F5F5F5] sm:text-4xl lg:text-5xl"
        >
          Projects &amp; Archive
        </h2>
      </motion.div>

      <motion.div
        initial={hidden}
        whileInView={visible}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: prefersReducedMotion ? 0.2 : 0.85,
          delay: prefersReducedMotion ? 0 : 0.08,
          ease: [0.16, 1, 0.3, 1]
        }}
        className="mx-auto mt-14 grid w-full max-w-3xl grid-cols-1 place-items-center gap-12 sm:mt-16 md:grid-cols-2 md:gap-16 lg:gap-24"
      >
        <InteractiveFolder
          count={PROJECTS_DATA.length}
          label="Projects"
          items={PROJECTS_DATA}
          variant="projects"
          isOpen={openFolder === 'projects'}
          onToggle={() => handleToggleFolder('projects')}
        />

        <InteractiveFolder
          count={CERTIFICATES_DATA.length}
          label="Certificates"
          items={CERTIFICATES_DATA}
          variant="certificates"
          isOpen={openFolder === 'certificates'}
          onToggle={() => handleToggleFolder('certificates')}
        />
      </motion.div>

      <AnimatePresence mode="wait">
        {openFolder && (
          <ExpandedFolderView
            activeFolder={openFolder}
            projects={PROJECTS_DATA}
            certificates={CERTIFICATES_DATA}
            onSwitchFolder={(nextFolder) => {
              setLightboxIndex(null)
              setOpenFolder(nextFolder)
            }}
            onClose={handleCloseFolder}
            onSelectItem={(index) => setLightboxIndex(index)}
          />
        )}
      </AnimatePresence>

      <FolderLightbox
        items={activeItems}
        activeIndex={lightboxIndex}
        category={openFolder}
        onChangeIndex={setLightboxIndex}
        onClose={() => setLightboxIndex(null)}
      />
    </section>
  )
}

export default memo(ProjectSection)
