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
  /** Datas em ISO 8601 (ex.: "2026-10-21T23:10:00.000Z"). */
  createdAt: string;
  updatedAt?: string;
}

/** Avaliação começada e ainda não publicada. Fica salva para não se perder se o app fechar. */
export interface Draft {
  albumId: string;
  author: string;
  verdict: Verdict | null;
  text: string;
  updatedAt: string;
}

/** Uma escuta registrada pelo botão "Ouvi hoje". */
export interface Listen {
  id: string;
  albumId: string;
  user: string;
  date: string;
}

/** Álbum guardado para ouvir depois. */
export interface WantItem {
  albumId: string;
  user: string;
  addedAt: string;
}

export interface User {
  name: string;
  email: string;
}

/** Login/SignUp só existem sem sessão; o resto só com sessão (ver RootNavigator). */
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Main: undefined;
  AlbumDetail: { albumId: string };
  /** Com `reviewId`, a tela abre em modo de edição. */
  NewReview: { albumId: string; reviewId?: string };
  Settings: undefined;
};

export type MainTabParamList = {
  Feed: undefined;
  Buscar: undefined;
  Perfil: undefined;
};
