import { DeckId } from '../domain/DeckId'
import type { DeckRepository } from '../domain/DeckRepository'

export class DeleteDeck {
  private readonly repo: DeckRepository
  constructor(repo: DeckRepository) {
    this.repo = repo
  }

  async execute(id: DeckId): Promise<void> {
    await this.repo.delete(id)
  }
}
