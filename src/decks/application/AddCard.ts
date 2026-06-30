import { Deck } from '../domain/Deck'
import { DeckId } from '../domain/DeckId'
import type { DeckRepository } from '../domain/DeckRepository'

export class AddCard {
  private readonly repo: DeckRepository
  constructor(repo: DeckRepository) {
    this.repo = repo
  }

  async execute(deckId: DeckId, question: string, answer: string): Promise<Deck> {
    const deck = await this.repo.findById(deckId)
    if (!deck) throw new Error(`Deck not found: ${deckId.value}`)
    const updated = deck.addCard(question, answer)
    await this.repo.save(updated)
    return updated
  }
}
