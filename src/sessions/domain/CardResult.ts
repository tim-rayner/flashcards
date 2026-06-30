import type { CardId } from '../../decks/domain/CardId'

export type ResultValue = 'correct' | 'incorrect'

export class CardResult {
  readonly cardId: CardId
  readonly result: ResultValue
  readonly answeredAt: Date

  constructor(cardId: CardId, result: ResultValue, answeredAt: Date) {
    this.cardId = cardId
    this.result = result
    this.answeredAt = answeredAt
  }

  equals(other: CardResult): boolean {
    return (
      this.cardId.value === other.cardId.value &&
      this.result === other.result &&
      this.answeredAt.getTime() === other.answeredAt.getTime()
    )
  }
}
