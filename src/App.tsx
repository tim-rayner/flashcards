import { useEffect, useState, useCallback } from 'react'
import { Box, CssBaseline, ThemeProvider, CircularProgress, Typography, useMediaQuery } from '@mui/material'
import SchoolIcon from '@mui/icons-material/School'
import { theme } from './theme'
import { Deck } from './decks/domain/Deck'
import { Card } from './decks/domain/Card'
import { StudySession } from './sessions/domain/StudySession'
import { CardId } from './decks/domain/CardId'
import { DeckId } from './decks/domain/DeckId'
import { SessionId } from './sessions/domain/SessionId'
import { ApiClient } from './shared/infrastructure/ApiClient'
import { HttpDeckRepository } from './decks/infrastructure/HttpDeckRepository'
import { HttpStudySessionRepository } from './sessions/infrastructure/HttpStudySessionRepository'
import { CreateDeck } from './decks/application/CreateDeck'
import { GetDecks } from './decks/application/GetDecks'
import { DeleteDeck } from './decks/application/DeleteDeck'
import { UpdateDeck } from './decks/application/UpdateDeck'
import { AddCard } from './decks/application/AddCard'
import { UpdateCard } from './decks/application/UpdateCard'
import { DeleteCard } from './decks/application/DeleteCard'
import { StartSession } from './sessions/application/StartSession'
import { RecordCardResult } from './sessions/application/RecordCardResult'
import { CompleteSession } from './sessions/application/CompleteSession'
import { GetSessionsForDeck } from './sessions/application/GetSessionsForDeck'
import { DeckList } from './decks/presentation/DeckList'
import { DeckDetail } from './decks/presentation/DeckDetail'
import { StudySessionView } from './sessions/presentation/StudySessionView'
import { SessionHistory } from './sessions/presentation/SessionHistory'

const api = new ApiClient()
const deckRepo = new HttpDeckRepository(api)
const sessionRepo = new HttpStudySessionRepository(api)

const createDeck = new CreateDeck(deckRepo)
const getDecks = new GetDecks(deckRepo)
const deleteDeck = new DeleteDeck(deckRepo)
const updateDeck = new UpdateDeck(deckRepo)
const addCard = new AddCard(deckRepo)
const updateCard = new UpdateCard(deckRepo)
const deleteCard = new DeleteCard(deckRepo)
const startSession = new StartSession(sessionRepo)
const recordCardResult = new RecordCardResult(sessionRepo, deckRepo)
const completeSession = new CompleteSession(sessionRepo)
const getSessionsForDeck = new GetSessionsForDeck(sessionRepo)

export default function App() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null)
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [studyCards, setStudyCards] = useState<Card[]>([])
  const [studyOpen, setStudyOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const selectedDeck = decks.find(d => d.id.value === selectedDeckId) ?? null

  const refreshDecks = useCallback(async () => {
    const all = await getDecks.execute()
    setDecks(all)
    return all
  }, [])

  useEffect(() => {
    getDecks.execute()
      .then(setDecks)
      .catch(() => setError('Cannot connect to local server. Run `npm run server` first.'))
      .finally(() => setLoading(false))
  }, [])

  async function handleCreateDeck(name: string) {
    await createDeck.execute(name)
    const all = await refreshDecks()
    setSelectedDeckId(all[all.length - 1].id.value)
  }

  async function handleDeleteDeck(id: string) {
    await deleteDeck.execute(new DeckId(id))
    if (selectedDeckId === id) setSelectedDeckId(null)
    await refreshDecks()
  }

  async function handleRenameDeck(id: string, name: string) {
    await updateDeck.execute(new DeckId(id), name)
    await refreshDecks()
  }

  async function handleAddCard(question: string, answer: string) {
    if (!selectedDeckId) return
    await addCard.execute(new DeckId(selectedDeckId), question, answer)
    await refreshDecks()
  }

  async function handleUpdateCard(cardId: CardId, question: string, answer: string) {
    if (!selectedDeckId) return
    await updateCard.execute(new DeckId(selectedDeckId), cardId, question, answer)
    await refreshDecks()
  }

  async function handleDeleteCard(cardId: CardId) {
    if (!selectedDeckId) return
    await deleteCard.execute(new DeckId(selectedDeckId), cardId)
    await refreshDecks()
  }

  async function handleStartStudy(cards: Card[]) {
    if (!selectedDeckId) return
    const session = await startSession.execute(new DeckId(selectedDeckId))
    setActiveSessionId(session.id.value)
    setStudyCards(cards)
    setStudyOpen(true)
  }

  async function handleRecordResult(cardId: string, result: 'correct' | 'incorrect') {
    if (!activeSessionId || !selectedDeckId) return
    await recordCardResult.execute(new SessionId(activeSessionId), new CardId(cardId), result)
    setDecks(await getDecks.execute())
  }

  async function handleCompleteSession() {
    if (!activeSessionId) return
    await completeSession.execute(new SessionId(activeSessionId))
    setStudyOpen(false)
    setActiveSessionId(null)
    if (selectedDeckId) {
      const updated = await getSessionsForDeck.execute(new DeckId(selectedDeckId))
      setSessions(updated)
    }
    await refreshDecks()
  }

  async function handleViewHistory() {
    if (!selectedDeckId) return
    const s = await getSessionsForDeck.execute(new DeckId(selectedDeckId))
    setSessions(s)
    setHistoryOpen(true)
  }

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100dvh' }}>
          <CircularProgress color="primary" />
        </Box>
      </ThemeProvider>
    )
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100dvh', p: 4 }}>
          <Typography color="error" align="center">{error}</Typography>
        </Box>
      </ThemeProvider>
    )
  }

  const deckListProps = {
    decks,
    selectedDeckId,
    onSelect: setSelectedDeckId,
    onCreate: handleCreateDeck,
    onDelete: handleDeleteDeck,
    onRename: handleRenameDeck,
  }

  const deckDetailProps = selectedDeck ? {
    deck: selectedDeck,
    onAddCard: handleAddCard,
    onUpdateCard: handleUpdateCard,
    onDeleteCard: handleDeleteCard,
    onStartStudy: handleStartStudy,
    onViewHistory: handleViewHistory,
  } : null

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {isMobile ? (
        // Mobile: stack navigation - one view at a time
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', bgcolor: 'background.default' }}>
          {selectedDeck && deckDetailProps ? (
            <DeckDetail
              key={selectedDeckId}
              {...deckDetailProps}
              onBack={() => setSelectedDeckId(null)}
            />
          ) : (
            <DeckList {...deckListProps} />
          )}
        </Box>
      ) : (
        // Desktop: sidebar + main content
        <Box sx={{ display: 'flex', minHeight: '100dvh', bgcolor: 'background.default' }}>
          <Box sx={{
            width: 260,
            flexShrink: 0,
            bgcolor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'sticky',
            top: 0,
            height: '100dvh',
          }}>
            <DeckList {...deckListProps} />
          </Box>

          <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
            {selectedDeck && deckDetailProps ? (
              <DeckDetail key={selectedDeckId} {...deckDetailProps} />
            ) : (
              <Box sx={{
                display: 'flex', flexDirection: 'column',
                justifyContent: 'center', alignItems: 'center',
                height: '100%', gap: 2, opacity: 0.6,
              }}>
                <Box sx={{
                  width: 72, height: 72, borderRadius: 3,
                  background: 'linear-gradient(135deg, #FF6847, #FBBF24)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <SchoolIcon sx={{ fontSize: 36, color: 'white' }} />
                </Box>
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Select a deck to get started
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {selectedDeck && studyOpen && (
        <StudySessionView
          open={studyOpen}
          deck={selectedDeck}
          cards={studyCards}
          onRecordResult={handleRecordResult}
          onComplete={handleCompleteSession}
          onClose={() => { setStudyOpen(false); setActiveSessionId(null) }}
        />
      )}

      {selectedDeck && (
        <SessionHistory
          open={historyOpen}
          deckName={selectedDeck.name}
          sessions={sessions}
          onClose={() => setHistoryOpen(false)}
        />
      )}
    </ThemeProvider>
  )
}
