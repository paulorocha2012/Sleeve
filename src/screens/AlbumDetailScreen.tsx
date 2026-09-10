import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScreenContainer } from '@/components/ScreenContainer';
import { AlbumCover } from '@/components/AlbumCover';
import { VerdictBadge } from '@/components/VerdictBadge';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors, spacing } from '@/theme/colors';
import { findAlbum } from '@/data/mockAlbums';
import { useReviews } from '@/state/ReviewsContext';
import { RootStackParamList } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AlbumDetail'>;

/** Tela "Detalhe do álbum": dados do álbum e todas as avaliações registradas para ele. */
export function AlbumDetailScreen({ route, navigation }: Props) {
  const { albumId } = route.params;
  const album = findAlbum(albumId);
  const { reviewsForAlbum } = useReviews();

  if (!album) {
    return (
      <ScreenContainer>
        <Text style={styles.emptyState}>Álbum não encontrado.</Text>
      </ScreenContainer>
    );
  }

  const reviews = reviewsForAlbum(albumId);
  const likedCount = reviews.filter((r) => r.verdict === 'gostei').length;
  const dislikedCount = reviews.length - likedCount;

  return (
    <ScreenContainer edges={['top']}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerLabel}>Detalhe do álbum</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.summary}>
        <AlbumCover letter={album.cover} size={96} />
        <Text style={styles.title}>{album.title}</Text>
        <Text style={styles.subtitle}>
          {album.artist} · {album.year} · {album.type}
        </Text>

        <View style={styles.stats}>
          <Stat value={reviews.length} label="avaliações" />
          <Stat value={likedCount} label="gostei" accent />
          <Stat value={dislikedCount} label="não gostei" />
        </View>

        <PrimaryButton
          label="Avaliar este álbum"
          onPress={() => navigation.navigate('NewReview', { albumId })}
        />
      </View>

      <Text style={styles.sectionLabel}>Avaliações</Text>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewAuthor}>{item.author}</Text>
              <VerdictBadge verdict={item.verdict} />
            </View>
            <Text style={styles.reviewText}>{item.text}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyState}>Ainda não há avaliações para este álbum.</Text>}
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

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  headerLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summary: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    marginTop: spacing.md,
    fontSize: 19,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.lg,
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
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  list: {
    gap: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  reviewCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    gap: 6,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewAuthor: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  reviewText: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  emptyState: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: spacing.xl,
  },
});
