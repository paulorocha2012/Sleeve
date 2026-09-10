import { Album } from '@/types';

/**
 * Catálogo de exemplo usado nesta etapa no lugar da integração real com a
 * MusicBrainz/Cover Art Archive (prevista para uma etapa futura, quando a
 * aplicação passar a ter comunicação com servidor).
 */
export const mockAlbums: Album[] = [
  { id: 'a1', title: 'Campo Magnético', artist: 'Antena', year: 2022, type: 'Álbum', cover: 'C' },
  { id: 'a2', title: 'Deriva', artist: 'Paralelo Sul', year: 2024, type: 'EP', cover: 'D' },
  { id: 'a3', title: 'Ano-Luz', artist: 'Constelar', year: 2021, type: 'Álbum', cover: 'A' },
  { id: 'a4', title: 'Ruído Branco', artist: 'Vetor Cinza', year: 2023, type: 'EP', cover: 'R' },
  { id: 'a5', title: 'Litoral', artist: 'Névoa Norte', year: 2020, type: 'Álbum', cover: 'L' },
  { id: 'a6', title: 'Noturno', artist: 'Sala Vazia', year: 2024, type: 'EP', cover: 'N' },
];

export function findAlbum(albumId: string): Album | undefined {
  return mockAlbums.find((album) => album.id === albumId);
}
