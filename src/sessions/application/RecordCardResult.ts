import { StudySession } from '../domain/StudySession'
import { SessionId } from '../domain/SessionId'
import type { StudySessionRepository } from '../domain/StudySessionRepository'
import type { DeckRepository } from '../../decks/domain/DeckRepository'
import { CardId } from '../../decks/domain/CardId'
import type { ResultValue } from '../domain/CardResult'

export class RecordCardResult {
  private readonly sessionRepo: StudySessionRepository
  private readonly deckRepo: DeckRepository

  constructor(sessionRepo: StudySessionRepository, deckRepo: DeckRepository) {
    this.sessionRepo = sessionRepo
    this.deckRepo = deckRepo
  }

  async execute(sessionId: SessionId, cardId: CardId, result: ResultValue): Promise<StudySession> {
    const session = await this.sessionRepo.findById(sessionId)
    if (!session) throw new Error(`Session not found: ${sessionId.value}`)
    const updated = session.recordCardResult(cardId, result)
    await this.sessionRepo.save(updated)

    const deck = await this.deckRepo.findById(session.deckId)
    if (deck) {
      await this.deckRepo.save(deck.rateCard(cardId, result))
    }

    return updated
  }
}
