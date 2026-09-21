import React, { useMemo, useState } from 'react';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlatList, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { AlbumCover } from '@/components/AlbumCover';
import { ChipGroup } from '@/components/Chip';
import { EmptyState } from '@/components/EmptyState';
import { colors, radius, spacing, typography } from '@/theme/colors';
import { useReviews } from '@/state/ReviewsContext';
import { useAuth } from '@/state/AuthContext';
import { findAlbum } from '@/data/mockAlbums';
import { MainTabParamList, RootStackParamList, Verdict } from '@/types';

type ProfileNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Perfil'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type FilterOption = 'Gostei' | 'Não gostei';
const FILTERS: readonly FilterOption[] = ['Gostei', 'Não gostei'];

/**
 * Tela "Perfil" (aba 3): estatísticas do usuário e grade das avaliações
 * feitas, filtráveis por veredito. Novidades da Etapa 3 na navegação:
 * - cada capa da grade é tocável e abre o Detalhe do álbum;
 * - a engrenagem no canto superior direito abre Configurações (onde fica o
 *   "Sair da conta", longe das ações frequentes).
 */
export function ProfileScreen() {
  const navigation = useNavigation<ProfileNavigation>();
  const { reviews, currentUser } = useReviews();
  const { user } = useAuth();
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
  const initials = currentUser
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <ScreenContainer edges={['top']}>
      <FlatList
        key={numColumns}
        data={filtered}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.grid}
        ListHeaderComponent={
          <View>
            <ScreenHeader
              title="Perfil"
              variant="large"
              right={{
                icon: 'settings',
                accessibilityLabel: 'Configurações',
                accessibilityHint: 'Abre as configurações da conta',
                onPress: () => navigation.navigate('Settings'),
              }}
            />

            <View style={styles.identity} accessible accessibilityLabel={`${currentUser}, ${user?.email ?? ''}`}>
              <View style={styles.avatar}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
              <Text style={styles.name}>{currentUser}</Text>
              <Text style={styles.handle}>{user?.email}</Text>
            </View>

            <View
              style={styles.stats}
              accessible
              accessibilityLabel={`${myReviews.length} avaliações: ${likedCount} gostei, ${dislikedCount} não gostei`}
            >
              <Stat value={myReviews.length} label="avaliações" />
              <Stat value={likedCount} label="gostei" accent />
              <Stat value={dislikedCount} label="não gostei" />
            </View>

            <ChipGroup
              label="Filtrar suas avaliações por veredito"
              options={FILTERS}
              value={filter}
              onChange={setFilter}
              stretch
              style={styles.filters}
            />
          </View>
        }
        renderItem={({ item }) => {
          const album = findAlbum(item.albumId);
          if (!album) return null;
          return (
            <Pressable
              onPress={() => navigation.navigate('AlbumDetail', { albumId: album.id })}
              accessibilityRole="button"
              accessibilityLabel={`${album.title}, de ${album.artist}. Você ${
                item.verdict === 'gostei' ? 'gostou' : 'não gostou'
              }.`}
              accessibilityHint="Abre o detalhe do álbum"
              style={({ pressed }) => [styles.gridItem, pressed && styles.gridItemPressed]}
            >
              <AlbumCover letter={album.cover} size={40} fill style={styles.gridCover} />
              <Text style={styles.gridTitle} numberOfLines={1}>
                {album.title}
              </Text>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            icon={filter === 'Gostei' ? 'thumbs-up' : 'thumbs-down'}
            title={myReviews.length === 0 ? 'Você ainda não avaliou nada' : `Nada em “${filter}”`}
            message={
              myReviews.length === 0
                ? 'Busque um álbum e diga se gostou ou não — ele aparece aqui.'
                : `Você não marcou nenhum álbum como “${filter.toLowerCase()}” ainda.`
            }
            actionLabel={myReviews.length === 0 ? 'Buscar um álbum' : undefined}
            onAction={() => navigation.navigate('Buscar')}
          />
        }
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
  identity: {
    alignItems: 'center',
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarInitials: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
  },
  name: {
    textAlign: 'center',
    fontSize: typography.title - 2,
    fontWeight: '700',
    color: colors.text,
  },
  handle: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: typography.small + 1,
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
    fontSize: typography.title - 2,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  filters: {
    marginBottom: spacing.md,
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
    gap: 4,
    padding: 4,
    borderRadius: radius.md,
  },
  gridItemPressed: {
    backgroundColor: colors.pressed,
  },
  gridCover: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.md,
  },
  gridTitle: {
    fontSize: typography.caption,
    color: colors.text,
    fontWeight: '600',
  },
});
