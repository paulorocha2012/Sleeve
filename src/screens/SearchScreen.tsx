import React, { useMemo, useRef, useState } from 'react';
import { CompositeNavigationProp, useNavigation, useScrollToTop } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlatList, StyleSheet, Text } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SearchField } from '@/components/SearchField';
import { AlbumListItem } from '@/components/AlbumListItem';
import { ChipGroup } from '@/components/Chip';
import { EmptyState } from '@/components/EmptyState';
import { colors, spacing, typography } from '@/theme/colors';
import { mockAlbums } from '@/data/mockAlbums';
import { Album, AlbumType, MainTabParamList, RootStackParamList } from '@/types';

type SearchNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Buscar'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type FilterOption = 'Todos' | AlbumType;
const FILTERS: readonly FilterOption[] = ['Todos', 'Álbum', 'EP'];

/**
 * Tela "Buscar" (aba 2): filtro por texto e por tipo (álbum/EP) sobre o
 * catálogo. A contagem de resultados é uma região "viva" — o leitor de tela
 * anuncia "3 resultados" sempre que ela muda, sem o usuário precisar
 * navegar até a lista para saber se a busca achou algo.
 */
export function SearchScreen() {
  const navigation = useNavigation<SearchNavigation>();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterOption>('Todos');
  const listRef = useRef<FlatList<Album>>(null);
  useScrollToTop(listRef);

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

  const hasFilters = query.length > 0 || filter !== 'Todos';

  return (
    <ScreenContainer edges={['top']}>
      <ScreenHeader title="Buscar" variant="large" />
      <SearchField value={query} onChangeText={setQuery} />

      <ChipGroup label="Filtrar por tipo" options={FILTERS} value={filter} onChange={setFilter} style={styles.filters} />

      <Text style={styles.count} accessibilityLiveRegion="polite" accessibilityRole="text">
        {results.length === 1 ? '1 resultado' : `${results.length} resultados`}
      </Text>

      <FlatList
        ref={listRef}
        data={results}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <AlbumListItem
            album={item}
            showType
            onPress={() => navigation.navigate('AlbumDetail', { albumId: item.id })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="search"
            title="Nada encontrado"
            message={
              query.trim()
                ? `Nenhum ${filter === 'Todos' ? 'álbum ou EP' : filter.toLowerCase()} com “${query.trim()}”. Confira a grafia ou tente o nome do artista.`
                : 'Nenhum item com esse filtro.'
            }
            actionLabel={hasFilters ? 'Limpar busca e filtros' : undefined}
            onAction={() => {
              setQuery('');
              setFilter('Todos');
            }}
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  filters: {
    marginTop: spacing.md,
  },
  count: {
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    fontSize: typography.small,
    fontWeight: '600',
    color: colors.textMuted,
  },
  list: {
    paddingBottom: spacing.xxl,
  },
});
