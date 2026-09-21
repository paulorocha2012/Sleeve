import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors, touch, typography } from '@/theme/colors';
import { MainTabParamList, RootStackParamList } from '@/types';
import { useAuth } from '@/state/AuthContext';

import { LoginScreen } from '@/screens/LoginScreen';
import { SignUpScreen } from '@/screens/SignUpScreen';
import { FeedScreen } from '@/screens/FeedScreen';
import { SearchScreen } from '@/screens/SearchScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { AlbumDetailScreen } from '@/screens/AlbumDetailScreen';
import { NewReviewScreen } from '@/screens/NewReviewScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.surface,
    border: colors.border,
    text: colors.text,
    primary: colors.accentStrong,
  },
};

interface TabConfig {
  icon: React.ComponentProps<typeof Feather>['name'];
  /** Rótulo falado pelo leitor de tela (o visível é o nome da rota). */
  a11yLabel: string;
}

const TABS: Record<keyof MainTabParamList, TabConfig> = {
  Feed: { icon: 'home', a11yLabel: 'Feed, avaliações recentes' },
  Buscar: { icon: 'search', a11yLabel: 'Buscar álbuns e EPs' },
  Perfil: { icon: 'user', a11yLabel: 'Perfil, suas avaliações' },
};

/**
 * Abas principais: Feed, Buscar e Perfil.
 *
 * A barra de abas é o mecanismo de navegação primário porque fica na zona
 * do polegar (parte de baixo da tela) e está sempre visível — Lei de Fitts:
 * alvos grandes (terço da largura cada, 64dp de altura) e sempre no mesmo
 * lugar. Cada aba tem ícone + rótulo de texto (o ícone sozinho seria
 * ambíguo), a aba ativa muda de cor E ganha rótulo em negrito, e a barra
 * some com o teclado aberto para não roubar espaço dos formulários.
 */
function MainTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const tab = TABS[route.name as keyof MainTabParamList];
        return {
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarAccessibilityLabel: tab.a11yLabel,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            height: touch.primary + 8 + insets.bottom,
            paddingTop: 6,
            paddingBottom: Math.max(insets.bottom, 8),
          },
          tabBarItemStyle: { minHeight: touch.min },
          tabBarActiveTintColor: colors.accentStrong,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{ color, fontSize: typography.caption, fontWeight: focused ? '700' : '500' }}
            >
              {route.name}
            </Text>
          ),
          tabBarIcon: ({ color }) => <Feather name={tab.icon} color={color} size={24} />,
        };
      }}
    >
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Buscar" component={SearchScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

/**
 * Pilha raiz com fluxo de autenticação:
 *
 *   sem sessão:  Login ⇄ Cadastro
 *   com sessão:  Main (abas) → Detalhe do álbum → Nova avaliação (modal)
 *                Main (aba Perfil) → Configurações
 *
 * As telas de cada grupo só existem na pilha enquanto a condição vale. Ao
 * entrar/criar conta o React Navigation troca o grupo sozinho (sem
 * `navigate`), e ao sair a pilha logada é descartada inteira — assim o botão
 * Voltar do Android nunca leva de volta ao Login depois de entrar, nem a uma
 * tela logada depois de sair.
 */
export function RootNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer
      theme={navigationTheme}
      documentTitle={{ formatter: (options, route) => `${options?.title ?? route?.name ?? ''} · Sleeve` }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: true }}>
        {user ? (
          <Stack.Group>
            <Stack.Screen name="Main" component={MainTabs} options={{ title: 'Início' }} />
            <Stack.Screen name="AlbumDetail" component={AlbumDetailScreen} options={{ title: 'Detalhe do álbum' }} />
            <Stack.Screen
              name="NewReview"
              component={NewReviewScreen}
              options={{ presentation: 'modal', title: 'Nova avaliação' }}
            />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Configurações' }} />
          </Stack.Group>
        ) : (
          <Stack.Group screenOptions={{ animationTypeForReplace: 'pop' }}>
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Entrar' }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Criar conta' }} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
