import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Platform, Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors, radius, spacing, touch, typography } from '@/theme/colors';

export type FeedbackType = 'success' | 'info' | 'error';

interface FeedbackMessage {
  id: number;
  text: string;
  type: FeedbackType;
}

interface FeedbackContextValue {
  /** Mostra uma mensagem curta de confirmação/erro no topo da tela. */
  showFeedback: (text: string, type?: FeedbackType) => void;
}

const FeedbackContext = createContext<FeedbackContextValue | undefined>(undefined);

const DURATION_MS = 3200;

const ICONS: Record<FeedbackType, React.ComponentProps<typeof Feather>['name']> = {
  success: 'check-circle',
  info: 'info',
  error: 'alert-triangle',
};

/**
 * Canal único de feedback visual da aplicação ("toast"). Qualquer tela
 * chama `showFeedback('Avaliação publicada')` após uma ação e a mensagem
 * aparece por ~3s logo abaixo do cabeçalho — longe da barra de abas e dos
 * botões inferiores, e sem cobrir o Voltar/Fechar do cabeçalho, para não
 * esconder o próximo alvo de toque.
 *
 * Acessibilidade:
 * - a mensagem é anunciada pelo leitor de tela (`announceForAccessibility`
 *   no iOS/web e `accessibilityLiveRegion` no Android);
 * - cor + ícone + texto (não depende só de cor);
 * - respeita "Reduzir movimento": sem animação de deslize quando ativado;
 * - toque na mensagem a dispensa antes do tempo.
 */
export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<FeedbackMessage | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => undefined);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => sub.remove();
  }, []);

  const hide = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    Animated.timing(anim, {
      toValue: 0,
      duration: reduceMotion ? 0 : 180,
      useNativeDriver: Platform.OS !== 'web',
    }).start(() => setMessage(null));
  }, [anim, reduceMotion]);

  const showFeedback = useCallback(
    (text: string, type: FeedbackType = 'success') => {
      if (timer.current) clearTimeout(timer.current);
      setMessage({ id: Date.now(), text, type });
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: reduceMotion ? 0 : 220,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
      if (Platform.OS !== 'android') {
        AccessibilityInfo.announceForAccessibility(text);
      }
      timer.current = setTimeout(hide, DURATION_MS);
    },
    [anim, hide, reduceMotion],
  );

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const value = useMemo(() => ({ showFeedback }), [showFeedback]);

  const palette =
    message?.type === 'error'
      ? { bg: colors.dangerSurface, fg: colors.danger, border: colors.danger }
      : message?.type === 'info'
        ? { bg: colors.surfaceAlt, fg: colors.text, border: colors.accent }
        : { bg: colors.successSurface, fg: colors.success, border: colors.success };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      {message && (
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.container,
            // Abaixo da faixa do cabeçalho (48dp): o aviso nunca cobre o botão
            // Voltar/Fechar nem a engrenagem, que ficam nessa faixa.
            { top: insets.top + touch.min + spacing.md },
            {
              opacity: anim,
              transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] }) }],
            },
          ]}
        >
          <Pressable
            key={message.id}
            onPress={hide}
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
            accessibilityHint="Toque para dispensar"
            style={[styles.toast, { backgroundColor: palette.bg, borderColor: palette.border }]}
          >
            <Feather name={ICONS[message.type]} size={20} color={palette.fg} />
            <Text style={[styles.text, { color: palette.fg }]} maxFontSizeMultiplier={typography.maxFontScale}>
              {message.text}
            </Text>
          </Pressable>
        </Animated.View>
      )}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) {
    throw new Error('useFeedback precisa ser usado dentro de um FeedbackProvider');
  }
  return ctx;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    alignItems: 'center',
    zIndex: 1000,
    elevation: 1000,
  },
  toast: {
    width: '100%',
    maxWidth: 560,
    minHeight: touch.min + 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  text: {
    flex: 1,
    fontSize: typography.body,
    fontWeight: '700',
  },
});
