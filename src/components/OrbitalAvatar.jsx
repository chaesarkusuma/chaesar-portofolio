import { memo } from 'react'
import { NaturalStar } from './PixelSkyBackground.jsx'

/**
 * Tilted pixel-fine orbital ring and four subtle accent stars positioned
 * behind the main centered hero headline. Keeps the original 15s traveling
 * highlight animation scaled proportionally to frame the full CHAESAR word.
 */
function OrbitalAvatar({ children }) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Thin tilted orbital ellipse behind the CHAESAR headline */}
      <svg
        viewBox="0 0 560 220"
        className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-[126%] max-w-none -translate-x-1/2 -translate-y-1/2 overflow-visible"
        aria-hidden="true"
      >
        <g transform="rotate(-11 280 110)">
          {/* Base thin orbital line */}
          <ellipse
            cx="280"
            cy="110"
            rx="254"
            ry="62"
            fill="none"
            stroke="rgba(245, 245, 245, 0.16)"
            strokeWidth="1"
            pathLength="640"
          />
          {/* Subtle traveling highlight segment */}
          <ellipse
            cx="280"
            cy="110"
            rx="254"
            ry="62"
            fill="none"
            stroke="rgba(245, 245, 245, 0.56)"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeDasharray="68 572"
            pathLength="640"
            className="pixel-orbit-highlight"
          />
        </g>
      </svg>

      {/* Subtle natural stars near the orbital ring */}
      <div
        className="pixel-star-gleam pointer-events-none absolute -top-7 left-[42%] z-10 sm:-top-10"
        style={{ '--dur': '4.4s', '--delay': '-1.1s', '--star-min': 0.45, '--star-max': 0.92 }}
      >
        <NaturalStar size={3.5} halo />
      </div>

      <div
        className="pointer-events-none absolute -right-4 -top-5 z-10 opacity-50 sm:-right-8 sm:-top-7"
        aria-hidden="true"
      >
        <NaturalStar size={2.5} tint="#DCE6F7" />
      </div>

      <div
        className="pixel-star-gleam pointer-events-none absolute -bottom-6 right-[14%] z-30 sm:-bottom-9"
        style={{ '--dur': '6.2s', '--delay': '-3.4s', '--star-min': 0.42, '--star-max': 0.88 }}
      >
        <NaturalStar size={3} halo />
      </div>

      <div
        className="pixel-star-twinkle pointer-events-none absolute -bottom-5 left-[10%] z-10 sm:-bottom-7"
        style={{ '--dur': '3.9s', '--delay': '-2.2s', '--star-min': 0.2, '--star-max': 0.56 }}
      >
        <NaturalStar size={2} tint="#E8ECF4" />
      </div>

      {/* Hero text sits cleanly above the orbital plane */}
      <div className="relative z-20">{children}</div>
    </div>
  )
}

export default memo(OrbitalAvatar)
