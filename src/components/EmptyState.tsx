import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/theme/colors';
import { PrimaryButton } from './PrimaryButton';

interface EmptyStateProps {
  icon: React.ComponentProps<typeof Feather>['name'];
  title: string;
  message: string;
  /** Ação que tira o usuário do "beco sem saída" (ex.: ir para Buscar, limpar filtros). */
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Estado vazio padrão. Em vez de só "Nenhum resultado", explica o porquê e
 * oferece o próximo passo como botão — nenhuma tela vazia fica sem saída.
 */
export function EmptyState({ icon, title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Feather name={icon} size={26} color={colors.accent} />
      </View>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction && (
        <PrimaryButton label={actionLabel} onPress={onAction} variant="outline" style={styles.action} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.bodyLarge,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.body - 1,
    lineHeight: 20,
    color: colors.textMuted,
    textAlign: 'center',
  },
  action: {
    marginTop: spacing.md,
    maxWidth: 320,
  },
});
