# Etapa 4 — Persistência local de dados

Até a Etapa 3 tudo ficava em memória: fechou o app, perdeu as avaliações e
a sessão. Nesta etapa os dados passam a ser gravados no próprio aparelho e
recuperados quando o app abre de novo.

Aproveitei a etapa para atender o que o professor pediu na avaliação oral
da Etapa 3: o app tinha pouca coisa para o usuário fazer além de avaliar,
e não mostrava nada sobre a relação dele com o álbum ao longo do tempo.
Tudo o que entrou de novo também é dado persistido, então também serve
para demonstrar a persistência:

- **Escutas ("Ouvi hoje")** e uma **linha do tempo** no Detalhe do álbum
  com a história do usuário com aquele disco;
- lista **Quero ouvir**;
- **editar e apagar** a própria avaliação;
- **rascunho** da avaliação que sobrevive ao fechamento do app;
- **resumo visual** no Perfil (gostei × não gostei e escutas por mês).

O catálogo de álbuns continua fixo no código (`src/data/mockAlbums.ts`).
A busca real na MusicBrainz fica para a próxima etapa.

## 1. Mecanismo de persistência utilizado

**AsyncStorage** (`@react-native-async-storage/async-storage`, versão
2.2.0, a que acompanha o Expo SDK 57).

É um armazenamento chave → valor, assíncrono e não criptografado. Cada
valor é uma string, e eu guardo JSON nela. No Android ele grava num banco
SQLite interno do app, no iOS em arquivos na pasta do app e na web no
`localStorage` do navegador.

## 2. Justificativa da escolha

- **É o mais simples para o tamanho do problema.** São cinco conjuntos de
  dados pequenos (sessão, avaliações, rascunhos, escutas e lista). Cada
  um cabe inteiro numa chave como uma lista JSON e é lido de uma vez só
  quando o app abre. Não preciso de consultas, junções nem índices.
- **Funciona no Expo Go sem configuração nativa**, igual nas três
  plataformas (Android, iOS e web).
- **Combina com o estado que já existia.** Os dados já estavam em Context
  como arrays. A mudança foi trocar `useState` por um `useState` que
  também grava no aparelho (seção 4), sem reescrever as telas.
- **Já estava previsto** no planejamento da Etapa 1 (`docs/proposta.md`).

Alternativas consideradas:

| Opção | Por que não agora |
|---|---|
| `expo-sqlite` | Seria a escolha se houvesse muitos dados ou consultas complexas. Aqui adicionaria SQL, criação de tabelas e migrações sem ganho real. |
| `expo-secure-store` | Feito para segredos pequenos (tokens), tem limite de tamanho por valor. Vai fazer sentido para o token do Supabase na Etapa 6. |
| `expo-file-system` (arquivo JSON) | Daria no mesmo que o AsyncStorage, só que com mais código para ler/gravar e tratar erros. |

Limitação conhecida: o AsyncStorage não é criptografado. Não guardo senha
(a senha nem é verificada ainda) e nenhum dado sensível.

## 3. Estrutura dos dados armazenados

Todas as chaves ficam em `src/storage/storage.ts` (`KEYS`). Os tipos estão
em `src/types/index.ts`. Datas são strings ISO 8601.

| Chave | Conteúdo | Tipo |
|---|---|---|
| `sleeve:sessao` | Usuário logado, ou `null` | `User \| null` |
| `sleeve:avaliacoes` | Todas as avaliações | `Review[]` |
| `sleeve:rascunhos` | Avaliações começadas e não publicadas | `Draft[]` |
| `sleeve:escutas` | Escutas registradas com "Ouvi hoje" | `Listen[]` |
| `sleeve:quero-ouvir` | Álbuns guardados para depois | `WantItem[]` |

Exemplo do que fica gravado:

```json
// sleeve:sessao
{ "name": "Paulo R.", "email": "paulo@email.com" }

// sleeve:avaliacoes
[
  {
    "id": "r1729551000000",
    "albumId": "a5",
    "author": "Paulo R.",
    "verdict": "gostei",
    "text": "Disco pra ouvir com a janela aberta.",
    "createdAt": "2026-10-21T23:10:00.000Z",
    "updatedAt": "2026-10-22T10:02:00.000Z"
  }
]

// sleeve:rascunhos
[{ "albumId": "a2", "author": "Paulo R.", "verdict": null, "text": "Começo forte, mas", "updatedAt": "2026-10-21T23:15:00.000Z" }]

// sleeve:escutas
[{ "id": "l1729551200000", "albumId": "a5", "user": "Paulo R.", "date": "2026-10-21T23:13:20.000Z" }]

// sleeve:quero-ouvir
[{ "albumId": "a6", "user": "Paulo R.", "addedAt": "2026-10-12T14:00:00.000Z" }]
```

Cada registro guarda o nome do usuário (`author`/`user`). Assim, duas
contas no mesmo aparelho não misturam escutas, lista e rascunhos. O Feed
continua mostrando as avaliações de todo mundo.

Na primeira vez que o app abre, as chaves ainda não existem. Nesse caso ele
começa com alguns dados de exemplo (`src/data/seed.ts`), para as telas não
abrirem vazias. A partir daí, vale o que está gravado.

## 4. Operações de persistência implementadas

A gravação e a leitura ficam concentradas em dois arquivos:

- `src/storage/storage.ts`: `loadJSON(key, fallback)` faz
  `AsyncStorage.getItem` + `JSON.parse`, e `saveJSON(key, value)` faz
  `JSON.stringify` + `AsyncStorage.setItem`. As duas tratam erro com
  `try/catch`.
- `src/storage/usePersistentState.ts`: um hook que funciona como
  `useState`, mas:
  1. ao montar, chama `loadJSON` e só então marca `ready = true`
     (**recuperação**);
  2. a cada mudança do valor (depois de carregado), chama `saveJSON`
     (**armazenamento**).

Os contexts usam esse hook no lugar de `useState`. As funções de criar,
atualizar e remover só trocam o array por um novo, e o hook grava.

| Operação | Onde | O que faz |
|---|---|---|
| **Criar** | `ReviewsContext.addReview` | Nova avaliação com `createdAt` no início do array |
| | `DiaryContext.addListen` | Nova escuta com a data de agora (e tira o álbum do "Quero ouvir") |
| | `DiaryContext.toggleWant` | Adiciona o álbum ao "Quero ouvir" |
| | `ReviewsContext.saveDraft` | Cria/substitui o rascunho do álbum |
| | `AuthContext.signIn` / `signUp` | Grava a sessão |
| **Armazenar** | `usePersistentState` → `saveJSON` | Grava a chave inteira sempre que o estado muda |
| **Recuperar** | `usePersistentState` → `loadJSON` | Lê todas as chaves ao abrir o app; `RootNavigator` mostra um indicador de carregamento até tudo estar lido |
| **Atualizar** | `ReviewsContext.updateReview` | Troca veredito/texto e grava `updatedAt` |
| | `ReviewsContext.saveDraft` | Atualiza o rascunho enquanto a pessoa digita (400 ms depois da última tecla) |
| **Remover** | `ReviewsContext.deleteReview` | Apaga uma avaliação |
| | `DiaryContext.removeListen` | Apaga uma escuta da linha do tempo |
| | `DiaryContext.toggleWant` | Tira o álbum do "Quero ouvir" |
| | `ReviewsContext.discardDraft` | Apaga o rascunho (ao publicar ou ao descartar) |
| | `ReviewsContext.clearMine` + `DiaryContext.clearMine` | "Apagar meus dados" nas Configurações |
| | `AuthContext.signOut` | Grava `null` na sessão |

Por que esperar o `ready` antes de gravar? Na primeira renderização o
estado ainda tem o valor inicial. Se o hook gravasse nesse momento, ele
apagaria o que estava salvo antes de conseguir ler. E por que o
`RootNavigator` espera? Sem isso, a tela de Login apareceria por um
instante antes de a sessão salva ser recuperada.

## 5. Telas que usam os dados persistidos

| Tela | Dados | O que o usuário vê/faz |
|---|---|---|
| Login / Criar conta | sessão | Entrar ou criar conta grava a sessão. Ao reabrir o app logado, essas telas nem aparecem. |
| Feed | avaliações | Lista de avaliações de todos os usuários. |
| Detalhe do álbum | avaliações, rascunhos, escutas, quero ouvir | Botões "Ouvi hoje" e "Quero ouvir"/"Na sua lista". Seção "Sua história com o álbum" com resumo ("Ouvido 3 vezes. Primeira escuta em 30 ago.") e linha do tempo (escutas, quando avaliou, quando editou, quando guardou), com × para remover escutas. "Editar" e "Apagar" na própria avaliação. O botão do rodapé muda: "Avaliar este álbum", "Continuar rascunho" ou "Editar sua avaliação". |
| Nova / Editar avaliação | avaliações, rascunhos | Modo novo: recupera o rascunho ("Rascunho de 21 out recuperado.") e, ao sair, pergunta se guarda ou descarta. Modo edição: abre preenchido e "Salvar" só habilita se algo mudou. |
| Perfil | avaliações, escutas, quero ouvir | Números (avaliações, escutas, quero ouvir), barra gostei × não gostei, gráfico de escutas dos últimos 6 meses e grade filtrável por Gostei / Não gostei / Quero ouvir. |
| Configurações | sessão e contagens | "Salvo neste aparelho" com as contagens, "Apagar meus dados" e "Sair da conta" (que agora avisa que os dados continuam salvos). |

## 6. Instruções para execução e teste

```bash
npm install                # instala também o AsyncStorage
npm start                  # QR code → Expo Go no celular
npx tsc --noEmit           # confere os tipos
```

Roteiro rápido (cada passo exercita uma operação):

1. Entre com qualquer e-mail válido e qualquer senha.
2. **Criar:** abra "Litoral" e toque em "Ouvi hoje". A linha do tempo
   ganha "Primeira escuta" com a data de hoje. Toque em "Quero ouvir": o
   botão vira "Na sua lista".
3. **Criar + rascunho:** toque em "Avaliar este álbum", escolha "Gostei" e
   escreva algo. Toque em "Cancelar" → "Guardar rascunho". O rodapé do
   Detalhe vira "Continuar rascunho".
4. **Atualizar:** em "Continuar rascunho", publique. No seu cartão, toque
   em "Editar", troque para "Não gostei" e salve. O cartão mostra
   "· editada" e a linha do tempo ganha "Editou a avaliação".
5. **Remover:** toque no × de uma escuta e confirme. Em "Ruído Branco",
   toque em "Apagar" no seu cartão e confirme.
6. **Apresentar:** no Perfil, confira os números, a barra, o gráfico e o
   filtro "Quero ouvir".

## 7. Procedimento para verificar a persistência após fechar e reabrir

1. Faça os passos 2 a 5 acima e anote o estado: números do Perfil, linha
   do tempo de "Litoral" e um rascunho em outro álbum (comece uma
   avaliação em "Deriva" e saia com "Guardar rascunho").
2. **Feche o app de verdade.** No Android: botão de apps recentes →
   arrastar o Sleeve (ou o Expo Go) para fora. No iOS: deslizar para cima
   e arrastar o app. Só voltar para a tela inicial não vale, porque o app
   continua na memória.
3. Abra de novo. Resultado esperado:
   - abre direto no Feed, sem passar pelo Login (sessão recuperada);
   - Perfil com os mesmos números;
   - "Litoral" com a mesma linha do tempo, a avaliação editada e
     "Na sua lista";
   - "Deriva" com "Continuar rascunho", e o texto volta igual.
4. Saia da conta, feche e reabra: o app abre no Login. Entre de novo e os
   dados continuam lá.
5. Crie uma conta nova: o Perfil começa zerado (os dados são por
   usuário). Volte para a conta antiga e está tudo lá.
6. Em Configurações → "Apagar meus dados", feche e reabra: o Perfil fica
   zerado e o Feed continua com as avaliações dos outros usuários.

O mesmo roteiro foi repetido na versão web, recarregando a página (F5),
o que zera a memória do JavaScript da mesma forma que fechar o app. Nas
ferramentas do navegador (aba Application → Local Storage) aparecem as
cinco chaves `sleeve:*`. As capturas em `docs/mockups/etapa-04/` são
dessa execução.

## 8. Outras mudanças desta etapa

- Expo atualizado do SDK 51 para o 57 (React 19, React Native 0.86) para
  rodar no Expo Go atual. Junto veio a troca de `beforeRemove` por
  `usePreventRemove` na Nova avaliação, que corrige o modal travando ao
  ser arrastado no iOS.
- `ConfirmDialog` ganhou uma terceira opção opcional (usada em "Guardar
  rascunho / Descartar / Continuar editando").
- Componentes novos: `AlbumTimeline` (linha do tempo) e `ProfileSummary`
  (resumo do Perfil, feito só com `View`, sem biblioteca de gráfico).
- A grade do Perfil completa a última linha com espaços vazios. Antes, uma
  capa sozinha esticava até ocupar a largura toda.
- O botão "Avaliar de novo" saiu: agora cada usuário tem uma avaliação
  por álbum e pode editá-la.
- Comentários longos do código foram encurtados.

## 9. Limitações

- Os dados ficam só neste aparelho; trocar de celular perde tudo. A
  sincronização entra com o Supabase (Etapa 6).
- O usuário é identificado pelo nome, já que o login ainda é simulado.
- A data da escuta é sempre "agora"; não dá para registrar uma escuta
  passada.
