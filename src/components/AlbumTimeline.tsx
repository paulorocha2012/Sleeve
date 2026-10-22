import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/theme/colors';
import { formatDay, formatDayLong } from '@/utils/date';
import { IconButton } from './IconButton';

export interface TimelineEvent {
  id: string;
  date: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  text: string;
  /** Quando existe, a linha ganha um × para remover o evento. */
  onRemove?: () => void;
}

/**
 * Linha do tempo vertical (mais recente em cima) usada no Detalhe do álbum
 * para mostrar a história do usuário com o disco: escutas, avaliação e
 * quando guardou para ouvir depois.
 */
export function AlbumTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <View>
      {events.map((event, index) => {
        const last = index === events.length - 1;
        return (
          <View key={event.id} style={styles.row}>
            <Text style={styles.date} accessibilityLabel={formatDayLong(event.date)}>
              {formatDay(event.date)}
            </Text>

            <View style={styles.rail} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              <View style={styles.dot}>
                <Feather name={event.icon} size={12} color={colors.accent} />
              </View>
              {!last && <View style={styles.line} />}
            </View>

            <Text style={styles.text}>{event.text}</Text>

            {event.onRemove ? (
              <IconButton
                icon="x"
                size={16}
                color={colors.textMuted}
                accessibilityLabel={`Remover: ${event.text}, ${formatDayLong(event.date)}`}
                onPress={event.onRemove}
                style={styles.remove}
              />
            ) : (
              <View style={styles.removePlaceholder} />
            )}
          </View>
        );
      })}
    </View>
  );
}

const DOT = 24;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    minHeight: 48,
  },
  date: {
    width: 52,
    paddingTop: 3,
    fontSize: typography.caption,
    color: colors.textMuted,
    textAlign: 'right',
  },
  rail: {
    width: DOT,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    flex: 1,
    width: 1,
    backgroundColor: colors.borderStrong,
  },
  text: {
    flex: 1,
    paddingTop: 2,
    fontSize: typography.body - 1,
    color: colors.text,
  },
  // Centraliza o × (48dp) com a bolinha (24dp) da linha.
  remove: {
    marginTop: -12,
  },
  removePlaceholder: {
    width: 48,
  },
});
