import React, { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AccessibilityInfo, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { colors, radius, spacing, typography } from '@/theme/colors';
import { useAuth } from '@/state/AuthContext';
import { useReviews } from '@/state/ReviewsContext';
import { useDiary } from '@/state/DiaryContext';
import { useFeedback } from '@/feedback/FeedbackContext';
import { RootStackParamList } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

/**
 * Configurações (engrenagem do Perfil): conta, estado da acessibilidade do
 * sistema, o que está salvo no aparelho e, no fim, as ações destrutivas
 * ("Apagar meus dados" e "Sair da conta"), sempre com confirmação.
 */
export function SettingsScreen({ navigation }: Props) {
  const { user, signOut } = useAuth();
  const { reviews, currentUser, clearMine: clearReviews } = useReviews();
  const { myListens, myWantList, clearMine: clearDiary } = useDiary();
  const { showFeedback } = useFeedback();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [clearVisible, setClearVisible] = useState(false);
  const myReviewCount = reviews.filter((r) => r.author === currentUser).length;
  const [screenReader, setScreenReader] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(setScreenReader).catch(() => undefined);
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => undefined);
    const a = AccessibilityInfo.addEventListener('screenReaderChanged', setScreenReader);
    const b = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      a.remove();
      b.remove();
    };
  }, []);

  return (
    <ScreenContainer edges={['top', 'bottom']}>
      <ScreenHeader
        title="Configurações"
        left={{ icon: 'arrow-left', accessibilityLabel: 'Voltar para o perfil', onPress: () => navigation.goBack() }}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.section} accessibilityRole="header">
          Conta
        </Text>
        <View style={styles.card}>
          <Row icon="user" label="Nome" value={user?.name ?? '—'} />
          <View style={styles.divider} />
          <Row icon="mail" label="E-mail" value={user?.email ?? '—'} />
        </View>

        <Text style={styles.section} accessibilityRole="header">
          Acessibilidade
        </Text>
        <View style={styles.card}>
          <Row icon="volume-2" label="Leitor de tela" value={screenReader ? 'Ativado' : 'Desativado'} />
          <View style={styles.divider} />
          <Row icon="wind" label="Reduzir movimento" value={reduceMotion ? 'Ativado' : 'Desativado'} />
          <View style={styles.divider} />
          <Row icon="type" label="Tamanho do texto" value="Segue o sistema" />
        </View>
        <Text style={styles.note}>
          O Sleeve acompanha as configurações de acessibilidade do seu aparelho (TalkBack/VoiceOver, tamanho de
          fonte e redução de movimento). Para alterá-las, use os ajustes do sistema.
        </Text>

        <Text style={styles.section} accessibilityRole="header">
          Salvo neste aparelho
        </Text>
        <View style={styles.card}>
          <Row icon="message-square" label="Avaliações" value={String(myReviewCount)} />
          <View style={styles.divider} />
          <Row icon="headphones" label="Escutas" value={String(myListens.length)} />
          <View style={styles.divider} />
          <Row icon="bookmark" label="Quero ouvir" value={String(myWantList.length)} />
        </View>
        <Text style={styles.note}>
          Seus dados ficam guardados no celular e continuam aqui quando você fecha o app ou sai da conta.
        </Text>

        <View style={styles.danger}>
          <PrimaryButton
            label="Apagar meus dados"
            icon="trash-2"
            variant="danger"
            accessibilityHint="Pede confirmação antes de apagar"
            onPress={() => setClearVisible(true)}
          />
          <PrimaryButton
            label="Sair da conta"
            icon="log-out"
            variant="danger"
            accessibilityHint="Pede confirmação antes de sair"
            onPress={() => setConfirmVisible(true)}
          />
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={confirmVisible}
        title="Sair da conta?"
        message="Você volta para a tela de login. Suas avaliações e escutas continuam salvas no aparelho."
        confirmLabel="Sair"
        cancelLabel="Cancelar"
        destructive
        onCancel={() => setConfirmVisible(false)}
        onConfirm={() => {
          setConfirmVisible(false);
          signOut();
          showFeedback('Você saiu da conta', 'info');
        }}
      />

      <ConfirmDialog
        visible={clearVisible}
        title="Apagar seus dados?"
        message="Avaliações, rascunhos, escutas e a lista Quero ouvir desta conta serão apagados do aparelho. Não dá para desfazer."
        confirmLabel="Apagar tudo"
        cancelLabel="Cancelar"
        destructive
        onCancel={() => setClearVisible(false)}
        onConfirm={() => {
          setClearVisible(false);
          clearReviews();
          clearDiary();
          showFeedback('Seus dados foram apagados', 'info');
        }}
      />
    </ScreenContainer>
  );
}

function Row({ icon, label, value }: { icon: React.ComponentProps<typeof Feather>['name']; label: string; value: string }) {
  return (
    <View style={styles.row} accessible accessibilityLabel={`${label}: ${value}`}>
      <Feather name={icon} size={18} color={colors.textMuted} />
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: spacing.xxl,
  },
  section: {
    fontSize: typography.caption,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 52,
  },
  rowLabel: {
    fontSize: typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  rowValue: {
    flex: 1,
    textAlign: 'right',
    fontSize: typography.body - 1,
    color: colors.textMuted,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  note: {
    marginTop: spacing.sm,
    fontSize: typography.small,
    lineHeight: 19,
    color: colors.textMuted,
  },
  danger: {
    marginTop: spacing.xxl + spacing.lg,
    gap: spacing.sm,
  },
});
