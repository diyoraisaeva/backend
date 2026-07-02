import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'
import db from './db.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

// --- Load .env (kichik parser, qo'shimcha paketsiz) ---
const envPath = join(__dirname, '.env')
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach((line) => {
    if (line.trim().startsWith('#')) return
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
    if (m) process.env[m[1]] = (m[2] || '').trim()
  })
}

const PORT = process.env.PORT || 4000
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'himart2026'
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

const app = express()
app.use(cors({
  origin: (origin, cb) => {
    // Brauzersiz so'rovlar (Postman, server-server) yoki har qanday localhost portiga ruxsat
    if (!origin || /^http:\/\/localhost:\d+$/.test(origin) || origin === CLIENT_ORIGIN) {
      return cb(null, true)
    }
    cb(new Error('CORS ruxsat etilmagan: ' + origin))
  },
}))
app.use(express.json())

// --- Static: yuklangan rasmlar ---
const uploadsDir = join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
app.use('/uploads', express.static(uploadsDir))

// --- Multer (rasm yuklash) ---
const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const safe = file.originalname.toLowerCase().replace(/[^a-z0-9.]/g, '-')
    cb(null, `${Date.now()}-${safe}`)
  },
})
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, /image\/(jpe?g|png|webp|gif)/.test(file.mimetype)),
})

// --- Auth middleware ---
function auth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: "Token yo'q" })
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Token yaroqsiz' })
  }
}

// ============ AUTH ============
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {}
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' })
    return res.json({ token, username })
  }
  res.status(401).json({ error: "Login yoki parol noto'g'ri" })
})
app.get('/api/me', auth, (req, res) => res.json({ user: req.user }))

// ============ PRODUCTS ============
app.get('/api/products', (req, res) => res.json(db.listProducts()))
app.post('/api/products', auth, (req, res) => {
  const { cat, kr = '', name, label = '', desc = '', badge = '', tone = '', img = '', price = 0, spicy = 0, available = true, sort = 0 } = req.body || {}
  if (!cat || !name) return res.status(400).json({ error: 'cat va name majburiy' })
  res.json(db.addProduct({
    cat, kr, name, label, desc, badge, tone, img,
    price: Number(price) || 0, spicy: Number(spicy) || 0, available: available !== false, sort: Number(sort),
  }))
})
app.put('/api/products/:id', auth, (req, res) => {
  const patch = { ...req.body }
  if (patch.sort !== undefined) patch.sort = Number(patch.sort)
  if (patch.price !== undefined) patch.price = Number(patch.price) || 0
  if (patch.spicy !== undefined) patch.spicy = Number(patch.spicy) || 0
  if (patch.available !== undefined) patch.available = patch.available !== false
  const row = db.updateProduct(req.params.id, patch)
  if (!row) return res.status(404).json({ error: 'Topilmadi' })
  res.json(row)
})
app.delete('/api/products/:id', auth, (req, res) => {
  db.deleteProduct(req.params.id)
  res.json({ ok: true })
})

// ============ GALLERY ============
app.get('/api/gallery', (req, res) => res.json(db.listGallery()))
app.post('/api/gallery', auth, (req, res) => {
  const { img, caption = '', sort = 0 } = req.body || {}
  if (!img) return res.status(400).json({ error: 'img majburiy' })
  res.json(db.addGallery({ img, caption, sort: Number(sort) }))
})
app.delete('/api/gallery/:id', auth, (req, res) => {
  db.deleteGallery(req.params.id)
  res.json({ ok: true })
})

// ============ SETTINGS ============
app.get('/api/settings', (req, res) => res.json(db.getSettings()))
app.put('/api/settings', auth, (req, res) => res.json(db.setSettings(req.body || {})))

// ============ UPLOAD ============
app.post('/api/upload', auth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Rasm yuklanmadi' })
  res.json({ url: `/uploads/${req.file.filename}`, filename: req.file.filename })
})

app.get('/api/health', (req, res) => res.json({ ok: true, name: 'HiMart API' }))

app.listen(PORT, () => {
  console.log(`\n🍜 HiMart API → http://localhost:${PORT}`)
  console.log(`   Admin: ${ADMIN_USERNAME} / ${ADMIN_PASSWORD}\n`)
})
