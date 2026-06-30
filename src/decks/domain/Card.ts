import type { CardId } from './CardId'

export type CardResult = 'correct' | 'incorrect'

export class Card {
  readonly id: CardId
  readonly question: string
  readonly answer: string
  readonly lastResult: CardResult | null

  constructor(id: CardId, question: string, answer: string, lastResult: CardResult | null) {
    this.id = id
    this.question = question
    this.answer = answer
    this.lastResult = lastResult
  }

  rate(result: CardResult): Card {
    return new Card(this.id, this.question, this.answer, result)
  }
}
