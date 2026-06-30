import { Deck } from '../../domain/Deck'
import { DeckId } from '../../domain/DeckId'
import type { DeckRepository } from '../../domain/DeckRepository'

export class InMemoryDeckRepository implements DeckRepository {
  private decks: Map<string, Deck> = new Map()

  async findAll(): Promise<Deck[]> {
    return Array.from(this.decks.values())
  }

  async findById(id: DeckId): Promise<Deck | null> {
    return this.decks.get(id.value) ?? null
  }

  async save(deck: Deck): Promise<void> {
    this.decks.set(deck.id.value, deck)
  }

  async delete(id: DeckId): Promise<void> {
    this.decks.delete(id.value)
  }
}
