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
  dados diretamente — apenas UI e chamadas para `state/`/`data/` (e, a
  partir de uma etapa futura, `services/`).
- `navigation/` — configuração de navegação (stack raiz + tabs principais).
- `components/` — componentes de UI reutilizados por mais de uma tela
  (botão, capa de álbum, badge de veredito, alternador gostei/não gostei,
  campo de busca, item de lista, casca de tela).
- `theme/` — tokens de cor/espaçamento/raio usados por todas as telas.
- `state/` — estado compartilhado entre telas em memória (`ReviewsContext`,
  Etapa 2). Passa a usar persistência local (AsyncStorage) numa etapa
  futura.
- `data/` — catálogo mock de álbuns usado enquanto não há integração real
  com a MusicBrainz/Cover Art Archive.
- `services/` — comunicação externa (`musicbrainz.ts`, `supabase.ts`,
  persistência local): ainda não implementado, previsto para as próximas
  etapas conforme o roadmap abaixo.
- `types/` — tipos TypeScript do domínio (`Album`, `Review`, tipos de
  navegação).

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
| 1 | Proposta e planejamento (sem código-fonte) | Análise de requisitos, arquitetura inicial |
| 2 | Protótipo de interface: telas reais e navegáveis, componentes reutilizáveis, sem persistência nem backend | Interfaces, navegação, componentização, responsividade |
| 3 | Persistência local (avaliações salvas no dispositivo, dados de álbum ainda mockados) | Persistência local, gerenciamento de estado |
| 4 | Integração real com MusicBrainz + Cover Art Archive na busca | Comunicação com APIs, tratamento de erros, desempenho (cache/debounce) |
| 5 | Autenticação com Supabase (cadastro/login/sessão) | Segurança, backend/serviços externos |
| 6 | Avaliações sincronizadas com o Supabase (local + remoto) e feed social entre usuários reais | Arquitetura (camada de dados), persistência híbrida, consultas relacionais |
| 7 | Recursos nativos: compartilhar avaliação, notificações, foto de perfil | Recursos nativos do dispositivo, permissões |
| 8 | Segurança (RLS, validação de entrada) e tratamento de erros em toda a app | Segurança, tratamento de erros |
| 9 | Testes unitários e de componentes | Testes |
| 10 | Otimização de listas/imagens e build de publicação (EAS) | Desempenho, preparação para publicação |
| final | Revisão geral, documentação final e polimento | Todos os anteriores |

> **Nota (Etapa 2):** as linhas 1 e 2 foram ajustadas em relação à versão
> original deste roadmap (escrita antes da divulgação do enunciado
> oficial de cada etapa, com base apenas nas regras gerais da disciplina).
> A Etapa 1 real cobriu só proposta/planejamento, e a implementação da
> interface (antes prevista para dentro da Etapa 1) passou a ser o foco
> desta Etapa 2, empurrando persistência local para a Etapa 3. As demais
> linhas foram renumeradas/compactadas para manter o roadmap dentro de 10
> etapas + final.

Mudanças de escopo, se necessárias, serão registradas nesta tabela e
justificadas conforme exigido pelas regras da disciplina.
