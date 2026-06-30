import { Box, Typography } from "@mui/material";
import { SURFACE_HIGH } from "@/shared/presentation/theme";

interface Props {
  label: string;
  value: string | number;
  color: string;
}

export function StatTile({ label, value, color }: Props) {
  return (
    <Box
      sx={{
        borderRadius: 2,
        p: 2,
        bgcolor: SURFACE_HIGH,
        border: "1px solid",
        borderColor: "divider",
        textAlign: "center",
        flex: 1,
      }}
    >
      <Typography
        variant="h4"
        sx={{ fontWeight: 800, color, lineHeight: 1, mb: 0.5 }}
      >
        {value}
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontSize: "0.72rem" }}
      >
        {label}
      </Typography>
    </Box>
  );
}
