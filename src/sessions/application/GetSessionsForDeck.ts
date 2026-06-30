import { StudySession } from '../domain/StudySession'
import type { StudySessionRepository } from '../domain/StudySessionRepository'
import { DeckId } from '@/decks/domain/DeckId'

export class GetSessionsForDeck {
  private readonly repo: StudySessionRepository
  constructor(repo: StudySessionRepository) {
    this.repo = repo
  }

  async execute(deckId: DeckId): Promise<StudySession[]> {
    return this.repo.findByDeckId(deckId)
  }
}
