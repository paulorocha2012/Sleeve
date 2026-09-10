import React, { useMemo, useState } from 'react';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SearchField } from '@/components/SearchField';
import { AlbumListItem } from '@/components/AlbumListItem';
import { colors, radius, spacing } from '@/theme/colors';
import { mockAlbums } from '@/data/mockAlbums';
import { AlbumType, MainTabParamList, RootStackParamList } from '@/types';

type SearchNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Buscar'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type FilterOption = 'Todos' | AlbumType;
const FILTERS: FilterOption[] = ['Todos', 'Álbum', 'EP'];

/** Tela "Buscar": filtro por texto e por tipo (álbum/EP) sobre o catálogo. */
export function SearchScreen() {
  const navigation = useNavigation<SearchNavigation>();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterOption>('Todos');

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return mockAlbums.filter((album) => {
      const matchesType = filter === 'Todos' || album.type === filter;
      const matchesQuery =
        normalized.length === 0 ||
        album.title.toLowerCase().includes(normalized) ||
        album.artist.toLowerCase().includes(normalized);
      return matchesType && matchesQuery;
    });
  }, [query, filter]);

  return (
    <ScreenContainer edges={['top']}>
      <Text style={styles.heading}>Buscar</Text>
      <SearchField value={query} onChangeText={setQuery} />

      <View style={styles.filters}>
        {FILTERS.map((option) => {
          const active = option === filter;
          return (
            <Pressable key={option} onPress={() => setFilter(option)}>
              <View style={[styles.filterChip, active && styles.filterChipActive]}>
                <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>{option}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AlbumListItem
            album={item}
            showType
            onPress={() => navigation.navigate('AlbumDetail', { albumId: item.id })}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum resultado para essa busca.</Text>}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  filters: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  filterChip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: 7,
    paddingHorizontal: 14,
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
  empty: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: spacing.xxl,
  },
});
