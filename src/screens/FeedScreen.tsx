import React, { useRef } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp, useNavigation, useScrollToTop } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { AlbumCover } from '@/components/AlbumCover';
import { VerdictBadge } from '@/components/VerdictBadge';
import { EmptyState } from '@/components/EmptyState';
import { colors, radius, spacing, typography } from '@/theme/colors';
import { useReviews } from '@/state/ReviewsContext';
import { findAlbum } from '@/data/mockAlbums';
import { MainTabParamList, RootStackParamList, Review } from '@/types';

type FeedNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Feed'>,
  NativeStackNavigationProp<RootStackParamList>
>;

/**
 * Tela "Feed" (aba 1): avaliações mais recentes de todos os usuários.
 * Cada cartão inteiro é tocável e leva ao Detalhe do álbum. Tocar de novo
 * na aba Feed já ativa rola a lista de volta ao topo (`useScrollToTop`).
 */
export function FeedScreen() {
  const navigation = useNavigation<FeedNavigation>();
  const { reviews, currentUser } = useReviews();
  const listRef = useRef<FlatList<Review>>(null);
  useScrollToTop(listRef);

  return (
    <ScreenContainer noPadding edges={['top']}>
      <View style={styles.header}>
        <ScreenHeader title="Feed" variant="large" />
      </View>
      <FlatList
        ref={listRef}
        data={reviews}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ReviewCard
            review={item}
            isMine={item.author === currentUser}
            onPress={() => navigation.navigate('AlbumDetail', { albumId: item.albumId })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="music"
            title="Nenhuma avaliação ainda"
            message="Quando alguém avaliar um álbum, a avaliação aparece aqui. Que tal começar?"
            actionLabel="Buscar um álbum"
            onAction={() => navigation.navigate('Buscar')}
          />
        }
      />
    </ScreenContainer>
  );
}

function ReviewCard({ review, isMine, onPress }: { review: Review; isMine: boolean; onPress: () => void }) {
  const album = findAlbum(review.albumId);
  if (!album) return null;

  const author = isMine ? 'você' : review.author;
  const verdict = review.verdict === 'gostei' ? 'gostou' : 'não gostou';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${album.title}, de ${album.artist}. Avaliado por ${author}: ${verdict}. ${review.text}`}
      accessibilityHint="Abre o detalhe do álbum"
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.cardHeader}>
        <AlbumCover letter={album.cover} size={48} />
        <View style={styles.cardHeaderInfo}>
          <Text style={styles.albumTitle} numberOfLines={2}>
            {album.title}
          </Text>
          <Text style={styles.albumSubtitle} numberOfLines={2}>
            {album.artist} · avaliado por {isMine ? 'você' : review.author}
          </Text>
        </View>
        <VerdictBadge verdict={review.verdict} />
      </View>
      <Text style={styles.reviewText} numberOfLines={3}>
        {review.text}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  cardPressed: {
    backgroundColor: colors.pressed,
    borderColor: colors.accent,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  cardHeaderInfo: {
    flex: 1,
    minWidth: 0,
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
  reviewText: {
    fontSize: typography.body - 1,
    color: colors.text,
    lineHeight: 20,
  },
});
