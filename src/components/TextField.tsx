import React, { forwardRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius, spacing, touch, typography } from '@/theme/colors';

interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  /** Mensagem de erro em linguagem simples; quando presente, o campo entra no estado de erro. */
  error?: string;
  /** Texto de apoio exibido abaixo do campo quando não há erro. */
  helper?: string;
}

/**
 * Campo de texto com rótulo visível (não depende do placeholder, que some
 * ao digitar) e três estados visuais: normal, em foco (borda azul mais
 * grossa) e erro (borda vermelha + ícone + mensagem). O rótulo e o erro são
 * repassados ao leitor de tela, e a mensagem de erro usa
 * `accessibilityLiveRegion` para ser anunciada assim que aparece (Android).
 */
export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  { label, error, helper, onFocus, onBlur, multiline, ...inputProps },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const hasError = Boolean(error);

  return (
    <View style={styles.field}>
      <Text style={styles.label} maxFontSizeMultiplier={typography.maxFontScale}>
        {label}
      </Text>
      <TextInput
        ref={ref}
        {...inputProps}
        multiline={multiline}
        accessibilityLabel={label}
        accessibilityHint={hasError ? error : helper}
        placeholderTextColor={colors.textMuted}
        maxFontSizeMultiplier={typography.maxFontScale}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[
          styles.input,
          multiline && styles.multiline,
          focused && styles.inputFocused,
          hasError && styles.inputError,
        ]}
      />
      {hasError ? (
        <View style={styles.messageRow} accessibilityLiveRegion="polite">
          <Feather name="alert-circle" size={15} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : helper ? (
        <Text style={styles.helperText}>{helper}</Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  field: {
    width: '100%',
    gap: 6,
  },
  label: {
    fontSize: typography.small,
    fontWeight: '700',
    color: colors.text,
  },
  input: {
    width: '100%',
    minHeight: touch.min + 4,
    paddingVertical: 12,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: typography.body,
  },
  multiline: {
    minHeight: 140,
    lineHeight: 21,
    textAlignVertical: 'top',
  },
  inputFocused: {
    borderColor: colors.accent,
    borderWidth: 2,
    backgroundColor: colors.bg,
  },
  inputError: {
    borderColor: colors.danger,
    borderWidth: 2,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  errorText: {
    flex: 1,
    fontSize: typography.small,
    color: colors.danger,
    fontWeight: '600',
  },
  helperText: {
    fontSize: typography.caption,
    color: colors.textMuted,
  },
});
