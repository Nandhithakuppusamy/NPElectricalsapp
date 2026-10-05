import { createTheme } from '@mui/material/styles';

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // Blue 600
      light: '#3b82f6',
      dark: '#1d4ed8',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#f59e0b', // Amber 500
      light: '#fbbf24',
      dark: '#d97706',
      contrastText: '#0f172a'
    },
    success: {
      main: '#10b981', // Emerald 500
      light: '#34d399',
      dark: '#059669',
      contrastText: '#ffffff'
    },
    error: {
      main: '#ef4444', // Red 500
      light: '#f87171',
      dark: '#dc2626',
      contrastText: '#ffffff'
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff'
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b'
    }
  },
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'sans-serif'
    ].join(','),
    h1: {
      fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
      fontWeight: 900,
      letterSpacing: '-0.02em',
      lineHeight: 1.2
    },
    h2: {
      fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
      fontWeight: 800,
      letterSpacing: '-0.01em',
      lineHeight: 1.25
    },
    h3: {
      fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
      fontWeight: 700,
      lineHeight: 1.3
    },
    h4: {
      fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
      fontWeight: 700,
      lineHeight: 1.35
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 700
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 700
    },
    body1: {
      fontSize: '0.9375rem', // 15px
      lineHeight: 1.5
    },
    body2: {
      fontSize: '0.8125rem', // 13px
      lineHeight: 1.45
    },
    caption: {
      fontSize: '0.75rem', // 12px
      lineHeight: 1.4
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      fontSize: '0.875rem'
    }
  },
  shape: {
    borderRadius: 14
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 700,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '0.8125rem',
          padding: '12px 16px'
        },
        head: {
          fontWeight: 700,
          backgroundColor: '#f8fafc',
          color: '#475569',
          textTransform: 'uppercase',
          fontSize: '0.72rem',
          letterSpacing: '0.05em'
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20
        }
      }
    }
  }
});
