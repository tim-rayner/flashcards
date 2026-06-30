import type { DeckId } from '@/decks/domain/DeckId'
import type { CardId } from '@/decks/domain/CardId'
import { CardResult, type ResultValue } from './CardResult'
import type { SessionId } from './SessionId'

export class StudySession {
  readonly id: SessionId
  readonly deckId: DeckId
  readonly cardResults: readonly CardResult[]
  readonly startedAt: Date
  readonly completedAt: Date | null

  constructor(
    id: SessionId,
    deckId: DeckId,
    cardResults: readonly CardResult[],
    startedAt: Date,
    completedAt: Date | null,
  ) {
    this.id = id
    this.deckId = deckId
    this.cardResults = cardResults
    this.startedAt = startedAt
    this.completedAt = completedAt
  }

  recordCardResult(cardId: CardId, result: ResultValue): StudySession {
    const cardResult = new CardResult(cardId, result, new Date())
    return new StudySession(this.id, this.deckId, [...this.cardResults, cardResult], this.startedAt, this.completedAt)
  }

  complete(): StudySession {
    return new StudySession(this.id, this.deckId, this.cardResults, this.startedAt, new Date())
  }

  get score(): { correct: number; incorrect: number; total: number } {
    const correct = this.cardResults.filter(r => r.result === 'correct').length
    const incorrect = this.cardResults.filter(r => r.result === 'incorrect').length
    return { correct, incorrect, total: this.cardResults.length }
  }
}
