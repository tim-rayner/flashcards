import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, Chip, useMediaQuery,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { alpha } from '@mui/material/styles'
import { StudySession } from '../domain/StudySession'
import { EMERALD, CORAL, GOLD, SURFACE_HIGH } from '../../shared/presentation/theme'

interface Props {
  open: boolean
  deckName: string
  sessions: StudySession[]
  onClose: () => void
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function SessionHistory({ open, deckName, sessions, onClose }: Props) {
  const isMobile = useMediaQuery('(max-width: 899px)')
  const sorted = [...sessions].sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" fullScreen={isMobile}>
      <DialogTitle sx={{ pb: 1 }}>
        Session History
      </DialogTitle>

      <DialogContent sx={{ pb: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {deckName}
        </Typography>

        {sorted.length === 0 && (
          <Box sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 1.5, py: 6, opacity: 0.6,
          }}>
            <AccessTimeIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary" align="center">
              No sessions yet. Start studying to see your history.
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 2 : 1.5 }}>
          {sorted.map((session, index) => {
            const { correct, incorrect, total } = session.score
            const pct = total > 0 ? Math.round((correct / total) * 100) : 0
            const isFirst = index === 0

            const scoreColor = pct >= 80
              ? EMERALD
              : pct >= 50
                ? GOLD
                : CORAL

            return (
              <Box
                key={session.id.value}
                sx={{
                  p: isMobile ? 2.5 : 2,
                  borderRadius: 2,
                  bgcolor: isFirst ? alpha(EMERALD, 0.06) : SURFACE_HIGH,
                  border: '1px solid',
                  borderColor: isFirst ? alpha(EMERALD, 0.2) : 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? 2.5 : 2,
                }}
              >
                {/* Score circle */}
                <Box sx={{
                  width: isMobile ? 60 : 52,
                  height: isMobile ? 60 : 52,
                  borderRadius: '50%',
                  flexShrink: 0,
                  border: `2px solid ${scoreColor}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  bgcolor: alpha(scoreColor, 0.1),
                }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 800, color: scoreColor, lineHeight: 1, fontSize: isMobile ? '0.95rem' : undefined }}
                  >
                    {total > 0 ? `${pct}%` : '-'}
                  </Typography>
                </Box>

                {/* Session info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: isMobile ? '0.9rem' : undefined }}>
                      {formatDate(session.startedAt)}
                    </Typography>
                    {isFirst && (
                      <Chip label="Latest" size="small" color="success" sx={{ height: 18, fontSize: '0.65rem' }} />
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                    {total > 0 ? (
                      <>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                          <CheckCircleIcon sx={{ fontSize: 14, color: EMERALD }} />
                          <Typography variant="caption" sx={{ color: EMERALD, fontWeight: 600 }}>
                            {correct}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                          <CancelIcon sx={{ fontSize: 14, color: CORAL }} />
                          <Typography variant="caption" sx={{ color: CORAL, fontWeight: 600 }}>
                            {incorrect}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {total} cards
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        No cards answered
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Completion chip */}
                <Chip
                  label={session.completedAt ? 'Done' : 'Partial'}
                  size="small"
                  color={session.completedAt ? 'success' : 'warning'}
                  variant="outlined"
                  sx={{ flexShrink: 0 }}
                />
              </Box>
            )
          })}
        </Box>
      </DialogContent>

      <DialogActions sx={{
        px: 2,
        pb: isMobile ? 'max(env(safe-area-inset-bottom), 16px)' : 2,
      }}>
        <Button
          onClick={onClose}
          variant="contained"
          fullWidth={isMobile}
          size={isMobile ? 'large' : 'medium'}
          sx={{ py: isMobile ? 1.5 : undefined }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
