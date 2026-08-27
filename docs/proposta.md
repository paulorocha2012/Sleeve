# Proposta — Sleeve

> Documento da Etapa 1 (Proposta e Planejamento) da disciplina Tecnologia de
> Construção de Software II. Este documento é a referência inicial do
> projeto e poderá ser ajustado ao longo do semestre, mediante justificativa
> (ver seção "Histórico de mudanças" ao final).

## 1. Nome da aplicação

**Sleeve**

O nome faz referência à capa/"sleeve" de um álbum — o objeto que primeiro
identifica um disco antes mesmo de ele ser ouvido — e remete a Last.fm,
Letterboxd e RYM sem copiar nenhum deles diretamente.

## 2. Problema que a aplicação pretende resolver

Ferramentas de "diário musical" existentes tendem a resolver dois problemas
diferentes de formas insatisfatórias para quem quer avaliar **álbuns e EPs
como obras completas**:

- Last.fm foca em *scrobbling* (contagem automática de execuções), não em
  avaliação crítica pessoal do álbum como um todo.
- Rate Your Music (RYM) e aplicativos similares a Letterboxd usam escalas
  numéricas (notas de 0 a 5, ou 0 a 10) que exigem calibração, geram
  comparações artificiais ("por que 7 e não 8?") e desestimulam quem só quer
  registrar uma opinião simples e escrever sobre ela.

Sleeve resolve isso removendo a nota numérica por completo: a avaliação é
binária — **gostei / não gostei** — e o espaço que normalmente seria gasto
"calibrando uma nota" é reaproveitado para escrever uma crítica de verdade.

## 3. Público-alvo

Ouvintes que consomem música primariamente em formato de álbum/EP (não
playlists de faixas soltas), que já têm o hábito de escrever ou ler críticas
curtas sobre discos, e que preferem uma avaliação direta a uma escala
numérica. Inclui desde ouvintes casuais que querem manter um histórico do
que ouviram, até fãs mais assíduos que gostam de descobrir o que outras
pessoas acharam de um álbum específico.

## 4. Objetivo principal

Permitir que o usuário registre, de forma rápida e binária, se gostou ou não
de um álbum/EP, acompanhado de uma crítica em texto livre, e que possa ver o
que outras pessoas acharam do mesmo álbum — construindo um histórico pessoal
e, ao mesmo tempo, um mural coletivo de opiniões sobre cada disco.

## 5. Descrição das principais funcionalidades

- **Autenticação**: cadastro e login de usuário.
- **Busca de álbuns/EPs**: busca por título/artista usando a API pública do
  MusicBrainz (metadados) e Cover Art Archive (capas), restrita a
  *release-groups* do tipo Album ou EP.
- **Avaliação binária**: marcar um álbum como "Gostei" ou "Não gostei",
  acompanhado de um texto de crítica escrito pelo usuário. Nenhuma nota
  numérica ou sistema de estrelas em nenhum momento do app.
- **Edição/exclusão** da própria avaliação.
- **Tela de álbum**: exibe a capa, artista, ano e todas as avaliações
  (de todos os usuários) feitas sobre aquele álbum.
- **Feed**: avaliações recentes da comunidade.
- **Perfil do usuário**: dados básicos e histórico de álbuns avaliados,
  separados visualmente em "gostei" e "não gostei".

Funcionalidades de rede social mais avançadas (seguir usuários, notificações
push) estão previstas no roadmap, mas entram em etapas posteriores — ver
`docs/arquitetura.md`.

## 6. Telas previstas (mínimo de 4)

1. **Login / Cadastro** — autenticação do usuário.
2. **Home / Feed** — avaliações recentes.
3. **Buscar** — busca de álbuns/EPs via MusicBrainz.
4. **Detalhe do álbum** — capa, dados do álbum e lista de avaliações de
   todos os usuários.
5. **Nova avaliação** — botões "Gostei" / "Não gostei" + campo de texto
   para a crítica.
6. **Perfil** — dados do usuário e seu histórico de avaliações.

(6 telas definidas, acima do mínimo de 4 exigido.)

## 7. Fluxo básico de navegação

```
Login ──(entrar)──▶ [Tabs principais]
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
      Home            Buscar          Perfil
        │               │
        │               ▼
        │        Detalhe do álbum
        │               │
        │               ▼
        │        Nova avaliação
        │               │
        └───────◀───────┘
        (avaliação salva volta para Detalhe do álbum,
         que passa a exibi-la na lista)
```

Navegação por abas (Home, Buscar, Perfil) na base do app, com uma pilha
(stack) sobre as abas para as telas de Detalhe do álbum e Nova avaliação,
acessadas a partir de qualquer aba. Login fica fora das abas, como tela
inicial da pilha raiz.

## 8. Tecnologia escolhida para o desenvolvimento mobile

**React Native com Expo, em TypeScript**, usando `@react-navigation` para
navegação (bottom tabs + native stack).

Justificativa: Expo permite testar no celular físico rapidamente durante
todo o semestre (via Expo Go / EAS Build), tem grande ecossistema de
bibliotecas prontas para os requisitos futuros da disciplina (persistência,
recursos nativos, notificações), e TypeScript reduz erros ao integrar com
APIs externas e com o backend.

## 9. Tecnologia escolhida para o backend

**Supabase** (PostgreSQL gerenciado + Auth + Storage), consumido via SDK
oficial (`@supabase/supabase-js`).

Justificativa: como as regras da disciplina não exigem backend próprio e
permitem serviços externos, optar por um BaaS (Backend as a Service) libera
tempo do semestre para os conceitos centrais do curso que são específicos de
mobile (interface, navegação, estado, recursos nativos, testes, desempenho e
publicação), sem abrir mão de pontos importantes da avaliação: o schema do
banco (PostgreSQL) e as políticas de segurança (Row Level Security) são
escritos e versionados pelo próprio aluno, o que ainda exige e demonstra
domínio de modelagem de dados e de segurança — só a infraestrutura de
servidor é terceirizada, não o design da solução.

## 10. Necessidade de comunicação com APIs externas

**Sim.** Duas integrações estão previstas:

- **MusicBrainz** (`https://musicbrainz.org/ws/2/`) — busca de metadados de
  álbuns/EPs (título, artista, ano, tipo de release).
- **Cover Art Archive** (`https://coverartarchive.org/`) — capas dos álbuns.

Ambas são públicas, gratuitas e não exigem chave de API.

## 11. Forma prevista de armazenamento de dados

Armazenamento híbrido:

- **Local** (`AsyncStorage`, via `src/services/localStorage.ts`): sessão do
  usuário, cache de resultados de busca já consultados no MusicBrainz, e
  rascunhos de avaliações feitas offline até serem sincronizadas.
- **Remoto** (Supabase / PostgreSQL): usuários, avaliações (`reviews`) e,
  futuramente, um cache de metadados de álbuns já buscados por qualquer
  usuário, para reduzir chamadas repetidas ao MusicBrainz.

O detalhamento do schema fica em `docs/arquitetura.md`.

## 12. Repositório Git

Repositório Git inicializado localmente nesta etapa, contendo a estrutura de
diretórios abaixo e o projeto Expo/TypeScript inicial (telas placeholder e
navegação já funcionando, sem lógica de negócio ainda). Entrega marcada com
a tag `etapa-01`.

## 13. Estrutura inicial de diretórios

```
Sleeve/
├── README.md
├── app.json
├── package.json
├── tsconfig.json
├── babel.config.js
├── App.tsx
├── docs/
│   ├── proposta.md
│   └── arquitetura.md
├── src/
│   ├── screens/        (as 6 telas da proposta)
│   ├── navigation/      (AppNavigator.tsx)
│   ├── services/        (musicbrainz.ts, supabase.ts, localStorage.ts)
│   ├── store/            (gerenciamento de estado — etapa futura)
│   ├── components/     (componentes reutilizáveis — etapa futura)
│   └── types/            (tipos do domínio: Album, Review, UserProfile)
├── tests/
└── assets/
```

## Histórico de mudanças

- **Etapa 1**: proposta inicial criada.
