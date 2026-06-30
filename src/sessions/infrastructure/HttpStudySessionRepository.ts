import { StudySession } from '../domain/StudySession'
import { SessionId } from '../domain/SessionId'
import type { StudySessionRepository } from '../domain/StudySessionRepository'
import { CardResult } from '../domain/CardResult'
import { DeckId } from '../../decks/domain/DeckId'
import { CardId } from '../../decks/domain/CardId'
import { ApiClient, type AppData } from '../../shared/infrastructure/ApiClient'

export class HttpStudySessionRepository implements StudySessionRepository {
  private readonly api: ApiClient
  constructor(api: ApiClient) {
    this.api = api
  }

  private toDomain(data: AppData): StudySession[] {
    return data.sessions.map(s =>
      new StudySession(
        new SessionId(s.id),
        new DeckId(s.deckId),
        s.cardResults.map(r => new CardResult(new CardId(r.cardId), r.result, new Date(r.answeredAt))),
        new Date(s.startedAt),
        s.completedAt ? new Date(s.completedAt) : null,
      ),
    )
  }

  private async loadAndSave(transform: (sessions: StudySession[]) => StudySession[]): Promise<void> {
    const data = await this.api.load()
    const sessions = this.toDomain(data)
    const updated = transform(sessions)
    await this.api.save({
      ...data,
      sessions: updated.map(s => ({
        id: s.id.value,
        deckId: s.deckId.value,
        cardResults: s.cardResults.map(r => ({
          cardId: r.cardId.value,
          result: r.result,
          answeredAt: r.answeredAt.toISOString(),
        })),
        startedAt: s.startedAt.toISOString(),
        completedAt: s.completedAt?.toISOString() ?? null,
      })),
    })
  }

  async findByDeckId(deckId: DeckId): Promise<StudySession[]> {
    const data = await this.api.load()
    return this.toDomain(data).filter(s => s.deckId.value === deckId.value)
  }

  async findById(id: SessionId): Promise<StudySession | null> {
    const data = await this.api.load()
    return this.toDomain(data).find(s => s.id.value === id.value) ?? null
  }

  async save(session: StudySession): Promise<void> {
    await this.loadAndSave(sessions => {
      const idx = sessions.findIndex(s => s.id.value === session.id.value)
      if (idx === -1) return [...sessions, session]
      return sessions.map(s => (s.id.value === session.id.value ? session : s))
    })
  }
}
