# Estrutura do código — Sleeve

Mapa de onde fica cada coisa e por onde os dados passam. Atualizado a cada
etapa (última revisão: Etapa 4).

## Pastas

```text
App.tsx                      monta os Providers e o navegador
src/
├── navigation/
│   └── RootNavigator.tsx    todas as rotas; espera os dados carregarem
├── screens/                 uma tela por arquivo
│   ├── LoginScreen.tsx
│   ├── SignUpScreen.tsx
│   ├── FeedScreen.tsx
│   ├── SearchScreen.tsx
│   ├── AlbumDetailScreen.tsx   escutas, linha do tempo, editar/apagar
│   ├── NewReviewScreen.tsx     nova avaliação, edição e rascunho
│   ├── ProfileScreen.tsx       números, resumo e grade filtrável
│   └── SettingsScreen.tsx      dados salvos, apagar dados, sair
├── components/              peças visuais reutilizáveis
│   ├── AlbumTimeline.tsx       linha do tempo do Detalhe (Etapa 4)
│   ├── ProfileSummary.tsx      barra + gráfico do Perfil (Etapa 4)
│   ├── ConfirmDialog.tsx       diálogo de confirmação (até 3 opções)
│   └── ...                     botões, campos, chips, capa, cabeçalho
├── state/                   dados compartilhados entre telas (Context)
│   ├── AuthContext.tsx         sessão
│   ├── ReviewsContext.tsx      avaliações + rascunhos
│   └── DiaryContext.tsx        escutas + "Quero ouvir" (Etapa 4)
├── storage/                 acesso ao armazenamento do aparelho (Etapa 4)
│   ├── storage.ts              chaves + loadJSON / saveJSON
│   └── usePersistentState.ts   useState que grava no aparelho
├── data/
│   ├── mockAlbums.ts           catálogo fixo de 6 álbuns
│   └── seed.ts                 dados de exemplo da primeira abertura
├── feedback/
│   └── FeedbackContext.tsx     avisos ("Avaliação publicada")
├── theme/colors.ts          cores, espaçamentos, tamanhos de toque, fontes
├── types/index.ts           tipos: Album, Review, Draft, Listen, WantItem, rotas
└── utils/date.ts            formatação de datas ("21 out")
docs/                        documentação de cada etapa
```

Regra de separação: a **tela** decide o que mostrar e para onde ir, o
**componente** decide como desenhar, o **state** guarda os dados, o
**storage** grava e lê do aparelho, o **tema** guarda os valores visuais.

## Ordem dos Providers (App.tsx)

```text
SafeAreaProvider
└── AuthProvider          sessão (os outros precisam saber quem está logado)
    └── ReviewsProvider   avaliações e rascunhos
        └── DiaryProvider escutas e "Quero ouvir"
            └── FeedbackProvider
                └── RootNavigator
```

## Caminho de um dado

Exemplo: tocar em "Ouvi hoje" no Detalhe do álbum.

```text
AlbumDetailScreen   onPress → addListen(albumId)
DiaryContext        setListens(prev => [novaEscuta, ...prev])
usePersistentState  o valor mudou → saveJSON('sleeve:escutas', lista)
storage.ts          AsyncStorage.setItem(...)
                    ↓ (o estado mudou, então todas as telas que leem redesenham)
AlbumDetailScreen   linha do tempo ganha "Ouviu de novo"
ProfileScreen       contador de escutas e gráfico atualizados
```

E ao abrir o app:

```text
usePersistentState  loadJSON('sleeve:escutas', seed) → setValue + ready = true
RootNavigator       espera auth, reviews e diary ficarem ready
                    → mostra Login (sem sessão) ou as abas (com sessão)
```

## Onde mexer para…

| Quero… | Arquivo |
|---|---|
| Criar um dado novo salvo no aparelho | chave em `storage.ts` → tipo em `types/index.ts` → `usePersistentState` num context → função de criar/remover no context |
| Mudar os dados de exemplo | `data/seed.ts` (só valem numa instalação nova, ou depois de limpar os dados do app/Expo Go) |
| Mudar quantos eventos a linha do tempo mostra | `TIMELINE_PREVIEW` em `AlbumDetailScreen.tsx` |
| Mudar quantos meses o gráfico mostra | `MONTHS_SHOWN` em `ProfileSummary.tsx` |
| Mudar o tempo de gravação do rascunho | `DRAFT_DELAY_MS` em `NewReviewScreen.tsx` |
| Ver o que está gravado | web: ferramentas do navegador → Application → Local Storage |
| Zerar os dados no celular | Configurações → "Apagar meus dados", ou desinstalar o app/limpar dados do Expo Go |
| Nova tela | tipo em `RootStackParamList` → arquivo em `screens/` → `Stack.Screen` no `RootNavigator` |
