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

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  AlbumDetail: { albumId: string };
  NewReview: { albumId: string };
};

export type MainTabParamList = {
  Feed: undefined;
  Buscar: undefined;
  Perfil: undefined;
};
