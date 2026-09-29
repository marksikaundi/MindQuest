export const colors = {
  primary: '#6C63FF',
  primaryDark: '#4E46C8',
  secondary: '#45C4B0',
  accent: '#FFC857',
  background: '#F5F7FF',
  surface: '#FFFFFF',
  text: '#24243E',
  muted: '#73738C',
  success: '#2F9E6B',
  danger: '#E85D75',
  coin: '#E8A317',
  star: '#F5B942',
  ink: '#1C1C33',
  line: '#E4E2F4',
  sky: '#D7E6FF',
} as const;

export const contrastColors = {
  ...colors,
  primary: '#2E25B8',
  primaryDark: '#1B166E',
  secondary: '#0E7A6B',
  accent: '#8A5A00',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  text: '#111111',
  muted: '#333333',
  success: '#0B6B3A',
  danger: '#9E1230',
  coin: '#8A5A00',
  star: '#8A5A00',
  ink: '#000000',
  line: '#111111',
  sky: '#FFFFFF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 12,
  md: 18,
  lg: 28,
  pill: 999,
} as const;

export const shadow = {
  shadowColor: '#241E4D',
  shadowOpacity: 0.12,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 6 },
  elevation: 4,
} as const;

export const touch = {
  min: 48,
  button: 54,
} as const;

export type Palette = { [Key in keyof typeof colors]: string };
