// Oddiy, bog'liqliksiz JSON-fayl ombori (better-sqlite3 o'rniga — hech qanday
// kompilyatsiya talab qilmaydi, har qanday kompyuterda ishlaydi).
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, 'data')
const DB_FILE = join(DATA_DIR, 'himart.json')

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })

const DEFAULT = { products: [], gallery: [], settings: {}, _seq: { products: 0, gallery: 0 } }

function read() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'))
  } catch {
    return structuredClone(DEFAULT)
  }
}
function write(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
}
if (!fs.existsSync(DB_FILE)) write(structuredClone(DEFAULT))

function nextId(state, table) {
  state._seq[table] = (state._seq[table] || 0) + 1
  return state._seq[table]
}

export const db = {
  read,
  write,

  // ---- products ----
  listProducts() {
    return read().products.sort((a, b) => a.sort - b.sort || a.id - b.id)
  },
  addProduct(p) {
    const s = read()
    const row = { id: nextId(s, 'products'), created_at: new Date().toISOString(), ...p }
    s.products.push(row)
    write(s)
    return row
  },
  updateProduct(id, patch) {
    const s = read()
    const i = s.products.findIndex((p) => p.id === Number(id))
    if (i === -1) return null
    s.products[i] = { ...s.products[i], ...patch, id: s.products[i].id }
    write(s)
    return s.products[i]
  },
  deleteProduct(id) {
    const s = read()
    s.products = s.products.filter((p) => p.id !== Number(id))
    write(s)
  },

  // ---- gallery ----
  listGallery() {
    return read().gallery.sort((a, b) => a.sort - b.sort || a.id - b.id)
  },
  addGallery(g) {
    const s = read()
    const row = { id: nextId(s, 'gallery'), created_at: new Date().toISOString(), ...g }
    s.gallery.push(row)
    write(s)
    return row
  },
  deleteGallery(id) {
    const s = read()
    s.gallery = s.gallery.filter((g) => g.id !== Number(id))
    write(s)
  },

  // ---- settings ----
  getSettings() {
    return read().settings
  },
  setSettings(patch) {
    const s = read()
    s.settings = { ...s.settings, ...patch }
    write(s)
    return s.settings
  },

  // ---- seed ----
  reset(seed) {
    write({ ...structuredClone(DEFAULT), ...seed })
  },
}

export default db
