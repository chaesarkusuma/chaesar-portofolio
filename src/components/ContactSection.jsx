import { memo, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const COMMENTS_STORAGE_KEY = 'chaesar_portfolio_comments_v1'
const MAX_AVATAR_BYTES = 5 * 1024 * 1024

// Optional EmailJS credentials: populate to dispatch real emails via EmailJS REST API
const EMAILJS_CONFIG = {
  serviceId: '',
  templateId: '',
  publicKey: ''
}

const FIND_ME_PHOTO = '/profile.jpg'

const SOCIAL_LINKS = [
  {
    id: 'linkedin',
    title: "Let's Connect",
    subtitle: 'on LinkedIn',
    href: 'https://www.linkedin.com/in/chaesarkusumaa',
    iconBg: 'bg-[#0A66C2] text-white'
  },
  {
    id: 'instagram',
    title: 'Instagram',
    subtitle: '@chaesarkusumaa',
    href: 'https://www.instagram.com/chaesarkusumaa',
    iconBg: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white'
  },
  {
    id: 'github',
    title: 'GitHub',
    subtitle: '@chaesarkusuma',
    href: 'https://github.com/chaesarkusuma',
    iconBg: 'bg-[#F5F5F5] text-[#0B0C10]'
  },
  {
    id: 'tiktok',
    title: 'TikTok',
    subtitle: '@chaesarkusuma',
    href: 'https://tiktok.com/@chaesarkusuma',
    iconBg: 'bg-[#0F1014] text-white border border-white/15'
  }
]

const SEED_COMMENTS = [
  {
    id: 'seed-1',
    name: 'Andika',
    text: 'Keren banget portfolionya bang, transisinya halus parah!',
    avatar: null,
    staticTime: '2d ago'
  },
  {
    id: 'seed-2',
    name: 'dilacantik dari ipb',
    text: 'Gokil kak, info GitHub-nya dong!',
    avatar: null,
    staticTime: '2d ago'
  },
  {
    id: 'seed-3',
    name: 'iwaw',
    text: 'Gacor bang desain UI-nya rapi dan interaktif.',
    avatar: null,
    staticTime: '2d ago'
  },
  {
    id: 'seed-4',
    name: 'Secret',
    text: 'Gokil bg web lu, ajarin dong gimana cara buat background konturnya?',
    avatar: '/avatar.png',
    staticTime: '3d ago'
  },
  {
    id: 'seed-5',
    name: 'chnaka',
    text: 'KERENN BGT BANG!!!',
    avatar: null,
    staticTime: '3d ago'
  }
]

function UserIcon({ className = 'h-4 w-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function MailIcon({ className = 'h-4 w-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  )
}

function ChatBubbleIcon({ className = 'h-4 w-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  )
}

function SendPlaneIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  )
}

function ExternalLinkIcon() {
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
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

function ImageUploadIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}

function AlertCircleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

function SocialBrandGlyph({ id }) {
  if (id === 'linkedin') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M6.94 8.5H3.56V19.5H6.94V8.5ZM5.25 3.5C4.14 3.5 3.25 4.39 3.25 5.5C3.25 6.6 4.14 7.5 5.25 7.5C6.35 7.5 7.25 6.6 7.25 5.5C7.25 4.39 6.35 3.5 5.25 3.5ZM20.44 13.02C20.44 9.88 18.76 8.22 16.16 8.22C14.37 8.22 13.48 9.21 13.02 9.93V8.5H9.65C9.7 9.48 9.65 19.5 9.65 19.5H13.02V13.36C13.02 13.02 13.05 12.69 13.15 12.45C13.42 11.78 14.03 11.09 15.07 11.09C16.41 11.09 17.06 12.11 17.06 13.6V19.5H20.44V13.02Z" />
      </svg>
    )
  }

  if (id === 'instagram') {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
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

  if (id === 'github') {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    )
  }

  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.1z" />
    </svg>
  )
}

function loadStoredComments() {
  try {
    const raw = window.localStorage.getItem(COMMENTS_STORAGE_KEY)
    if (!raw) return SEED_COMMENTS
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed
    }
  } catch {
    // Ignore storage read failures in restricted environments
  }
  return SEED_COMMENTS
}

function formatCommentTime(comment) {
  if (comment.staticTime) return comment.staticTime
  if (!comment.createdAt) return 'Just now'

  const elapsedSec = Math.max(0, Math.floor((Date.now() - comment.createdAt) / 1000))
  if (elapsedSec < 60) return 'Just now'
  const minutes = Math.floor(elapsedSec / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

/**
 * Downscales an uploaded avatar file into a compact square JPEG DataURL so
 * user avatars stay lightweight inside localStorage without blowing quota.
 */
function resizeAvatarFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Failed to read image'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Invalid image file'))
      img.onload = () => {
        const size = 128
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(reader.result)
          return
        }

        const minSide = Math.min(img.width, img.height)
        const sx = (img.width - minSide) / 2
        const sy = (img.height - minSide) / 2
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size)
        resolve(canvas.toDataURL('image/jpeg', 0.85))
      }
      img.src = String(reader.result || '')
    }
    reader.readAsDataURL(file)
  })
}

const DARK_GLASS_CARD =
  'rounded-3xl border border-white/10 bg-[#0D0E14]/[0.90] p-6 shadow-[0_14px_38px_rgba(0,0,0,0.48)] backdrop-blur-sm sm:p-7'

const DARK_INPUT_SHELL =
  'flex items-center gap-3 rounded-xl border border-white/10 bg-[#151720]/85 px-3.5 text-[#F5F5F5] transition-colors focus-within:border-white/50 focus-within:ring-1 focus-within:ring-white/20'

const DARK_HEADER_BADGE =
  'flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/[0.08] text-white'

const PRIMARY_CTA_BUTTON =
  'flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white font-sans text-sm font-semibold text-[#09090b] shadow-[0_8px_24px_rgba(255,255,255,0.08)] transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60'

/**
 * Contact & Guestbook section (#contact) plus bottom copyright Footer, positioned
 * at the base of the continuous 3D topographic contour canvas.
 */
function ContactSection() {
  const prefersReducedMotion = useReducedMotion()
  const fileInputRef = useRef(null)

  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [toast, setToast] = useState(null)

  const [comments, setComments] = useState(loadStoredComments)
  const [commentForm, setCommentForm] = useState({ name: '', text: '' })
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [avatarFileName, setAvatarFileName] = useState('')
  const [avatarError, setAvatarError] = useState('')

  useEffect(() => {
    try {
      window.localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments))
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [comments])

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(null), 4000)
    return () => window.clearTimeout(timer)
  }, [toast])

  const showToast = (type, message) => {
    setToast({ type, message })
  }

  const handleContactSubmit = async (event) => {
    event.preventDefault()
    const name = contactForm.name.trim()
    const email = contactForm.email.trim()
    const message = contactForm.message.trim()

    if (!name || !email || !message) {
      showToast('error', 'Mohon lengkapi nama, email, dan pesan terlebih dahulu.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('error', 'Format email tidak valid.')
      return
    }

    setIsSendingMessage(true)
    try {
      const { serviceId, templateId, publicKey } = EMAILJS_CONFIG
      if (serviceId && templateId && publicKey) {
        const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            template_params: { from_name: name, from_email: email, message }
          })
        })
        if (!res.ok) throw new Error('EmailJS failed')
      }

      setContactForm({ name: '', email: '', message: '' })
      showToast('success', 'Pesan berhasil dikirim! Terima kasih telah menghubungi.')
    } catch {
      showToast('error', 'Gagal mengirim pesan. Coba lagi beberapa saat.')
    } finally {
      setIsSendingMessage(false)
    }
  }

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0]
    setAvatarError('')
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setAvatarError('Format file harus berupa gambar (.jpg, .png, .webp).')
      event.target.value = ''
      return
    }

    if (file.size > MAX_AVATAR_BYTES) {
      setAvatarError('Ukuran foto maksimal 5MB.')
      event.target.value = ''
      return
    }

    try {
      const resized = await resizeAvatarFile(file)
      setAvatarPreview(resized)
      setAvatarFileName(file.name)
    } catch {
      setAvatarError('Tidak dapat memproses foto yang dipilih.')
    }
  }

  const handleClearAvatar = () => {
    setAvatarPreview(null)
    setAvatarFileName('')
    setAvatarError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleCommentSubmit = (event) => {
    event.preventDefault()
    const name = commentForm.name.trim()
    const text = commentForm.text.trim()

    if (!name || !text) {
      showToast('error', 'Nama dan isi komentar wajib diisi.')
      return
    }

    const newComment = {
      id: `comment-${Date.now()}`,
      name,
      text,
      avatar: avatarPreview,
      createdAt: Date.now()
    }

    setComments((prev) => [newComment, ...prev])
    setCommentForm({ name: '', text: '' })
    handleClearAvatar()
    showToast('success', 'Komentar berhasil ditambahkan!')
  }

  const revealHidden = prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }
  const revealVisible = prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }

  return (
    <>
      <section
        id="contact"
        aria-labelledby="contact-heading"
        className="relative z-10 mx-auto w-full max-w-6xl scroll-mt-10 px-5 pb-16 pt-24 sm:px-10 sm:pb-24 sm:pt-28 lg:px-14"
      >
        {/* 2-Column Responsive Layout (~38% Left / ~62% Right) */}
        <motion.div
          initial={revealHidden}
          whileInView={revealVisible}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: prefersReducedMotion ? 0.2 : 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,38fr)_minmax(0,62fr)] lg:gap-7"
        >
          {/* Left Column (~38%): Hubungi + Find Me */}
          <div className="flex flex-col gap-6">
            {/* Top Left Card: Hubungi */}
            <div className={DARK_GLASS_CARD}>
              <h2
                id="contact-heading"
                className="font-sans text-2xl font-extrabold tracking-tight text-white sm:text-[28px]"
              >
                Hubungi
              </h2>
              <p className="mt-2 font-sans text-xs leading-relaxed text-[#9A9CA3] sm:text-[13.5px]">
                Ada yang mau didiskusikan? Langsung kirim pesan aja ya..!
              </p>

              <form onSubmit={handleContactSubmit} className="mt-6 space-y-3.5" noValidate>
                <div className={DARK_INPUT_SHELL}>
                  <UserIcon className="h-4 w-4 shrink-0 text-[#7E828A]" />
                  <input
                    type="text"
                    name="name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Nama Anda"
                    aria-label="Nama Anda"
                    required
                    className="h-11 w-full bg-transparent font-sans text-sm text-[#F5F5F5] placeholder-[#6B6F78] focus:outline-none"
                  />
                </div>

                <div className={DARK_INPUT_SHELL}>
                  <MailIcon className="h-4 w-4 shrink-0 text-[#7E828A]" />
                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="Email Anda"
                    aria-label="Email Anda"
                    required
                    className="h-11 w-full bg-transparent font-sans text-sm text-[#F5F5F5] placeholder-[#6B6F78] focus:outline-none"
                  />
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-[#151720]/85 px-3.5 py-3 text-[#F5F5F5] transition-colors focus-within:border-white/50 focus-within:ring-1 focus-within:ring-white/20">
                  <ChatBubbleIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#7E828A]" />
                  <textarea
                    name="message"
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))}
                    placeholder="Pesan Anda"
                    aria-label="Pesan Anda"
                    required
                    className="w-full resize-none bg-transparent font-sans text-sm text-[#F5F5F5] placeholder-[#6B6F78] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSendingMessage}
                  className={PRIMARY_CTA_BUTTON}
                >
                  <SendPlaneIcon />
                  <span>{isSendingMessage ? 'Mengirim...' : 'Kirim Pesan'}</span>
                </button>
              </form>
            </div>

            {/* Bottom Left Card: Find Me */}
            <div className={DARK_GLASS_CARD}>
              <h3 className="font-sans text-lg font-extrabold tracking-tight text-[#F5F5F5] sm:text-xl">
                Find Me
              </h3>

              <div className="mt-4 divide-y divide-white/[0.08]">
                {SOCIAL_LINKS.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-3 py-3.5 transition-colors first:pt-1.5 last:pb-3"
                  >
                    <div className="flex min-w-0 items-center gap-3.5">
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-105 ${item.iconBg}`}
                      >
                        <SocialBrandGlyph id={item.id} />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-sans text-sm font-bold text-[#F5F5F5] transition-colors group-hover:text-white">
                          {item.title}
                        </p>
                        <p className="truncate font-sans text-xs text-[#8E9299]">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 text-[#6F737C] transition-colors group-hover:text-white">
                      <ExternalLinkIcon />
                    </span>
                  </a>
                ))}
              </div>

              <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-[#14161D]">
                <img
                  src={FIND_ME_PHOTO}
                  alt="Chaesar Kusuma"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="aspect-[4/3] w-full select-none object-cover object-[50%_62%]"
                />
              </div>
            </div>
          </div>

          {/* Right Column (~62%): Tulis Komentar + Live Komentar List */}
          <div className="flex flex-col gap-6">
            {/* Top Right Card: Tulis Komentar */}
            <div className={DARK_GLASS_CARD}>
              <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
                <span className={DARK_HEADER_BADGE}>
                  <ChatBubbleIcon className="h-4 w-4" />
                </span>
                <h3 className="font-sans text-lg font-extrabold tracking-tight text-white sm:text-xl">
                  Tulis Komentar
                </h3>
              </div>

              <form onSubmit={handleCommentSubmit} className="mt-5 space-y-4" noValidate>
                <div>
                  <label
                    htmlFor="comment-author-name"
                    className="mb-1.5 block font-sans text-xs font-bold tracking-wide text-[#D4D6DC]"
                  >
                    Nama
                  </label>
                  <input
                    id="comment-author-name"
                    type="text"
                    maxLength={60}
                    value={commentForm.name}
                    onChange={(e) => setCommentForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Masukkan nama kamu"
                    required
                    className="h-11 w-full rounded-xl border border-white/10 bg-[#151720]/85 px-4 font-sans text-sm text-[#F5F5F5] placeholder-[#6B6F78] transition-colors focus:border-white/50 focus:outline-none focus:ring-1 focus:ring-white/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="comment-author-text"
                    className="mb-1.5 block font-sans text-xs font-bold tracking-wide text-[#D4D6DC]"
                  >
                    Komentar
                  </label>
                  <textarea
                    id="comment-author-text"
                    rows={4}
                    maxLength={500}
                    value={commentForm.text}
                    onChange={(e) => setCommentForm((p) => ({ ...p, text: e.target.value }))}
                    placeholder="Tulis komentar kamu di sini..."
                    required
                    className="w-full resize-none rounded-xl border border-white/10 bg-[#151720]/85 p-4 font-sans text-sm text-[#F5F5F5] placeholder-[#6B6F78] transition-colors focus:border-white/50 focus:outline-none focus:ring-1 focus:ring-white/20"
                  />
                </div>

                <div>
                  <span className="mb-1.5 block font-sans text-xs font-bold tracking-wide text-[#D4D6DC]">
                    Foto Profil <span className="font-normal text-[#8E9299]">(opsional)</span>
                  </span>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    id="comment-avatar-upload"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-dashed border-white/15 bg-[#151720]/70 px-4 font-sans text-sm font-medium text-[#D4D6DC] transition-colors hover:border-white/45 hover:text-white focus:border-white/50 focus:outline-none focus:ring-1 focus:ring-white/20"
                  >
                    <ImageUploadIcon />
                    <span>{avatarFileName ? 'Change Profile Photo' : 'Choose Profile Photo'}</span>
                  </button>

                  <p className="mt-1.5 text-center font-mono text-[11px] text-[#7E828A]">
                    Max file size: 5MB
                  </p>

                  {avatarError && (
                    <p className="mt-1.5 text-center font-sans text-xs text-rose-400">
                      {avatarError}
                    </p>
                  )}

                  {avatarPreview && (
                    <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#151720]/90 px-3.5 py-2">
                      <div className="flex min-w-0 items-center gap-3">
                        <img
                          src={avatarPreview}
                          alt="Selected avatar preview"
                          decoding="async"
                          className="h-9 w-9 shrink-0 rounded-full border border-white/15 object-cover"
                        />
                        <span className="truncate font-mono text-xs text-[#D4D6DC]">
                          {avatarFileName}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleClearAvatar}
                        className="shrink-0 font-sans text-xs font-semibold text-rose-400 hover:text-rose-300"
                      >
                        Hapus
                      </button>
                    </div>
                  )}
                </div>

                <button type="submit" className={PRIMARY_CTA_BUTTON}>
                  <SendPlaneIcon />
                  <span>Kirim Komentar</span>
                </button>
              </form>
            </div>

            {/* Bottom Right Card: Komentar (Dynamic Live List) */}
            <div className={DARK_GLASS_CARD}>
              <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
                <span className={DARK_HEADER_BADGE}>
                  <ChatBubbleIcon className="h-4 w-4" />
                </span>
                <h3 className="font-sans text-lg font-extrabold tracking-tight text-white sm:text-xl">
                  Komentar <span className="text-white">({comments.length})</span>
                </h3>
              </div>

              <ul
                data-lenis-prevent
                className="mt-2 max-h-[430px] divide-y divide-white/[0.07] overflow-y-auto pr-1"
              >
                <AnimatePresence initial={false}>
                  {comments.map((comment) => (
                    <motion.li
                      key={comment.id}
                      initial={
                        prefersReducedMotion
                          ? { opacity: 0 }
                          : { opacity: 0, y: -12, scale: 0.98 }
                      }
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-start gap-3.5 py-4 first:pt-3.5"
                    >
                      {comment.avatar ? (
                        <img
                          src={comment.avatar}
                          alt={comment.name}
                          loading="lazy"
                          decoding="async"
                          className="h-10 w-10 shrink-0 rounded-full border border-white/15 object-cover"
                        />
                      ) : (
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-[#8E9299]">
                          <UserIcon className="h-4 w-4" />
                        </span>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="truncate font-sans text-sm font-bold text-[#F5F5F5]">
                            {comment.name}
                          </p>
                          <span className="shrink-0 font-mono text-[11px] text-[#7E828A]">
                            {formatCommentTime(comment)}
                          </span>
                        </div>
                        <p className="mt-1 whitespace-pre-wrap break-words font-sans text-xs leading-relaxed text-[#A3A6AE] sm:text-[13px]">
                          {comment.text}
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Subtle Copyright Footer */}
      <footer className="relative z-10 w-full border-t border-white/[0.08] py-8 text-center">
        <p className="px-4 font-sans text-xs text-[#7E828A] sm:text-sm">
          &copy; 2026 Chaesar Kusuma. All Rights Reserved.
        </p>
      </footer>

      {/* Floating Feedback Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            role="status"
            aria-live="polite"
            className={`fixed bottom-6 right-6 z-50 flex max-w-sm items-center gap-2.5 rounded-2xl border px-4 py-3 font-sans text-xs font-medium shadow-[0_14px_38px_rgba(0,0,0,0.65)] backdrop-blur-sm sm:text-sm ${
              toast.type === 'error'
                ? 'border-rose-500/35 bg-[#1B1014]/95 text-rose-200'
                : 'border-white/25 bg-[#111216]/95 text-white'
            }`}
          >
            {toast.type === 'error' ? <AlertCircleIcon /> : <CheckCircleIcon />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default memo(ContactSection)
