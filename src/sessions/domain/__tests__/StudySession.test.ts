import { describe, it, expect } from 'vitest'
import { StudySession } from '../StudySession'
import { SessionId } from '../SessionId'
import { CardResult } from '../CardResult'
import { DeckId } from '../../../decks/domain/DeckId'
import { CardId } from '../../../decks/domain/CardId'

describe('StudySession', () => {
  const sessionId = new SessionId('session-1')
  const deckId = new DeckId('deck-1')
  const cardId1 = new CardId('card-1')
  const cardId2 = new CardId('card-2')
  const startedAt = new Date('2024-01-01T10:00:00Z')

  const emptySession = new StudySession(sessionId, deckId, [], startedAt, null)

  describe('recordCardResult', () => {
    it('appends a CardResult to the session', () => {
      const updated = emptySession.recordCardResult(cardId1, 'correct')
      expect(updated.cardResults).toHaveLength(1)
      expect(updated.cardResults[0].cardId.value).toBe('card-1')
      expect(updated.cardResults[0].result).toBe('correct')
    })

    it('does not mutate the original session', () => {
      emptySession.recordCardResult(cardId1, 'correct')
      expect(emptySession.cardResults).toHaveLength(0)
    })

    it('records multiple card results', () => {
      const s1 = emptySession.recordCardResult(cardId1, 'correct')
      const s2 = s1.recordCardResult(cardId2, 'incorrect')
      expect(s2.cardResults).toHaveLength(2)
    })

    it('sets answeredAt on the CardResult', () => {
      const before = new Date()
      const updated = emptySession.recordCardResult(cardId1, 'correct')
      const after = new Date()
      const answeredAt = updated.cardResults[0].answeredAt
      expect(answeredAt.getTime()).toBeGreaterThanOrEqual(before.getTime())
      expect(answeredAt.getTime()).toBeLessThanOrEqual(after.getTime())
    })
  })

  describe('complete', () => {
    it('sets completedAt', () => {
      const before = new Date()
      const completed = emptySession.complete()
      const after = new Date()
      expect(completed.completedAt).not.toBeNull()
      expect(completed.completedAt!.getTime()).toBeGreaterThanOrEqual(before.getTime())
      expect(completed.completedAt!.getTime()).toBeLessThanOrEqual(after.getTime())
    })

    it('does not mutate the original session', () => {
      emptySession.complete()
      expect(emptySession.completedAt).toBeNull()
    })
  })

  describe('score', () => {
    it('returns zero counts for an empty session', () => {
      expect(emptySession.score).toEqual({ correct: 0, incorrect: 0, total: 0 })
    })

    it('counts correct and incorrect results', () => {
      const session = emptySession
        .recordCardResult(cardId1, 'correct')
        .recordCardResult(cardId2, 'incorrect')
        .recordCardResult(new CardId('card-3'), 'correct')
      expect(session.score).toEqual({ correct: 2, incorrect: 1, total: 3 })
    })
  })

  describe('CardResult equality', () => {
    it('two CardResults with same data are equal', () => {
      const date = new Date('2024-01-01T10:00:00Z')
      const r1 = new CardResult(cardId1, 'correct', date)
      const r2 = new CardResult(cardId1, 'correct', date)
      expect(r1.equals(r2)).toBe(true)
    })

    it('CardResults with different result are not equal', () => {
      const date = new Date('2024-01-01T10:00:00Z')
      const r1 = new CardResult(cardId1, 'correct', date)
      const r2 = new CardResult(cardId1, 'incorrect', date)
      expect(r1.equals(r2)).toBe(false)
    })
  })
})
