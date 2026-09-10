import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScreenContainer } from '@/components/ScreenContainer';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors, spacing } from '@/theme/colors';
import { RootStackParamList } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

/**
 * Tela inicial do app. Nesta etapa não há autenticação real (sem
 * persistência/backend ainda) — "Entrar" apenas navega para a área
 * principal, e os campos servem para demonstrar os elementos de entrada de
 * dados previstos para o fluxo de autenticação.
 */
export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <ScreenContainer>
      <View style={styles.center}>
        <View style={styles.mark}>
          <Feather name="disc" size={30} color={colors.accentStrong} />
        </View>

        <Text style={styles.title}>Sleeve</Text>
        <Text style={styles.subtitle}>seu diário de álbuns e EPs</Text>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>E-MAIL</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="voce@email.com"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>SENHA</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              style={styles.input}
            />
          </View>
        </View>

        <PrimaryButton
          label="Entrar"
          onPress={() => navigation.replace('Main')}
          style={styles.button}
        />

        <Text style={styles.footerLink}>
          Não tem conta? <Text style={styles.link}>Criar conta</Text>
        </Text>
      </View>

      <Text style={styles.legal}>
        Ao continuar, você concorda com os Termos de Uso e a Política de Privacidade.
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mark: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: colors.accentStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: spacing.sm,
    marginBottom: spacing.xxl + spacing.md,
    color: colors.textMuted,
    fontSize: 15,
  },
  form: {
    width: '100%',
    gap: spacing.md,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  input: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 15,
  },
  button: {
    marginTop: spacing.lg + 2,
  },
  footerLink: {
    marginTop: spacing.lg,
    fontSize: 14,
    color: colors.textMuted,
  },
  link: {
    color: colors.accentStrong,
    fontWeight: '600',
  },
  legal: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 11,
    lineHeight: 16,
    paddingHorizontal: 24,
    paddingBottom: spacing.lg,
  },
});
