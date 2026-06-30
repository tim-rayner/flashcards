import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryStudySessionRepository } from './InMemoryStudySessionRepository'
import { InMemoryDeckRepository } from '@/decks/application/__tests__/InMemoryDeckRepository'
import { StartSession } from '../StartSession'
import { RecordCardResult } from '../RecordCardResult'
import { CompleteSession } from '../CompleteSession'
import { GetSessionsForDeck } from '../GetSessionsForDeck'
import { Deck } from '@/decks/domain/Deck'
import { DeckId } from '@/decks/domain/DeckId'
import { Card } from '@/decks/domain/Card'
import { CardId } from '@/decks/domain/CardId'
import { SessionId } from '../../domain/SessionId'
import { StudySession } from '../../domain/StudySession'

describe('Session use cases', () => {
  let repo: InMemoryStudySessionRepository
  let deckRepo: InMemoryDeckRepository
  const deckId = new DeckId('deck-1')
  const cardId = new CardId('card-1')

  beforeEach(async () => {
    repo = new InMemoryStudySessionRepository()
    deckRepo = new InMemoryDeckRepository()
    await deckRepo.save(new Deck(deckId, 'Test Deck', [
      new Card(cardId, 'Q', 'A', null),
    ]))
  })

  describe('StartSession', () => {
    it('creates and saves a new session for the given deck', async () => {
      const useCase = new StartSession(repo)
      const session = await useCase.execute(deckId)
      expect(session.deckId.value).toBe('deck-1')
      expect(session.cardResults).toHaveLength(0)
      expect(session.completedAt).toBeNull()
      const saved = await repo.findByDeckId(deckId)
      expect(saved).toHaveLength(1)
    })
  })

  describe('RecordCardResult', () => {
    it('appends a card result to the session', async () => {
      const session = new StudySession(new SessionId('s-1'), deckId, [], new Date(), null)
      await repo.save(session)
      const useCase = new RecordCardResult(repo, deckRepo)
      const updated = await useCase.execute(new SessionId('s-1'), cardId, 'correct')
      expect(updated.cardResults).toHaveLength(1)
      expect(updated.cardResults[0].result).toBe('correct')
    })

    it('updates the deck card lastResult', async () => {
      const session = new StudySession(new SessionId('s-1'), deckId, [], new Date(), null)
      await repo.save(session)
      const useCase = new RecordCardResult(repo, deckRepo)
      await useCase.execute(new SessionId('s-1'), cardId, 'incorrect')
      const deck = await deckRepo.findById(deckId)
      expect(deck!.cards[0].lastResult).toBe('incorrect')
    })

    it('throws if session not found', async () => {
      const useCase = new RecordCardResult(repo, deckRepo)
      await expect(useCase.execute(new SessionId('missing'), new CardId('c'), 'correct')).rejects.toThrow()
    })
  })

  describe('CompleteSession', () => {
    it('marks the session as completed', async () => {
      const session = new StudySession(new SessionId('s-1'), deckId, [], new Date(), null)
      await repo.save(session)
      const useCase = new CompleteSession(repo)
      const completed = await useCase.execute(new SessionId('s-1'))
      expect(completed.completedAt).not.toBeNull()
    })
  })

  describe('GetSessionsForDeck', () => {
    it('returns all sessions for the given deck', async () => {
      const s1 = new StudySession(new SessionId('s-1'), deckId, [], new Date(), null)
      const s2 = new StudySession(new SessionId('s-2'), deckId, [], new Date(), null)
      const s3 = new StudySession(new SessionId('s-3'), new DeckId('other'), [], new Date(), null)
      await repo.save(s1)
      await repo.save(s2)
      await repo.save(s3)
      const useCase = new GetSessionsForDeck(repo)
      const sessions = await useCase.execute(deckId)
      expect(sessions).toHaveLength(2)
    })
  })
})
