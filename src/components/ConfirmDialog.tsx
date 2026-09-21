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
}

/**
 * Diálogo de confirmação usado antes de ações que perdem dados (descartar
 * uma avaliação em andamento, sair da conta). Implementado com `Modal` em
 * vez de `Alert.alert` para funcionar igual em Android, iOS e web.
 *
 * - `accessibilityViewIsModal` faz o VoiceOver ignorar o conteúdo por trás.
 * - Toque fora do cartão ou botão Voltar do Android = cancelar (ação segura).
 * - Os botões ficam empilhados em largura total; a ação segura ("Continuar
 *   editando") fica embaixo, mais perto do polegar, e a destrutiva em cima.
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
