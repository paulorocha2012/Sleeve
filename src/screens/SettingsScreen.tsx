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
import { useFeedback } from '@/feedback/FeedbackContext';
import { RootStackParamList } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

/**
 * Tela "Configurações" (nova na Etapa 3), acessada pela engrenagem do
 * Perfil. Reúne:
 * - dados da conta;
 * - um painel que mostra, ao vivo, se o leitor de tela e o "Reduzir
 *   movimento" do sistema estão ativos (o app se adapta a eles — ex.: o
 *   aviso de feedback não desliza quando "Reduzir movimento" está ligado);
 * - "Sair da conta", isolado no fim da tela e com confirmação: ação
 *   destrutiva longe das ações frequentes, para não ser tocada por engano.
 */
export function SettingsScreen({ navigation }: Props) {
  const { user, signOut } = useAuth();
  const { showFeedback } = useFeedback();
  const [confirmVisible, setConfirmVisible] = useState(false);
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

        <View style={styles.danger}>
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
        message="Você volta para a tela de login. As avaliações desta sessão não são salvas no aparelho ainda."
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
  },
});
