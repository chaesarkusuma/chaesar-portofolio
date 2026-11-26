import { memo } from 'react'
import { motion } from 'framer-motion'

/**
 * Ambient, non-interactive backdrop: a slow-drifting radial light, a
 * near-invisible grid, and a grain layer. All effects stay under ~8%
 * opacity so they read as atmosphere, never decoration.
 */
function BackgroundEffects({ prefersReducedMotion }) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute left-1/2 top-1/2 h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          willChange: 'transform, opacity',
          background:
            'radial-gradient(circle, rgba(245,245,245,0.06) 0%, rgba(245,245,245,0.015) 45%, rgba(8,8,8,0) 70%)'
        }}
        animate={
          prefersReducedMotion
            ? {}
            : {
                scale: [1, 1.06, 1],
                opacity: [0.8, 1, 0.8]
              }
        }
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="chaesar-grid" />
      <div className="chaesar-grain" />
    </div>
  )
}

export default memo(BackgroundEffects)
