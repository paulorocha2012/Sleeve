import React, { createContext, useContext, useMemo } from 'react';
import { Listen, WantItem } from '@/types';
import { KEYS } from '@/storage/storage';
import { usePersistentState } from '@/storage/usePersistentState';
import { seedListens, seedWantList } from '@/data/seed';
import { DEMO_USER_NAME, useAuth } from './AuthContext';

interface DiaryContextValue {
  ready: boolean;
  /** Escutas do usuário logado, da mais recente para a mais antiga. */
  myListens: Listen[];
  /** Álbuns que o usuário logado quer ouvir, do mais recente para o mais antigo. */
  myWantList: WantItem[];
  listensFor: (albumId: string) => Listen[];
  addListen: (albumId: string) => void;
  removeListen: (id: string) => void;
  isWanted: (albumId: string) => boolean;
  toggleWant: (albumId: string) => boolean;
  /** Apaga escutas e a lista "Quero ouvir" do usuário logado (Configurações). */
  clearMine: () => void;
}

const DiaryContext = createContext<DiaryContextValue | undefined>(undefined);

const byDateDesc = (a: Listen, b: Listen) => b.date.localeCompare(a.date);

/**
 * Diário do usuário com cada álbum: as escutas registradas ("Ouvi hoje") e
 * a lista "Quero ouvir". Salvo em `sleeve:escutas` e `sleeve:quero-ouvir`.
 */
export function DiaryProvider({ children }: { children: React.ReactNode }) {
  const [listens, setListens, listensReady] = usePersistentState<Listen[]>(KEYS.listens, seedListens);
  const [wantList, setWantList, wantReady] = usePersistentState<WantItem[]>(KEYS.wantList, seedWantList);
  const { user } = useAuth();
  const currentUser = user?.name ?? DEMO_USER_NAME;

  const value = useMemo<DiaryContextValue>(() => {
    const myListens = listens.filter((l) => l.user === currentUser).sort(byDateDesc);
    const myWantList = wantList.filter((w) => w.user === currentUser);
    const isWanted = (albumId: string) => myWantList.some((w) => w.albumId === albumId);

    return {
      ready: listensReady && wantReady,
      myListens,
      myWantList,
      listensFor: (albumId) => myListens.filter((l) => l.albumId === albumId),

      addListen: (albumId) => {
        const listen: Listen = { id: `l${Date.now()}`, albumId, user: currentUser, date: new Date().toISOString() };
        setListens((prev) => [listen, ...prev]);
        // Quem ouviu já não precisa mais do lembrete.
        setWantList((prev) => prev.filter((w) => !(w.albumId === albumId && w.user === currentUser)));
      },
      removeListen: (id) => {
        setListens((prev) => prev.filter((l) => l.id !== id));
      },

      isWanted,
      toggleWant: (albumId) => {
        const wanted = isWanted(albumId);
        setWantList((prev) =>
          wanted
            ? prev.filter((w) => !(w.albumId === albumId && w.user === currentUser))
            : [{ albumId, user: currentUser, addedAt: new Date().toISOString() }, ...prev],
        );
        return !wanted;
      },

      clearMine: () => {
        setListens((prev) => prev.filter((l) => l.user !== currentUser));
        setWantList((prev) => prev.filter((w) => w.user !== currentUser));
      },
    };
  }, [listens, wantList, currentUser, listensReady, wantReady, setListens, setWantList]);

  return <DiaryContext.Provider value={value}>{children}</DiaryContext.Provider>;
}

export function useDiary() {
  const ctx = useContext(DiaryContext);
  if (!ctx) {
    throw new Error('useDiary precisa ser usado dentro de um DiaryProvider');
  }
  return ctx;
}
