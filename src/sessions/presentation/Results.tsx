import { Dialog, DialogContent, Box, Typography, Button } from "@mui/material";
import { GOLD, CORAL, EMERALD } from "@/shared/presentation/theme";
import { alpha } from "@mui/material/styles";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { StatTile } from "./StatTile";

interface Props {
  open: boolean;
  onClose: () => void;
  resultMessage: string;
  localCorrect: number;
  accuracy: number;
  maxStreak: number;
  handleDone: () => void;
  isMobile: boolean;
}

export function Results({
  open,
  handleDone,
  isMobile,
  resultMessage,
  localCorrect,
  accuracy,
  maxStreak,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={handleDone}
      fullWidth
      maxWidth="xs"
      fullScreen={isMobile}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            py: isMobile ? 0 : 4,
            px: isMobile ? 3 : 3,
            textAlign: "center",
            minHeight: isMobile ? "100dvh" : undefined,
            justifyContent: isMobile ? "center" : undefined,
          }}
        >
          <Box
            sx={{
              width: isMobile ? 96 : 80,
              height: isMobile ? 96 : 80,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${GOLD}, ${CORAL})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 8px 32px ${alpha(GOLD, 0.4)}`,
            }}
          >
            <EmojiEventsIcon
              sx={{ fontSize: isMobile ? 48 : 40, color: "white" }}
            />
          </Box>

          <Box>
            <Typography
              variant={isMobile ? "h3" : "h4"}
              sx={{ fontWeight: 800, letterSpacing: "-0.02em", mb: 0.5 }}
            >
              Session done!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {resultMessage}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5, width: "100%" }}>
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
  );
}
