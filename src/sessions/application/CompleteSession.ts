import { StudySession } from '../domain/StudySession'
import { SessionId } from '../domain/SessionId'
import type { StudySessionRepository } from '../domain/StudySessionRepository'

export class CompleteSession {
  private readonly repo: StudySessionRepository
  constructor(repo: StudySessionRepository) {
    this.repo = repo
  }

  async execute(sessionId: SessionId): Promise<StudySession> {
    const session = await this.repo.findById(sessionId)
    if (!session) throw new Error(`Session not found: ${sessionId.value}`)
    const completed = session.complete()
    await this.repo.save(completed)
    return completed
  }
}
