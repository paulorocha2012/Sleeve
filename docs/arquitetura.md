# Arquitetura — Sleeve

> Documento vivo: começa simples na Etapa 1 e é detalhado a cada etapa em
> que a arquitetura evolui (ver seção "Evolução por etapa"). Não é uma
> entrega obrigatória da Etapa 1, mas é mantido desde já para acompanhar o
> desenvolvimento.

## Visão geral

```
┌────────────────────────┐
│   App (React Native)    │
│  Expo + TypeScript       │
└───────────┬──────────────┘
            │
   ┌────────┼─────────────┐
   ▼                          ▼
┌─────────────┐      ┌──────────────────┐
│ MusicBrainz   │      │ Supabase             │
│ + CoverArt     │      │ (Auth + Postgres) │
│ (dados de     │      │ (usuários,         │
│ álbum/EP)     │      │  avaliações)         │
└─────────────┘      └──────────────────┘
            ▲
            │
   ┌────────┴─────────┐
   │ AsyncStorage        │
   │ (sessão, cache,    │
   │  fila offline)       │
   └────────────────────┘
```

## Camadas (src/)

- `screens/` — telas da aplicação (uma por arquivo), sem lógica de acesso a
  dados diretamente — apenas UI e chamadas para `services/`.
- `navigation/` — configuração de navegação (stack raiz + tabs principais).
- `services/` — toda comunicação externa: `musicbrainz.ts` (API de álbuns),
  `supabase.ts` (auth + dados remotos), `localStorage.ts` (persistência
  local).
- `store/` — estado global compartilhado entre telas (sessão do usuário,
  avaliações carregadas). Ainda não implementado na Etapa 1.
- `types/` — tipos TypeScript do domínio (`Album`, `Review`, `UserProfile`).

## Modelo de dados (previsto)

**users** (gerenciado pelo Supabase Auth + tabela `profiles`)
- id (uuid, pk)
- username
- display_name
- avatar_url
- bio

**reviews**
- id (uuid, pk)
- user_id (fk -> profiles.id)
- album_mbid (referência ao release-group do MusicBrainz)
- verdict ("liked" | "disliked")
- text
- created_at

Nenhuma tabela de "notas" existe por design — o campo `verdict` é
estritamente binário.

## Decisões técnicas e justificativas

| Decisão | Justificativa |
|---|---|
| React Native + Expo | Ciclo rápido de teste no dispositivo físico; grande suporte a recursos nativos via Expo SDK. |
| TypeScript | Reduz erros de integração ao consumir APIs externas (MusicBrainz, Supabase). |
| Supabase como backend | Fornece Auth + Postgres gerenciado, permitindo focar o tempo do semestre nos conceitos mobile da disciplina sem abrir mão de segurança (RLS) e modelagem de dados próprias. |
| MusicBrainz + Cover Art Archive | APIs públicas, gratuitas, sem necessidade de chave — evita bloqueios/custos durante o semestre. |
| Sem sistema de notas | Requisito central do projeto: avaliação deve ser só "gostei/não gostei" + crítica em texto. |
| AsyncStorage para dados locais | Simples, nativo do ecossistema Expo, suficiente para sessão/cache/fila offline (sem necessidade de SQL local nesta fase). |

## Evolução por etapa (roadmap)

| Etapa | Foco | Conceitos da disciplina cobertos |
|---|---|---|
| 1 | Proposta, estrutura do projeto, telas estáticas e navegação | Interfaces, navegação, arquitetura inicial |
| 2 | Persistência local + estado global (avaliações salvas só no dispositivo, com dados de álbum mockados) | Persistência local, gerenciamento de estado |
| 3 | Integração real com MusicBrainz + Cover Art Archive na busca | Comunicação com APIs, tratamento de erros, desempenho (cache/debounce) |
| 4 | Autenticação com Supabase (cadastro/login/sessão) | Segurança, backend/serviços externos |
| 5 | Avaliações sincronizadas com o Supabase (local + remoto) | Arquitetura (camada de dados), persistência híbrida |
| 6 | Feed social e tela de álbum com avaliações de todos os usuários | Interface/UX, arquitetura (consultas relacionais), desempenho (paginação) |
| 7 | Recursos nativos: compartilhar avaliação, notificações, foto de perfil | Recursos nativos do dispositivo, permissões |
| 8 | Segurança (RLS, validação de entrada) e tratamento de erros em toda a app | Segurança, tratamento de erros |
| 9 | Testes unitários e de componentes | Testes |
| 10 | Otimização de listas/imagens e build de publicação (EAS) | Desempenho, preparação para publicação |
| final | Revisão geral, documentação final e polimento | Todos os anteriores |

Mudanças de escopo, se necessárias, serão registradas nesta tabela e
justificadas conforme exigido pelas regras da disciplina.
