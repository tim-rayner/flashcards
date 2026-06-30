import { createTheme, alpha } from '@mui/material/styles'

const CORAL = '#FF6847'
const EMERALD = '#4ADE80'
const ROSE = '#FB7185'
const GOLD = '#FBBF24'
const BG = '#0F172A'
const SURFACE = '#1E293B'
const SURFACE_HIGH = '#263548'
const SLATE_400 = '#94A3B8'
const SLATE_100 = '#F1F5F9'

export { CORAL, EMERALD, ROSE, GOLD, SURFACE_HIGH }

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: CORAL,
      light: '#FF8E72',
      dark: '#E5562F',
      contrastText: '#FFFFFF',
    },
    success: {
      main: EMERALD,
      contrastText: '#052e16',
    },
    error: {
      main: ROSE,
      contrastText: '#FFFFFF',
    },
    warning: {
      main: GOLD,
      contrastText: '#451a03',
    },
    background: {
      default: BG,
      paper: SURFACE,
    },
    text: {
      primary: SLATE_100,
      secondary: SLATE_400,
    },
    divider: alpha(SLATE_100, 0.08),
  },
  typography: {
    fontFamily: '"Outfit", "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 800, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: {
      fontWeight: 700,
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
    overline: {
      fontWeight: 600,
      letterSpacing: '0.12em',
      fontSize: '0.68rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        body { background-color: ${BG}; }

        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb {
          background: ${alpha(SLATE_100, 0.12)};
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${alpha(SLATE_100, 0.22)};
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '8px 18px',
          fontWeight: 700,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
          '&:active': { transform: 'scale(0.97)', boxShadow: 'none' },
          transition: 'transform 0.1s ease, background-color 0.15s ease, border-color 0.15s ease, opacity 0.15s ease',
        },
        sizeLarge: {
          padding: '11px 26px',
          fontSize: '1rem',
          borderRadius: 12,
        },
        sizeSmall: {
          padding: '4px 12px',
          fontSize: '0.8125rem',
          borderRadius: 8,
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${CORAL} 0%, #FF8E50 100%)`,
          '&:hover': { background: `linear-gradient(135deg, #e55630 0%, ${CORAL} 100%)` },
        },
        containedSuccess: {
          background: `linear-gradient(135deg, #22c55e 0%, ${EMERALD} 100%)`,
          color: '#052e16',
          '&:hover': { background: `linear-gradient(135deg, #16a34a 0%, #22c55e 100%)` },
        },
        containedError: {
          background: `linear-gradient(135deg, #e11d48 0%, ${ROSE} 100%)`,
          '&:hover': { background: `linear-gradient(135deg, #be123c 0%, #e11d48 100%)` },
        },
        outlinedPrimary: {
          borderColor: alpha(CORAL, 0.5),
          color: CORAL,
          '&:hover': { borderColor: CORAL, backgroundColor: alpha(CORAL, 0.08) },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
        elevation2: {
          boxShadow: `0 0 0 1px ${alpha(SLATE_100, 0.06)}, 0 8px 32px ${alpha('#000', 0.4)}`,
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(4px)',
          backgroundColor: alpha('#000', 0.55),
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          backgroundImage: 'none',
          border: `1px solid ${alpha(SLATE_100, 0.08)}`,
          boxShadow: `0 24px 80px ${alpha('#000', 0.6)}`,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 8,
          backgroundColor: alpha(SLATE_100, 0.1),
        },
        bar: {
          borderRadius: 4,
          background: `linear-gradient(90deg, ${CORAL}, ${GOLD})`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 700,
          fontFamily: '"Outfit", sans-serif',
          fontSize: '0.75rem',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: '2px 8px',
          paddingLeft: 12,
          paddingRight: 8,
          '&.Mui-selected': {
            backgroundColor: alpha(CORAL, 0.12),
            '&:hover': { backgroundColor: alpha(CORAL, 0.18) },
            '& .MuiListItemText-primary': { color: CORAL, fontWeight: 700 },
          },
          '&:hover': { backgroundColor: alpha(SLATE_100, 0.05) },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: SURFACE_HIGH,
            '& fieldset': { borderColor: alpha(SLATE_100, 0.12) },
            '&:hover fieldset': { borderColor: alpha(SLATE_100, 0.25) },
            '&.Mui-focused fieldset': { borderColor: CORAL, borderWidth: 2 },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: CORAL },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          color: SLATE_400,
          '&:hover': { color: SLATE_100, backgroundColor: alpha(SLATE_100, 0.08) },
          '&:active': { transform: 'scale(0.9)' },
          transition: 'transform 0.1s ease, color 0.15s ease, background-color 0.15s ease',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: alpha(SLATE_100, 0.08) },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: { fontFamily: '"Outfit", sans-serif', fontWeight: 700, fontSize: '1.2rem' },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: { padding: '16px 24px' },
      },
    },
  },
})
