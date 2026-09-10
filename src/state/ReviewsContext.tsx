import React, { createContext, useContext, useMemo, useState } from 'react';
import { Review, Verdict } from '@/types';

const CURRENT_USER = 'Paulo R.';

const initialReviews: Review[] = [
  {
    id: 'r1',
    albumId: 'a1',
    author: CURRENT_USER,
    verdict: 'gostei',
    text:
      'Do início ao fim sem um momento fraco. A produção respira e deixa espaço pra voz contar a história — em especial a faixa 4, que resume o disco inteiro em três minutos.',
  },
  {
    id: 'r2',
    albumId: 'a3',
    author: CURRENT_USER,
    verdict: 'gostei',
    text: 'Atmosférico e coerente, ótimo pra ouvir em sequência.',
  },
  {
    id: 'r3',
    albumId: 'a4',
    author: CURRENT_USER,
    verdict: 'nao_gostei',
    text: 'Boas ideias soltas, mas não emenda como EP.',
  },
  {
    id: 'r4',
    albumId: 'a2',
    author: 'Marina S.',
    verdict: 'gostei',
    text: 'EP curto mas certeiro, dá vontade de repetir na hora.',
  },
];

interface ReviewsContextValue {
  reviews: Review[];
  currentUser: string;
  addReview: (albumId: string, verdict: Verdict, text: string) => void;
  reviewsForAlbum: (albumId: string) => Review[];
}

const ReviewsContext = createContext<ReviewsContextValue | undefined>(undefined);

/**
 * Guarda as avaliações em memória (estado do React) para toda a árvore de
 * telas. Nesta etapa não há persistência local nem backend — os dados somem
 * ao fechar o app, como previsto no enunciado da Etapa 2.
 */
export function ReviewsProvider({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  const value = useMemo<ReviewsContextValue>(
    () => ({
      reviews,
      currentUser: CURRENT_USER,
      addReview: (albumId, verdict, text) => {
        setReviews((prev) => [
          { id: `r${Date.now()}`, albumId, author: CURRENT_USER, verdict, text },
          ...prev,
        ]);
      },
      reviewsForAlbum: (albumId) => reviews.filter((r) => r.albumId === albumId),
    }),
    [reviews],
  );

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
}

export function useReviews() {
  const ctx = useContext(ReviewsContext);
  if (!ctx) {
    throw new Error('useReviews precisa ser usado dentro de um ReviewsProvider');
  }
  return ctx;
}
