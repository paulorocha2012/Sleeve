import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme/colors';
import { PrimaryButton } from './PrimaryButton';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  /** Pinta o botão de confirmação como ação destrutiva (vermelho). */
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  /** Terceira opção, opcional (ex.: "Descartar rascunho"). Aparece entre as outras duas, em vermelho. */
  secondaryLabel?: string;
  onSecondary?: () => void;
}

/**
 * Diálogo de confirmação antes de ações que perdem dados. Usa `Modal` (e
 * não `Alert.alert`) para funcionar igual em Android, iOS e web. Tocar fora
 * ou o Voltar do Android = cancelar. A ação segura fica embaixo, mais perto
 * do polegar.
 */
export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancelar',
  destructive,
  onConfirm,
  onCancel,
  secondaryLabel,
  onSecondary,
}: ConfirmDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable
        style={styles.scrim}
        onPress={onCancel}
        accessibilityLabel="Fechar diálogo"
        accessibilityRole="button"
      >
        <Pressable style={styles.card} accessibilityViewIsModal onPress={() => undefined} accessible={false}>
          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <PrimaryButton
              label={confirmLabel}
              onPress={onConfirm}
              variant={destructive ? 'danger' : 'solid'}
            />
            {secondaryLabel && onSecondary && (
              <PrimaryButton label={secondaryLabel} onPress={onSecondary} variant="danger" />
            )}
            <PrimaryButton label={cancelLabel} onPress={onCancel} variant="outline" />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: colors.scrim,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.bg,
    borderRadius: radius.lg + 4,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.title - 2,
    fontWeight: '700',
    color: colors.text,
  },
  message: {
    fontSize: typography.body,
    lineHeight: 22,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  actions: {
    gap: spacing.sm,
  },
});
