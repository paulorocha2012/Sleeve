// Tipos centrais do domínio da aplicação.
// Serão refinados nas próximas etapas (ex.: campos vindos do Supabase / MusicBrainz).

export type Verdict = "liked" | "disliked";

export type ReleaseType = "album" | "ep";

export interface Album {
  mbid: string; // MusicBrainz Release Group ID
  title: string;
  artist: string;
  coverUrl?: string;
  releaseYear?: number;
  type: ReleaseType;
}

export interface Review {
  id: string;
  userId: string;
  albumMbid: string;
  verdict: Verdict;
  text: string;
  createdAt: string; // ISO date
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
}
