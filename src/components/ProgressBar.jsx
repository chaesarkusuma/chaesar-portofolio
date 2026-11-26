import { motion } from 'framer-motion'

export default function ProgressBar({ progress, progressValue, prefersReducedMotion }) {
  return (
    <div className="mx-auto w-full max-w-[280px] sm:max-w-[320px]">
      <div
        className="relative h-px w-full overflow-hidden bg-muted"
        role="progressbar"
        aria-label="Loading"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <motion.div
          className="absolute inset-0 origin-left bg-paper"
          style={{ scaleX: progressValue, willChange: 'transform' }}
        />
        {!prefersReducedMotion && (
          <motion.div
            className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-transparent via-white/60 to-transparent"
            style={{ willChange: 'transform' }}
            initial={{ x: '-100%' }}
            animate={{ x: '850%' }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </div>
      <div className="mt-4 flex items-center justify-between font-sans text-[11px] tracking-[0.25em] text-dim">
        <span>LOADING</span>
        <span className="tabular-nums text-paper/80">{String(progress).padStart(2, '0')}%</span>
      </div>
    </div>
  )
}
