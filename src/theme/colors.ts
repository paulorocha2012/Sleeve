/**
 * Paleta da Sleeve: branco + azul (#045dd1).
 */
export const colors = {
  bg: '#ffffff',
  surface: '#f4f7fc',
  surfaceAlt: '#dfe9fb',
  border: '#e0e6f0',
  text: '#0b1220',
  textMuted: '#66707f',
  accent: '#045dd1',
  accentStrong: '#045dd1',
  /** Cor de texto/ícone sobre um preenchimento de `accent` (botões, chips ativos, toggle selecionado). */
  onAccent: '#ffffff',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 14,
  pill: 20,
  round: 999,
} as const;
