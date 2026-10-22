import { Listen, Review, WantItem } from '@/types';
import { DEMO_USER_NAME } from '@/state/AuthContext';

/**
 * Dados de exemplo gravados só na primeira vez que o app abre (quando as
 * chaves ainda não existem no aparelho). Depois disso, o que vale é o que
 * está salvo.
 */

export const seedReviews: Review[] = [
  {
    id: 'r1',
    albumId: 'a1',
    author: DEMO_USER_NAME,
    verdict: 'gostei',
    text:
      'Do início ao fim sem um momento fraco. A produção respira e deixa espaço pra voz contar a história — em especial a faixa 4, que resume o disco inteiro em três minutos.',
    createdAt: '2026-09-02T22:10:00.000Z',
  },
  {
    id: 'r2',
    albumId: 'a3',
    author: DEMO_USER_NAME,
    verdict: 'gostei',
    text: 'Atmosférico e coerente, ótimo pra ouvir em sequência.',
    createdAt: '2026-08-19T01:30:00.000Z',
  },
  {
    id: 'r3',
    albumId: 'a4',
    author: DEMO_USER_NAME,
    verdict: 'nao_gostei',
    text: 'Boas ideias soltas, mas não emenda como EP.',
    createdAt: '2026-07-28T20:05:00.000Z',
  },
  {
    id: 'r4',
    albumId: 'a2',
    author: 'Marina S.',
    verdict: 'gostei',
    text: 'EP curto mas certeiro, dá vontade de repetir na hora.',
    createdAt: '2026-07-14T15:40:00.000Z',
  },
];

export const seedListens: Listen[] = [
  { id: 'l1', albumId: 'a1', user: DEMO_USER_NAME, date: '2026-08-30T23:00:00.000Z' },
  { id: 'l2', albumId: 'a1', user: DEMO_USER_NAME, date: '2026-09-02T21:40:00.000Z' },
  { id: 'l3', albumId: 'a1', user: DEMO_USER_NAME, date: '2026-10-04T12:15:00.000Z' },
  { id: 'l4', albumId: 'a3', user: DEMO_USER_NAME, date: '2026-08-18T23:50:00.000Z' },
  { id: 'l5', albumId: 'a3', user: DEMO_USER_NAME, date: '2026-09-21T10:20:00.000Z' },
  { id: 'l6', albumId: 'a4', user: DEMO_USER_NAME, date: '2026-07-28T19:30:00.000Z' },
  { id: 'l7', albumId: 'a5', user: DEMO_USER_NAME, date: '2026-10-11T18:00:00.000Z' },
];

export const seedWantList: WantItem[] = [
  { albumId: 'a6', user: DEMO_USER_NAME, addedAt: '2026-10-12T14:00:00.000Z' },
];
