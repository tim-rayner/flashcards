import { useState } from 'react'
import {
  Box, Typography, Button, TextField,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Chip, useMediaQuery,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import HistoryIcon from '@mui/icons-material/History'
import AddIcon from '@mui/icons-material/Add'
import StyleIcon from '@mui/icons-material/Style'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { alpha } from '@mui/material/styles'
import { Deck } from '../domain/Deck'
import { Card } from '../domain/Card'
import { CardId } from '../domain/CardId'
import { CORAL, SURFACE_HIGH } from '../../shared/presentation/theme'

type CardFilter = 'correct' | 'incorrect' | 'new'

interface Props {
  deck: Deck
  onAddCard: (question: string, answer: string) => void
  onUpdateCard: (cardId: CardId, question: string, answer: string) => void
  onDeleteCard: (cardId: CardId) => void
  onStartStudy: (cards: Card[]) => void
  onViewHistory: () => void
  onBack?: () => void
}

export function DeckDetail({ deck, onAddCard, onUpdateCard, onDeleteCard, onStartStudy, onViewHistory, onBack }: Props) {
  const isMobile = useMediaQuery('(max-width: 899px)')
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingCardId, setEditingCardId] = useState<CardId | null>(null)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [activeFilter, setActiveFilter] = useState<CardFilter | null>(null)

  function toggleFilter(f: CardFilter) {
    setActiveFilter(prev => prev === f ? null : f)
  }

  const filteredCards: Card[] = activeFilter === null
    ? deck.cards
    : activeFilter === 'new'
      ? deck.cards.filter(c => c.lastResult === null)
      : deck.cards.filter(c => c.lastResult === activeFilter)

  function handleAdd() {
    if (question.trim() && answer.trim()) {
      onAddCard(question.trim(), answer.trim())
      setQuestion('')
      setAnswer('')
      setAddOpen(false)
    }
  }

  function handleEdit() {
    if (editingCardId && question.trim() && answer.trim()) {
      onUpdateCard(editingCardId, question.trim(), answer.trim())
      setQuestion('')
      setAnswer('')
      setEditOpen(false)
      setEditingCardId(null)
    }
  }

  function openEdit(cardId: CardId, q: string, a: string) {
    setEditingCardId(cardId)
    setQuestion(q)
    setAnswer(a)
    setEditOpen(true)
  }

  const statusColor = (result: 'correct' | 'incorrect' | null) => {
    if (result === 'correct') return 'success'
    if (result === 'incorrect') return 'error'
    return 'default'
  }

  const correctCount = deck.cards.filter(c => c.lastResult === 'correct').length
  const incorrectCount = deck.cards.filter(c => c.lastResult === 'incorrect').length
  const unseenCount = deck.cards.filter(c => c.lastResult === null).length

  const statChips = deck.cards.length > 0 && (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      <Chip
        label={`${deck.cards.length} cards`}
        size="small"
        onClick={activeFilter !== null ? () => setActiveFilter(null) : undefined}
        sx={{ cursor: activeFilter !== null ? 'pointer' : 'default' }}
      />
      {correctCount > 0 && (
        <Chip
          label={`${correctCount} correct`}
          size="small"
          color="success"
          variant={activeFilter === 'correct' ? 'filled' : 'outlined'}
          onClick={() => toggleFilter('correct')}
          clickable
        />
      )}
      {incorrectCount > 0 && (
        <Chip
          label={`${incorrectCount} to review`}
          size="small"
          color="error"
          variant={activeFilter === 'incorrect' ? 'filled' : 'outlined'}
          onClick={() => toggleFilter('incorrect')}
          clickable
        />
      )}
      {unseenCount > 0 && (
        <Chip
          label={`${unseenCount} new`}
          size="small"
          variant={activeFilter === 'new' ? 'filled' : 'outlined'}
          onClick={() => toggleFilter('new')}
          clickable
        />
      )}
    </Box>
  )

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: isMobile ? '100dvh' : undefined,
      maxWidth: isMobile ? undefined : 800,
    }}>
      {/* Mobile sticky top bar */}
      {isMobile && (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1,
          py: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
          position: 'sticky',
          top: 0,
          bgcolor: 'background.default',
          zIndex: 10,
          minHeight: 60,
        }}>
          {onBack && (
            <IconButton onClick={onBack} size="medium" sx={{ flexShrink: 0 }}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography variant="h6" fontWeight={700} noWrap sx={{ flex: 1, letterSpacing: '-0.01em' }}>
            {deck.name}
          </Typography>
          <IconButton
            size="medium"
            onClick={onViewHistory}
            sx={{ flexShrink: 0 }}
            aria-label="Session history"
          >
            <HistoryIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            onClick={() => onStartStudy(filteredCards)}
            disabled={filteredCards.length === 0}
            size="medium"
            sx={{ flexShrink: 0, minWidth: 90 }}
          >
            {activeFilter !== null ? `Study (${filteredCards.length})` : 'Study'}
          </Button>
        </Box>
      )}

      {/* Content */}
      <Box sx={{ p: isMobile ? 2 : 0, flex: 1 }}>
        {/* Desktop header - not shown on mobile */}
        {!isMobile && (
          <Box sx={{
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'space-between', mb: 3, gap: 2,
          }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 0.5 }}>
                {deck.name}
              </Typography>
              {statChips}
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
              <Button size="small" startIcon={<HistoryIcon />} onClick={onViewHistory}>
                History
              </Button>
              <Button
                variant="contained"
                startIcon={<PlayArrowIcon />}
                onClick={() => onStartStudy(filteredCards)}
                disabled={filteredCards.length === 0}
                size="large"
              >
                {activeFilter !== null ? `Study (${filteredCards.length})` : 'Study'}
              </Button>
            </Box>
          </Box>
        )}

        {/* Mobile stat chips - below the sticky bar */}
        {isMobile && deck.cards.length > 0 && (
          <Box sx={{ mb: 2 }}>
            {statChips}
          </Box>
        )}

        {/* Card list header */}
        <Box sx={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', mb: 1.5,
        }}>
          <Typography variant="overline" color="text.secondary">
            Cards
          </Typography>
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={() => { setQuestion(''); setAnswer(''); setAddOpen(true) }}
            sx={{ py: isMobile ? 0.75 : undefined }}
          >
            Add Card
          </Button>
        </Box>

        {/* Empty state */}
        {deck.cards.length === 0 && (
          <Box sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 2, py: isMobile ? 6 : 8, opacity: 0.6,
          }}>
            <Box sx={{
              width: 56, height: 56, borderRadius: 2,
              bgcolor: alpha(CORAL, 0.12),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <StyleIcon sx={{ fontSize: 28, color: CORAL }} />
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                No cards yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add some cards to start studying.
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => { setQuestion(''); setAnswer(''); setAddOpen(true) }}
              size={isMobile ? 'large' : 'medium'}
              sx={{ px: isMobile ? 4 : undefined }}
            >
              Add First Card
            </Button>
          </Box>
        )}

        {/* Card items */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 2 : 1.5 }}>
          {filteredCards.map(card => (
            <Box
              key={card.id.value}
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'stretch' : 'flex-start',
                gap: isMobile ? 1.5 : 2,
                p: isMobile ? 2.5 : 2,
                borderRadius: 2,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  borderColor: alpha('#94A3B8', 0.2),
                  bgcolor: SURFACE_HIGH,
                },
                transition: 'all 0.15s ease',
              }}
            >
              {/* Q/A content */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography
                    variant="overline"
                    sx={{
                      color: CORAL,
                      fontSize: '0.62rem',
                      letterSpacing: '0.14em',
                      lineHeight: 1,
                    }}
                  >
                    Q
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, lineHeight: 1.4, fontSize: isMobile ? '1rem' : undefined }}>
                    {card.question}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ pl: '1.6rem', fontSize: isMobile ? '0.9rem' : undefined }}>
                  {card.answer}
                </Typography>
              </Box>

              {/* Actions row - full width on mobile, column on desktop */}
              <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: isMobile ? 'space-between' : 'flex-end',
                gap: 1,
                flexShrink: 0,
              }}>
                <Chip
                  label={card.lastResult ?? 'new'}
                  size="small"
                  color={statusColor(card.lastResult)}
                  variant="outlined"
                />
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton
                    size={isMobile ? 'medium' : 'small'}
                    onClick={() => openEdit(card.id, card.question, card.answer)}
                    sx={{ width: isMobile ? 40 : undefined, height: isMobile ? 40 : undefined }}
                  >
                    <EditIcon sx={{ fontSize: isMobile ? 18 : 15 }} />
                  </IconButton>
                  <IconButton
                    size={isMobile ? 'medium' : 'small'}
                    onClick={() => onDeleteCard(card.id)}
                    sx={{
                      width: isMobile ? 40 : undefined,
                      height: isMobile ? 40 : undefined,
                      '&:hover': { color: 'error.main' },
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: isMobile ? 18 : 15 }} />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Add card dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} fullWidth maxWidth="sm" fullScreen={isMobile}>
        <DialogTitle>Add Card</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            autoFocus fullWidth label="Question" multiline rows={3}
            value={question} onChange={e => setQuestion(e.target.value)}
          />
          <TextField
            fullWidth label="Answer" multiline rows={3}
            value={answer} onChange={e => setAnswer(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: isMobile ? 2 : undefined, gap: isMobile ? 1 : undefined }}>
          <Button onClick={() => setAddOpen(false)} size={isMobile ? 'large' : 'medium'}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} size={isMobile ? 'large' : 'medium'} fullWidth={isMobile}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit card dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm" fullScreen={isMobile}>
        <DialogTitle>Edit Card</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            autoFocus fullWidth label="Question" multiline rows={3}
            value={question} onChange={e => setQuestion(e.target.value)}
          />
          <TextField
            fullWidth label="Answer" multiline rows={3}
            value={answer} onChange={e => setAnswer(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: isMobile ? 2 : undefined, gap: isMobile ? 1 : undefined }}>
          <Button onClick={() => setEditOpen(false)} size={isMobile ? 'large' : 'medium'}>Cancel</Button>
          <Button variant="contained" onClick={handleEdit} size={isMobile ? 'large' : 'medium'} fullWidth={isMobile}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
