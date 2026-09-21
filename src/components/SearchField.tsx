import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius, spacing, touch, typography } from '@/theme/colors';
import { IconButton } from './IconButton';

interface SearchFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

/**
 * Campo de busca reutilizado na tela Buscar. Mostra estado de foco (borda
 * azul) e, quando há texto, um botão "Limpar busca" de 48dp — evita que o
 * usuário precise apagar caractere por caractere.
 */
export function SearchField({ value, onChangeText, placeholder }: SearchFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrapper, focused && styles.wrapperFocused]}>
      <Feather name="search" size={18} color={focused ? colors.accent : colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? 'Buscar álbum ou artista'}
        placeholderTextColor={colors.textMuted}
        accessibilityLabel="Buscar álbum ou artista"
        accessibilityHint="Os resultados são atualizados enquanto você digita"
        style={styles.input}
        autoCorrect={false}
        returnKeyType="search"
        maxFontSizeMultiplier={typography.maxFontScale}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {value.length > 0 && (
        <IconButton
          icon="x-circle"
          size={18}
          color={colors.textMuted}
          accessibilityLabel="Limpar busca"
          onPress={() => onChangeText('')}
          style={styles.clear}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: touch.min + 4,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.md,
    paddingLeft: spacing.lg,
    paddingRight: spacing.xs,
  },
  wrapperFocused: {
    borderColor: colors.accent,
    borderWidth: 2,
    backgroundColor: colors.bg,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: typography.body,
    paddingVertical: 12,
  },
  clear: {
    marginLeft: -spacing.xs,
  },
});
