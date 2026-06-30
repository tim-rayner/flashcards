import { useCallback, useEffect, useMemo, useState } from 'react'
import { flashcardsApp } from '../application/FlashcardsApp'
import { Deck } from '../../decks/domain/Deck'
import { Card } from '../../decks/domain/Card'
import { CardId } from '../../decks/domain/CardId'
import { DeckId } from '../../decks/domain/DeckId'
import { SessionId } from '../../sessions/domain/SessionId'
import { StudySession } from '../../sessions/domain/StudySession'

export function useFlashcardsApp() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null)
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [studyCards, setStudyCards] = useState<Card[]>([])
  const [studyOpen, setStudyOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const selectedDeck = useMemo(
    () => decks.find(d => d.id.value === selectedDeckId) ?? null,
    [decks, selectedDeckId],
  )

  const refreshDecks = useCallback(async () => {
    const all = await flashcardsApp.loadDecks()
    setDecks(all)
    return all
  }, [])

  useEffect(() => {
    flashcardsApp.loadDecks()
      .then(setDecks)
      .catch(() => setError('Cannot connect to local server. Run `npm run server` first.'))
      .finally(() => setLoading(false))
  }, [])

  const handleCreateDeck = useCallback(async (name: string) => {
    await flashcardsApp.createDeck(name)
    const all = await refreshDecks()
    setSelectedDeckId(all[all.length - 1].id.value)
  }, [refreshDecks])

  const handleDeleteDeck = useCallback(async (id: string) => {
    await flashcardsApp.deleteDeck(new DeckId(id))
    setSelectedDeckId(current => (current === id ? null : current))
    await refreshDecks()
  }, [refreshDecks])

  const handleRenameDeck = useCallback(async (id: string, name: string) => {
    await flashcardsApp.renameDeck(new DeckId(id), name)
    await refreshDecks()
  }, [refreshDecks])

  const handleAddCard = useCallback(async (question: string, answer: string) => {
    if (!selectedDeckId) return
    await flashcardsApp.addCard(new DeckId(selectedDeckId), question, answer)
    await refreshDecks()
  }, [selectedDeckId, refreshDecks])

  const handleUpdateCard = useCallback(async (cardId: CardId, question: string, answer: string) => {
    if (!selectedDeckId) return
    await flashcardsApp.updateCard(new DeckId(selectedDeckId), cardId, question, answer)
    await refreshDecks()
  }, [selectedDeckId, refreshDecks])

  const handleDeleteCard = useCallback(async (cardId: CardId) => {
    if (!selectedDeckId) return
    await flashcardsApp.deleteCard(new DeckId(selectedDeckId), cardId)
    await refreshDecks()
  }, [selectedDeckId, refreshDecks])

  const handleStartStudy = useCallback(async (cards: Card[]) => {
    if (!selectedDeckId) return
    const session = await flashcardsApp.startSession(new DeckId(selectedDeckId))
    setActiveSessionId(session.id.value)
    setStudyCards(cards)
    setStudyOpen(true)
  }, [selectedDeckId])

  const handleRecordResult = useCallback(async (cardId: string, result: 'correct' | 'incorrect') => {
    if (!activeSessionId || !selectedDeckId) return
    await flashcardsApp.recordCardResult(new SessionId(activeSessionId), new CardId(cardId), result)
    setDecks(await flashcardsApp.loadDecks())
  }, [activeSessionId, selectedDeckId])

  const handleCompleteSession = useCallback(async () => {
    if (!activeSessionId) return
    await flashcardsApp.completeSession(new SessionId(activeSessionId))
    setStudyOpen(false)
    setActiveSessionId(null)
    if (selectedDeckId) {
      const updated = await flashcardsApp.getSessionsForDeck(new DeckId(selectedDeckId))
      setSessions(updated)
    }
    await refreshDecks()
  }, [activeSessionId, selectedDeckId, refreshDecks])

  const handleViewHistory = useCallback(async () => {
    if (!selectedDeckId) return
    const deckSessions = await flashcardsApp.getSessionsForDeck(new DeckId(selectedDeckId))
    setSessions(deckSessions)
    setHistoryOpen(true)
  }, [selectedDeckId])

  const handleCloseStudy = useCallback(() => {
    setStudyOpen(false)
    setActiveSessionId(null)
  }, [])

  const handleCloseHistory = useCallback(() => {
    setHistoryOpen(false)
  }, [])

  const deckListProps = useMemo(() => ({
    decks,
    selectedDeckId,
    onSelect: setSelectedDeckId,
    onCreate: handleCreateDeck,
    onDelete: handleDeleteDeck,
    onRename: handleRenameDeck,
  }), [decks, selectedDeckId, handleCreateDeck, handleDeleteDeck, handleRenameDeck])

  const deckDetailProps = useMemo(() => {
    if (!selectedDeck) return null
    return {
      deck: selectedDeck,
      onAddCard: handleAddCard,
      onUpdateCard: handleUpdateCard,
      onDeleteCard: handleDeleteCard,
      onStartStudy: handleStartStudy,
      onViewHistory: handleViewHistory,
    }
  }, [selectedDeck, handleAddCard, handleUpdateCard, handleDeleteCard, handleStartStudy, handleViewHistory])

  return {
    loading,
    error,
    selectedDeck,
    selectedDeckId,
    sessions,
    studyOpen,
    historyOpen,
    studyCards,
    deckListProps,
    deckDetailProps,
    handleRecordResult,
    handleCompleteSession,
    handleCloseStudy,
    handleCloseHistory,
    selectDeck: setSelectedDeckId,
  }
}
