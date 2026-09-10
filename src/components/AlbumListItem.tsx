import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/theme/colors';
import { Album } from '@/types';
import { AlbumCover } from './AlbumCover';

interface AlbumListItemProps {
  album: Album;
  onPress: () => void;
  /** Rótulo opcional de tipo (ÁLBUM/EP), usado na tela de Busca. */
  showType?: boolean;
}

/** Linha de lista reutilizada em Buscar e no Feed. */
export function AlbumListItem({ album, onPress, showType }: AlbumListItemProps) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <AlbumCover letter={album.cover} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {album.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {album.artist} · {album.year}
        </Text>
      </View>
      {showType && (
        <View style={styles.typeTag}>
          <Text style={styles.typeText}>{album.type === 'Álbum' ? 'ÁLBUM' : 'EP'}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 12.5,
    color: colors.textMuted,
    marginTop: 2,
  },
  typeTag: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: 4,
    paddingHorizontal: 9,
  },
  typeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.textMuted,
  },
});
