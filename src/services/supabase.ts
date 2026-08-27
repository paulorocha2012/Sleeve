// Ponto único de configuração do cliente Supabase (Auth + Postgres).
// As credenciais reais (URL e anon key) serão adicionadas via variáveis de
// ambiente (.env, fora do controle de versão) numa etapa futura, quando o
// backend for de fato integrado (autenticação e sincronização de avaliações).

export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

// TODO (etapa futura): criar cliente com @supabase/supabase-js e expor
// helpers de auth (signUp, signIn, signOut) e de dados (reviews, profiles).
