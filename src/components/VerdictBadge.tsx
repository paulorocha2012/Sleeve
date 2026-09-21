import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius, typography } from '@/theme/colors';
import { Verdict } from '@/types';

/**
 * Selo compacto de só-leitura usado no Feed e no Detalhe do álbum para mostrar
 * um veredito já registrado. Além da cor, traz o ícone (polegar para cima/baixo)
 * e o texto, para não depender só de cor.
 */
export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const liked = verdict === 'gostei';
  const fg = liked ? colors.onAccent : colors.text;
  return (
    <View
      style={[styles.badge, { backgroundColor: liked ? colors.accent : colors.surfaceAlt }]}
      accessible
      accessibilityLabel={liked ? 'Veredito: gostei' : 'Veredito: não gostei'}
    >
      <Feather name={liked ? 'thumbs-up' : 'thumbs-down'} size={12} color={fg} />
      <Text style={[styles.text, { color: fg }]} maxFontSizeMultiplier={typography.maxFontScale}>
        {liked ? 'Gostei' : 'Não gostei'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: typography.caption,
    fontWeight: '700',
  },
});
