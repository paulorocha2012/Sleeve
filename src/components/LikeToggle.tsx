import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius, spacing, touch, typography } from '@/theme/colors';
import { Verdict } from '@/types';

interface LikeToggleProps {
  value: Verdict | null;
  onChange: (value: Verdict) => void;
}

/**
 * Componente central do app: substitui qualquer sistema de notas por um
 * único par de opções binárias (gostei / não gostei). Reutilizado na tela
 * de Nova avaliação.
 *
 * Etapa 3: as duas opções são alvos grandes (altura mínima de 88dp, metade
 * da largura cada — Lei de Fitts), expostas como `radiogroup`/`radio` para
 * o leitor de tela, e o estado selecionado é indicado por cor, borda e
 * ícone de check ao mesmo tempo (não depende só de cor).
 */
export function LikeToggle({ value, onChange }: LikeToggleProps) {
  return (
    <View style={styles.row} accessibilityRole="radiogroup" accessibilityLabel="Seu veredito">
      <Option
        label="Gostei"
        icon="thumbs-up"
        selected={value === 'gostei'}
        onPress={() => onChange('gostei')}
      />
      <Option
        label="Não gostei"
        icon="thumbs-down"
        selected={value === 'nao_gostei'}
        onPress={() => onChange('nao_gostei')}
      />
    </View>
  );
}

function Option({
  label,
  icon,
  selected,
  onPress,
}: {
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  selected: boolean;
  onPress: () => void;
}) {
  const fg = selected ? colors.onAccent : colors.textMuted;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected, selected }}
      style={({ pressed }) => [
        styles.option,
        selected ? styles.optionSelected : styles.optionIdle,
        pressed && !selected && styles.optionPressed,
      ]}
    >
      {selected && (
        <View style={styles.check}>
          <Feather name="check-circle" size={16} color={colors.onAccent} />
        </View>
      )}
      <Feather name={icon} size={26} color={fg} />
      <Text style={[styles.label, { color: fg }]} maxFontSizeMultiplier={typography.maxFontScale}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  option: {
    flex: 1,
    minHeight: touch.min * 2 - 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 2,
  },
  optionSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  optionIdle: {
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
  },
  optionPressed: {
    backgroundColor: colors.pressed,
  },
  check: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  label: {
    fontSize: typography.body,
    fontWeight: '700',
  },
});
