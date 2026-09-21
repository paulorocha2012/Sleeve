export type Verdict = 'gostei' | 'nao_gostei';

export type AlbumType = 'Álbum' | 'EP';

export interface Album {
  id: string;
  title: string;
  artist: string;
  year: number;
  type: AlbumType;
  /** Letra usada como placeholder de capa enquanto não há integração com a Cover Art Archive. */
  cover: string;
}

export interface Review {
  id: string;
  albumId: string;
  author: string;
  verdict: Verdict;
  text: string;
}

export interface User {
  name: string;
  email: string;
}

/**
 * Pilha raiz. Login/SignUp só existem na pilha enquanto não há sessão;
 * Main/AlbumDetail/NewReview/Settings só existem com sessão ativa (fluxo de
 * autenticação do React Navigation — ver src/navigation/RootNavigator.tsx).
 */
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Main: undefined;
  AlbumDetail: { albumId: string };
  NewReview: { albumId: string };
  Settings: undefined;
};

export type MainTabParamList = {
  Feed: undefined;
  Buscar: undefined;
  Perfil: undefined;
};
