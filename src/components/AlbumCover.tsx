import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius } from '@/theme/colors';

interface AlbumCoverProps {
  letter: string;
  size?: number;
  style?: ViewStyle;
  /**
   * Quando true, não define width/height fixos: o tamanho passa a ser
   * ditado pelo `style` (ex.: flex + aspectRatio), usado na grade
   * responsiva do Perfil. `size` continua definindo o tamanho da letra.
   */
  fill?: boolean;
}

/**
 * Placeholder de capa (inicial do título) reutilizado em todas as listas e
 * na tela de detalhe. Numa etapa futura, com comunicação com servidor, esta
 * é a peça que passa a exibir a capa real vinda da Cover Art Archive.
 *
 * Acessibilidade: a capa é decorativa (o título do álbum sempre aparece em
 * texto ao lado), então fica escondida do leitor de tela para ele não
 * anunciar uma letra solta.
 */
export function AlbumCover({ letter, size = 52, style, fill = false }: AlbumCoverProps) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.base,
        !fill && { width: size, height: size },
        { borderRadius: size >= 64 ? radius.md : radius.sm },
        style,
      ]}
    >
      <Text style={[styles.letter, { fontSize: size * 0.34 }]} allowFontScaling={false}>
        {letter}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    fontWeight: '700',
    color: colors.text,
    opacity: 0.85,
  },
});
