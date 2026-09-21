import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius, spacing, touch, typography } from '@/theme/colors';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  /** `solid`: ação principal. `outline`: ação secundária. `danger`: ação destrutiva (ex.: sair da conta). */
  variant?: 'solid' | 'outline' | 'danger';
  icon?: React.ComponentProps<typeof Feather>['name'];
  style?: ViewStyle;
  disabled?: boolean;
  /** Mostra um indicador de progresso e bloqueia novos toques enquanto a ação está em andamento. */
  loading?: boolean;
  /** Texto exibido durante o carregamento (ex.: "Entrando…"). */
  loadingLabel?: string;
  accessibilityHint?: string;
}

/**
 * Botão de ação principal. Ocupa a largura toda e tem 56dp de altura
 * (`touch.primary`): pela Lei de Fitts, alvos grandes e largos são mais
 * rápidos de acertar, especialmente com o polegar. Estados visuais:
 * normal, pressionado (escurece levemente), desabilitado (opacidade) e
 * carregando (spinner + texto). Os mesmos estados são expostos ao leitor
 * de tela via `accessibilityState`.
 */
export function PrimaryButton({
  label,
  onPress,
  variant = 'solid',
  icon,
  style,
  disabled,
  loading,
  loadingLabel,
  accessibilityHint,
}: PrimaryButtonProps) {
  const inactive = disabled || loading;
  const fg = variant === 'solid' ? colors.onAccent : variant === 'danger' ? colors.danger : colors.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={loading && loadingLabel ? loadingLabel : label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      style={({ pressed }) => [
        styles.base,
        variant === 'solid' && styles.solid,
        variant === 'outline' && styles.outline,
        variant === 'danger' && styles.danger,
        disabled && !loading && styles.disabled,
        pressed && !inactive && (variant === 'solid' ? styles.solidPressed : styles.lightPressed),
        style,
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={fg} />
        ) : (
          icon && <Feather name={icon} size={18} color={fg} />
        )}
        <Text style={[styles.label, { color: fg }]} maxFontSizeMultiplier={typography.maxFontScale}>
          {loading && loadingLabel ? loadingLabel : label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    minHeight: touch.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  solid: {
    backgroundColor: colors.accent,
  },
  solidPressed: {
    backgroundColor: '#034aa7',
  },
  outline: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  danger: {
    backgroundColor: colors.dangerSurface,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  lightPressed: {
    backgroundColor: colors.pressed,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    fontSize: typography.bodyLarge,
    fontWeight: '700',
  },
});
