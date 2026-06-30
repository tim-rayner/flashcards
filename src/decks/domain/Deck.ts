import { v4 as uuidv4 } from 'uuid'
import { Card, type CardResult } from './Card'
import { CardId } from './CardId'
import type { DeckId } from './DeckId'

export class Deck {
  readonly id: DeckId
  readonly name: string
  readonly cards: readonly Card[]

  constructor(id: DeckId, name: string, cards: readonly Card[]) {
    this.id = id
    this.name = name
    this.cards = cards
  }

  addCard(question: string, answer: string): Deck {
    const card = new Card(new CardId(uuidv4()), question, answer, null)
    return new Deck(this.id, this.name, [...this.cards, card])
  }

  removeCard(cardId: CardId): Deck {
    return new Deck(this.id, this.name, this.cards.filter(c => c.id.value !== cardId.value))
  }

  updateCard(cardId: CardId, question: string, answer: string): Deck {
    const cards = this.cards.map(c =>
      c.id.value === cardId.value ? new Card(c.id, question, answer, c.lastResult) : c,
    )
    return new Deck(this.id, this.name, cards)
  }

  updateName(name: string): Deck {
    return new Deck(this.id, name, this.cards)
  }

  rateCard(cardId: CardId, result: CardResult): Deck {
    const cards = this.cards.map(c => (c.id.value === cardId.value ? c.rate(result) : c))
    return new Deck(this.id, this.name, cards)
  }
}
