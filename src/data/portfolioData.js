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
 * Spatial & Z-axis depth presets for the Floating Photo Collage (#moments).
 * Divided into 3 overlapping depth waves so foreground -> midground -> background
 * groups emerge sequentially, linger sharp, then zoom/blur past the camera.
 */
const GALLERY_LAYOUT_PRESETS = {
  'kazak.jpg': {
    label: 'Kazakhstan Delegation',
    layer: 1,
    slotInLayer: 0,
    zIndex: 32,
    left: '28%',
    top: '31%',
    sizeClass: 'w-[148px] sm:w-[225px] lg:w-[265px] aspect-[4/3]',
    objectPosition: 'object-center',
    baseRotate: -6,
    enterX: '8vw',
    enterY: '7vh',
    exitX: '-14vw',
    exitY: '-10vh',
    exitRotate: -10
  },
  'ip.jpg': {
    label: 'International Program',
    layer: 1,
    slotInLayer: 1,
    zIndex: 35,
    left: '51%',
    top: '50%',
    sizeClass: 'w-[128px] sm:w-[172px] lg:w-[202px] aspect-[3/4]',
    objectPosition: 'object-[50%_25%]',
    baseRotate: 3.5,
    enterX: '0vw',
    enterY: '3vh',
    exitX: '2vw',
    exitY: '8vh',
    exitRotate: 6
  },
  'uzbek.jpg': {
    label: 'Uzbekistan Exchange',
    layer: 1,
    slotInLayer: 2,
    zIndex: 30,
    left: '71%',
    top: '66%',
    sizeClass: 'w-[148px] sm:w-[222px] lg:w-[262px] aspect-[4/3]',
    objectPosition: 'object-center',
    baseRotate: 5.5,
    enterX: '-8vw',
    enterY: '-6vh',
    exitX: '15vw',
    exitY: '11vh',
    exitRotate: 10
  },
  'turki.jpg': {
    label: 'Istanbul Bosphorus',
    layer: 1,
    slotInLayer: 2,
    zIndex: 30,
    left: '71%',
    top: '66%',
    sizeClass: 'w-[132px] sm:w-[178px] lg:w-[210px] aspect-[3/4]',
    objectPosition: 'object-[50%_25%]',
    baseRotate: 5.5,
    enterX: '-8vw',
    enterY: '-6vh',
    exitX: '15vw',
    exitY: '11vh',
    exitRotate: 10
  },
  'ais.jpg': {
    label: 'AIS Moment',
    layer: 2,
    slotInLayer: 0,
    zIndex: 24,
    left: '65%',
    top: '28%',
    sizeClass: 'w-[118px] sm:w-[158px] lg:w-[184px] aspect-[2/3]',
    objectPosition: 'object-[50%_22%]',
    baseRotate: 7,
    enterX: '-6vw',
    enterY: '8vh',
    exitX: '13vw',
    exitY: '-12vh',
    exitRotate: 11
  },
  'basket.jpg': {
    label: 'Basketball Court',
    layer: 2,
    slotInLayer: 1,
    zIndex: 22,
    left: '27%',
    top: '67%',
    sizeClass: 'w-[150px] sm:w-[228px] lg:w-[270px] aspect-[3/2]',
    objectPosition: 'object-center',
    baseRotate: -7.5,
    enterX: '8vw',
    enterY: '-6vh',
    exitX: '-15vw',
    exitY: '12vh',
    exitRotate: -12
  },
  'bandara.jpg': {
    label: 'Airport Departure',
    layer: 2,
    slotInLayer: 1,
    zIndex: 22,
    left: '27%',
    top: '67%',
    sizeClass: 'w-[132px] sm:w-[178px] lg:w-[210px] aspect-[3/4]',
    objectPosition: 'object-center',
    baseRotate: -7.5,
    enterX: '8vw',
    enterY: '-6vh',
    exitX: '-15vw',
    exitY: '12vh',
    exitRotate: -12
  },
  'thai.jpeg': {
    label: 'Thailand Memories',
    layer: 2,
    slotInLayer: 2,
    zIndex: 26,
    left: '43%',
    top: '42%',
    sizeClass: 'w-[116px] sm:w-[154px] lg:w-[178px] aspect-[3/4]',
    objectPosition: 'object-[50%_24%]',
    baseRotate: -3.5,
    enterX: '4vw',
    enterY: '4vh',
    exitX: '-7vw',
    exitY: '-8vh',
    exitRotate: -7
  },
  'ican.jpg': {
    label: 'Campus Moments',
    layer: 3,
    slotInLayer: 0,
    zIndex: 14,
    left: '21%',
    top: '47%',
    sizeClass: 'w-[104px] sm:w-[138px] lg:w-[160px] aspect-[9/15]',
    objectPosition: 'object-[50%_24%]',
    baseRotate: 6,
    enterX: '10vw',
    enterY: '2vh',
    exitX: '-15vw',
    exitY: '-3vh',
    exitRotate: 9
  },
  'china.jpg': {
    label: 'China Journey',
    layer: 3,
    slotInLayer: 0,
    zIndex: 14,
    left: '21%',
    top: '47%',
    sizeClass: 'w-[120px] sm:w-[160px] lg:w-[188px] aspect-[3/4]',
    objectPosition: 'object-center',
    baseRotate: 6,
    enterX: '10vw',
    enterY: '2vh',
    exitX: '-15vw',
    exitY: '-3vh',
    exitRotate: 9
  },
  'vietnam.jpeg': {
    label: 'Vietnam Journey',
    layer: 3,
    slotInLayer: 1,
    zIndex: 12,
    left: '80%',
    top: '43%',
    sizeClass: 'w-[104px] sm:w-[136px] lg:w-[158px] aspect-[9/15]',
    objectPosition: 'object-[50%_24%]',
    baseRotate: -6.5,
    enterX: '-10vw',
    enterY: '3vh',
    exitX: '15vw',
    exitY: '-4vh',
    exitRotate: -10
  },
  'patung.jpg': {
    label: 'Landmark Exploration',
    layer: 3,
    slotInLayer: 2,
    zIndex: 16,
    left: '56%',
    top: '70%',
    sizeClass: 'w-[108px] sm:w-[142px] lg:w-[164px] aspect-[9/15]',
    objectPosition: 'object-[50%_24%]',
    baseRotate: -4.5,
    enterX: '-2vw',
    enterY: '-6vh',
    exitX: '4vw',
    exitY: '13vh',
    exitRotate: -8
  }
}

const FALLBACK_GALLERY_SLOTS = [
  {
    layer: 3,
    slotInLayer: 2,
    zIndex: 18,
    left: '48%',
    top: '28%',
    sizeClass: 'w-[132px] sm:w-[180px] lg:w-[210px] aspect-[4/3]',
    objectPosition: 'object-center',
    baseRotate: 4,
    enterX: '0vw',
    enterY: '8vh',
    exitX: '0vw',
    exitY: '-14vh',
    exitRotate: 8
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
