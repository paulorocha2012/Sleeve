import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '@/theme/colors';
import { Verdict } from '@/types';

/** Selo compacto de só-leitura usado no Feed e no Detalhe do álbum para mostrar um veredito já registrado. */
export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const liked = verdict === 'gostei';
  return (
    <View style={[styles.badge, { backgroundColor: liked ? colors.accent : colors.surfaceAlt }]}>
      <Text style={[styles.text, { color: liked ? colors.onAccent : colors.textMuted }]}>
        {liked ? 'Gostei' : 'Não gostei'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
  },
});
