import {
  Box,
  Typography,
  LinearProgress,
  Chip,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

interface Props {
  deckName: string;
  currentIndex: number;
  total: number;
  streak: number;
  localCorrect: number;
  localIncorrect: number;
  progress: number;
  isMobile: boolean;
  onClose: () => void;
}

export function SessionHeader({
  deckName,
  currentIndex,
  total,
  streak,
  localCorrect,
  localIncorrect,
  progress,
  isMobile,
  onClose,
}: Props) {
  return (
    <Box sx={{ px: isMobile ? 2 : 3, pt: isMobile ? 2 : 2.5, pb: 1.5 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1.5,
        }}
      >
        <Box>
          <Typography
            variant={isMobile ? "subtitle1" : "h6"}
            sx={{ fontWeight: 700, lineHeight: 1.2 }}
          >
            {deckName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {currentIndex + 1} of {total}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {streak >= 2 && (
            <Chip
              icon={
                <LocalFireDepartmentIcon sx={{ fontSize: "14px !important" }} />
              }
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
          <IconButton size="small" onClick={onClose} sx={{ ml: 0.5 }}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>

      <LinearProgress variant="determinate" value={progress} />
    </Box>
  );
}
