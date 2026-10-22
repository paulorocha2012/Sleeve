import React, { createContext, useContext, useMemo } from 'react';
import { Draft, Review, Verdict } from '@/types';
import { KEYS } from '@/storage/storage';
import { usePersistentState } from '@/storage/usePersistentState';
import { seedReviews } from '@/data/seed';
import { DEMO_USER_NAME, useAuth } from './AuthContext';

interface ReviewsContextValue {
  reviews: Review[];
  /** Nome do usuário logado (vem do AuthContext). */
  currentUser: string;
  ready: boolean;
  addReview: (albumId: string, verdict: Verdict, text: string) => void;
  updateReview: (id: string, verdict: Verdict, text: string) => void;
  deleteReview: (id: string) => void;
  reviewsForAlbum: (albumId: string) => Review[];
  myReviewFor: (albumId: string) => Review | undefined;
  draftFor: (albumId: string) => Draft | undefined;
  saveDraft: (albumId: string, verdict: Verdict | null, text: string) => void;
  discardDraft: (albumId: string) => void;
  /** Apaga avaliações e rascunhos do usuário logado (Configurações). */
  clearMine: () => void;
}

const ReviewsContext = createContext<ReviewsContextValue | undefined>(undefined);

/**
 * Avaliações e rascunhos, salvos no aparelho (`sleeve:avaliacoes` e
 * `sleeve:rascunhos`). As funções abaixo só trocam o estado por um array
 * novo; quem grava no AsyncStorage é o `usePersistentState`.
 */
export function ReviewsProvider({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews, reviewsReady] = usePersistentState<Review[]>(KEYS.reviews, seedReviews);
  const [drafts, setDrafts, draftsReady] = usePersistentState<Draft[]>(KEYS.drafts, []);
  const { user } = useAuth();
  const currentUser = user?.name ?? DEMO_USER_NAME;

  const value = useMemo<ReviewsContextValue>(() => {
    const isMyDraft = (d: Draft, albumId: string) => d.albumId === albumId && d.author === currentUser;

    return {
      reviews,
      currentUser,
      ready: reviewsReady && draftsReady,

      // Criar
      addReview: (albumId, verdict, text) => {
        const review: Review = {
          id: `r${Date.now()}`,
          albumId,
          author: currentUser,
          verdict,
          text,
          createdAt: new Date().toISOString(),
        };
        setReviews((prev) => [review, ...prev]);
      },

      // Atualizar
      updateReview: (id, verdict, text) => {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, verdict, text, updatedAt: new Date().toISOString() } : r)),
        );
      },

      // Remover
      deleteReview: (id) => {
        setReviews((prev) => prev.filter((r) => r.id !== id));
      },

      reviewsForAlbum: (albumId) => reviews.filter((r) => r.albumId === albumId),
      myReviewFor: (albumId) => reviews.find((r) => r.albumId === albumId && r.author === currentUser),

      draftFor: (albumId) => drafts.find((d) => isMyDraft(d, albumId)),
      saveDraft: (albumId, verdict, text) => {
        const draft: Draft = { albumId, author: currentUser, verdict, text, updatedAt: new Date().toISOString() };
        setDrafts((prev) => [draft, ...prev.filter((d) => !isMyDraft(d, albumId))]);
      },
      discardDraft: (albumId) => {
        setDrafts((prev) => prev.filter((d) => !isMyDraft(d, albumId)));
      },

      clearMine: () => {
        setReviews((prev) => prev.filter((r) => r.author !== currentUser));
        setDrafts((prev) => prev.filter((d) => d.author !== currentUser));
      },
    };
  }, [reviews, drafts, currentUser, reviewsReady, draftsReady, setReviews, setDrafts]);

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
}

export function useReviews() {
  const ctx = useContext(ReviewsContext);
  if (!ctx) {
    throw new Error('useReviews precisa ser usado dentro de um ReviewsProvider');
  }
  return ctx;
}
