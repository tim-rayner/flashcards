import { StudySession } from './StudySession'
import { SessionId } from './SessionId'
import { DeckId } from '../../decks/domain/DeckId'

export interface StudySessionRepository {
  findByDeckId(deckId: DeckId): Promise<StudySession[]>
  findById(id: SessionId): Promise<StudySession | null>
  save(session: StudySession): Promise<void>
}
