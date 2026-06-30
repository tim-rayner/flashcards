import { DialogActions, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

interface Props {
  revealed: boolean;
  isMobile: boolean;
  onClose: () => void;
  onRate: (result: "correct" | "incorrect") => void;
}

export function SessionActions({ revealed, isMobile, onClose, onRate }: Props) {
  return (
    <DialogActions
      sx={{
        px: isMobile ? 2 : 3,
        pb: isMobile ? "max(env(safe-area-inset-bottom), 20px)" : 3,
        pt: 0,
        gap: isMobile ? 1.5 : 1,
        flexWrap: isMobile ? "wrap" : "nowrap",
      }}
    >
      <Button
        onClick={onClose}
        color="inherit"
        size={isMobile ? "large" : "medium"}
        sx={{
          mr: "auto",
          order: isMobile ? 3 : 0,
          width: isMobile ? "100%" : undefined,
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
            onClick={() => onRate("incorrect")}
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
            onClick={() => onRate("correct")}
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
  );
}
