import { ApiClient } from '@/shared/infrastructure/ApiClient'
import { HttpDeckRepository } from '@/decks/infrastructure/HttpDeckRepository'
import { HttpStudySessionRepository } from '@/sessions/infrastructure/HttpStudySessionRepository'
import { CreateDeck } from '@/decks/application/CreateDeck'
import { GetDecks } from '@/decks/application/GetDecks'
import { DeleteDeck } from '@/decks/application/DeleteDeck'
import { UpdateDeck } from '@/decks/application/UpdateDeck'
import { AddCard } from '@/decks/application/AddCard'
import { UpdateCard } from '@/decks/application/UpdateCard'
import { DeleteCard } from '@/decks/application/DeleteCard'
import { StartSession } from '@/sessions/application/StartSession'
import { RecordCardResult } from '@/sessions/application/RecordCardResult'
import { CompleteSession } from '@/sessions/application/CompleteSession'
import { GetSessionsForDeck } from '@/sessions/application/GetSessionsForDeck'
import { Deck } from '@/decks/domain/Deck'
import { CardId } from '@/decks/domain/CardId'
import { DeckId } from '@/decks/domain/DeckId'
import { SessionId } from '@/sessions/domain/SessionId'
import { StudySession } from '@/sessions/domain/StudySession'
import type { DeckRepository } from '@/decks/domain/DeckRepository'
import type { StudySessionRepository } from '@/sessions/domain/StudySessionRepository'
import type { ResultValue } from '@/sessions/domain/CardResult'

export class FlashcardsApp {
  private readonly createDeckUseCase: CreateDeck
  private readonly getDecksUseCase: GetDecks
  private readonly deleteDeckUseCase: DeleteDeck
  private readonly updateDeckUseCase: UpdateDeck
  private readonly addCardUseCase: AddCard
  private readonly updateCardUseCase: UpdateCard
  private readonly deleteCardUseCase: DeleteCard
  private readonly startSessionUseCase: StartSession
  private readonly recordCardResultUseCase: RecordCardResult
  private readonly completeSessionUseCase: CompleteSession
  private readonly getSessionsForDeckUseCase: GetSessionsForDeck

  constructor(
    deckRepo: DeckRepository = new HttpDeckRepository(new ApiClient()),
    sessionRepo: StudySessionRepository = new HttpStudySessionRepository(new ApiClient()),
  ) {
    this.createDeckUseCase = new CreateDeck(deckRepo)
    this.getDecksUseCase = new GetDecks(deckRepo)
    this.deleteDeckUseCase = new DeleteDeck(deckRepo)
    this.updateDeckUseCase = new UpdateDeck(deckRepo)
    this.addCardUseCase = new AddCard(deckRepo)
    this.updateCardUseCase = new UpdateCard(deckRepo)
    this.deleteCardUseCase = new DeleteCard(deckRepo)
    this.startSessionUseCase = new StartSession(sessionRepo)
    this.recordCardResultUseCase = new RecordCardResult(sessionRepo, deckRepo)
    this.completeSessionUseCase = new CompleteSession(sessionRepo)
    this.getSessionsForDeckUseCase = new GetSessionsForDeck(sessionRepo)
  }

  loadDecks(): Promise<Deck[]> {
    return this.getDecksUseCase.execute()
  }

  createDeck(name: string): Promise<Deck> {
    return this.createDeckUseCase.execute(name)
  }

  deleteDeck(id: DeckId): Promise<void> {
    return this.deleteDeckUseCase.execute(id)
  }

  renameDeck(id: DeckId, name: string): Promise<Deck> {
    return this.updateDeckUseCase.execute(id, name)
  }

  addCard(deckId: DeckId, question: string, answer: string): Promise<Deck> {
    return this.addCardUseCase.execute(deckId, question, answer)
  }

  updateCard(deckId: DeckId, cardId: CardId, question: string, answer: string): Promise<Deck> {
    return this.updateCardUseCase.execute(deckId, cardId, question, answer)
  }

  deleteCard(deckId: DeckId, cardId: CardId): Promise<Deck> {
    return this.deleteCardUseCase.execute(deckId, cardId)
  }

  startSession(deckId: DeckId): Promise<StudySession> {
    return this.startSessionUseCase.execute(deckId)
  }

  recordCardResult(sessionId: SessionId, cardId: CardId, result: ResultValue): Promise<StudySession> {
    return this.recordCardResultUseCase.execute(sessionId, cardId, result)
  }

  completeSession(sessionId: SessionId): Promise<StudySession> {
    return this.completeSessionUseCase.execute(sessionId)
  }

  getSessionsForDeck(deckId: DeckId): Promise<StudySession[]> {
    return this.getSessionsForDeckUseCase.execute(deckId)
  }
}

export const flashcardsApp = new FlashcardsApp()
