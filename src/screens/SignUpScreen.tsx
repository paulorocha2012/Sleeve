import React, { useRef, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AccessibilityInfo, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { colors, spacing, typography } from '@/theme/colors';
import { isValidEmail, useAuth } from '@/state/AuthContext';
import { useFeedback } from '@/feedback/FeedbackContext';
import { RootStackParamList } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

type Field = 'name' | 'email' | 'password' | 'confirm';
type Errors = Partial<Record<Field, string>>;

const MIN_PASSWORD = 6;

/**
 * Tela "Criar conta" (nova na Etapa 3 — na Etapa 2 o link "Criar conta" do
 * Login não levava a lugar nenhum). Acessada pelo Login; volta ao Login
 * pela seta do cabeçalho, pelo gesto de voltar (iOS) ou pelo botão Voltar
 * do Android. Ao concluir, a sessão é criada e a navegação troca para as
 * abas principais automaticamente.
 */
export function SignUpScreen({ navigation }: Props) {
  const { signUp } = useAuth();
  const { showFeedback } = useFeedback();

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const [values, setValues] = useState<Record<Field, string>>({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  function update(field: Field, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate(): Errors {
    const next: Errors = {};
    if (values.name.trim().length < 2) next.name = 'Informe seu nome (pelo menos 2 letras).';
    if (!values.email.trim()) next.email = 'Informe seu e-mail.';
    else if (!isValidEmail(values.email)) next.email = 'Esse e-mail não parece válido (ex.: voce@email.com).';
    if (values.password.length < MIN_PASSWORD) next.password = `A senha precisa ter pelo menos ${MIN_PASSWORD} caracteres.`;
    if (values.confirm !== values.password) next.confirm = 'As senhas não são iguais.';
    return next;
  }

  async function handleSubmit() {
    const found = validate();
    setErrors(found);
    const count = Object.keys(found).length;
    if (count > 0) {
      AccessibilityInfo.announceForAccessibility(
        count === 1 ? 'Falta corrigir 1 campo.' : `Falta corrigir ${count} campos.`,
      );
      return;
    }
    setLoading(true);
    const user = await signUp(values.name, values.email);
    showFeedback(`Conta criada! Bem-vindo(a), ${user.name.split(' ')[0]}.`);
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenContainer edges={['top', 'bottom']}>
        <ScreenHeader
          title="Criar conta"
          left={{ icon: 'arrow-left', accessibilityLabel: 'Voltar para o login', onPress: () => navigation.goBack() }}
        />
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.intro}>
            Crie sua conta para registrar o que achou de cada álbum — só gostei ou não gostei, e a sua crítica.
          </Text>

          <View style={styles.form}>
            <TextField
              label="Nome"
              value={values.name}
              onChangeText={(v) => update('name', v)}
              error={errors.name}
              placeholder="Como quer aparecer no Sleeve"
              autoComplete="name"
              textContentType="name"
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
              editable={!loading}
            />
            <TextField
              ref={emailRef}
              label="E-mail"
              value={values.email}
              onChangeText={(v) => update('email', v)}
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
              value={values.password}
              onChangeText={(v) => update('password', v)}
              error={errors.password}
              helper={`Mínimo de ${MIN_PASSWORD} caracteres.`}
              secureTextEntry
              autoComplete="password-new"
              textContentType="newPassword"
              returnKeyType="next"
              onSubmitEditing={() => confirmRef.current?.focus()}
              editable={!loading}
            />
            <TextField
              ref={confirmRef}
              label="Confirmar senha"
              value={values.confirm}
              onChangeText={(v) => update('confirm', v)}
              error={errors.confirm}
              secureTextEntry
              textContentType="newPassword"
              returnKeyType="go"
              onSubmitEditing={handleSubmit}
              editable={!loading}
            />
          </View>

          <PrimaryButton
            label="Criar conta"
            loadingLabel="Criando conta…"
            loading={loading}
            onPress={handleSubmit}
            style={styles.button}
          />
          <PrimaryButton
            label="Já tenho conta"
            variant="outline"
            onPress={() => navigation.goBack()}
            disabled={loading}
            style={styles.secondary}
          />
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
    paddingBottom: spacing.xxl,
  },
  intro: {
    fontSize: typography.body,
    lineHeight: 22,
    color: colors.textMuted,
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.lg,
  },
  button: {
    marginTop: spacing.xl,
  },
  secondary: {
    marginTop: spacing.sm,
  },
});
