import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { User } from '@/types';

/** Usuário de demonstração usado pelo login enquanto não há autenticação real (Supabase, etapa futura). */
export const DEMO_USER_NAME = 'Paulo R.';

interface AuthContextValue {
  user: User | null;
  signIn: (email: string) => Promise<User>;
  signUp: (name: string, email: string) => Promise<User>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** Simula a latência de uma chamada de rede, para que o estado "carregando" dos botões seja visível. */
const fakeLatency = () => new Promise((resolve) => setTimeout(resolve, 700));

/**
 * Sessão do usuário em memória. Serve para a navegação decidir quais telas
 * existem (Login/Cadastro vs. área logada) e para o botão "Sair" das
 * Configurações. Não há validação de senha nem persistência: a
 * autenticação real com Supabase está prevista para uma etapa futura (ver
 * docs/arquitetura.md).
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const signIn = useCallback(async (email: string) => {
    await fakeLatency();
    const next = { name: DEMO_USER_NAME, email: email.trim().toLowerCase() };
    setUser(next);
    return next;
  }, []);

  const signUp = useCallback(async (name: string, email: string) => {
    await fakeLatency();
    const next = { name: name.trim(), email: email.trim().toLowerCase() };
    setUser(next);
    return next;
  }, []);

  const signOut = useCallback(() => setUser(null), []);

  const value = useMemo(() => ({ user, signIn, signUp, signOut }), [user, signIn, signUp, signOut]);

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
