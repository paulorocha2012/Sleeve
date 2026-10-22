import React, { useEffect, useState } from 'react';
import { UNSTABLE_usePreventRemove as usePreventRemove } from '@react-navigation/native';
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
import { FeedbackType, useFeedback } from '@/feedback/FeedbackContext';
import { formatDay } from '@/utils/date';
import { RootStackParamList, Verdict } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'NewReview'>;

const MAX_LENGTH = 500;
/** Espera entre a última tecla e a gravação do rascunho, para não gravar a cada letra. */
const DRAFT_DELAY_MS = 400;

type PendingAction = Parameters<Props['navigation']['dispatch']>[0];

/** Como a tela vai fechar depois que o bloqueio de saída é liberado. */
interface ExitRequest {
  action?: PendingAction;
  message: string;
  type?: FeedbackType;
}

/**
 * Modal de avaliação (veredito + crítica). Funciona em dois modos:
 *
 * - **Nova:** o texto vai sendo salvo como rascunho no aparelho. Se o app
 *   fechar no meio, ao voltar o rascunho é recuperado. Publicar apaga o
 *   rascunho.
 * - **Edição** (`reviewId` na rota): abre com a avaliação já publicada e
 *   "Salvar" atualiza ela. Não usa rascunho.
 *
 * Sair com algo preenchido (×, Cancelar, gesto ou Voltar do Android) abre um
 * diálogo — `usePreventRemove` bloqueia a saída até a pessoa escolher.
 */
export function NewReviewScreen({ route, navigation }: Props) {
  const { albumId, reviewId } = route.params;
  const album = findAlbum(albumId);
  const { reviews, addReview, updateReview, draftFor, saveDraft, discardDraft } = useReviews();
  const { showFeedback } = useFeedback();

  const original = reviewId ? reviews.find((r) => r.id === reviewId) : undefined;
  const editing = original !== undefined;

  // O rascunho só é lido na abertura da tela.
  const [restored] = useState(() => (editing ? undefined : draftFor(albumId)));
  const [verdict, setVerdict] = useState<Verdict | null>(original?.verdict ?? restored?.verdict ?? null);
  const [text, setText] = useState(original?.text ?? restored?.text ?? '');
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [exit, setExit] = useState<ExitRequest | null>(null);

  const trimmed = text.trim();
  const hasContent = verdict !== null || trimmed.length > 0;
  const changed = editing && (verdict !== original.verdict || trimmed !== original.text);
  const canSave = verdict !== null && trimmed.length > 0 && (!editing || changed);

  const missing =
    verdict === null && trimmed.length === 0
      ? 'Escolha gostei ou não gostei e escreva sua crítica.'
      : verdict === null
        ? 'Falta escolher: gostei ou não gostei.'
        : trimmed.length === 0
          ? 'Falta escrever sua crítica.'
          : editing && !changed
            ? 'Nada mudou ainda.'
            : null;

  // Rascunho: grava um pouco depois da última alteração. Se a pessoa apagar
  // tudo, o rascunho salvo também é removido.
  useEffect(() => {
    if (editing || exit) return;
    const timer = setTimeout(() => {
      if (hasContent) saveDraft(albumId, verdict, text);
      else if (draftFor(albumId)) discardDraft(albumId);
    }, DRAFT_DELAY_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verdict, text, editing, exit]);

  // Bloqueia qualquer forma de sair enquanto houver algo a perder. Usa
  // `usePreventRemove` (e não o evento `beforeRemove`) porque só ele também
  // segura o gesto de arrastar o modal no iOS.
  usePreventRemove((editing ? changed : hasContent) && exit === null, ({ data }) => {
    setPendingAction(data.action);
  });

  // Sai só depois que o bloqueio foi liberado (estado `exit` já aplicado).
  useEffect(() => {
    if (!exit) return;
    if (exit.action) navigation.dispatch(exit.action);
    else navigation.goBack();
    showFeedback(exit.message, exit.type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exit]);

  function handleSave() {
    if (!verdict || !album || !canSave) return;
    if (editing) {
      updateReview(original.id, verdict, trimmed);
      setExit({ message: 'Avaliação atualizada' });
    } else {
      addReview(album.id, verdict, trimmed);
      discardDraft(album.id);
      setExit({ message: 'Avaliação publicada' });
    }
  }

  const title = editing ? 'Editar avaliação' : 'Nova avaliação';
  const close = {
    icon: 'x' as const,
    accessibilityLabel: 'Fechar',
    accessibilityHint: 'Volta ao detalhe do álbum',
    onPress: () => navigation.goBack(),
  };

  if (!album) {
    return (
      <ScreenContainer edges={['top']}>
        <ScreenHeader title={title} left={close} />
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
  const note = editing
    ? `Publicada em ${formatDay(original.createdAt)}${original.updatedAt ? `, editada em ${formatDay(original.updatedAt)}` : ''}.`
    : restored
      ? `Rascunho de ${formatDay(restored.updatedAt)} recuperado.`
      : null;

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenContainer edges={['top', 'bottom']}>
        <ScreenHeader title={title} left={close} />

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.albumRow} accessible accessibilityLabel={`Avaliando ${album.title}, de ${album.artist}`}>
            <AlbumCover letter={album.cover} size={48} />
            <View style={styles.albumInfo}>
              <Text style={styles.albumTitle}>{album.title}</Text>
              <Text style={styles.albumSubtitle}>{album.artist}</Text>
            </View>
          </View>

          {note && <Text style={styles.note}>{note}</Text>}

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
          <View style={styles.actions}>
            <PrimaryButton
              label="Cancelar"
              variant="outline"
              onPress={() => navigation.goBack()}
              accessibilityHint="Volta ao detalhe do álbum"
              style={styles.cancel}
            />
            <PrimaryButton
              label={editing ? 'Salvar' : 'Publicar'}
              icon={editing ? 'check' : 'send'}
              onPress={handleSave}
              disabled={!canSave}
              accessibilityHint={missing ?? (editing ? 'Salva as alterações' : 'Publica a avaliação')}
              style={styles.publish}
            />
          </View>
        </View>
      </ScreenContainer>

      {editing ? (
        <ConfirmDialog
          visible={pendingAction !== null}
          title="Descartar alterações?"
          message="A avaliação publicada continua como estava."
          confirmLabel="Descartar alterações"
          cancelLabel="Continuar editando"
          destructive
          onCancel={() => setPendingAction(null)}
          onConfirm={() => {
            const action = pendingAction ?? undefined;
            setPendingAction(null);
            setExit({ action, message: 'Alterações descartadas', type: 'info' });
          }}
        />
      ) : (
        <ConfirmDialog
          visible={pendingAction !== null}
          title="Sair da avaliação?"
          message="Você pode guardar o que escreveu como rascunho e terminar depois, mesmo que feche o app."
          confirmLabel="Guardar rascunho"
          secondaryLabel="Descartar"
          cancelLabel="Continuar editando"
          onCancel={() => setPendingAction(null)}
          onConfirm={() => {
            const action = pendingAction ?? undefined;
            setPendingAction(null);
            saveDraft(albumId, verdict, text);
            setExit({ action, message: 'Rascunho guardado', type: 'info' });
          }}
          onSecondary={() => {
            const action = pendingAction ?? undefined;
            setPendingAction(null);
            discardDraft(albumId);
            setExit({ action, message: 'Avaliação descartada', type: 'info' });
          }}
        />
      )}
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
    marginBottom: spacing.md,
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
  note: {
    fontSize: typography.small,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontSize: typography.small,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.sm,
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
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  // A ação principal fica à direita e com o dobro da largura (Lei de Fitts).
  cancel: {
    flex: 1,
    width: undefined,
  },
  publish: {
    flex: 2,
    width: undefined,
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
