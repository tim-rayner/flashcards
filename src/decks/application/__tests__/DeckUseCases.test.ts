import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryDeckRepository } from './InMemoryDeckRepository'
import { CreateDeck } from '../CreateDeck'
import { GetDecks } from '../GetDecks'
import { DeleteDeck } from '../DeleteDeck'
import { UpdateDeck } from '../UpdateDeck'
import { AddCard } from '../AddCard'
import { UpdateCard } from '../UpdateCard'
import { DeleteCard } from '../DeleteCard'
import { Deck } from '../../domain/Deck'
import { DeckId } from '../../domain/DeckId'

describe('Deck use cases', () => {
  let repo: InMemoryDeckRepository

  beforeEach(() => {
    repo = new InMemoryDeckRepository()
  })

  describe('CreateDeck', () => {
    it('saves a new deck and returns it', async () => {
      const useCase = new CreateDeck(repo)
      const deck = await useCase.execute('TypeScript')
      expect(deck.name).toBe('TypeScript')
      expect(deck.cards).toHaveLength(0)
      const saved = await repo.findAll()
      expect(saved).toHaveLength(1)
    })
  })

  describe('GetDecks', () => {
    it('returns all decks', async () => {
      await repo.save(new Deck(new DeckId('1'), 'TypeScript', []))
      await repo.save(new Deck(new DeckId('2'), 'React', []))
      const useCase = new GetDecks(repo)
      const decks = await useCase.execute()
      expect(decks).toHaveLength(2)
    })

    it('returns empty array when no decks exist', async () => {
      const useCase = new GetDecks(repo)
      expect(await useCase.execute()).toEqual([])
    })
  })

  describe('DeleteDeck', () => {
    it('removes the deck from the repository', async () => {
      const deckId = new DeckId('1')
      await repo.save(new Deck(deckId, 'TypeScript', []))
      const useCase = new DeleteDeck(repo)
      await useCase.execute(deckId)
      expect(await repo.findAll()).toHaveLength(0)
    })
  })

  describe('UpdateDeck', () => {
    it('renames the deck', async () => {
      const deckId = new DeckId('1')
      await repo.save(new Deck(deckId, 'Old Name', []))
      const useCase = new UpdateDeck(repo)
      const updated = await useCase.execute(deckId, 'New Name')
      expect(updated.name).toBe('New Name')
      const saved = await repo.findById(deckId)
      expect(saved?.name).toBe('New Name')
    })

    it('throws if deck not found', async () => {
      const useCase = new UpdateDeck(repo)
      await expect(useCase.execute(new DeckId('missing'), 'X')).rejects.toThrow()
    })
  })

  describe('AddCard', () => {
    it('adds a card to the deck', async () => {
      const deckId = new DeckId('1')
      await repo.save(new Deck(deckId, 'TypeScript', []))
      const useCase = new AddCard(repo)
      const updated = await useCase.execute(deckId, 'What is a union type?', 'A | B')
      expect(updated.cards).toHaveLength(1)
      expect(updated.cards[0].question).toBe('What is a union type?')
    })
  })

  describe('UpdateCard', () => {
    it('updates the card content', async () => {
      const deckId = new DeckId('1')
      const deck = new Deck(deckId, 'TypeScript', [])
      const withCard = deck.addCard('Old Q', 'Old A')
      await repo.save(withCard)
      const cardId = withCard.cards[0].id
      const useCase = new UpdateCard(repo)
      const updated = await useCase.execute(deckId, cardId, 'New Q', 'New A')
      expect(updated.cards[0].question).toBe('New Q')
      expect(updated.cards[0].answer).toBe('New A')
    })
  })

  describe('DeleteCard', () => {
    it('removes the card from the deck', async () => {
      const deckId = new DeckId('1')
      const deck = new Deck(deckId, 'TypeScript', [])
      const withCard = deck.addCard('Q', 'A')
      await repo.save(withCard)
      const cardId = withCard.cards[0].id
      const useCase = new DeleteCard(repo)
      const updated = await useCase.execute(deckId, cardId)
      expect(updated.cards).toHaveLength(0)
    })
  })
})
