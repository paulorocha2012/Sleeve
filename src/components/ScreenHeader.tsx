import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, touch, typography } from '@/theme/colors';
import { IconButton } from './IconButton';

interface HeaderAction {
  icon: React.ComponentProps<typeof IconButton>['icon'];
  accessibilityLabel: string;
  accessibilityHint?: string;
  onPress: () => void;
}

interface ScreenHeaderProps {
  title: string;
  /** Ação à esquerda — normalmente "Voltar" (seta) ou "Fechar" (x) em modais. */
  left?: HeaderAction;
  /** Ação à direita — ex.: engrenagem de Configurações no Perfil. */
  right?: HeaderAction;
  /** `large`: título grande alinhado à esquerda (telas de aba). `compact`: título centralizado (telas empilhadas). */
  variant?: 'large' | 'compact';
}

/**
 * Cabeçalho padrão de todas as telas. O título é marcado como
 * `accessibilityRole="header"`, o que permite a quem usa TalkBack/VoiceOver
 * pular direto entre títulos, e as ações usam `IconButton` (48x48dp) com
 * rótulo falado. Os dois lados reservam a mesma largura para o título ficar
 * realmente centralizado.
 */
export function ScreenHeader({ title, left, right, variant = 'compact' }: ScreenHeaderProps) {
  if (variant === 'large') {
    return (
      <View style={styles.largeRow}>
        <Text style={styles.largeTitle} accessibilityRole="header" maxFontSizeMultiplier={typography.maxFontScale}>
          {title}
        </Text>
        {right && <IconButton {...right} />}
      </View>
    );
  }

  return (
    <View style={styles.compactRow}>
      <View style={styles.side}>{left && <IconButton {...left} />}</View>
      <Text
        style={styles.compactTitle}
        accessibilityRole="header"
        numberOfLines={1}
        maxFontSizeMultiplier={typography.maxFontScale}
      >
        {title}
      </Text>
      <View style={[styles.side, styles.sideRight]}>{right && <IconButton {...right} />}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  largeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: touch.min,
    marginBottom: spacing.md,
  },
  largeTitle: {
    fontSize: typography.heading,
    fontWeight: '700',
    color: colors.text,
  },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: touch.min,
    marginBottom: spacing.md,
    marginHorizontal: -spacing.md,
  },
  side: {
    width: touch.min,
    alignItems: 'flex-start',
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  compactTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: typography.bodyLarge,
    fontWeight: '700',
    color: colors.text,
  },
});
