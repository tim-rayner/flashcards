import { Box, CssBaseline, ThemeProvider, CircularProgress, Typography, useMediaQuery } from '@mui/material'
import { theme } from '@/shared/presentation/theme'
import { useFlashcardsApp } from './useFlashcardsApp'
import { MobileLayout, DesktopLayout } from './AppLayout'
import { StudySessionView } from '@/sessions/presentation/StudySessionView'
import { SessionHistory } from '@/sessions/presentation/SessionHistory'

export default function App() {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const {
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
    selectDeck,
  } = useFlashcardsApp()

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

  const layoutProps = { deckListProps, deckDetailProps, selectedDeckId }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {isMobile ? (
        <MobileLayout {...layoutProps} onBack={() => selectDeck(null)} />
      ) : (
        <DesktopLayout {...layoutProps} />
      )}

      {selectedDeck && studyOpen && (
        <StudySessionView
          open={studyOpen}
          deck={selectedDeck}
          cards={studyCards}
          onRecordResult={handleRecordResult}
          onComplete={handleCompleteSession}
          onClose={handleCloseStudy}
        />
      )}

      {selectedDeck && (
        <SessionHistory
          open={historyOpen}
          deckName={selectedDeck.name}
          sessions={sessions}
          onClose={handleCloseHistory}
        />
      )}
    </ThemeProvider>
  )
}
