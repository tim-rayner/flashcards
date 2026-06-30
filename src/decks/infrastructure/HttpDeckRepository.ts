import { Deck } from '../domain/Deck'
import { DeckId } from '../domain/DeckId'
import { Card } from '../domain/Card'
import { CardId } from '../domain/CardId'
import type { DeckRepository } from '../domain/DeckRepository'
import { ApiClient, type AppData } from '../../shared/infrastructure/ApiClient'

export class HttpDeckRepository implements DeckRepository {
  private readonly api: ApiClient
  constructor(api: ApiClient) {
    this.api = api
  }

  private toDomain(data: AppData): Deck[] {
    return data.decks.map(d =>
      new Deck(
        new DeckId(d.id),
        d.name,
        d.cards.map(c => new Card(new CardId(c.id), c.question, c.answer, c.lastResult)),
      ),
    )
  }

  private async loadAndSave(transform: (decks: Deck[]) => Deck[]): Promise<Deck[]> {
    const data = await this.api.load()
    const decks = this.toDomain(data)
    const updated = transform(decks)
    await this.api.save({
      ...data,
      decks: updated.map(d => ({
        id: d.id.value,
        name: d.name,
        cards: d.cards.map(c => ({
          id: c.id.value,
          question: c.question,
          answer: c.answer,
          lastResult: c.lastResult,
        })),
      })),
    })
    return updated
  }

  async findAll(): Promise<Deck[]> {
    const data = await this.api.load()
    return this.toDomain(data)
  }

  async findById(id: DeckId): Promise<Deck | null> {
    const decks = await this.findAll()
    return decks.find(d => d.id.value === id.value) ?? null
  }

  async save(deck: Deck): Promise<void> {
    await this.loadAndSave(decks => {
      const idx = decks.findIndex(d => d.id.value === deck.id.value)
      if (idx === -1) return [...decks, deck]
      return decks.map(d => (d.id.value === deck.id.value ? deck : d))
    })
  }

  async delete(id: DeckId): Promise<void> {
    await this.loadAndSave(decks => decks.filter(d => d.id.value !== id.value))
  }
}
