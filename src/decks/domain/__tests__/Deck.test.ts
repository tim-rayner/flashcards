import { describe, it, expect } from 'vitest'
import { Deck } from '../Deck'
import { DeckId } from '../DeckId'

describe('Deck', () => {
  const deckId = new DeckId('deck-1')

  describe('addCard', () => {
    it('adds a card to the deck', () => {
      const deck = new Deck(deckId, 'TypeScript', [])
      const updated = deck.addCard('What is a type guard?', 'A runtime check that narrows a type')
      expect(updated.cards).toHaveLength(1)
      expect(updated.cards[0].question).toBe('What is a type guard?')
      expect(updated.cards[0].answer).toBe('A runtime check that narrows a type')
      expect(updated.cards[0].lastResult).toBeNull()
    })

    it('does not mutate the original deck', () => {
      const deck = new Deck(deckId, 'TypeScript', [])
      deck.addCard('Q', 'A')
      expect(deck.cards).toHaveLength(0)
    })

    it('assigns a unique id to each card', () => {
      const deck = new Deck(deckId, 'TypeScript', [])
      const d1 = deck.addCard('Q1', 'A1')
      const d2 = d1.addCard('Q2', 'A2')
      expect(d2.cards[0].id.value).not.toBe(d2.cards[1].id.value)
    })
  })

  describe('removeCard', () => {
    it('removes the card with the given id', () => {
      const deck = new Deck(deckId, 'TypeScript', [])
      const withCard = deck.addCard('Q', 'A')
      const cardId = withCard.cards[0].id
      const withoutCard = withCard.removeCard(cardId)
      expect(withoutCard.cards).toHaveLength(0)
    })
  })

  describe('updateCard', () => {
    it('updates question and answer of an existing card', () => {
      const deck = new Deck(deckId, 'TypeScript', [])
      const withCard = deck.addCard('Old Q', 'Old A')
      const cardId = withCard.cards[0].id
      const updated = withCard.updateCard(cardId, 'New Q', 'New A')
      expect(updated.cards[0].question).toBe('New Q')
      expect(updated.cards[0].answer).toBe('New A')
    })

    it('preserves lastResult when updating card content', () => {
      const deck = new Deck(deckId, 'TypeScript', [])
      const withCard = deck.addCard('Q', 'A')
      const cardId = withCard.cards[0].id
      const rated = withCard.rateCard(cardId, 'correct')
      const updated = rated.updateCard(cardId, 'New Q', 'New A')
      expect(updated.cards[0].lastResult).toBe('correct')
    })
  })

  describe('updateName', () => {
    it('returns a deck with the new name', () => {
      const deck = new Deck(deckId, 'TypeScript', [])
      const renamed = deck.updateName('Advanced TypeScript')
      expect(renamed.name).toBe('Advanced TypeScript')
      expect(deck.name).toBe('TypeScript')
    })
  })

  describe('rateCard', () => {
    it('updates the lastResult of the specified card', () => {
      const deck = new Deck(deckId, 'TypeScript', [])
      const withCard = deck.addCard('Q', 'A')
      const cardId = withCard.cards[0].id
      const rated = withCard.rateCard(cardId, 'incorrect')
      expect(rated.cards[0].lastResult).toBe('incorrect')
    })

    it('does not affect other cards', () => {
      const deck = new Deck(deckId, 'TypeScript', [])
      const d = deck.addCard('Q1', 'A1').addCard('Q2', 'A2')
      const cardId = d.cards[0].id
      const rated = d.rateCard(cardId, 'correct')
      expect(rated.cards[1].lastResult).toBeNull()
    })
  })
})
