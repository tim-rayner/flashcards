import express from 'express'
import cors from 'cors'
import { readFile, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_FILE = join(__dirname, '..', 'flashcards-data.json')
const EMPTY_DATA = { decks: [], sessions: [] }

const app = express()
app.use(cors())
app.use(express.json())

async function readData() {
  if (!existsSync(DATA_FILE)) return EMPTY_DATA
  const raw = await readFile(DATA_FILE, 'utf-8')
  return JSON.parse(raw)
}

async function writeData(data) {
  await writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

app.get('/api/data', async (_req, res) => {
  try {
    res.json(await readData())
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/data', async (req, res) => {
  try {
    await writeData(req.body)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

const PORT = 3001
app.listen(PORT, () => console.log(`Flashcards API running on http://localhost:${PORT}`))
