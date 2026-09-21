import React, { useRef, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AccessibilityInfo, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScreenContainer } from '@/components/ScreenContainer';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { colors, spacing, touch, typography } from '@/theme/colors';
import { isValidEmail, useAuth } from '@/state/AuthContext';
import { useFeedback } from '@/feedback/FeedbackContext';
import { RootStackParamList } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

interface Errors {
  email?: string;
  password?: string;
}

/**
 * Tela inicial do app (sem sessão). Ainda não há autenticação real
 * (Supabase fica para uma etapa futura): qualquer e-mail válido + senha
 * entra com o usuário de demonstração. O que esta etapa acrescenta é o
 * comportamento de UX do formulário:
 *
 * - validação com mensagens em linguagem simples, mostradas junto do campo;
 * - estado de carregamento no botão ("Entrando…") enquanto a "requisição" roda;
 * - teclado encadeado (Enter no e-mail vai para a senha; na senha, envia);
 * - "Criar conta" é um botão de verdade (48dp), que leva à tela de Cadastro.
 */
export function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const { showFeedback } = useFeedback();
  const passwordRef = useRef<TextInput>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  function validate(): Errors {
    const next: Errors = {};
    if (!email.trim()) next.email = 'Informe seu e-mail.';
    else if (!isValidEmail(email)) next.email = 'Esse e-mail não parece válido. Confira se tem "@" e domínio (ex.: voce@email.com).';
    if (!password) next.password = 'Informe sua senha.';
    return next;
  }

  async function handleSubmit() {
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // Os erros aparecem junto de cada campo; para quem usa leitor de tela,
      // anuncia também um resumo (o toast cobriria o topo da tela à toa).
      AccessibilityInfo.announceForAccessibility('Não foi possível entrar. Corrija os campos destacados.');
      return;
    }
    setLoading(true);
    const user = await signIn(email);
    // A navegação troca para as abas automaticamente (ver RootNavigator).
    showFeedback(`Bem-vindo de volta, ${user.name.split(' ')[0]}!`);
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenContainer>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.center}>
            <View style={styles.mark} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              <Feather name="disc" size={30} color={colors.accentStrong} />
            </View>

            <Text style={styles.title} accessibilityRole="header">
              Sleeve
            </Text>
            <Text style={styles.subtitle}>seu diário de álbuns e EPs</Text>

            <View style={styles.form}>
              <TextField
                label="E-mail"
                value={email}
                onChangeText={(v) => {
                  setEmail(v);
                  if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
                }}
                error={errors.email}
                placeholder="voce@email.com"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                textContentType="emailAddress"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                editable={!loading}
              />
              <TextField
                ref={passwordRef}
                label="Senha"
                value={password}
                onChangeText={(v) => {
                  setPassword(v);
                  if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
                }}
                error={errors.password}
                placeholder="Sua senha"
                secureTextEntry
                autoComplete="password"
                textContentType="password"
                returnKeyType="go"
                onSubmitEditing={handleSubmit}
                editable={!loading}
              />
            </View>

            <PrimaryButton
              label="Entrar"
              loadingLabel="Entrando…"
              loading={loading}
              onPress={handleSubmit}
              style={styles.button}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Não tem conta?</Text>
              <Pressable
                onPress={() => navigation.navigate('SignUp')}
                disabled={loading}
                accessibilityRole="link"
                accessibilityLabel="Criar conta"
                accessibilityHint="Abre o formulário de cadastro"
                style={({ pressed }) => [styles.linkButton, pressed && styles.linkPressed]}
              >
                <Text style={styles.link}>Criar conta</Text>
              </Pressable>
            </View>
          </View>

          <Text style={styles.legal}>
            Ao continuar, você concorda com os Termos de Uso e a Política de Privacidade.
          </Text>
        </ScrollView>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
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
    marginBottom: spacing.xxl,
    color: colors.textMuted,
    fontSize: typography.body,
  },
  form: {
    width: '100%',
    gap: spacing.lg,
  },
  button: {
    marginTop: spacing.xl,
  },
  footer: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: typography.body,
    color: colors.textMuted,
  },
  linkButton: {
    minHeight: touch.min,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
  },
  linkPressed: {
    backgroundColor: colors.pressed,
  },
  link: {
    fontSize: typography.body,
    color: colors.accentStrong,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  legal: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 17,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
});
