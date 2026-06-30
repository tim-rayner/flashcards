import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { CORAL, SURFACE_HIGH } from "@/shared/presentation/theme";

interface Props {
  question: string;
  answer: string;
  revealed: boolean;
  isMobile: boolean;
  onReveal: () => void;
}

export function FlipCard({
  question,
  answer,
  revealed,
  isMobile,
  onReveal,
}: Props) {
  return (
    <Box
      onClick={() => !revealed && onReveal()}
      sx={{
        perspective: "1200px",
        height: isMobile ? "clamp(240px, 42dvh, 380px)" : 200,
        cursor: !revealed ? "pointer" : "default",
        userSelect: "none",
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transition: "transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: revealed ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front - Question */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            p: isMobile ? 3.5 : 3,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="overline" color="text.secondary">
            Question
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              lineHeight: 1.4,
              flex: 1,
              fontSize: isMobile ? "1.15rem" : undefined,
            }}
          >
            {question}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ opacity: 0.5, textAlign: "center" }}
          >
            Tap to reveal answer
          </Typography>
        </Box>

        {/* Back - Answer */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: 3,
            border: "2px solid",
            borderColor: alpha(CORAL, 0.5),
            bgcolor: SURFACE_HIGH,
            p: isMobile ? 3.5 : 3,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ fontWeight: 500, lineHeight: 1.4 }}
          >
            {question}
          </Typography>
          <Typography variant="overline" sx={{ color: CORAL }}>
            Answer
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 500,
              lineHeight: 1.6,
              flex: 1,
              fontSize: isMobile ? "1.1rem" : undefined,
            }}
          >
            {answer}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
