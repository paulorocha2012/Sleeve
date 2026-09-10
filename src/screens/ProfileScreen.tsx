import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { AlbumCover } from '@/components/AlbumCover';
import { colors, radius, spacing } from '@/theme/colors';
import { useReviews } from '@/state/ReviewsContext';
import { findAlbum } from '@/data/mockAlbums';
import { Verdict } from '@/types';

type FilterOption = 'Gostei' | 'Não gostei';

/** Tela "Perfil": estatísticas do usuário e grade das avaliações feitas, filtráveis por veredito. */
export function ProfileScreen() {
  const { reviews, currentUser } = useReviews();
  const { width } = useWindowDimensions();
  const [filter, setFilter] = useState<FilterOption>('Gostei');

  const myReviews = useMemo(() => reviews.filter((r) => r.author === currentUser), [reviews, currentUser]);
  const likedCount = myReviews.filter((r) => r.verdict === 'gostei').length;
  const dislikedCount = myReviews.length - likedCount;

  const wantedVerdict: Verdict = filter === 'Gostei' ? 'gostei' : 'nao_gostei';
  const filtered = useMemo(
    () => myReviews.filter((r) => r.verdict === wantedVerdict),
    [myReviews, wantedVerdict],
  );

  // Grade responsiva: mais colunas conforme a largura disponível da tela.
  const numColumns = width >= 900 ? 5 : width >= 600 ? 4 : 3;

  return (
    <ScreenContainer edges={['top']}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Perfil</Text>
      </View>

      <View style={styles.avatar}>
        <Text style={styles.avatarInitials}>
          {currentUser
            .split(' ')
            .map((part) => part[0])
            .join('')}
        </Text>
      </View>
      <Text style={styles.name}>{currentUser}</Text>
      <Text style={styles.handle}>@{currentUser.split(' ')[0].toLowerCase()}</Text>

      <View style={styles.stats}>
        <Stat value={myReviews.length} label="avaliações" />
        <Stat value={likedCount} label="gostei" accent />
        <Stat value={dislikedCount} label="não gostei" />
      </View>

      <View style={styles.filters}>
        {(['Gostei', 'Não gostei'] as FilterOption[]).map((option) => {
          const active = option === filter;
          return (
            <Pressable key={option} style={styles.filterPress} onPress={() => setFilter(option)}>
              <View style={[styles.filterChip, active && styles.filterChipActive]}>
                <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>{option}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        key={numColumns}
        data={filtered}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => {
          const album = findAlbum(item.albumId);
          if (!album) return null;
          return <AlbumCover letter={album.cover} size={40} fill style={styles.gridItem} />;
        }}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma avaliação com esse veredito ainda.</Text>}
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
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  avatar: {
    alignSelf: 'center',
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  avatarInitials: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
  },
  name: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  handle: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 13.5,
    marginBottom: spacing.lg,
  },
  stats: {
    flexDirection: 'row',
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
  filters: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filterPress: {
    flex: 1,
  },
  filterChip: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: 9,
  },
  filterChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  filterLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.textMuted,
  },
  filterLabelActive: {
    color: colors.onAccent,
    fontWeight: '700',
  },
  grid: {
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  gridRow: {
    gap: spacing.sm,
  },
  gridItem: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: radius.md,
  },
  empty: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: spacing.xl,
  },
});
