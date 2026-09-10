# Etapa 2 — Implementação do protótipo de interface

Esta etapa transforma a proposta da Etapa 1 (`docs/proposta.md`) na primeira
versão visual e navegável do Sleeve: uma aplicação React Native (Expo) +
TypeScript com as 6 telas previstas, sem persistência de dados nem
comunicação com servidor (fora do escopo desta etapa).

## Telas implementadas

| # | Tela | Arquivo | Papel no fluxo |
|---|------|---------|-----------------|
| 1 | Login / Cadastro | `src/screens/LoginScreen.tsx` | Tela inicial da aplicação. |
| 2 | Feed | `src/screens/FeedScreen.tsx` | Aba inicial pós-login: lista as avaliações recentes de todos os usuários. |
| 3 | Buscar | `src/screens/SearchScreen.tsx` | Busca e filtro do catálogo de álbuns/EPs. |
| 4 | Detalhe do álbum | `src/screens/AlbumDetailScreen.tsx` | Dados do álbum e todas as avaliações feitas sobre ele. |
| 5 | Nova avaliação | `src/screens/NewReviewScreen.tsx` | Registro do veredito binário + crítica em texto. |
| 6 | Perfil | `src/screens/ProfileScreen.tsx` | Estatísticas do usuário e grade dos álbuns avaliados. |

A navegação segue o fluxo previsto na Etapa 1 (`docs/proposta.md`): Login
leva às abas principais (Feed, Buscar, Perfil); a partir de Buscar ou do
Feed chega-se ao Detalhe do álbum; do Detalhe chega-se à Nova avaliação,
que ao salvar retorna ao Detalhe já com a avaliação listada.

## Principais componentes utilizados

- **React Navigation** — `@react-navigation/native-stack` para a pilha
  principal (Login → Main → Detalhe → Nova avaliação) e
  `@react-navigation/bottom-tabs` para as abas (Feed/Buscar/Perfil),
  configuradas em `src/navigation/RootNavigator.tsx`.
- **`FlatList`** — listagem do feed, dos resultados de busca, das
  avaliações de um álbum e da grade de álbuns do perfil.
- **`TextInput`** — campos de e-mail/senha (Login), busca (Buscar) e
  crítica em texto livre (Nova avaliação).
- **`@expo/vector-icons` (Feather)** — ícones de navegação, busca,
  gostei/não gostei e ações (voltar, fechar).
- **`react-native-safe-area-context`** — respeito às áreas seguras
  (notch/status bar) em todas as telas via `ScreenContainer`.

## Componentes reutilizáveis (`src/components/`)

Separados das telas para reaproveitamento entre elas, sem lógica de tela
embutida:

- `ScreenContainer` — casca usada por todas as telas: aplica a cor de
  fundo do tema, respeita as áreas seguras e centraliza o conteúdo em
  telas largas.
- `PrimaryButton` — botão de ação principal, usado em Login e Detalhe do
  álbum.
- `LikeToggle` — o par de opções gostei/não gostei, usado na Nova
  avaliação.
- `VerdictBadge` — selo somente leitura do veredito, usado no Feed e no
  Detalhe do álbum.
- `AlbumCover` — placeholder de capa (inicial do título), usado em listas,
  detalhe e grade do perfil.
- `AlbumListItem` — linha de álbum (capa + título + artista/ano), usada na
  Busca e reaproveitável em outras listas.
- `SearchField` — campo de busca com ícone, usado na tela Buscar.

## Elementos de entrada de dados

- **Login**: campos de e-mail (`keyboardType="email-address"`) e senha
  (`secureTextEntry`).
- **Buscar**: campo de texto livre para busca por álbum/artista, mais
  filtros por tipo (Todos/Álbum/EP) como chips selecionáveis.
- **Nova avaliação**: seletor binário gostei/não gostei (`LikeToggle`) e
  campo de texto multilinha para a crítica, com limite de 500 caracteres e
  contador visível; o botão "Salvar avaliação" só habilita quando os dois
  campos estão preenchidos.
- **Perfil**: chips de filtro (Gostei/Não gostei) sobre a grade de álbuns
  avaliados.

## Estratégias de adaptação de layout a diferentes tamanhos de tela

- Layout construído inteiramente com **Flexbox** (sem larguras fixas em
  pixels na maioria dos componentes), permitindo que o conteúdo se
  redistribua conforme o espaço disponível.
- `ScreenContainer` usa `useWindowDimensions` para limitar a largura do
  conteúdo (`maxWidth: 640`, centralizado) em telas largas (tablets/web),
  evitando que formulários e cartões fiquem esticados de ponta a ponta.
- A grade de álbuns do Perfil (`FlatList` com `numColumns`) recalcula o
  número de colunas dinamicamente a partir da largura da janela (3 colunas
  em celulares, 4 em telas médias, 5 em telas largas).
- Uso de `SafeAreaView`/`edges` para respeitar notch, status bar e barra de
  gestos em diferentes aparelhos.
- Textos truncados com `numberOfLines` e componentes com `flex`/`minWidth: 0`
  evitam overflow em telas estreitas.

## Instruções para execução

```bash
npm install
npx expo install --fix
npm start
```

Escaneie o QR code com o app **Expo Go** (Android/iOS) ou pressione `a`/`i`
no terminal para abrir em um emulador/simulador. `npm run web` também
funciona para uma checagem rápida no navegador.

## Principais decisões de interface tomadas nesta etapa

- **Nenhum sistema de notas em lugar algum da interface** — decisão
  central do projeto (Etapa 1) reforçada aqui: o único controle de
  avaliação é o `LikeToggle` binário, sem estrelas, sem números.
- **Estado das avaliações em memória (`ReviewsContext`)**, e não isolado em
  cada tela: permite que uma avaliação salva na tela Nova avaliação
  apareça imediatamente no Detalhe do álbum, no Feed e no Perfil, mesmo
  sem persistência — demonstra a navegação e a composição das telas de
  forma realista dentro do que a etapa permite.
- **Catálogo de álbuns mock** (`src/data/mockAlbums.ts`) no lugar da
  integração com MusicBrainz/Cover Art Archive, adiada para quando a
  aplicação tiver comunicação com servidor (fora do escopo desta etapa).
- **Paleta clara (branco + azul `#045dd1`)**, centralizada em tokens de cor
  em `src/theme/colors.ts` e aplicada de forma consistente via `StyleSheet`
  em todas as telas — nenhuma tela declara cor "solta". O token `onAccent`
  existe justamente para o texto/ícone que fica sobre um preenchimento
  azul, garantindo contraste em botões, chips ativos e no seletor
  gostei/não gostei. Trocar a identidade visual do app inteiro é uma
  alteração de um único arquivo.
- **Nova avaliação como modal** (`presentation: 'modal'` na pilha de
  navegação), reforçando que é uma ação pontual sobre um álbum específico,
  e não mais uma tela do fluxo principal de navegação por abas.
