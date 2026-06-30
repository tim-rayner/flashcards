import { Deck } from '../domain/Deck'
import { DeckId } from '../domain/DeckId'
import type { DeckRepository } from '../domain/DeckRepository'

export class UpdateDeck {
  private readonly repo: DeckRepository
  constructor(repo: DeckRepository) {
    this.repo = repo
  }

  async execute(id: DeckId, name: string): Promise<Deck> {
    const deck = await this.repo.findById(id)
    if (!deck) throw new Error(`Deck not found: ${id.value}`)
    const updated = deck.updateName(name)
    await this.repo.save(updated)
    return updated
  }
}
