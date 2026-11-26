import { memo } from 'react'

/**
 * Quiet, natural dark-space night sky: organic wispy atmospheric clouds /
 * subtle nebula mist and soft glowing celestial stars. All drift and twinkle
 * animations run via pure CSS keyframes (transform/opacity) on GPU layers.
 */

const NATURAL_STARS = [
  // Static depth anchors (varied tiny sizes & muted brightness)
  { id: 'ns-1', left: '11%', top: '44%', size: 1.5, mode: 'static', opacity: 0.28, tint: '#DCE6F7' },
  { id: 'ns-2', left: '20.5%', top: '71%', size: 2, mode: 'static', opacity: 0.36, tint: '#F5F7FA' },
  { id: 'ns-3', left: '34%', top: '17%', size: 1.5, mode: 'static', opacity: 0.24, tint: '#E8ECF4' },
  { id: 'ns-4', left: '65%', top: '18%', size: 2, mode: 'static', opacity: 0.26, tint: '#DCE6F7' },
  { id: 'ns-5', left: '14.5%', top: '61%', size: 1.5, mode: 'static', opacity: 0.3, tint: '#F4EFE6' },
  { id: 'ns-6', left: '84%', top: '41%', size: 2, mode: 'static', opacity: 0.25, tint: '#F5F7FA' },
  { id: 'ns-7', left: '61.5%', top: '76%', size: 1.5, mode: 'static', opacity: 0.24, tint: '#DCE6F7' },
  { id: 'ns-8', left: '47%', top: '23%', size: 1.5, mode: 'static', opacity: 0.22, tint: '#F5F7FA' },
  { id: 'ns-9', left: '9%', top: '26%', size: 1.5, mode: 'static', opacity: 0.2, tint: '#E8ECF4' },

  // Gentle twinkling stars (3–7s staggered)
  { id: 'ns-10', left: '24%', top: '24%', size: 3, halo: true, mode: 'twinkle', dur: '4.6s', delay: '-1.4s', min: 0.32, max: 0.78, tint: '#F5F7FA' },
  { id: 'ns-11', left: '78.5%', top: '65%', size: 2.5, mode: 'twinkle', dur: '6.4s', delay: '-4.1s', min: 0.22, max: 0.58, tint: '#DCE6F7' },
  { id: 'ns-12', left: '74%', top: '24%', size: 2.5, mode: 'twinkle', dur: '3.8s', delay: '-0.8s', min: 0.24, max: 0.72, tint: '#F5F7FA' },
  { id: 'ns-13', left: '38%', top: '74%', size: 2, mode: 'twinkle', dur: '5.1s', delay: '-3.2s', min: 0.18, max: 0.56, tint: '#E8ECF4' },
  { id: 'ns-14', left: '88%', top: '53%', size: 2, mode: 'twinkle', dur: '6.7s', delay: '-4.9s', min: 0.2, max: 0.6, tint: '#F4EFE6' },
  { id: 'ns-15', left: '16%', top: '31%', size: 2, mode: 'twinkle', dur: '4.2s', delay: '-1.9s', min: 0.2, max: 0.55, tint: '#DCE6F7' },
  { id: 'ns-16', left: '54%', top: '81%', size: 2, mode: 'twinkle', dur: '5.5s', delay: '-2.6s', min: 0.16, max: 0.48, tint: '#F5F7FA' },
  { id: 'ns-17', left: '83%', top: '14%', size: 1.5, mode: 'twinkle', dur: '4.4s', delay: '-3.6s', min: 0.2, max: 0.62, tint: '#F5F7FA' },
  { id: 'ns-18', left: '31%', top: '35%', size: 1.5, mode: 'twinkle', dur: '6.1s', delay: '-0.9s', min: 0.16, max: 0.46, tint: '#DCE6F7' },

  // Subtle brightness / gleam focal stars
  { id: 'ns-19', left: '91.5%', top: '22%', size: 3.5, halo: true, mode: 'gleam', dur: '5.8s', delay: '-2.7s', min: 0.48, max: 0.92, tint: '#F5F7FA' },
  { id: 'ns-20', left: '27.5%', top: '63%', size: 3, halo: true, mode: 'gleam', dur: '6.2s', delay: '-4.5s', min: 0.36, max: 0.8, tint: '#E8EEF8' },

  // Subtle drifting tiny distant stars (15–25s)
  { id: 'ns-21', left: '5.5%', top: '65%', size: 2, mode: 'float-a', dur: '17s', delay: '-3s', min: 0.26, max: 0.6, tint: '#DCE6F7' },
  { id: 'ns-22', left: '68%', top: '31%', size: 1.5, mode: 'float-b', dur: '21s', delay: '-9s', min: 0.2, max: 0.48, tint: '#F5F7FA' },
  { id: 'ns-23', left: '29%', top: '55%', size: 1.5, mode: 'float-a', dur: '24s', delay: '-15s', min: 0.18, max: 0.44, tint: '#F4EFE6' },
  { id: 'ns-24', left: '72%', top: '79%', size: 2, mode: 'float-b', dur: '19s', delay: '-7s', min: 0.2, max: 0.5, tint: '#DCE6F7' }
]

const STAR_CLASS = {
  static: '',
  twinkle: 'pixel-star-twinkle',
  gleam: 'pixel-star-gleam',
  'float-a': 'pixel-star-float-a',
  'float-b': 'pixel-star-float-b'
}

export function NaturalStar({ size = 2.5, halo = false, tint = '#F5F7FA', className = '', style }) {
  return (
    <span
      className={`block rounded-full ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: halo
          ? `radial-gradient(circle, #FFFFFF 0%, ${tint} 40%, rgba(220, 230, 247, 0) 100%)`
          : tint,
        boxShadow: halo
          ? `0 0 ${Math.max(5, size * 2.4)}px ${Math.max(1, size * 0.45)}px rgba(225, 234, 248, 0.34)`
          : size >= 2.5
            ? '0 0 4px rgba(235, 240, 250, 0.25)'
            : undefined,
        ...style
      }}
      aria-hidden="true"
    />
  )
}

/**
 * Kept exported for existing inline divider icons in LandingPage without
 * altering hero subtitle layout or markup.
 */
export function PixelCrossStar({ size = 14, className = '', style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 7 7"
      shapeRendering="crispEdges"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <rect x="3" y="0" width="1" height="1" fill="#F5F5F5" fillOpacity="0.45" />
      <rect x="3" y="6" width="1" height="1" fill="#F5F5F5" fillOpacity="0.45" />
      <rect x="0" y="3" width="1" height="1" fill="#F5F5F5" fillOpacity="0.45" />
      <rect x="6" y="3" width="1" height="1" fill="#F5F5F5" fillOpacity="0.45" />
      <rect x="3" y="1" width="1" height="2" fill="#F5F5F5" fillOpacity="0.82" />
      <rect x="3" y="4" width="1" height="2" fill="#F5F5F5" fillOpacity="0.82" />
      <rect x="1" y="3" width="2" height="1" fill="#F5F5F5" fillOpacity="0.82" />
      <rect x="4" y="3" width="2" height="1" fill="#F5F5F5" fillOpacity="0.82" />
      <rect x="3" y="3" width="1" height="1" fill="#FFFFFF" />
    </svg>
  )
}

const PixelSkyBackground = memo(function PixelSkyBackground({ skyRef }) {
  return (
    <div
      ref={skyRef}
      className="pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Subtle 64px architectural grid */}
      <div className="chaesar-grid" />

      {/* Top-left distant atmospheric nebula mist (slower parallax layer) */}
      <div
        className="pixel-cloud-right pointer-events-none absolute -left-24 top-[6%] w-[56vw] max-w-[520px] opacity-80 sm:-left-20 sm:top-[7%]"
        style={{ '--dx': '75px', '--dur': '38s', '--delay': '-12s' }}
      >
        <svg viewBox="0 0 420 220" className="pixel-cloud-bob w-full overflow-visible" style={{ '--dy': '6px', '--bob-dur': '17s', '--bob-delay': '-5s' }}>
          <defs>
            <filter id="nebula-mist-tl-far" x="-30%" y="-30%" width="160%" height="160%">
              <feTurbulence type="fractalNoise" baseFrequency="0.014 0.025" numOctaves="4" seed="4" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="44" xChannelSelector="R" yChannelSelector="G" result="displaced" />
              <feGaussianBlur in="displaced" stdDeviation="16" />
            </filter>
            <radialGradient id="nebula-grad-tl-far" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#9aa4b8" stopOpacity="0.11" />
              <stop offset="55%" stopColor="#5c6370" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#080808" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g filter="url(#nebula-mist-tl-far)">
            <ellipse cx="180" cy="110" rx="130" ry="48" fill="url(#nebula-grad-tl-far)" />
            <ellipse cx="255" cy="98" rx="95" ry="38" fill="url(#nebula-grad-tl-far)" />
          </g>
        </svg>
      </div>

      {/* Top-left primary soft atmospheric cloud (foreground parallax, drifts right +125px) */}
      <div
        className="pixel-cloud-right pointer-events-none absolute -left-28 top-[11%] w-[64vw] max-w-[580px] opacity-95 sm:-left-24 sm:top-[12%]"
        style={{ '--dx': '125px', '--dur': '26s', '--delay': '-6s' }}
      >
        <svg viewBox="0 0 460 240" className="pixel-cloud-bob w-full overflow-visible" style={{ '--dy': '9px', '--bob-dur': '11s', '--bob-delay': '-2s' }}>
          <defs>
            <filter id="nebula-cloud-tl" x="-30%" y="-30%" width="160%" height="160%">
              <feTurbulence type="fractalNoise" baseFrequency="0.016 0.026" numOctaves="4" seed="11" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="52" xChannelSelector="R" yChannelSelector="G" result="displaced" />
              <feGaussianBlur in="displaced" stdDeviation="14" />
            </filter>
            <radialGradient id="nebula-grad-tl-core" cx="48%" cy="46%" r="52%">
              <stop offset="0%" stopColor="#cbd3e0" stopOpacity="0.13" />
              <stop offset="48%" stopColor="#778091" stopOpacity="0.07" />
              <stop offset="100%" stopColor="#080808" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="nebula-grad-tl-rim" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#e2e8f2" stopOpacity="0.1" />
              <stop offset="60%" stopColor="#6a7180" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#080808" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g filter="url(#nebula-cloud-tl)">
            <ellipse cx="195" cy="122" rx="145" ry="54" fill="url(#nebula-grad-tl-core)" />
            <ellipse cx="275" cy="112" rx="108" ry="42" fill="url(#nebula-grad-tl-rim)" />
            <ellipse cx="145" cy="134" rx="92" ry="38" fill="url(#nebula-grad-tl-core)" />
          </g>
        </svg>
      </div>

      {/* Bottom-right primary soft atmospheric cloud (foreground parallax, drifts left -130px) */}
      <div
        className="pixel-cloud-left pointer-events-none absolute -right-28 bottom-[6%] w-[66vw] max-w-[600px] opacity-95 sm:-right-24 sm:bottom-[8%]"
        style={{ '--dx': '-130px', '--dur': '30s', '--delay': '-14s' }}
      >
        <svg viewBox="0 0 460 240" className="pixel-cloud-bob w-full overflow-visible" style={{ '--dy': '10px', '--bob-dur': '14s', '--bob-delay': '-7s' }}>
          <defs>
            <filter id="nebula-cloud-br" x="-30%" y="-30%" width="160%" height="160%">
              <feTurbulence type="fractalNoise" baseFrequency="0.015 0.025" numOctaves="4" seed="23" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="52" xChannelSelector="R" yChannelSelector="G" result="displaced" />
              <feGaussianBlur in="displaced" stdDeviation="15" />
            </filter>
            <radialGradient id="nebula-grad-br-core" cx="52%" cy="50%" r="52%">
              <stop offset="0%" stopColor="#c5cedc" stopOpacity="0.125" />
              <stop offset="50%" stopColor="#6f7889" stopOpacity="0.065" />
              <stop offset="100%" stopColor="#080808" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="nebula-grad-br-tail" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#dce3ee" stopOpacity="0.095" />
              <stop offset="55%" stopColor="#5b6270" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#080808" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g filter="url(#nebula-cloud-br)">
            <ellipse cx="265" cy="126" rx="148" ry="56" fill="url(#nebula-grad-br-core)" />
            <ellipse cx="178" cy="136" rx="112" ry="42" fill="url(#nebula-grad-br-tail)" />
            <ellipse cx="322" cy="108" rx="96" ry="38" fill="url(#nebula-grad-br-core)" />
          </g>
        </svg>
      </div>

      {/* Upper-right faint wispy space veil (slower parallax, drifts left -90px) */}
      <div
        className="pixel-cloud-left pointer-events-none absolute -right-20 top-[14%] hidden w-[38vw] max-w-[360px] opacity-70 sm:block"
        style={{ '--dx': '-90px', '--dur': '37s', '--delay': '-9s' }}
      >
        <svg viewBox="0 0 360 180" className="pixel-cloud-bob w-full overflow-visible" style={{ '--dy': '7px', '--bob-dur': '15s', '--bob-delay': '-4s' }}>
          <defs>
            <filter id="nebula-veil-tr" x="-30%" y="-30%" width="160%" height="160%">
              <feTurbulence type="fractalNoise" baseFrequency="0.018 0.03" numOctaves="3" seed="31" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="36" xChannelSelector="R" yChannelSelector="G" result="displaced" />
              <feGaussianBlur in="displaced" stdDeviation="14" />
            </filter>
            <radialGradient id="nebula-grad-tr" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#aeb8ca" stopOpacity="0.09" />
              <stop offset="55%" stopColor="#58606e" stopOpacity="0.035" />
              <stop offset="100%" stopColor="#080808" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g filter="url(#nebula-veil-tr)">
            <ellipse cx="195" cy="92" rx="115" ry="34" fill="url(#nebula-grad-tr)" />
            <ellipse cx="135" cy="102" rx="75" ry="26" fill="url(#nebula-grad-tr)" />
          </g>
        </svg>
      </div>

      {/* Seamless double-tiled soft atmospheric horizon mist gliding along the bottom */}
      <svg
        viewBox="0 0 960 90"
        preserveAspectRatio="none"
        className="pixel-cloud-horizon absolute -bottom-2 left-0 h-20 w-[200%] opacity-90 sm:h-28"
        style={{ '--dur': '46s' }}
      >
        <defs>
          <linearGradient id="horizon-mist-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9aa4b6" stopOpacity="0" />
            <stop offset="48%" stopColor="#8892a4" stopOpacity="0.055" />
            <stop offset="100%" stopColor="#464d59" stopOpacity="0.09" />
          </linearGradient>
          <filter id="horizon-soft-blur" x="-5%" y="-20%" width="110%" height="140%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>
        <g filter="url(#horizon-soft-blur)">
          <path
            d="M0 54 C80 34, 160 64, 240 48 C320 32, 400 62, 480 54 C560 34, 640 64, 720 48 C800 32, 880 62, 960 54 L960 95 L0 95 Z"
            fill="url(#horizon-mist-grad)"
          />
          <path
            d="M0 64 C110 50, 210 74, 320 58 C390 48, 435 68, 480 64 C590 50, 690 74, 800 58 C870 48, 915 68, 960 64 L960 95 L0 95 Z"
            fill="url(#horizon-mist-grad)"
          />
        </g>
      </svg>

      {/* Natural soft stars across the night sky */}
      {NATURAL_STARS.map((star) => (
        <div
          key={star.id}
          className={`absolute -translate-x-1/2 -translate-y-1/2 ${STAR_CLASS[star.mode]}`}
          style={{
            left: star.left,
            top: star.top,
            opacity: star.mode === 'static' ? star.opacity : undefined,
            '--dur': star.dur,
            '--delay': star.delay,
            '--star-min': star.min,
            '--star-max': star.max
          }}
        >
          <NaturalStar size={star.size} halo={star.halo} tint={star.tint} />
        </div>
      ))}

      <div className="chaesar-grain" />
    </div>
  )
})

export default PixelSkyBackground
