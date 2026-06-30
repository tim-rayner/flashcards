import { v4 as uuidv4 } from 'uuid'
import { StudySession } from '../domain/StudySession'
import { SessionId } from '../domain/SessionId'
import type { StudySessionRepository } from '../domain/StudySessionRepository'
import { DeckId } from '../../decks/domain/DeckId'

export class StartSession {
  private readonly repo: StudySessionRepository
  constructor(repo: StudySessionRepository) {
    this.repo = repo
  }

  async execute(deckId: DeckId): Promise<StudySession> {
    const session = new StudySession(new SessionId(uuidv4()), deckId, [], new Date(), null)
    await this.repo.save(session)
    return session
  }
}
