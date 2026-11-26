import { useId } from 'react'

/**
 * Crisp inline brand SVG icons using real SVG masks for internal cutouts so
 * CSS `brightness(0) invert(1)` turns every icon cleanly monochrome white
 * while idle, and reveals full brand color smoothly on hover.
 */

export function Html5Icon({ className = 'h-10 w-10 sm:h-14 sm:w-14' }) {
  const maskId = useId()
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <mask id={maskId}>
          <rect width="32" height="32" fill="white" />
          <path
            d="M9.6 8.5h12.8l-.4 3.4H12.9l.3 3.3h8.4l-.7 8-4.9 1.6-4.9-1.6-.3-3.6h3.3l.2 1.8 1.7.6 1.8-.6.3-2.9H10.2L9.6 8.5z"
            fill="black"
          />
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        <path d="M5 3h22l-2 22.5L16 29l-9-3.5L5 3z" fill="#FF5722" />
        <path d="M16 5.2v21.6l7.2-2.7 1.6-18.9H16z" fill="#FF7043" fillOpacity="0.45" />
      </g>
    </svg>
  )
}

export function Css3Icon({ className = 'h-10 w-10 sm:h-14 sm:w-14' }) {
  const maskId = useId()
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <mask id={maskId}>
          <rect width="32" height="32" fill="white" />
          <text
            x="17"
            y="24.5"
            textAnchor="middle"
            fill="black"
            fontFamily="Inter, system-ui, sans-serif"
            fontWeight="800"
            fontSize="10"
            letterSpacing="-0.4"
          >
            CSS
          </text>
        </mask>
      </defs>
      <path
        d="M4 4h19a5 5 0 0 1 5 5v19H9a5 5 0 0 1-5-5V4z"
        fill="#2965F1"
        mask={`url(#${maskId})`}
      />
    </svg>
  )
}

export function JavaScriptIcon({ className = 'h-10 w-10 sm:h-14 sm:w-14' }) {
  const maskId = useId()
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <mask id={maskId}>
          <rect width="32" height="32" fill="white" />
          <text
            x="19.5"
            y="24.5"
            textAnchor="middle"
            fill="black"
            fontFamily="Inter, system-ui, sans-serif"
            fontWeight="800"
            fontSize="11.5"
            letterSpacing="-0.5"
          >
            JS
          </text>
        </mask>
      </defs>
      <rect x="4" y="4" width="24" height="24" rx="2.5" fill="#F7DF1E" mask={`url(#${maskId})`} />
    </svg>
  )
}

export function MySqlIcon({ className = 'h-11 w-12 sm:h-14 sm:w-16' }) {
  return (
    <svg viewBox="0 0 40 32" className={className} aria-hidden="true">
      <path
        d="M27.6 14.5c-1.1-2-2.6-3.7-4.5-4.8-.6-.4-1.3-.7-2-.8-.3-.1-.3-.4 0-.6.5-.3 1.1-.4 1.8-.3-.9-.5-1.9-.6-2.8-.2-.5.2-.9.6-1.2 1.1-.9-.3-1.9-.2-2.7.2-.2.1-.1.4.1.4.9.1 1.7.4 2.4.9.9.6 1.6 1.5 2 2.5.1.3.4.3.5 0 .1-.4.1-.9 0-1.3 1.5.9 2.7 2.2 3.4 3.8.2.3.5.3.6 0 .2-.6.1-1.3-.2-1.8.8.4 1.6 1 2.2 1.7.3.4.7.1.4-.4z"
        fill="none"
        stroke="#14B8A6"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="19.5"
        y="24.5"
        textAnchor="middle"
        fill="#14B8A6"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="700"
        fontSize="8.8"
        letterSpacing="-0.2"
      >
        MySQL
      </text>
    </svg>
  )
}

export function TailwindIcon({ className = 'h-10 w-10 sm:h-14 sm:w-14' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path
        d="M16 8.5c-3.7 0-6 1.85-6.9 5.55 1.38-1.85 3-2.54 4.83-2.08 1.05.26 1.8 1.02 2.63 1.86 1.35 1.37 2.91 2.96 6.34 2.96 3.7 0 6-1.85 6.9-5.55-1.38 1.85-3 2.54-4.83 2.08-1.05-.26-1.8-1.02-2.63-1.86C20.99 10.09 19.43 8.5 16 8.5zM9.1 16.8c-3.7 0-6 1.85-6.9 5.55 1.38-1.85 3-2.54 4.83-2.08 1.05.26 1.8 1.02 2.63 1.86 1.35 1.37 2.91 2.96 6.34 2.96 3.7 0 6-1.85 6.9-5.55-1.38 1.85-3 2.54-4.83 2.08-1.05-.26-1.8-1.02-2.63-1.86-1.35-1.37-2.91-2.96-6.34-2.96z"
        fill="#38BDF8"
      />
    </svg>
  )
}

export function LaravelIcon({ className = 'h-10 w-10 sm:h-14 sm:w-14' }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="#FF2D20"
      strokeWidth="1.55"
      strokeLinejoin="round"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5.5 7.5l4-2.2 4 2.2v12.2l5.5 3.1v4.4L5.5 19.5V7.5z" />
      <path d="M5.5 7.5l4 2.2 4-2.2M9.5 9.7v10l9.5 5.4" />
      <path d="M19 10.5l4-2.2 4 2.2v6.6l-4 2.2-4-2.2v-6.6z" />
      <path d="M19 10.5l4 2.2 4-2.2M23 12.7v6.6" />
      <path d="M13.5 19.7l5.5-2.6M19 22.8l4-2.2v-1.3" />
    </svg>
  )
}

export function BootstrapIcon({ className = 'h-10 w-10 sm:h-14 sm:w-14' }) {
  const maskId = useId()
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <mask id={maskId}>
          <rect width="32" height="32" fill="white" />
          <text
            x="16"
            y="21"
            textAnchor="middle"
            fill="black"
            fontFamily="Inter, system-ui, sans-serif"
            fontWeight="700"
            fontSize="14.5"
          >
            B
          </text>
        </mask>
      </defs>
      <path
        d="M7.8 6.5h16.4c1.3 0 2.3 1 2.3 2.3v2.6c0 1.4.8 2.6 2 3.1v3c-1.2.5-2 1.7-2 3.1v2.6c0 1.3-1 2.3-2.3 2.3H7.8c-1.3 0-2.3-1-2.3-2.3v-2.6c0-1.4-.8-2.6-2-3.1v-3c1.2-.5 2-1.7 2-3.1V8.8c0-1.3 1-2.3 2.3-2.3z"
        fill="#8B5CF6"
        mask={`url(#${maskId})`}
      />
    </svg>
  )
}

export function ReactIcon({ className = 'h-10 w-10 sm:h-14 sm:w-14' }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="2.2" fill="#22D3EE" />
      <ellipse cx="16" cy="16" rx="11.5" ry="4.4" stroke="#22D3EE" strokeWidth="1.5" />
      <ellipse
        cx="16"
        cy="16"
        rx="11.5"
        ry="4.4"
        transform="rotate(60 16 16)"
        stroke="#22D3EE"
        strokeWidth="1.5"
      />
      <ellipse
        cx="16"
        cy="16"
        rx="11.5"
        ry="4.4"
        transform="rotate(120 16 16)"
        stroke="#22D3EE"
        strokeWidth="1.5"
      />
    </svg>
  )
}

export function FlutterIcon({ className = 'h-10 w-10 sm:h-14 sm:w-14' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M18.2 4L6.2 16l3.7 3.7L25.6 4h-7.4z" fill="#54C5F8" />
      <path d="M18.2 14.8l-6.6 6.6 6.6 6.6h7.4L19 21.4l6.6-6.6h-7.4z" fill="#2989F8" />
      <path d="M11.6 21.4l3.7 3.7 3.7-3.7-3.7-3.7-3.7 3.7z" fill="#60A5FA" fillOpacity="0.7" />
    </svg>
  )
}

export function GitHubLogoIcon({ className = 'h-10 w-10 sm:h-14 sm:w-14' }) {
  return (
    <svg viewBox="0 0 24 24" fill="#FFFFFF" className={className} aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

export const TECH_STACK_LOGOS = [
  { name: 'HTML5', Icon: Html5Icon },
  { name: 'CSS3', Icon: Css3Icon },
  { name: 'JavaScript', Icon: JavaScriptIcon },
  { name: 'MySQL', Icon: MySqlIcon },
  { name: 'Tailwind CSS', Icon: TailwindIcon },
  { name: 'Laravel', Icon: LaravelIcon },
  { name: 'Bootstrap', Icon: BootstrapIcon },
  { name: 'React', Icon: ReactIcon },
  { name: 'Flutter', Icon: FlutterIcon },
  { name: 'GitHub', Icon: GitHubLogoIcon }
]
