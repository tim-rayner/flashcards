import { useState } from 'react'
import {
  Dialog, DialogContent, DialogActions,
  Button, Typography, Box, LinearProgress, Chip, IconButton, useMediaQuery,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import CloseIcon from '@mui/icons-material/Close'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { alpha } from '@mui/material/styles'
import { Deck } from '../../decks/domain/Deck'
import { Card } from '../../decks/domain/Card'
import { CORAL, GOLD, EMERALD, ROSE, SURFACE_HIGH } from '../../shared/presentation/theme'

interface Props {
  open: boolean
  deck: Deck
  cards: Card[]
  onRecordResult: (cardId: string, result: 'correct' | 'incorrect') => void
  onComplete: () => void
  onClose: () => void
}

function StatTile({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <Box sx={{
      borderRadius: 2,
      p: 2,
      bgcolor: SURFACE_HIGH,
      border: '1px solid',
      borderColor: 'divider',
      textAlign: 'center',
      flex: 1,
    }}>
      <Typography variant="h4" sx={{ fontWeight: 800, color, lineHeight: 1, mb: 0.5 }}>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
        {label}
      </Typography>
    </Box>
  )
}

export function StudySessionView({ open, deck, cards, onRecordResult, onComplete, onClose }: Props) {
  const isMobile = useMediaQuery('(max-width: 899px)')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [answered, setAnswered] = useState<Set<number>>(new Set())
  const [localCorrect, setLocalCorrect] = useState(0)
  const [localIncorrect, setLocalIncorrect] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const current = cards[currentIndex]
  const isLast = currentIndex === cards.length - 1
  const progress = (answered.size / cards.length) * 100
  const totalAnswered = localCorrect + localIncorrect
  const accuracy = totalAnswered > 0 ? Math.round((localCorrect / totalAnswered) * 100) : 0

  function handleRate(result: 'correct' | 'incorrect') {
    onRecordResult(current.id.value, result)

    const newCorrect = result === 'correct' ? localCorrect + 1 : localCorrect
    const newIncorrect = result === 'incorrect' ? localIncorrect + 1 : localIncorrect
    const newStreak = result === 'correct' ? streak + 1 : 0
    const newMaxStreak = Math.max(maxStreak, newStreak)

    setLocalCorrect(newCorrect)
    setLocalIncorrect(newIncorrect)
    setStreak(newStreak)
    setMaxStreak(newMaxStreak)
    setAnswered(prev => new Set(prev).add(currentIndex))
    setRevealed(false)

    if (isLast) {
      setShowResults(true)
    } else {
      setCurrentIndex(i => i + 1)
    }
  }

  function handleDone() {
    setShowResults(false)
    onComplete()
  }

  function handleClose() {
    setCurrentIndex(0)
    setRevealed(false)
    setAnswered(new Set())
    setLocalCorrect(0)
    setLocalIncorrect(0)
    setStreak(0)
    setMaxStreak(0)
    setShowResults(false)
    onClose()
  }

  const resultMessage = accuracy >= 90
    ? 'Outstanding!'
    : accuracy >= 70
      ? 'Great work!'
      : accuracy >= 50
        ? 'Good effort, keep going!'
        : 'Practice makes perfect.'

  // Results screen
  if (showResults) {
    return (
      <Dialog open={open} onClose={handleDone} fullWidth maxWidth="xs" fullScreen={isMobile}>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 3,
            py: isMobile ? 0 : 4,
            px: isMobile ? 3 : 3,
            textAlign: 'center',
            minHeight: isMobile ? '100dvh' : undefined,
            justifyContent: isMobile ? 'center' : undefined,
          }}>
            <Box sx={{
              width: isMobile ? 96 : 80,
              height: isMobile ? 96 : 80,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${GOLD}, ${CORAL})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 8px 32px ${alpha(GOLD, 0.4)}`,
            }}>
              <EmojiEventsIcon sx={{ fontSize: isMobile ? 48 : 40, color: 'white' }} />
            </Box>

            <Box>
              <Typography variant={isMobile ? 'h3' : 'h4'} sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 0.5 }}>
                Session done!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {resultMessage}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, width: '100%' }}>
              <StatTile label="Correct" value={localCorrect} color={EMERALD} />
              <StatTile label="Accuracy" value={`${accuracy}%`} color={CORAL} />
              <StatTile label="Best streak" value={maxStreak} color={GOLD} />
            </Box>

            <Button
              variant="contained"
              size="large"
              onClick={handleDone}
              fullWidth
              sx={{ py: isMobile ? 1.75 : undefined }}
            >
              Back to Deck
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    )
  }

  if (!current) return null

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" fullScreen={isMobile}>
      {/* Header */}
      <Box sx={{ px: isMobile ? 2 : 3, pt: isMobile ? 2 : 2.5, pb: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Box>
            <Typography variant={isMobile ? 'subtitle1' : 'h6'} sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {deck.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {currentIndex + 1} of {cards.length}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {streak >= 2 && (
              <Chip
                icon={<LocalFireDepartmentIcon sx={{ fontSize: '14px !important' }} />}
                label={`${streak} streak`}
                color="warning"
                size="small"
              />
            )}
            <Chip
              label={`${localCorrect}`}
              size="small"
              color="success"
              variant="outlined"
              sx={{ minWidth: 36 }}
            />
            <Chip
              label={`${localIncorrect}`}
              size="small"
              color="error"
              variant="outlined"
              sx={{ minWidth: 36 }}
            />
            <IconButton size="small" onClick={handleClose} sx={{ ml: 0.5 }}>
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>

        <LinearProgress variant="determinate" value={progress} />
      </Box>

      <DialogContent sx={{ pt: 2, pb: 2, display: 'flex', flexDirection: 'column' }}>
        {/* Flip card - taller on mobile for better usability */}
        <Box
          onClick={() => !revealed && setRevealed(true)}
          sx={{
            perspective: '1200px',
            height: isMobile ? 'clamp(240px, 42dvh, 380px)' : 200,
            cursor: !revealed ? 'pointer' : 'default',
            userSelect: 'none',
            flexShrink: 0,
          }}
        >
          <Box sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: revealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}>
            {/* Front - Question */}
            <Box sx={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              p: isMobile ? 3.5 : 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}>
              <Typography variant="overline" color="text.secondary">
                Question
              </Typography>
              <Typography
                variant={isMobile ? 'h6' : 'h6'}
                sx={{ fontWeight: 600, lineHeight: 1.4, flex: 1, fontSize: isMobile ? '1.15rem' : undefined }}
              >
                {current.question}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.5, textAlign: 'center' }}>
                Tap to reveal answer
              </Typography>
            </Box>

            {/* Back - Answer */}
            <Box sx={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              borderRadius: 3,
              border: '2px solid',
              borderColor: alpha(CORAL, 0.5),
              bgcolor: SURFACE_HIGH,
              p: isMobile ? 3.5 : 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}>
              <Typography variant="overline" sx={{ color: CORAL }}>
                Answer
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 500, lineHeight: 1.6, flex: 1, fontSize: isMobile ? '1.1rem' : undefined }}
              >
                {current.answer}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Reveal button (visible before flip) */}
        {!revealed && (
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setRevealed(true)}
            size={isMobile ? 'large' : 'medium'}
            sx={{ mt: 2, py: isMobile ? 1.5 : undefined }}
          >
            Reveal Answer
          </Button>
        )}
      </DialogContent>

      <DialogActions sx={{
        px: isMobile ? 2 : 3,
        pb: isMobile ? 'max(env(safe-area-inset-bottom), 20px)' : 3,
        pt: 0,
        gap: isMobile ? 1.5 : 1,
        flexWrap: isMobile ? 'wrap' : 'nowrap',
      }}>
        <Button
          onClick={handleClose}
          color="inherit"
          size={isMobile ? 'large' : 'medium'}
          sx={{
            mr: isMobile ? 'auto' : 'auto',
            order: isMobile ? 3 : 0,
            width: isMobile ? '100%' : undefined,
            py: isMobile ? 1.25 : undefined,
          }}
        >
          End Session
        </Button>
        {revealed && (
          <>
            <Button
              variant="contained"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => handleRate('incorrect')}
              size="large"
              sx={{
                flex: isMobile ? 1 : undefined,
                py: isMobile ? 1.5 : undefined,
              }}
            >
              Missed it
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={() => handleRate('correct')}
              size="large"
              sx={{
                flex: isMobile ? 1 : undefined,
                py: isMobile ? 1.5 : undefined,
              }}
            >
              Got it
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}
