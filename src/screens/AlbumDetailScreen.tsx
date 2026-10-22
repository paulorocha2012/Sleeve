import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { AlbumCover } from '@/components/AlbumCover';
import { VerdictBadge } from '@/components/VerdictBadge';
import { PrimaryButton } from '@/components/PrimaryButton';
import { EmptyState } from '@/components/EmptyState';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { AlbumTimeline, TimelineEvent } from '@/components/AlbumTimeline';
import { colors, radius, spacing, touch, typography } from '@/theme/colors';
import { findAlbum } from '@/data/mockAlbums';
import { useReviews } from '@/state/ReviewsContext';
import { useDiary } from '@/state/DiaryContext';
import { useFeedback } from '@/feedback/FeedbackContext';
import { formatDay } from '@/utils/date';
import { Listen, Review, RootStackParamList } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AlbumDetail'>;

/** Quantos eventos da linha do tempo aparecem antes de "Mostrar tudo". */
const TIMELINE_PREVIEW = 4;

/**
 * Detalhe do álbum: dados do disco, a história do usuário com ele (escutas,
 * avaliação, lista "Quero ouvir") e as avaliações de todo mundo.
 * O botão principal fica fixo no rodapé, na zona do polegar.
 */
export function AlbumDetailScreen({ route, navigation }: Props) {
  const { albumId } = route.params;
  const album = findAlbum(albumId);
  const { reviewsForAlbum, myReviewFor, draftFor, deleteReview, currentUser } = useReviews();
  const { listensFor, addListen, removeListen, isWanted, toggleWant, myWantList } = useDiary();
  const { showFeedback } = useFeedback();

  const [showAll, setShowAll] = useState(false);
  const [listenToRemove, setListenToRemove] = useState<Listen | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);

  const back = { icon: 'arrow-left' as const, accessibilityLabel: 'Voltar', onPress: () => navigation.goBack() };

  if (!album) {
    return (
      <ScreenContainer edges={['top']}>
        <ScreenHeader title="Detalhe do álbum" left={back} />
        <EmptyState
          icon="alert-circle"
          title="Álbum não encontrado"
          message="Esse álbum não está mais disponível no catálogo."
          actionLabel="Voltar"
          onAction={() => navigation.goBack()}
        />
      </ScreenContainer>
    );
  }

  const reviews = reviewsForAlbum(albumId);
  const likedCount = reviews.filter((r) => r.verdict === 'gostei').length;
  const dislikedCount = reviews.length - likedCount;
  const myReview = myReviewFor(albumId);
  const draft = draftFor(albumId);
  const listens = listensFor(albumId);
  const wanted = isWanted(albumId);
  const wantItem = myWantList.find((w) => w.albumId === albumId);

  // Monta a linha do tempo juntando tudo que o usuário fez com o álbum.
  const events: TimelineEvent[] = [
    ...listens.map((l, i) => ({
      id: l.id,
      date: l.date,
      icon: 'headphones' as const,
      text: i === listens.length - 1 ? 'Primeira escuta' : 'Ouviu de novo',
      onRemove: () => setListenToRemove(l),
    })),
    ...(myReview
      ? [{
          id: `review-${myReview.id}`,
          date: myReview.createdAt,
          icon: (myReview.verdict === 'gostei' ? 'thumbs-up' : 'thumbs-down') as TimelineEvent['icon'],
          text: myReview.verdict === 'gostei' ? 'Avaliou: gostei' : 'Avaliou: não gostei',
        }]
      : []),
    ...(myReview?.updatedAt
      ? [{ id: `edit-${myReview.id}`, date: myReview.updatedAt, icon: 'edit-3' as const, text: 'Editou a avaliação' }]
      : []),
    ...(wantItem
      ? [{ id: 'want', date: wantItem.addedAt, icon: 'bookmark' as const, text: 'Guardou para ouvir depois' }]
      : []),
  ].sort((a, b) => b.date.localeCompare(a.date));

  const visibleEvents = showAll ? events : events.slice(0, TIMELINE_PREVIEW);

  const summary =
    listens.length === 0
      ? 'Você ainda não registrou nenhuma escuta.'
      : `Ouvido ${listens.length === 1 ? '1 vez' : `${listens.length} vezes`}. Primeira escuta em ${formatDay(
          listens[listens.length - 1].date,
        )}.`;

  const footerLabel = myReview ? 'Editar sua avaliação' : draft ? 'Continuar rascunho' : 'Avaliar este álbum';

  return (
    <ScreenContainer edges={['top', 'bottom']}>
      <ScreenHeader title="Detalhe do álbum" left={back} />

      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <View style={styles.summary}>
              <AlbumCover letter={album.cover} size={112} />
              <Text style={styles.title} accessibilityRole="header">
                {album.title}
              </Text>
              <Text style={styles.subtitle}>
                {album.artist} · {album.year} · {album.type}
              </Text>
            </View>

            <View style={styles.quickActions}>
              <PrimaryButton
                label="Ouvi hoje"
                icon="headphones"
                variant="outline"
                style={styles.quickButton}
                accessibilityHint="Registra uma escuta com a data de hoje"
                onPress={() => {
                  addListen(albumId);
                  showFeedback('Escuta registrada');
                }}
              />
              <PrimaryButton
                label={wanted ? 'Na sua lista' : 'Quero ouvir'}
                icon={wanted ? 'check' : 'bookmark'}
                variant="outline"
                style={styles.quickButton}
                accessibilityHint={wanted ? 'Tira o álbum da lista Quero ouvir' : 'Guarda o álbum para ouvir depois'}
                onPress={() => {
                  const nowWanted = toggleWant(albumId);
                  showFeedback(nowWanted ? 'Guardado em Quero ouvir' : 'Removido de Quero ouvir', 'info');
                }}
              />
            </View>

            <Text style={styles.sectionLabel} accessibilityRole="header">
              Sua história com o álbum
            </Text>
            <Text style={styles.historySummary}>{summary}</Text>
            {events.length > 0 && <AlbumTimeline events={visibleEvents} />}
            {events.length > TIMELINE_PREVIEW && (
              <Pressable
                onPress={() => setShowAll((v) => !v)}
                accessibilityRole="button"
                style={({ pressed }) => [styles.textButton, pressed && styles.textButtonPressed]}
              >
                <Text style={styles.textButtonLabel}>
                  {showAll ? 'Mostrar menos' : `Mostrar tudo (${events.length})`}
                </Text>
              </Pressable>
            )}

            <View
              style={styles.stats}
              accessible
              accessibilityLabel={`${reviews.length} avaliações: ${likedCount} gostei, ${dislikedCount} não gostei`}
            >
              <Stat value={reviews.length} label="avaliações" />
              <Stat value={likedCount} label="gostei" accent />
              <Stat value={dislikedCount} label="não gostei" />
            </View>

            <Text style={styles.sectionLabel} accessibilityRole="header">
              Avaliações
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const mine = item.author === currentUser;
          const verdictText = item.verdict === 'gostei' ? 'gostei' : 'não gostei';
          return (
            <View style={[styles.reviewCard, mine && styles.reviewCardMine]}>
              <View
                accessible
                accessibilityLabel={`${mine ? 'Sua avaliação' : `Avaliação de ${item.author}`}: ${verdictText}. ${item.text}`}
                style={styles.reviewBody}
              >
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewAuthor}>{mine ? `${item.author} (você)` : item.author}</Text>
                  <VerdictBadge verdict={item.verdict} />
                </View>
                <Text style={styles.reviewText}>{item.text}</Text>
                <Text style={styles.reviewDate}>
                  {formatDay(item.createdAt)}
                  {item.updatedAt ? ' · editada' : ''}
                </Text>
              </View>

              {mine && (
                <View style={styles.reviewActions}>
                  <SmallAction
                    label="Editar"
                    onPress={() => navigation.navigate('NewReview', { albumId, reviewId: item.id })}
                  />
                  <SmallAction label="Apagar" danger onPress={() => setReviewToDelete(item)} />
                </View>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            icon="message-circle"
            title="Ainda sem avaliações"
            message="Seja a primeira pessoa a dizer se gostou ou não deste álbum."
          />
        }
      />

      <View style={styles.footer}>
        <PrimaryButton
          label={footerLabel}
          icon="edit-3"
          accessibilityHint={myReview ? 'Abre sua avaliação para editar' : 'Abre o formulário de avaliação'}
          onPress={() => navigation.navigate('NewReview', { albumId, reviewId: myReview?.id })}
        />
      </View>

      <ConfirmDialog
        visible={listenToRemove !== null}
        title="Remover esta escuta?"
        message={listenToRemove ? `A escuta de ${formatDay(listenToRemove.date)} sai do seu histórico.` : ''}
        confirmLabel="Remover"
        destructive
        onCancel={() => setListenToRemove(null)}
        onConfirm={() => {
          if (listenToRemove) removeListen(listenToRemove.id);
          setListenToRemove(null);
          showFeedback('Escuta removida', 'info');
        }}
      />

      <ConfirmDialog
        visible={reviewToDelete !== null}
        title="Apagar sua avaliação?"
        message="O veredito e a crítica serão apagados deste aparelho. Suas escutas continuam no histórico."
        confirmLabel="Apagar"
        destructive
        onCancel={() => setReviewToDelete(null)}
        onConfirm={() => {
          if (reviewToDelete) deleteReview(reviewToDelete.id);
          setReviewToDelete(null);
          showFeedback('Avaliação apagada', 'info');
        }}
      />
    </ScreenContainer>
  );
}

function Stat({ value, label, accent }: { value: number; label: string; accent?: boolean }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, accent && { color: colors.accentStrong }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SmallAction({ label, onPress, danger }: { label: string; onPress: () => void; danger?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label} sua avaliação`}
      style={({ pressed }) => [styles.smallAction, pressed && styles.textButtonPressed]}
    >
      <Text style={[styles.smallActionLabel, danger && { color: colors.danger }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  summary: {
    alignItems: 'center',
  },
  title: {
    marginTop: spacing.md,
    fontSize: typography.title,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 4,
    fontSize: typography.small + 1,
    color: colors.textMuted,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  quickButton: {
    flex: 1,
    width: undefined,
    paddingHorizontal: spacing.sm,
  },
  historySummary: {
    fontSize: typography.body - 1,
    color: colors.text,
    marginBottom: spacing.md,
  },
  textButton: {
    alignSelf: 'flex-start',
    minHeight: touch.min,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
  },
  textButtonPressed: {
    backgroundColor: colors.pressed,
  },
  textButtonLabel: {
    fontSize: typography.small + 1,
    fontWeight: '700',
    color: colors.accentStrong,
  },
  stats: {
    flexDirection: 'row',
    width: '100%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.title - 2,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  sectionLabel: {
    alignSelf: 'flex-start',
    fontSize: typography.caption,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  list: {
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  reviewCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  reviewCardMine: {
    borderColor: colors.accent,
    borderLeftWidth: 4,
  },
  reviewBody: {
    gap: 6,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  reviewAuthor: {
    flex: 1,
    fontSize: typography.small + 1,
    fontWeight: '700',
    color: colors.text,
  },
  reviewText: {
    fontSize: typography.body - 1,
    color: colors.text,
    lineHeight: 20,
  },
  reviewDate: {
    fontSize: typography.caption,
    color: colors.textMuted,
  },
  reviewActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.xs,
    marginTop: spacing.xs,
    marginBottom: -spacing.sm,
    marginRight: -spacing.sm,
  },
  smallAction: {
    minHeight: touch.min,
    minWidth: touch.min,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
  },
  smallActionLabel: {
    fontSize: typography.small + 1,
    fontWeight: '700',
    color: colors.accentStrong,
  },
  footer: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
});
