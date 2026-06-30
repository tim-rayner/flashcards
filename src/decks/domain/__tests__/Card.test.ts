import { describe, it, expect } from 'vitest'
import { Card } from '../Card'
import { CardId } from '../CardId'

describe('Card', () => {
  const card = new Card(new CardId('1'), 'What is DDD?', 'Domain Driven Design', null)

  it('rate() returns a new card with updated lastResult', () => {
    const rated = card.rate('correct')
    expect(rated.lastResult).toBe('correct')
  })

  it('rate() does not mutate the original card', () => {
    card.rate('incorrect')
    expect(card.lastResult).toBeNull()
  })

  it('rate() preserves card identity and content', () => {
    const rated = card.rate('incorrect')
    expect(rated.id.value).toBe('1')
    expect(rated.question).toBe('What is DDD?')
    expect(rated.answer).toBe('Domain Driven Design')
  })
})
