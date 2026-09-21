import React, { useEffect, useRef, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { AlbumCover } from '@/components/AlbumCover';
import { LikeToggle } from '@/components/LikeToggle';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { EmptyState } from '@/components/EmptyState';
import { colors, radius, spacing, typography } from '@/theme/colors';
import { findAlbum } from '@/data/mockAlbums';
import { useReviews } from '@/state/ReviewsContext';
import { useFeedback } from '@/feedback/FeedbackContext';
import { RootStackParamList, Verdict } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'NewReview'>;

const MAX_LENGTH = 500;

type PendingAction = Parameters<Props['navigation']['dispatch']>[0];

/**
 * Tela "Nova avaliação" (modal sobre o Detalhe do álbum): veredito binário
 * + crítica em texto livre — sem notas.
 *
 * Navegação e feedback desta etapa:
 * - "Fechar" (x), gesto de arrastar o modal ou botão Voltar do Android com
 *   um rascunho preenchido abrem um diálogo "Descartar avaliação?" — o
 *   usuário não perde texto por um toque acidental (`beforeRemove`);
 * - o botão "Publicar" fica fixo no rodapé e, enquanto está desabilitado,
 *   uma linha logo acima diz exatamente o que falta preencher;
 * - ao publicar, volta ao Detalhe (que já lista a nova avaliação) e mostra
 *   a confirmação "Avaliação publicada".
 */
export function NewReviewScreen({ route, navigation }: Props) {
  const { albumId } = route.params;
  const album = findAlbum(albumId);
  const { addReview } = useReviews();
  const { showFeedback } = useFeedback();

  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [text, setText] = useState('');
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const saved = useRef(false);

  const hasDraft = verdict !== null || text.trim().length > 0;
  const canSave = verdict !== null && text.trim().length > 0;

  const missing =
    verdict === null && text.trim().length === 0
      ? 'Escolha gostei ou não gostei e escreva sua crítica.'
      : verdict === null
        ? 'Falta escolher: gostei ou não gostei.'
        : text.trim().length === 0
          ? 'Falta escrever sua crítica.'
          : null;

  // Intercepta qualquer forma de sair da tela (botão, gesto, Voltar do Android)
  // enquanto houver rascunho não publicado.
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (saved.current || !hasDraft) return;
      e.preventDefault();
      setPendingAction(e.data.action);
    });
    return unsubscribe;
  }, [navigation, hasDraft]);

  function handleSave() {
    if (!verdict || !album || !canSave) return;
    addReview(album.id, verdict, text.trim());
    saved.current = true;
    navigation.goBack();
    showFeedback('Avaliação publicada');
  }

  const close = { icon: 'x' as const, accessibilityLabel: 'Fechar', accessibilityHint: 'Volta ao detalhe do álbum', onPress: () => navigation.goBack() };

  if (!album) {
    return (
      <ScreenContainer edges={['top']}>
        <ScreenHeader title="Nova avaliação" left={close} />
        <EmptyState
          icon="alert-circle"
          title="Álbum não encontrado"
          message="Não foi possível abrir este álbum para avaliação."
          actionLabel="Voltar"
          onAction={() => navigation.goBack()}
        />
      </ScreenContainer>
    );
  }

  const remaining = MAX_LENGTH - text.length;

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenContainer edges={['top', 'bottom']}>
        <ScreenHeader title="Nova avaliação" left={close} />

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.albumRow} accessible accessibilityLabel={`Avaliando ${album.title}, de ${album.artist}`}>
            <AlbumCover letter={album.cover} size={48} />
            <View style={styles.albumInfo}>
              <Text style={styles.albumTitle}>{album.title}</Text>
              <Text style={styles.albumSubtitle}>{album.artist}</Text>
            </View>
          </View>

          <Text style={styles.sectionLabel} accessibilityRole="header">
            Sua avaliação
          </Text>
          <LikeToggle value={verdict} onChange={setVerdict} />

          <View style={styles.textBlock}>
            <TextField
              label="Sua crítica"
              value={text}
              onChangeText={(value) => setText(value.slice(0, MAX_LENGTH))}
              placeholder="O que você achou deste álbum?"
              multiline
              maxLength={MAX_LENGTH}
            />
            <Text
              style={[styles.counter, remaining <= 50 && styles.counterWarning]}
              accessibilityLabel={`${text.length} de ${MAX_LENGTH} caracteres usados`}
            >
              {text.length}/{MAX_LENGTH}
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          {missing && (
            <View style={styles.hintRow} accessibilityLiveRegion="polite">
              <Feather name="info" size={15} color={colors.textMuted} />
              <Text style={styles.hint}>{missing}</Text>
            </View>
          )}
          <PrimaryButton
            label="Publicar avaliação"
            icon="send"
            onPress={handleSave}
            disabled={!canSave}
            accessibilityHint={missing ?? 'Publica e volta ao detalhe do álbum'}
          />
        </View>
      </ScreenContainer>

      <ConfirmDialog
        visible={pendingAction !== null}
        title="Descartar avaliação?"
        message="Você começou a avaliar este álbum. Se sair agora, o que escreveu será perdido."
        confirmLabel="Descartar"
        cancelLabel="Continuar editando"
        destructive
        onCancel={() => setPendingAction(null)}
        onConfirm={() => {
          const action = pendingAction;
          setPendingAction(null);
          saved.current = true;
          if (action) navigation.dispatch(action);
          showFeedback('Avaliação descartada', 'info');
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    paddingBottom: spacing.lg,
  },
  albumRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  albumInfo: {
    flex: 1,
  },
  albumTitle: {
    fontSize: typography.body,
    fontWeight: '700',
    color: colors.text,
  },
  albumSubtitle: {
    fontSize: typography.small,
    color: colors.textMuted,
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: typography.small,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  textBlock: {
    marginTop: spacing.xl,
  },
  counter: {
    textAlign: 'right',
    fontSize: typography.caption,
    color: colors.textMuted,
    marginTop: 6,
  },
  counterWarning: {
    color: colors.danger,
    fontWeight: '700',
  },
  footer: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hint: {
    flex: 1,
    fontSize: typography.small,
    color: colors.textMuted,
  },
});
