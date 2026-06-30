import { v4 as uuidv4 } from 'uuid'
import { Deck } from '../domain/Deck'
import { DeckId } from '../domain/DeckId'
import type { DeckRepository } from '../domain/DeckRepository'

export class CreateDeck {
  private readonly repo: DeckRepository
  constructor(repo: DeckRepository) {
    this.repo = repo
  }

  async execute(name: string): Promise<Deck> {
    const deck = new Deck(new DeckId(uuidv4()), name, [])
    await this.repo.save(deck)
    return deck
  }
}
