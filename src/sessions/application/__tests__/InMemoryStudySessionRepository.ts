import { StudySession } from '../../domain/StudySession'
import { SessionId } from '../../domain/SessionId'
import type { StudySessionRepository } from '../../domain/StudySessionRepository'
import { DeckId } from '@/decks/domain/DeckId'

export class InMemoryStudySessionRepository implements StudySessionRepository {
  private sessions: Map<string, StudySession> = new Map()

  async findByDeckId(deckId: DeckId): Promise<StudySession[]> {
    return Array.from(this.sessions.values()).filter(s => s.deckId.value === deckId.value)
  }

  async findById(id: SessionId): Promise<StudySession | null> {
    return this.sessions.get(id.value) ?? null
  }

  async save(session: StudySession): Promise<void> {
    this.sessions.set(session.id.value, session)
  }
}
