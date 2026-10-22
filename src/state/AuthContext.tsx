import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { User } from '@/types';
import { KEYS } from '@/storage/storage';
import { usePersistentState } from '@/storage/usePersistentState';

/** Usuário de demonstração usado pelo login enquanto não há autenticação real (Supabase, etapa futura). */
export const DEMO_USER_NAME = 'Paulo R.';

interface AuthContextValue {
  user: User | null;
  /** false enquanto a sessão salva ainda está sendo lida do aparelho. */
  ready: boolean;
  signIn: (email: string) => Promise<User>;
  signUp: (name: string, email: string) => Promise<User>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** Simula a latência de uma chamada de rede, para que o estado "carregando" dos botões seja visível. */
const fakeLatency = () => new Promise((resolve) => setTimeout(resolve, 700));

/**
 * Sessão do usuário. Desde a Etapa 4 fica salva no aparelho (chave
 * `sleeve:sessao`): quem fecha o app logado já abre direto nas abas.
 * A senha continua sem verificação até a autenticação real (Supabase).
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser, ready] = usePersistentState<User | null>(KEYS.session, null);

  const signIn = useCallback(async (email: string) => {
    await fakeLatency();
    const next = { name: DEMO_USER_NAME, email: email.trim().toLowerCase() };
    setUser(next);
    return next;
  }, [setUser]);

  const signUp = useCallback(async (name: string, email: string) => {
    await fakeLatency();
    const next = { name: name.trim(), email: email.trim().toLowerCase() };
    setUser(next);
    return next;
  }, [setUser]);

  const signOut = useCallback(() => setUser(null), [setUser]);

  const value = useMemo(
    () => ({ user, ready, signIn, signUp, signOut }),
    [user, ready, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth precisa ser usado dentro de um AuthProvider');
  }
  return ctx;
}

/** Validação simples de formato de e-mail, só para dar feedback imediato no formulário. */
export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
