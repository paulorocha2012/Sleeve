import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { AlbumCover } from '@/components/AlbumCover';
import { VerdictBadge } from '@/components/VerdictBadge';
import { colors, spacing } from '@/theme/colors';
import { useReviews } from '@/state/ReviewsContext';
import { findAlbum } from '@/data/mockAlbums';
import { MainTabParamList, RootStackParamList, Review } from '@/types';

type FeedNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Feed'>,
  NativeStackNavigationProp<RootStackParamList>
>;

/** Tela "Feed": lista as avaliações mais recentes de todos os usuários. */
export function FeedScreen() {
  const navigation = useNavigation<FeedNavigation>();
  const { reviews } = useReviews();

  return (
    <ScreenContainer noPadding edges={['top']}>
      <Text style={styles.heading}>Feed</Text>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ReviewCard review={item} onPress={() => navigation.navigate('AlbumDetail', { albumId: item.albumId })} />
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma avaliação ainda.</Text>}
      />
    </ScreenContainer>
  );
}

function ReviewCard({ review, onPress }: { review: Review; onPress: () => void }) {
  const album = findAlbum(review.albumId);
  if (!album) return null;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <AlbumCover letter={album.cover} size={44} />
        <View style={styles.cardHeaderInfo}>
          <Text style={styles.albumTitle} numberOfLines={1}>
            {album.title}
          </Text>
          <Text style={styles.albumSubtitle} numberOfLines={1}>
            {album.artist} · avaliado por {review.author}
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
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: 20,
    marginBottom: spacing.md,
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
    borderRadius: 14,
    padding: spacing.lg,
    gap: spacing.sm,
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
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  albumSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  reviewText: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 19,
  },
  empty: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: spacing.xxl,
  },
});
