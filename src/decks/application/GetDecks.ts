import { Deck } from '../domain/Deck'
import type { DeckRepository } from '../domain/DeckRepository'

export class GetDecks {
  private readonly repo: DeckRepository
  constructor(repo: DeckRepository) {
    this.repo = repo
  }

  async execute(): Promise<Deck[]> {
    return this.repo.findAll()
  }
}
