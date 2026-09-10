import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScreenContainer } from '@/components/ScreenContainer';
import { AlbumCover } from '@/components/AlbumCover';
import { LikeToggle } from '@/components/LikeToggle';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors, spacing } from '@/theme/colors';
import { findAlbum } from '@/data/mockAlbums';
import { useReviews } from '@/state/ReviewsContext';
import { RootStackParamList, Verdict } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'NewReview'>;

const MAX_LENGTH = 500;

/** Tela "Nova avaliação": veredito binário + crítica em texto livre — sem notas. */
export function NewReviewScreen({ route, navigation }: Props) {
  const { albumId } = route.params;
  const album = findAlbum(albumId);
  const { addReview } = useReviews();

  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [text, setText] = useState('');

  const canSave = verdict !== null && text.trim().length > 0;

  function handleSave() {
    if (!verdict || !album) return;
    addReview(album.id, verdict, text.trim());
    navigation.goBack();
  }

  if (!album) {
    return (
      <ScreenContainer>
        <Text style={styles.emptyState}>Álbum não encontrado.</Text>
      </ScreenContainer>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenContainer edges={['top']}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
            <Feather name="x" size={20} color={colors.text} />
          </Pressable>
          <Text style={styles.headerLabel}>Nova avaliação</Text>
          <View style={{ width: 20 }} />
        </View>

        <View style={styles.albumRow}>
          <AlbumCover letter={album.cover} size={44} />
          <View>
            <Text style={styles.albumTitle}>{album.title}</Text>
            <Text style={styles.albumSubtitle}>{album.artist}</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Sua avaliação</Text>
        <LikeToggle value={verdict} onChange={setVerdict} />

        <Text style={[styles.sectionLabel, { marginTop: spacing.xl }]}>Sua crítica</Text>
        <TextInput
          value={text}
          onChangeText={(value) => setText(value.slice(0, MAX_LENGTH))}
          placeholder="O que você achou deste álbum?"
          placeholderTextColor={colors.textMuted}
          multiline
          style={styles.textarea}
        />
        <Text style={styles.counter}>
          {text.length}/{MAX_LENGTH}
        </Text>

        <PrimaryButton
          label="Salvar avaliação"
          onPress={handleSave}
          disabled={!canSave}
          style={styles.saveButton}
        />
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  headerLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  albumRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  albumTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.text,
  },
  albumSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  textarea: {
    minHeight: 140,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    padding: spacing.md,
    fontSize: 14,
    lineHeight: 20,
    textAlignVertical: 'top',
  },
  counter: {
    textAlign: 'right',
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 6,
  },
  saveButton: {
    marginTop: spacing.lg,
  },
  emptyState: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: spacing.xl,
  },
});
