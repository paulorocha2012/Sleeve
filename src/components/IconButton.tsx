import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius, touch } from '@/theme/colors';

interface IconButtonProps {
  icon: React.ComponentProps<typeof Feather>['name'];
  /** Obrigatório: é o que o leitor de tela anuncia, já que o botão não tem texto visível. */
  accessibilityLabel: string;
  accessibilityHint?: string;
  onPress: () => void;
  color?: string;
  size?: number;
  style?: ViewStyle;
}

/**
 * Botão só de ícone (voltar, fechar, configurações). O ícone tem 22dp, mas a
 * área tocável tem sempre 48x48dp (`touch.min`) — Lei de Fitts: o alvo real
 * é bem maior que o desenho, o que reduz toques errados nos cantos da tela.
 */
export function IconButton({
  icon,
  accessibilityLabel,
  accessibilityHint,
  onPress,
  color = colors.text,
  size = 22,
  style,
}: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      hitSlop={4}
      style={({ pressed }) => [styles.base, pressed && styles.pressed, style]}
    >
      <Feather name={icon} size={size} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: touch.min,
    height: touch.min,
    borderRadius: radius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    backgroundColor: colors.pressed,
  },
});
