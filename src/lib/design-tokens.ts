export const colors = {
  primary: '#781E36',
  primaryHover: '#B83A4A',
  secondary: '#6B5B57',
  success: '#16A34A',
  warning: '#D97706',
  danger: '#DC2626',
  background: '#FAEDE6',
  surface: '#FFFFFF',
  border: '#E8CFC1',
  textPrimary: '#111827',
  textSecondary: '#6B5B57',
  accent: '#E8CFC1',
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '80px',
  '5xl': '96px',
} as const;

export const radius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '40px',
  full: '9999px',
} as const;

export const typography = {
  fontFamily: 'Inter, sans-serif',
  sizes: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '40px',
    '4xl': '56px',
  },
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1440px',
} as const;

export const container = {
  maxWidth: '1280px',
  padding: spacing.md,
} as const;
