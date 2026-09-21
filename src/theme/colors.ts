/**
 * Paleta da Sleeve: branco + azul (#045dd1).
 *
 * Etapa 3: tokens revisados para acessibilidade. Todas as combinações de
 * texto usadas no app atingem contraste WCAG AA (>= 4.5:1) — ver tabela em
 * docs/etapa-03.md. `borderStrong` existe para contornos de componentes
 * interativos (campos, chips), que precisam de >= 3:1 contra o fundo
 * (WCAG 1.4.11); `border` fica só para divisórias decorativas.
 */
export const colors = {
  bg: '#ffffff',
  surface: '#f4f7fc',
  surfaceAlt: '#dfe9fb',
  /** Divisórias decorativas (não carregam informação). */
  border: '#e0e6f0',
  /** Contorno de controles interativos: 3,5:1 sobre `surface`. */
  borderStrong: '#7a8597',
  text: '#0b1220',
  /** Texto secundário: 5,6:1 sobre `surface`, 6:1 sobre `bg`. */
  textMuted: '#5b6474',
  accent: '#045dd1',
  accentStrong: '#045dd1',
  /** Cor de texto/ícone sobre um preenchimento de `accent` (botões, chips ativos, toggle selecionado). */
  onAccent: '#ffffff',
  /** Fundo do estado "pressionado" de itens de lista/cartões. */
  pressed: '#e8eefa',
  danger: '#b3261e',
  dangerSurface: '#fdecea',
  success: '#1b7f3b',
  successSurface: '#e7f5ec',
  /** Fundo escurecido atrás de diálogos modais. */
  scrim: 'rgba(11, 18, 32, 0.55)',
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

/**
 * Tamanhos mínimos de alvo de toque (Lei de Fitts): quanto maior e mais
 * próximo o alvo, menor o tempo e o erro para acertá-lo. 48dp é o mínimo
 * recomendado pelo Material Design (Android) e fica acima dos 44pt das
 * diretrizes da Apple. Ações principais usam `primary` (56dp).
 */
export const touch = {
  min: 48,
  primary: 56,
} as const;

/**
 * Escala tipográfica. Nenhum texto do app fica abaixo de 12pt, e todos
 * respeitam o tamanho de fonte do sistema (allowFontScaling é o padrão do
 * React Native) — o limite `maxFontScale` só evita que o layout quebre em
 * escalas extremas.
 */
export const typography = {
  caption: 12,
  small: 13,
  body: 15,
  bodyLarge: 16,
  title: 20,
  heading: 24,
  maxFontScale: 1.6,
} as const;
