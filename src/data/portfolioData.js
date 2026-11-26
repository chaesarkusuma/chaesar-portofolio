import { certificateFiles, galleryFiles, projectFiles } from 'virtual:portfolio-public-assets'

/**
 * Optional metadata enrichment for known files in `public/certificates`.
 * Any additional `.png`, `.jpg`, `.jpeg`, `.webp`, or `.pdf` added to
 * `public/certificates` is automatically detected and formatted cleanly.
 */
const CERTIFICATE_META = {
  'menangospn.jpg': {
    title: 'Peraih Medali Emas OSPN 2025 — Informatika',
    issuer: 'FOSNAS • OSPN',
    year: '2025',
    credentialId: '2366150/BHM-FOSNAS/OSPN/P/X/2025',
    category: 'Gold Medal • Informatics',
    accent: '#F59E0B',
    order: 1
  },
  'dicoding.jpg': {
    title: 'Belajar Dasar Manajemen Proyek',
    issuer: 'Dicoding Indonesia',
    year: '2026',
    credentialId: 'MRZMWWJ90PYQ',
    category: 'Project Management',
    accent: '#38BDF8',
    order: 2
  },
  'python.jpg': {
    title: 'Belajar Python Dasar',
    issuer: 'CODEPOLITAN',
    year: '2026',
    credentialId: 'MF0SI4X',
    category: 'Programming',
    accent: '#14B8A6',
    order: 3
  },
  'mengenalproggram.jpg': {
    title: 'Mengenal Pemrograman Komputer',
    issuer: 'CODEPOLITAN',
    year: '2026',
    credentialId: 'TJVKJPL',
    category: 'Computer Science',
    accent: '#2DD4BF',
    order: 4
  },
  'java.jpg': {
    title: 'Belajar JavaScript Dasar',
    issuer: 'CODEPOLITAN',
    year: '2025',
    credentialId: 'AXPQODC',
    category: 'JavaScript',
    accent: '#FACC15',
    order: 5
  },
  'git.jpg': {
    title: 'Belajar GIT untuk Pemula',
    issuer: 'CODEPOLITAN',
    year: '2025',
    credentialId: 'NQF5ZLT',
    category: 'Version Control',
    accent: '#34D399',
    order: 6
  },
  'html.jpg': {
    title: 'Belajar Dasar-dasar HTML dan CSS',
    issuer: 'CODEPOLITAN',
    year: '2025',
    credentialId: 'CMZILFG',
    category: 'Front-End Web',
    accent: '#60A5FA',
    order: 7
  },
  'ospn.jpg': {
    title: 'Peserta Aktif OSPN 2025 — Informatika',
    issuer: 'FOSNAS • OSPN',
    year: '2025',
    credentialId: '2366150/BHM-FOSNAS/OSPN/S/X/2025',
    category: 'National Olympiad',
    accent: '#EF4444',
    order: 8
  }
}

/**
 * Structured metadata enrichment for screenshot files inside `public/project`.
 * Edit or extend entries keyed by lowercase filename; any additional image
 * (.png, .jpg, .jpeg, .webp) placed in `public/project` is auto-detected.
 */
const PROJECT_META = {
  'e-commerce.png': {
    id: 'idn-cart',
    title: 'IDN CART',
    category: 'E-Commerce Storefront',
    year: '2025',
    summary:
      'E-commerce storefront featuring category navigation, product search bar, wishlist & cart counters, and a modern furniture hero showcase.',
    stack: ['HTML5', 'CSS3', 'Tailwind CSS', 'JavaScript'],
    accent: '#EF4444',
    codeUrl: 'https://github.com/chaesarkusuma/IDN-CART',
    repoUrl: 'https://github.com/chaesarkusuma/IDN-CART',
    order: 1
  },
  'e-report.png': {
    id: 'e-report',
    title: 'IDN E-Report 2025',
    category: 'Digital Reporting Portal',
    year: '2025',
    summary:
      'Web application for online student and facility incident reporting, streamlining ticket submission, transparency, and real-time tracking.',
    stack: ['Laravel', 'MySQL', 'Tailwind CSS'],
    accent: '#2563EB',
    codeUrl: 'https://github.com/chaesarkusuma/E-REPORT',
    repoUrl: 'https://github.com/chaesarkusuma/E-REPORT',
    order: 2
  },
  'payroll.png': {
    id: 'payroll-system',
    title: 'Payroll & Attendance System',
    category: 'Full-Stack Admin Dashboard',
    year: '2025',
    summary:
      'HR and attendance management dashboard built with Laravel and Filament v5 covering leaves, shifts, schedules, offices, and Shield RBAC roles.',
    stack: ['Laravel', 'Filament', 'MySQL', 'Tailwind CSS'],
    accent: '#F59E0B',
    codeUrl: 'https://github.com/chaesarkusuma/PAYROLL',
    repoUrl: 'https://github.com/chaesarkusuma/PAYROLL',
    order: 3
  },
  'bullstack.png': {
    id: 'santiago-bernabeu',
    title: 'Santiago Bernabeu Web',
    category: 'Stadium & Club Showcase',
    year: '2024',
    summary:
      'Interactive sports showcase website highlighting stadium history, standings, navigation dropdowns, member login portal, and embedded media.',
    stack: ['HTML5', 'CSS3', 'Bootstrap', 'JavaScript'],
    accent: '#3B82F6',
    codeUrl: 'https://github.com/chaesarkusuma/Santiago-Bernab-u',
    repoUrl: 'https://github.com/chaesarkusuma/Santiago-Bernab-u',
    order: 4
  },
  'firstporto.png': {
    id: 'first-portfolio',
    title: 'First Personal Portfolio',
    category: 'Personal Web Portfolio',
    year: '2024',
    summary:
      'My first personal portfolio website with monochrome typography aesthetic, quick section navigation (Skills, Contact, About), and social links.',
    stack: ['HTML5', 'CSS3', 'JavaScript'],
    accent: '#E4E4E7',
    codeUrl: 'https://github.com/chaesarkusuma/portofolio',
    repoUrl: 'https://github.com/chaesarkusuma/portofolio',
    order: 5
  }
}

function formatFileTitle(fileName) {
  const baseName = fileName.replace(/\.[^.]+$/, '')
  return baseName
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function toSlug(value) {
  return value.toLowerCase().replace(/\.[^.]+$/, '').replace(/[^a-z0-9]+/g, '')
}

export const CERTIFICATES_DATA = certificateFiles
  .map((file, index) => {
    const key = file.fileName.toLowerCase()
    const meta = CERTIFICATE_META[key] || {}
    return {
      id: `cert-${toSlug(file.fileName) || index}`,
      fileName: file.fileName,
      title: meta.title || formatFileTitle(file.fileName),
      issuer: meta.issuer || (file.mediaType === 'pdf' ? 'PDF Certificate' : 'Certificate'),
      year: meta.year || 'Verified',
      credentialId: meta.credentialId || file.fileName,
      category: meta.category || file.ext.replace('.', '').toUpperCase(),
      accent: meta.accent || '#38BDF8',
      image: file.url,
      mediaType: file.mediaType,
      order: meta.order ?? 100 + index
    }
  })
  .sort((a, b) => a.order - b.order)

export const PROJECTS_DATA = projectFiles
  .filter((file) => file.mediaType === 'image')
  .map((file, index) => {
    const key = file.fileName.toLowerCase()
    const meta = PROJECT_META[key] || {}
    return {
      id: meta.id || `project-${toSlug(file.fileName) || index}`,
      fileName: file.fileName,
      title: meta.title || formatFileTitle(file.fileName),
      category: meta.category || 'Web / App Project',
      year: meta.year || '2025',
      summary:
        meta.summary ||
        `Project screenshot loaded from public/project/${file.fileName}.`,
      stack: meta.stack || ['Web Development'],
      accent: meta.accent || '#E4E4E7',
      badgeText: meta.badgeText || file.ext.replace('.', '').toUpperCase(),
      image: file.url,
      mediaType: file.mediaType,
      demoUrl: meta.demoUrl || null,
      codeUrl: meta.codeUrl || meta.repoUrl || 'https://github.com/chaesarkusuma',
      repoUrl: meta.repoUrl || 'https://github.com/chaesarkusuma',
      order: meta.order ?? 100 + index
    }
  })
  .sort((a, b) => a.order - b.order)

/**
 * Exploding Centered Scrapbook Cluster presets for Moments & Memories (#moments).
 * Cards cluster tightly in the center with contrasting portrait sizes (w-64/w-72
 * hero anchors + w-36..w-48 accents), then explode outward at varied 3D parallax
 * velocities and scales (1.15–1.25) when scrolling down toward Contact.
 */
const GALLERY_LAYOUT_PRESETS = {
  'ip.jpg': {
    label: 'International Program',
    layer: 1,
    slotInLayer: 0,
    zIndex: 32,
    left: '40%',
    top: '31%',
    sizeClass: 'w-[136px] sm:w-[210px] lg:w-64 aspect-[3/4]',
    objectPosition: 'object-center',
    baseRotate: -3,
    exitX: '-16vw',
    exitY: '-36vh',
    exitScale: 1.24,
    exitTwist: -5,
    exitEnd: 0.91
  },
  'turki.jpg': {
    label: 'Istanbul Bosphorus',
    layer: 1,
    slotInLayer: 1,
    zIndex: 30,
    left: '74%',
    top: '44%',
    sizeClass: 'w-[144px] sm:w-[224px] lg:w-72 aspect-[3/4]',
    objectPosition: 'object-center',
    baseRotate: 3.5,
    exitX: '44vw',
    exitY: '-16vh',
    exitScale: 1.25,
    exitTwist: 6,
    exitEnd: 0.92
  },
  'kazak.jpg': {
    label: 'Kazakhstan Snow Mountain',
    layer: 2,
    slotInLayer: 0,
    zIndex: 28,
    left: '26%',
    top: '70%',
    sizeClass: 'w-[106px] sm:w-[152px] lg:w-48 aspect-[3/4]',
    objectPosition: 'object-center',
    baseRotate: 4,
    exitX: '-36vw',
    exitY: '28vh',
    exitScale: 1.2,
    exitTwist: 6,
    exitEnd: 0.94
  },
  'thai.jpeg': {
    label: 'Bangkok Skywalk',
    layer: 2,
    slotInLayer: 1,
    zIndex: 34,
    left: '51%',
    top: '76%',
    sizeClass: 'w-[98px] sm:w-[144px] lg:w-44 aspect-[3/4]',
    objectPosition: 'object-center',
    baseRotate: -2.5,
    exitX: '4vw',
    exitY: '38vh',
    exitScale: 1.18,
    exitTwist: -4,
    exitEnd: 0.95
  },
  'bandara.jpg': {
    label: 'Airport Departure',
    layer: 2,
    slotInLayer: 2,
    zIndex: 33,
    left: '67%',
    top: '19%',
    sizeClass: 'w-[92px] sm:w-[132px] lg:w-40 aspect-[3/4]',
    objectPosition: 'object-center',
    baseRotate: -4,
    exitX: '32vw',
    exitY: '-34vh',
    exitScale: 1.2,
    exitTwist: -6,
    exitEnd: 0.93
  },
  'vietnam.jpeg': {
    label: 'Vietnam Lakeside',
    layer: 3,
    slotInLayer: 0,
    zIndex: 35,
    left: '82%',
    top: '77%',
    sizeClass: 'w-[90px] sm:w-[130px] lg:w-40 aspect-[3/4]',
    objectPosition: 'object-center',
    baseRotate: -4.5,
    exitX: '38vw',
    exitY: '32vh',
    exitScale: 1.22,
    exitTwist: -5,
    exitEnd: 0.91
  },
  'ais.jpg': {
    label: 'Oldroll Photobooth',
    layer: 3,
    slotInLayer: 1,
    zIndex: 26,
    left: '15%',
    top: '36%',
    sizeClass: 'w-[88px] sm:w-[122px] lg:w-36 aspect-[3/4]',
    objectPosition: 'object-center',
    baseRotate: -5,
    exitX: '-38vw',
    exitY: '-24vh',
    exitScale: 1.16,
    exitTwist: -6,
    exitEnd: 0.96
  },
  'china.jpg': {
    label: 'China Journey',
    layer: 3,
    slotInLayer: 2,
    zIndex: 29,
    left: '13%',
    top: '62%',
    sizeClass: 'w-[88px] sm:w-[126px] lg:w-36 aspect-[3/4]',
    objectPosition: 'object-center',
    baseRotate: 3,
    exitX: '-42vw',
    exitY: '12vh',
    exitScale: 1.15,
    exitTwist: 5,
    exitEnd: 0.96
  }
}

const FALLBACK_GALLERY_SLOTS = [
  {
    layer: 3,
    slotInLayer: 2,
    zIndex: 24,
    left: '25%',
    top: '20%',
    sizeClass: 'w-[88px] sm:w-[126px] lg:w-36 aspect-[3/4]',
    objectPosition: 'object-center',
    baseRotate: -3.5,
    exitX: '-26vw',
    exitY: '-30vh',
    exitScale: 1.18,
    exitTwist: -5,
    exitEnd: 0.95
  }
]

export const GALLERY_PHOTOS = galleryFiles
  .filter((file) => file.mediaType === 'image')
  .map((file, index) => {
    const preset =
      GALLERY_LAYOUT_PRESETS[file.fileName.toLowerCase()] ||
      FALLBACK_GALLERY_SLOTS[index % FALLBACK_GALLERY_SLOTS.length]
    return {
      id: `moment-${toSlug(file.fileName) || index}`,
      src: file.url,
      alt: preset.label || formatFileTitle(file.fileName),
      ...preset
    }
  })
