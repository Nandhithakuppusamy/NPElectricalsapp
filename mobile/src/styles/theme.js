import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  primary: '#1e3a8a',       // Deep Navy Blue
  primaryDark: '#0f172a',   // Slate 900
  primaryLight: '#2563eb',  // Royal Blue
  accent: '#f59e0b',        // Amber Gold
  accentLight: '#fef3c7',   // Light Amber
  success: '#10b981',       // Emerald Green
  successLight: '#d1fae5',  // Light Green
  danger: '#ef4444',        // Rose Red
  dangerLight: '#fee2e2',   // Light Red
  warning: '#f59e0b',       // Amber Warning
  warningLight: '#fffbeb',  // Amber Background
  background: '#f8fafc',    // Slate 50
  surface: '#ffffff',       // Pure White
  cardBorder: '#e2e8f0',    // Slate 200
  text: '#0f172a',          // Dark Charcoal Text
  textSecondary: '#64748b', // Slate 500
  textMuted: '#94a3b8',     // Slate 400
  border: '#cbd5e1',        // Slate 300
};

// Responsive Scaling Helper
export const isLargeScreen = width >= 768;
export const isTablet = width >= 600 && width < 1024;
export const isDesktop = width >= 1024;

export const SIZES = {
  // Spacing
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,

  // Typography (scaled for readability on all screens)
  fontXs: isLargeScreen ? 13 : 12,
  fontSm: isLargeScreen ? 15 : 14,
  fontMd: isLargeScreen ? 17 : 15,
  fontLg: isLargeScreen ? 19 : 17,
  fontXl: isLargeScreen ? 22 : 19,
  fontXxl: isLargeScreen ? 26 : 22,
  fontTitle: isLargeScreen ? 30 : 25,

  // Radii
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
  radiusFull: 9999,

  // Max width for desktop/laptop container
  maxContentWidth: 1024,
};

export const SHADOWS = {
  small: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
};
