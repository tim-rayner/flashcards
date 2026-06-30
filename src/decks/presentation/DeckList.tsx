import { useState } from 'react'
import {
  List, ListItemButton, ListItemText,
  IconButton, Button, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, Typography, Box, useMediaQuery,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import { alpha } from '@mui/material/styles'
import { Deck } from '../domain/Deck'
import { CORAL } from '@/shared/presentation/theme'

interface Props {
  decks: Deck[]
  selectedDeckId: string | null
  onSelect: (id: string) => void
  onCreate: (name: string) => void
  onDelete: (id: string) => void
  onRename: (id: string, name: string) => void
}

export function DeckList({ decks, selectedDeckId, onSelect, onCreate, onDelete, onRename }: Props) {
  const isMobile = useMediaQuery('(max-width: 899px)')
  const [createOpen, setCreateOpen] = useState(false)
  const [renameOpen, setRenameOpen] = useState(false)
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [nameInput, setNameInput] = useState('')

  function handleCreate() {
    if (nameInput.trim()) {
      onCreate(nameInput.trim())
      setNameInput('')
      setCreateOpen(false)
    }
  }

  function handleRename() {
    if (renamingId && nameInput.trim()) {
      onRename(renamingId, nameInput.trim())
      setNameInput('')
      setRenameOpen(false)
      setRenamingId(null)
    }
  }

  function openRename(deck: Deck, e: React.MouseEvent) {
    e.stopPropagation()
    setRenamingId(deck.id.value)
    setNameInput(deck.name)
    setRenameOpen(true)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* App branding */}
      <Box sx={{ px: 2, pt: isMobile ? 3 : 2.5, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: isMobile ? 40 : 34,
            height: isMobile ? 40 : 34,
            borderRadius: 1.5,
            background: 'linear-gradient(135deg, #FF6847 0%, #FBBF24 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Typography sx={{ fontSize: isMobile ? '1.3rem' : '1.1rem', lineHeight: 1 }}>
              {'🃏'}
            </Typography>
          </Box>
          <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: '-0.02em', fontSize: isMobile ? '1.15rem' : undefined }}>
            Flashcards
          </Typography>
        </Box>
      </Box>

      {/* Section header */}
      <Box sx={{
        px: 2, pt: 1.5, pb: 0.5,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Typography variant="overline" color="text.secondary">
          My Decks
        </Typography>
        <IconButton
          size="small"
          onClick={() => { setNameInput(''); setCreateOpen(true) }}
          sx={{
            width: isMobile ? 32 : 24,
            height: isMobile ? 32 : 24,
            bgcolor: alpha(CORAL, 0.15),
            color: CORAL,
            '&:hover': { bgcolor: alpha(CORAL, 0.25), color: CORAL },
          }}
        >
          <AddIcon sx={{ fontSize: isMobile ? 18 : 16 }} />
        </IconButton>
      </Box>

      {/* Empty state */}
      {decks.length === 0 && (
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, mb: 1.5 }}>
            No decks yet. Create one to start learning.
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => { setNameInput(''); setCreateOpen(true) }}
            fullWidth
            sx={{ py: isMobile ? 1 : undefined }}
          >
            New Deck
          </Button>
        </Box>
      )}

      {/* Deck list */}
      <List dense={!isMobile} sx={{ px: 0, py: 0.5, flexGrow: 1, overflow: 'auto' }}>
        {decks.map(deck => (
          <ListItemButton
            key={deck.id.value}
            selected={deck.id.value === selectedDeckId}
            onClick={() => onSelect(deck.id.value)}
            sx={{
              pr: 0.5,
              py: isMobile ? 1.5 : undefined,
              mx: isMobile ? 1 : 0,
              borderRadius: isMobile ? 2 : undefined,
              mb: isMobile ? 0.5 : 0,
            }}
          >
            <ListItemText
              primary={deck.name}
              secondary={`${deck.cards.length} card${deck.cards.length !== 1 ? 's' : ''}`}
              primaryTypographyProps={{
                fontWeight: 500,
                noWrap: true,
                fontSize: isMobile ? '0.95rem' : undefined,
              }}
              secondaryTypographyProps={{ fontSize: '0.72rem' }}
            />
            <Box sx={{ display: 'flex', gap: 0, flexShrink: 0, ml: 0.5 }}>
              <IconButton
                size="small"
                onClick={e => openRename(deck, e)}
                sx={{
                  // Always visible on mobile (no hover state on touch)
                  opacity: isMobile ? 0.55 : 0,
                  '.MuiListItemButton-root:hover &': { opacity: 0.7 },
                  width: isMobile ? 36 : 28,
                  height: isMobile ? 36 : 28,
                }}
              >
                <EditIcon sx={{ fontSize: isMobile ? 15 : 13 }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={e => { e.stopPropagation(); onDelete(deck.id.value) }}
                sx={{
                  opacity: isMobile ? 0.55 : 0,
                  '.MuiListItemButton-root:hover &': { opacity: 0.7 },
                  width: isMobile ? 36 : 28,
                  height: isMobile ? 36 : 28,
                  '&:hover': { color: 'error.main', opacity: 1 },
                }}
              >
                <DeleteIcon sx={{ fontSize: isMobile ? 15 : 13 }} />
              </IconButton>
            </Box>
          </ListItemButton>
        ))}
      </List>

      {/* New deck button pinned at bottom */}
      {decks.length > 0 && (
        <Box sx={{
          p: isMobile ? 2 : 1.5,
          borderTop: '1px solid',
          borderColor: 'divider',
          pb: isMobile ? 'max(env(safe-area-inset-bottom), 1rem)' : 1.5,
        }}>
          <Button
            variant="outlined"
            size={isMobile ? 'medium' : 'small'}
            startIcon={<AddIcon />}
            onClick={() => { setNameInput(''); setCreateOpen(true) }}
            fullWidth
            sx={{ py: isMobile ? 1.25 : undefined }}
          >
            New Deck
          </Button>
        </Box>
      )}

      {/* Create dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>New Deck</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus fullWidth label="Deck name" value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Rename dialog */}
      <Dialog open={renameOpen} onClose={() => setRenameOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Rename Deck</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus fullWidth label="New name" value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleRename()}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleRename}>Rename</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
