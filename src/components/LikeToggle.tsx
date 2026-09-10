import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/theme/colors';
import { Verdict } from '@/types';

interface LikeToggleProps {
  value: Verdict | null;
  onChange: (value: Verdict) => void;
}

/**
 * Componente central do app: substitui qualquer sistema de notas por um
 * único par de opções binárias (gostei / não gostei). Reutilizado na tela
 * de Nova avaliação.
 */
export function LikeToggle({ value, onChange }: LikeToggleProps) {
  return (
    <View style={styles.row}>
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
  return (
    <Pressable
      onPress={onPress}
      style={[styles.option, selected ? styles.optionSelected : styles.optionIdle]}
    >
      <Feather name={icon} size={22} color={selected ? colors.onAccent : colors.textMuted} />
      <Text style={[styles.label, { color: selected ? colors.onAccent : colors.textMuted }]}>{label}</Text>
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
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 16,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.lg,
  },
  optionSelected: {
    backgroundColor: colors.accent,
  },
  optionIdle: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
  },
});
