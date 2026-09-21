import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { AlbumCover } from '@/components/AlbumCover';
import { VerdictBadge } from '@/components/VerdictBadge';
import { PrimaryButton } from '@/components/PrimaryButton';
import { EmptyState } from '@/components/EmptyState';
import { colors, radius, spacing, typography } from '@/theme/colors';
import { findAlbum } from '@/data/mockAlbums';
import { useReviews } from '@/state/ReviewsContext';
import { RootStackParamList } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AlbumDetail'>;

/**
 * Tela "Detalhe do álbum" (empilhada sobre as abas): dados do álbum e todas
 * as avaliações registradas para ele. Acessada a partir do Feed, do Buscar
 * ou da grade do Perfil; volta para a tela de origem pela seta, gesto ou
 * botão Voltar do Android.
 *
 * O botão "Avaliar este álbum" fica fixo no rodapé (zona do polegar), em
 * vez de no meio do conteúdo: continua no mesmo lugar e ao alcance mesmo
 * quando a lista de avaliações rola — Lei de Fitts aplicada à ação mais
 * importante da tela.
 */
export function AlbumDetailScreen({ route, navigation }: Props) {
  const { albumId } = route.params;
  const album = findAlbum(albumId);
  const { reviewsForAlbum, currentUser } = useReviews();

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
  const alreadyReviewed = reviews.some((r) => r.author === currentUser);

  return (
    <ScreenContainer edges={['top', 'bottom']}>
      <ScreenHeader title="Detalhe do álbum" left={back} />

      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.summary}>
            <AlbumCover letter={album.cover} size={112} />
            <Text style={styles.title} accessibilityRole="header">
              {album.title}
            </Text>
            <Text style={styles.subtitle}>
              {album.artist} · {album.year} · {album.type}
            </Text>

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
          return (
            <View
              style={[styles.reviewCard, mine && styles.reviewCardMine]}
              accessible
              accessibilityLabel={`${mine ? 'Sua avaliação' : `Avaliação de ${item.author}`}: ${
                item.verdict === 'gostei' ? 'gostei' : 'não gostei'
              }. ${item.text}`}
            >
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewAuthor}>{mine ? `${item.author} (você)` : item.author}</Text>
                <VerdictBadge verdict={item.verdict} />
              </View>
              <Text style={styles.reviewText}>{item.text}</Text>
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
          label={alreadyReviewed ? 'Avaliar de novo' : 'Avaliar este álbum'}
          icon="edit-3"
          accessibilityHint="Abre o formulário de nova avaliação"
          onPress={() => navigation.navigate('NewReview', { albumId })}
        />
      </View>
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
  stats: {
    flexDirection: 'row',
    width: '100%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
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
    gap: 6,
  },
  reviewCardMine: {
    borderColor: colors.accent,
    borderLeftWidth: 4,
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
  footer: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
});
