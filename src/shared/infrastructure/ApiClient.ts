const BASE_URL = 'http://localhost:3001'

export interface AppData {
  decks: DeckDto[]
  sessions: SessionDto[]
}

export interface DeckDto {
  id: string
  name: string
  cards: CardDto[]
}

export interface CardDto {
  id: string
  question: string
  answer: string
  lastResult: 'correct' | 'incorrect' | null
}

export interface CardResultDto {
  cardId: string
  result: 'correct' | 'incorrect'
  answeredAt: string
}

export interface SessionDto {
  id: string
  deckId: string
  cardResults: CardResultDto[]
  startedAt: string
  completedAt: string | null
}

export class ApiClient {
  async load(): Promise<AppData> {
    const res = await fetch(`${BASE_URL}/api/data`)
    if (!res.ok) throw new Error('Failed to load data')
    return res.json()
  }

  async save(data: AppData): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/data`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to save data')
  }
}
