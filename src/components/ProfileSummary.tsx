import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme/colors';
import { isSameMonth, lastMonths } from '@/utils/date';
import { Listen, Review } from '@/types';

const MONTHS_SHOWN = 6;
const BAR_MAX = 64;

/**
 * Resumo visual do Perfil: proporção gostei × não gostei e escutas por mês
 * (últimos 6 meses). Desenhado só com View, sem biblioteca de gráfico.
 */
export function ProfileSummary({ reviews, listens }: { reviews: Review[]; listens: Listen[] }) {
  const liked = reviews.filter((r) => r.verdict === 'gostei').length;
  const disliked = reviews.length - liked;

  const months = lastMonths(MONTHS_SHOWN).map((m) => ({
    ...m,
    count: listens.filter((l) => isSameMonth(l.date, m.year, m.month)).length,
  }));
  const max = Math.max(1, ...months.map((m) => m.count));
  const monthsLabel = months.map((m) => `${m.fullLabel}: ${m.count}`).join(', ');

  return (
    <View style={styles.container}>
      {reviews.length > 0 && (
        <View
          style={styles.block}
          accessible
          accessibilityLabel={`Das suas ${reviews.length} avaliações, ${liked} são gostei e ${disliked} não gostei`}
        >
          <View style={styles.legend}>
            <Text style={styles.legendText}>
              <Text style={styles.legendStrong}>{liked}</Text> gostei
            </Text>
            <Text style={styles.legendText}>
              <Text style={styles.legendStrong}>{disliked}</Text> não gostei
            </Text>
          </View>
          <View style={styles.bar}>
            {liked > 0 && <View style={[styles.barLiked, { flex: liked }]} />}
            {disliked > 0 && <View style={[styles.barDisliked, { flex: disliked }]} />}
          </View>
        </View>
      )}

      <View style={styles.block} accessible accessibilityLabel={`Escutas por mês. ${monthsLabel}`}>
        <Text style={styles.blockTitle}>Escutas por mês</Text>
        <View style={styles.chart}>
          {months.map((m, i) => {
            const current = i === months.length - 1;
            return (
              <View key={`${m.year}-${m.month}`} style={styles.column}>
                <Text style={styles.count}>{m.count > 0 ? m.count : ''}</Text>
                <View
                  style={[
                    styles.columnBar,
                    { height: m.count === 0 ? 2 : Math.max(6, (m.count / max) * BAR_MAX) },
                    m.count === 0 && styles.columnBarEmpty,
                  ]}
                />
                <Text style={[styles.month, current && styles.monthCurrent]}>{m.label}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  block: {
    gap: spacing.sm,
  },
  blockTitle: {
    fontSize: typography.small,
    fontWeight: '700',
    color: colors.text,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendText: {
    fontSize: typography.small,
    color: colors.textMuted,
  },
  legendStrong: {
    fontWeight: '700',
    color: colors.text,
  },
  bar: {
    flexDirection: 'row',
    height: 10,
    borderRadius: radius.round,
    overflow: 'hidden',
    gap: 2,
  },
  barLiked: {
    backgroundColor: colors.accent,
  },
  barDisliked: {
    backgroundColor: colors.borderStrong,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  count: {
    fontSize: typography.caption,
    color: colors.textMuted,
    minHeight: 16,
  },
  columnBar: {
    width: '70%',
    maxWidth: 36,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  columnBarEmpty: {
    backgroundColor: colors.border,
  },
  month: {
    fontSize: typography.caption,
    color: colors.textMuted,
  },
  monthCurrent: {
    color: colors.text,
    fontWeight: '700',
  },
});
