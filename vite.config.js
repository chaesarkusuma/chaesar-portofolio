import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const VIRTUAL_MODULE_ID = 'virtual:portfolio-public-assets'
const RESOLVED_VIRTUAL_ID = `\0${VIRTUAL_MODULE_ID}`
const SUPPORTED_EXT_RE = /\.(png|jpe?g|webp|pdf)$/i

const ROOT_DIR = path.dirname(fileURLToPath(import.meta.url))
const PUBLIC_DIR = path.resolve(ROOT_DIR, 'public')

function scanPublicSubfolder(folderName) {
  const dirPath = path.join(PUBLIC_DIR, folderName)
  if (!fs.existsSync(dirPath)) return []

  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && !entry.name.startsWith('.') && SUPPORTED_EXT_RE.test(entry.name))
    .map((entry) => {
      const ext = path.extname(entry.name).toLowerCase()
      return {
        fileName: entry.name,
        url: `/${folderName}/${encodeURIComponent(entry.name)}`,
        ext,
        mediaType: ext === '.pdf' ? 'pdf' : 'image'
      }
    })
    .sort((a, b) => a.fileName.localeCompare(b.fileName, undefined, { numeric: true }))
}

/**
 * Vite plugin exposing all image & PDF files inside `public/certificates`,
 * `public/project`, and `public/gallery` via `virtual:portfolio-public-assets`
 * with live dev reload.
 */
function portfolioPublicAssetsPlugin() {
  const trackedFolders = ['certificates', 'project', 'gallery']

  return {
    name: 'portfolio-public-assets',
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) return RESOLVED_VIRTUAL_ID
      return null
    },
    load(id) {
      if (id !== RESOLVED_VIRTUAL_ID) return null
      const certificateFiles = scanPublicSubfolder('certificates')
      const projectFiles = scanPublicSubfolder('project')
      const galleryFiles = scanPublicSubfolder('gallery')
      return [
        `export const certificateFiles = ${JSON.stringify(certificateFiles)};`,
        `export const projectFiles = ${JSON.stringify(projectFiles)};`,
        `export const galleryFiles = ${JSON.stringify(galleryFiles)};`
      ].join('\n')
    },
    configureServer(server) {
      for (const folder of trackedFolders) {
        server.watcher.add(path.join(PUBLIC_DIR, folder))
      }

      const handleAssetChange = (filePath) => {
        const normalized = filePath.replace(/\\/g, '/')
        const isTracked = trackedFolders.some((f) => normalized.includes(`/public/${f}/`))
        if (!isTracked) return

        const mod = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_ID)
        if (mod) {
          server.moduleGraph.invalidateModule(mod)
        }
        server.ws.send({ type: 'full-reload' })
      }

      server.watcher.on('add', handleAssetChange)
      server.watcher.on('unlink', handleAssetChange)
    }
  }
}

export default defineConfig({
  plugins: [react(), portfolioPublicAssetsPlugin()],
  server: {
    port: 5173
  }
})
