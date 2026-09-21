import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius, spacing, touch, typography } from '@/theme/colors';
import { Album } from '@/types';
import { AlbumCover } from './AlbumCover';

interface AlbumListItemProps {
  album: Album;
  onPress: () => void;
  /** Rótulo opcional de tipo (ÁLBUM/EP), usado na tela de Busca. */
  showType?: boolean;
}

/**
 * Linha de lista reutilizada em Buscar. A linha inteira é o alvo de toque
 * (não só o título), com altura mínima de 72dp, fundo destacado ao
 * pressionar e um chevron indicando que leva a outra tela. Para o leitor de
 * tela, a linha é um único botão com rótulo completo.
 */
export function AlbumListItem({ album, onPress, showType }: AlbumListItemProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${album.title}, ${album.type} de ${album.artist}, ${album.year}`}
      accessibilityHint="Abre o detalhe do álbum"
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <AlbumCover letter={album.cover} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2} maxFontSizeMultiplier={typography.maxFontScale}>
          {album.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1} maxFontSizeMultiplier={typography.maxFontScale}>
          {album.artist} · {album.year}
        </Text>
      </View>
      {showType && (
        <View style={styles.typeTag}>
          <Text style={styles.typeText}>{album.type === 'Álbum' ? 'ÁLBUM' : 'EP'}</Text>
        </View>
      )}
      <Feather name="chevron-right" size={20} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: touch.min + 24,
    paddingVertical: 10,
    paddingHorizontal: spacing.sm,
    marginHorizontal: -spacing.sm,
    borderRadius: radius.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  rowPressed: {
    backgroundColor: colors.pressed,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: typography.body,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.small,
    color: colors.textMuted,
    marginTop: 2,
  },
  typeTag: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.pill,
    paddingVertical: 4,
    paddingHorizontal: 9,
  },
  typeText: {
    fontSize: typography.caption,
    fontWeight: '700',
    color: colors.textMuted,
  },
});
