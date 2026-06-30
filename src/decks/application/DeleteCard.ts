import { Deck } from '../domain/Deck'
import { DeckId } from '../domain/DeckId'
import { CardId } from '../domain/CardId'
import type { DeckRepository } from '../domain/DeckRepository'

export class DeleteCard {
  private readonly repo: DeckRepository
  constructor(repo: DeckRepository) {
    this.repo = repo
  }

  async execute(deckId: DeckId, cardId: CardId): Promise<Deck> {
    const deck = await this.repo.findById(deckId)
    if (!deck) throw new Error(`Deck not found: ${deckId.value}`)
    const updated = deck.removeCard(cardId)
    await this.repo.save(updated)
    return updated
  }
}
