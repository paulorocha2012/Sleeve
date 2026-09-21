import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius, spacing, touch, typography } from '@/theme/colors';

interface ChipGroupProps<T extends string> {
  /** Nome do grupo, anunciado pelo leitor de tela (ex.: "Filtrar por tipo"). */
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  /** Quando true, os chips dividem igualmente a largura disponível. */
  stretch?: boolean;
  style?: ViewStyle;
}

/**
 * Grupo de chips de seleção única (filtros do Buscar e do Perfil).
 * Acessibilidade: o grupo é um `radiogroup` e cada chip um `radio` com
 * `accessibilityState.checked`, então o leitor de tela anuncia
 * "Álbum, botão de opção, selecionado, 2 de 3". Visualmente, o estado
 * selecionado não depende só da cor: o chip ativo também ganha um ícone de
 * check (WCAG 1.4.1 — uso de cor).
 */
export function ChipGroup<T extends string>({ label, options, value, onChange, stretch, style }: ChipGroupProps<T>) {
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={label} style={[styles.row, style]}>
      {options.map((option) => {
        const selected = option === value;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected, selected }}
            accessibilityLabel={option}
            style={({ pressed }) => [
              styles.chip,
              stretch && styles.stretch,
              selected ? styles.chipSelected : styles.chipIdle,
              pressed && !selected && styles.chipPressed,
            ]}
          >
            {selected && <Feather name="check" size={15} color={colors.onAccent} />}
            <Text
              style={[styles.label, selected && styles.labelSelected]}
              maxFontSizeMultiplier={typography.maxFontScale}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    minHeight: touch.min,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.round,
    borderWidth: 1,
  },
  stretch: {
    flex: 1,
  },
  chipIdle: {
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
  },
  chipPressed: {
    backgroundColor: colors.pressed,
  },
  chipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  label: {
    fontSize: typography.small,
    fontWeight: '600',
    color: colors.textMuted,
  },
  labelSelected: {
    color: colors.onAccent,
    fontWeight: '700',
  },
});
