import { Box, Typography } from '@mui/material'
import SchoolIcon from '@mui/icons-material/School'
import { Deck } from '../../decks/domain/Deck'
import { CardId } from '../../decks/domain/CardId'
import { Card } from '../../decks/domain/Card'
import { DeckList } from '../../decks/presentation/DeckList'
import { DeckDetail } from '../../decks/presentation/DeckDetail'

interface DeckListProps {
  decks: Deck[]
  selectedDeckId: string | null
  onSelect: (id: string) => void
  onCreate: (name: string) => void
  onDelete: (id: string) => void
  onRename: (id: string, name: string) => void
}

interface DeckDetailProps {
  deck: Deck
  onAddCard: (question: string, answer: string) => void
  onUpdateCard: (cardId: CardId, question: string, answer: string) => void
  onDeleteCard: (cardId: CardId) => void
  onStartStudy: (cards: Card[]) => void
  onViewHistory: () => void
}

interface LayoutProps {
  deckListProps: DeckListProps
  deckDetailProps: DeckDetailProps | null
  selectedDeckId: string | null
}

function EmptyDeckPlaceholder() {
  return (
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
  )
}

function DeckDetailPanel({ deckDetailProps, selectedDeckId, onBack }: {
  deckDetailProps: DeckDetailProps
  selectedDeckId: string | null
  onBack?: () => void
}) {
  return (
    <DeckDetail
      key={selectedDeckId}
      {...deckDetailProps}
      onBack={onBack}
    />
  )
}

function MainPanel({ deckDetailProps, selectedDeckId }: LayoutProps) {
  if (deckDetailProps) {
    return <DeckDetailPanel deckDetailProps={deckDetailProps} selectedDeckId={selectedDeckId} />
  }
  return <EmptyDeckPlaceholder />
}

export function MobileLayout({ deckListProps, deckDetailProps, selectedDeckId, onBack }: LayoutProps & {
  onBack: () => void
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', bgcolor: 'background.default' }}>
      {deckDetailProps ? (
        <DeckDetailPanel deckDetailProps={deckDetailProps} selectedDeckId={selectedDeckId} onBack={onBack} />
      ) : (
        <DeckList {...deckListProps} />
      )}
    </Box>
  )
}

export function DesktopLayout({ deckListProps, deckDetailProps, selectedDeckId }: LayoutProps) {
  return (
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
        <MainPanel deckListProps={deckListProps} deckDetailProps={deckDetailProps} selectedDeckId={selectedDeckId} />
      </Box>
    </Box>
  )
}
