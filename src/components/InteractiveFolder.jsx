import { memo, useId, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

const BACK_SHELL_BOX_PATH =
  'M 0 52 Q 0 34 18 34 L 130 34 C 150 34 158 2 182 2 L 302 2 Q 320 2 320 20 L 320 222 Q 320 240 302 240 L 18 240 Q 0 240 0 222 Z'

const BACK_SHELL_CLIP_PATH =
  'M 0 0.2167 Q 0 0.1417 0.05625 0.1417 L 0.40625 0.1417 C 0.46875 0.1417 0.49375 0.0083 0.56875 0.0083 L 0.94375 0.0083 Q 1 0.0083 1 0.0833 L 1 0.925 Q 1 1 0.94375 1 L 0.05625 1 Q 0 1 0 0.925 Z'

const FRONT_FLAP_BOX_PATH =
  'M 0 84 Q 0 66 18 66 L 108 66 C 130 66 138 98 160 98 L 302 98 Q 320 98 320 116 L 320 222 Q 320 240 302 240 L 18 240 Q 0 240 0 222 Z'

const FRONT_FLAP_CLIP_PATH =
  'M 0 0.35 Q 0 0.275 0.05625 0.275 L 0.3375 0.275 C 0.40625 0.275 0.43125 0.4083 0.5 0.4083 L 0.94375 0.4083 Q 1 0.4083 1 0.4833 L 1 0.925 Q 1 1 0.94375 1 L 0.05625 1 Q 0 1 0 0.925 Z'

const SHEET_LAYOUTS = [
  {
    key: 'left',
    zIndex: 10,
    idleTransform: 'translate(-11%, 4%) rotate(-3.5deg) scale(0.95)',
    hoverTransform: (mx, my) =>
      `translate(${-24 + mx * 9}%, ${-21 + my * 5}%) rotate(${-13 + mx * 3}deg) scale(1)`,
    openTransform: 'translate(-32%, -48%) rotate(-16deg) scale(1.04)'
  },
  {
    key: 'right',
    zIndex: 15,
    idleTransform: 'translate(11%, 5%) rotate(3.5deg) scale(0.95)',
    hoverTransform: (mx, my) =>
      `translate(${24 + mx * 9}%, ${-18 + my * 5}%) rotate(${13 + mx * 3}deg) scale(1)`,
    openTransform: 'translate(32%, -46%) rotate(16deg) scale(1.04)'
  },
  {
    key: 'center',
    zIndex: 20,
    idleTransform: 'translate(0%, -2%) rotate(0deg) scale(1)',
    hoverTransform: (mx, my) =>
      `translate(${mx * 10}%, ${-30 + my * 6}%) rotate(${mx * 2}deg) scale(1.04)`,
    openTransform: 'translate(0%, -58%) rotate(0deg) scale(1.08)'
  }
]

const FOLDER_SPRING = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease'

/**
 * Miniature document/app sheet stacked inside the frosted-glass folder.
 * Renders real detected images, crisp PDF cover cards, or stylized UI wireframes.
 */
function FolderPaperPreview({ item, variant }) {
  if (item?.image && item.mediaType === 'image') {
    return (
      <img
        src={item.image}
        alt={item.title}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="h-full w-full select-none object-cover object-top"
      />
    )
  }

  if (item?.mediaType === 'pdf' || variant === 'certificates') {
    return (
      <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-[#F8FAFC] via-[#EEF2F6] to-[#DCE4F0] p-2.5 text-[#0F172A]">
        <div className="flex items-center justify-between">
          <div
            className="h-1.5 flex-1 rounded-full"
            style={{ backgroundColor: item.accent || '#38BDF8' }}
          />
          {item.mediaType === 'pdf' && (
            <span className="ml-1.5 rounded bg-[#0F172A] px-1 py-[1px] font-mono text-[5.5px] font-bold text-white">
              PDF
            </span>
          )}
        </div>
        <div className="my-auto flex flex-col items-center gap-1 text-center">
          <span className="font-mono text-[6px] font-bold uppercase tracking-[0.18em] text-[#475569]">
            {item.issuer}
          </span>
          <span className="line-clamp-2 font-sans text-[8.5px] font-extrabold leading-tight text-[#0F172A]">
            {item.title}
          </span>
        </div>
        <div className="flex items-center justify-between font-mono text-[5.5px] text-[#64748B]">
          <span className="max-w-[70%] truncate">{item.credentialId}</span>
          <span>{item.year}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-[#191D28] via-[#11141C] to-[#0A0C10] p-2.5 text-[#F5F5F5]">
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
        </div>
        <span
          className="rounded-full px-1.5 py-[1px] font-mono text-[6px] font-semibold text-[#080808]"
          style={{ backgroundColor: item.accent || '#E4E4E7' }}
        >
          {item.year}
        </span>
      </div>

      <div className="my-auto space-y-1.5">
        <div
          className="h-9 w-full rounded-md border border-white/15 p-1.5"
          style={{
            background: `linear-gradient(135deg, ${item.accent}2E 0%, rgba(255,255,255,0.04) 100%)`
          }}
        >
          <p className="truncate font-sans text-[8.5px] font-bold text-white">{item.title}</p>
          <p className="truncate font-mono text-[6px] text-white/65">{item.category}</p>
        </div>

        <div className="grid grid-cols-3 gap-1">
          <span className="h-3.5 rounded bg-white/[0.08]" />
          <span className="h-3.5 rounded bg-white/[0.11]" />
          <span className="h-3.5 rounded bg-white/[0.06]" />
        </div>
      </div>

      <div className="flex items-center justify-between font-mono text-[6px] text-white/50">
        <span>{item.stack?.[0] || 'Web'}</span>
        <span>{item.badgeText}</span>
      </div>
    </div>
  )
}

/**
 * Interactive dark frosted-glass folder inspired by React Bits Folder:
 * - Stepped right-tab back shell + 3 translucent-peeking document/project cards
 * - Frosted dark-glass front flap (backdrop-blur + border-white/15) letting inner sheets peek through
 * - Dynamic item count & label at bottom-left, rounded ••• button at bottom-right
 * - Hover opens flap & fans sheets; Click opens flap wide while expanding gallery
 */
function InteractiveFolder({ count, label, items, variant, isOpen, onToggle }) {
  const prefersReducedMotion = useReducedMotion()
  const rawUid = useId()
  const uid = rawUid.replace(/:/g, '')
  const backClipId = `folder-back-${uid}`
  const frontClipId = `folder-front-${uid}`

  const [isHovered, setIsHovered] = useState(false)
  const [magnet, setMagnet] = useState({ x: 0, y: 0 })

  // Prioritize distinct first 3 entries for the stacked preview inside the folder
  const previewItems = [items[2] || items[0], items[1] || items[0], items[0]].filter(Boolean)

  const handlePointerMove = (event) => {
    if (prefersReducedMotion || event.pointerType === 'touch' || isOpen) return
    const rect = event.currentTarget.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2
    const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2
    setMagnet({
      x: Math.max(-1, Math.min(1, nx)),
      y: Math.max(-1, Math.min(1, ny))
    })
  }

  const handlePointerLeave = () => {
    setIsHovered(false)
    setMagnet({ x: 0, y: 0 })
  }

  const flapTransform = prefersReducedMotion
    ? 'none'
    : isOpen
      ? 'rotateX(-54deg) translateY(6px) scaleY(0.95)'
      : isHovered
        ? `rotateX(-24deg) skewX(${magnet.x * 2.5}deg) scaleY(0.97)`
        : 'rotateX(0deg) skewX(0deg) scaleY(1)'

  const backTransform = prefersReducedMotion
    ? 'none'
    : isOpen
      ? 'scale(1.02)'
      : isHovered
        ? `rotateY(${magnet.x * 3.5}deg) rotateX(${-magnet.y * 2}deg)`
        : 'rotateY(0deg) rotateX(0deg)'

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      onPointerEnter={(event) => {
        if (event.pointerType !== 'touch') {
          setIsHovered(true)
        }
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onFocus={() => setIsHovered(true)}
      onBlur={() => {
        setIsHovered(false)
        setMagnet({ x: 0, y: 0 })
      }}
      aria-label={`${isOpen ? 'Close' : 'Open'} ${label} folder (${count} items)`}
      style={{ perspective: '1100px' }}
      className="group relative flex w-full max-w-[300px] cursor-pointer flex-col items-center focus:outline-none sm:max-w-[330px]"
    >
      <svg width="0" height="0" className="pointer-events-none absolute" aria-hidden="true">
        <defs>
          <clipPath id={backClipId} clipPathUnits="objectBoundingBox">
            <path d={BACK_SHELL_CLIP_PATH} />
          </clipPath>
          <clipPath id={frontClipId} clipPathUnits="objectBoundingBox">
            <path d={FRONT_FLAP_CLIP_PATH} />
          </clipPath>
        </defs>
      </svg>

      <div
        style={{
          transformStyle: 'preserve-3d',
          transform: backTransform,
          transition: FOLDER_SPRING
        }}
        className="relative aspect-[320/240] w-full"
      >
        {/* Ground shadow under folder */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -bottom-3 inset-x-5 h-8 rounded-full bg-black/80 blur-xl transition-opacity duration-500 ${
            isOpen || isHovered ? 'opacity-95' : 'opacity-60'
          }`}
        />

        {/* Layer 1: Dark Metallic Back Folder Shell with Right Crown Tab */}
        <div
          style={{ clipPath: `url(#${backClipId})` }}
          className="absolute inset-0 bg-gradient-to-b from-[#2A2D35] via-[#171A20] to-[#0D0F13]"
        />
        <svg
          viewBox="0 0 320 240"
          fill="none"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <path
            d={BACK_SHELL_BOX_PATH}
            stroke={isOpen ? 'rgba(255, 255, 255, 0.34)' : 'rgba(255, 255, 255, 0.16)'}
            strokeWidth="1.25"
            className="transition-colors duration-300"
          />
        </svg>

        {/* Layer 2: 3 Stacked Preview Sheets peeking from inside folder */}
        <div className="pointer-events-none absolute inset-x-[9%] bottom-[11%] top-[20%]">
          {previewItems.map((previewItem, index) => {
            const layout = SHEET_LAYOUTS[index] || SHEET_LAYOUTS[2]
            const sheetTransform = prefersReducedMotion
              ? 'none'
              : isOpen
                ? layout.openTransform
                : isHovered
                  ? layout.hoverTransform(magnet.x, magnet.y)
                  : layout.idleTransform

            return (
              <div
                key={`${layout.key}-${previewItem.id}`}
                style={{
                  zIndex: layout.zIndex,
                  transformOrigin: 'bottom center',
                  transform: sheetTransform,
                  opacity: isOpen ? 0.92 : 1,
                  transition: FOLDER_SPRING
                }}
                className="absolute inset-0 overflow-hidden rounded-[12px] border border-white/20 bg-[#12141A] shadow-[0_12px_30px_rgba(0,0,0,0.65)]"
              >
                <FolderPaperPreview item={previewItem} variant={variant} />
              </div>
            )
          })}
        </div>

        {/* Layer 3: Translucent Frosted Dark-Glass Front Flap */}
        <div
          style={{
            transformOrigin: 'bottom center',
            transform: flapTransform,
            opacity: isOpen ? 0.88 : 1,
            transition: FOLDER_SPRING,
            transformStyle: 'preserve-3d'
          }}
          className="pointer-events-none absolute inset-0 z-30"
        >
          <div
            style={{ clipPath: `url(#${frontClipId})` }}
            className="relative h-full w-full bg-gradient-to-b from-[#1B1E25]/[0.54] via-[#101218]/[0.70] to-[#090A0D]/[0.88] backdrop-blur-sm"
          >
            {/* Bottom gradient for clean count/label contrast over translucent sheets */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#08090C]/90 via-[#08090C]/25 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_45%_at_25%_18%,rgba(255,255,255,0.09),transparent_70%)]" />

            {/* Bottom-Left Dynamic Count & Label */}
            <div className="absolute bottom-5 left-6 flex flex-col items-start text-left sm:bottom-6 sm:left-7">
              <span className="font-sans text-[1.75rem] font-extrabold leading-none tracking-tight text-white sm:text-[2rem]">
                {count}
              </span>
              <span className="mt-1 font-sans text-xs font-medium tracking-wide text-[#DCDFE6] sm:text-[13px]">
                {label}
              </span>
            </div>

            {/* Bottom-Right Rounded Three-Dots Action Box (ooo) */}
            <div
              className={`absolute bottom-5 right-5 flex h-11 w-12 items-center justify-center rounded-2xl border transition-colors duration-300 sm:bottom-6 sm:right-6 ${
                isOpen || isHovered
                  ? 'border-white/30 bg-[#2A2E38]/90 text-white'
                  : 'border-white/15 bg-[#1F2229]/80 text-white/80'
              }`}
            >
              <span className="flex items-center gap-[3px]" aria-hidden="true">
                <span className="h-[5px] w-[5px] rounded-full border-[1.4px] border-current" />
                <span className="h-[5px] w-[5px] rounded-full border-[1.4px] border-current" />
                <span className="h-[5px] w-[5px] rounded-full border-[1.4px] border-current" />
              </span>
            </div>
          </div>

          <svg
            viewBox="0 0 320 240"
            fill="none"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            <path
              d={FRONT_FLAP_BOX_PATH}
              stroke={
                isOpen
                  ? 'rgba(255, 255, 255, 0.35)'
                  : isHovered
                    ? 'rgba(255, 255, 255, 0.25)'
                    : 'rgba(255, 255, 255, 0.15)'
              }
              strokeWidth="1.25"
              className="transition-colors duration-300"
            />
          </svg>
        </div>
      </div>
    </button>
  )
}

export default memo(InteractiveFolder)
