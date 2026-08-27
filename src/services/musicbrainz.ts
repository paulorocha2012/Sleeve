// Cliente para a API pública do MusicBrainz + Cover Art Archive.
// Nenhuma chave de API é necessária. Será implementado na etapa de
// "comunicação com APIs externas".
//
// Endpoints previstos:
//   Busca de release-groups (álbum/EP):
//     https://musicbrainz.org/ws/2/release-group/?query=...&fmt=json
//   Capa do álbum:
//     https://coverartarchive.org/release-group/{mbid}/front

import type { Album } from "../types";

export async function searchAlbums(_query: string): Promise<Album[]> {
  // TODO (próxima etapa): implementar chamada real + filtro por tipo
  // (Album | EP) + tratamento de erros e cache local dos resultados.
  return [];
}
