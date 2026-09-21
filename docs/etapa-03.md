# Etapa 3 — Navegação, UX e acessibilidade

Esta etapa parte do protótipo da Etapa 2 (`docs/etapa-02.md`) e fecha o
**fluxo completo de navegação** do Sleeve, aplicando princípios de UX
(incluindo a **Lei de Fitts**) e de **acessibilidade**, com suporte a
leitores de tela (TalkBack no Android, VoiceOver no iOS e leitores de tela
no navegador).

O que mudou, em resumo:

- duas telas novas: **Criar conta** e **Configurações**;
- fluxo de autenticação de verdade na navegação (grupo "sem sessão" e
  grupo "com sessão"), com **Sair da conta**;
- todos os becos sem saída da Etapa 2 foram fechados ("Criar conta" do
  Login não fazia nada, a grade do Perfil não era tocável, listas vazias
  não ofereciam próximo passo);
- um canal único de **feedback visual** (aviso/"toast"), **diálogos de
  confirmação** para ações que perdem dados e estados visuais para
  pressionado, foco, selecionado, desabilitado, carregando e erro;
- revisão de **tamanho de alvos de toque** (mínimo 48dp), **contraste**
  (WCAG AA), **tamanho de texto** (mínimo 12pt, respeitando a fonte do
  sistema) e **semântica para leitor de tela** em todos os componentes.

Os dados continuam em memória (sem persistência nem backend), como nas
etapas anteriores — isso não faz parte do escopo desta etapa.

---

## 1. Estrutura de navegação implementada

A navegação é feita com **React Navigation 6**, configurada em
`src/navigation/RootNavigator.tsx`. São dois navegadores aninhados:

```
NavigationContainer
└── Stack (native-stack) — pilha raiz
    │
    ├── [sem sessão]  ──────────────────────────────
    │     Login  ⇄  SignUp (Criar conta)
    │
    └── [com sessão]  ──────────────────────────────
          Main  ── Bottom Tabs ──┬── Feed
          │                      ├── Buscar
          │                      └── Perfil ──(engrenagem)──► Settings
          │
          ├── AlbumDetail  (empilhada sobre as abas)
          │      └── NewReview  (modal)
          └── Settings     (empilhada sobre as abas)
```

**Fluxo de autenticação.** A pilha raiz só registra as telas do grupo
correspondente ao estado da sessão (`useAuth().user`, em
`src/state/AuthContext.tsx`). Ao entrar ou criar conta, o React Navigation
troca de grupo sozinho e mostra as abas; ao sair, a pilha logada inteira
é descartada e o Login volta. Consequência prática: o botão **Voltar** do
Android nunca leva de volta ao Login depois de entrar, nem a uma tela
logada depois de sair — a pilha só contém telas que fazem sentido naquele
momento.

**Retorno a telas anteriores.** Toda tela empilhada tem três formas de
voltar, todas equivalentes:

1. botão no cabeçalho (seta ← ou × no modal), com rótulo falado;
2. gesto de voltar do sistema (arrastar da borda no iOS; o modal de Nova
   avaliação também fecha arrastando para baixo);
3. botão Voltar físico/gestual do Android.

Na Nova avaliação, qualquer uma das três com rascunho preenchido é
interceptada (evento `beforeRemove`) e pede confirmação — ver seção 4.

**Fluxo principal (caminho feliz):**

```
Login ─► Feed ─► (toca num cartão) ─► Detalhe do álbum ─► Avaliar ─► Nova avaliação
                                               ▲                          │
                                               └──── Publicar (feedback) ─┘
```

## 2. Telas e respectivos mecanismos de acesso

| Tela | Arquivo | Tipo | Como se chega | Como se sai |
|---|---|---|---|---|
| Login | `src/screens/LoginScreen.tsx` | Pilha (sem sessão) | Tela inicial; também após "Sair da conta" | "Entrar" (vai às abas) ou "Criar conta" |
| Criar conta **(nova)** | `src/screens/SignUpScreen.tsx` | Pilha (sem sessão) | Link "Criar conta" no Login | "Criar conta" (vai às abas), "Já tenho conta", seta ← ou Voltar do sistema |
| Feed | `src/screens/FeedScreen.tsx` | Aba 1 | Aba "Feed"; é a aba inicial após entrar | Tocar num cartão abre o Detalhe; estado vazio oferece "Buscar um álbum" |
| Buscar | `src/screens/SearchScreen.tsx` | Aba 2 | Aba "Buscar"; botões "Buscar um álbum" dos estados vazios do Feed/Perfil | Tocar num resultado abre o Detalhe |
| Perfil | `src/screens/ProfileScreen.tsx` | Aba 3 | Aba "Perfil" | Tocar numa capa da grade abre o Detalhe **(novo)**; engrenagem abre Configurações **(novo)** |
| Detalhe do álbum | `src/screens/AlbumDetailScreen.tsx` | Pilha sobre as abas | Cartão do Feed, resultado do Buscar ou capa do Perfil | "Avaliar este álbum" abre a Nova avaliação; seta ← volta para a tela de origem |
| Nova avaliação | `src/screens/NewReviewScreen.tsx` | Modal | "Avaliar este álbum" / "Avaliar de novo" no Detalhe | "Publicar avaliação" (volta ao Detalhe com a avaliação listada) ou × (com confirmação se houver rascunho) |
| Configurações **(nova)** | `src/screens/SettingsScreen.tsx` | Pilha sobre as abas | Engrenagem no cabeçalho do Perfil | Seta ← volta ao Perfil; "Sair da conta" (com confirmação) volta ao Login |

## 3. Menus, abas e outros mecanismos de navegação

- **Barra de abas inferior** (`createBottomTabNavigator`) — mecanismo
  primário, com Feed, Buscar e Perfil. Escolhida porque o app tem três
  áreas de mesmo nível que o usuário alterna o tempo todo, e porque fica na
  zona do polegar. Detalhes:
  - ícone **e** rótulo de texto em cada aba (ícone sozinho é ambíguo);
  - aba ativa com cor de destaque **e** rótulo em negrito (não só cor);
  - altura de 64dp + área segura; cada aba ocupa um terço da largura;
  - `tabBarAccessibilityLabel` descritivo ("Buscar álbuns e EPs");
  - `tabBarHideOnKeyboard`: some com o teclado aberto e não rouba espaço
    dos formulários;
  - tocar de novo na aba já ativa rola a lista de volta ao topo
    (`useScrollToTop` no Feed e no Buscar).
- **Pilha (native-stack)** — para aprofundar a partir das abas (Detalhe,
  Configurações) e para o fluxo sem sessão (Login ⇄ Criar conta).
- **Modal** — a Nova avaliação é apresentada como modal
  (`presentation: 'modal'`), comunicando que é uma tarefa pontual que
  termina voltando ao ponto de origem.
- **Cabeçalho padrão** (`src/components/ScreenHeader.tsx`) — todas as telas
  usam o mesmo componente: título marcado como cabeçalho para leitor de
  tela, ação à esquerda (voltar/fechar) e à direita (engrenagem) sempre nas
  mesmas posições.
- **Chips de filtro** (`src/components/Chip.tsx`) — navegação dentro do
  conteúdo: tipo (Todos/Álbum/EP) no Buscar e veredito (Gostei/Não gostei)
  no Perfil.
- **Botões de "próximo passo" nos estados vazios**
  (`src/components/EmptyState.tsx`) — "Buscar um álbum" (Feed e Perfil
  vazios) leva à aba Buscar; "Limpar busca e filtros" desfaz uma busca sem
  resultado.

## 4. Mecanismos de feedback visual

| Mecanismo | Onde está | Quando aparece |
|---|---|---|
| **Aviso (toast)** com ícone + cor + texto, anunciado pelo leitor de tela | `src/feedback/FeedbackContext.tsx` (`useFeedback().showFeedback`) | "Bem-vindo de volta", "Conta criada", "Avaliação publicada", "Avaliação descartada", "Você saiu da conta" |
| **Diálogo de confirmação** | `src/components/ConfirmDialog.tsx` | Fechar a Nova avaliação com rascunho ("Descartar avaliação?") e "Sair da conta?" |
| **Estado pressionado** | Todos os `Pressable` (botões, cartões, linhas, chips, abas, ícones) | Fundo destacado/escurecido enquanto o dedo está no alvo |
| **Estado de carregamento** | `PrimaryButton` (`loading`) | "Entrando…" / "Criando conta…" com spinner; bloqueia toque duplo |
| **Estado desabilitado + motivo** | Botão "Publicar avaliação" | Botão esmaecido e, logo acima, uma linha dizendo o que falta ("Falta escolher: gostei ou não gostei.") |
| **Estado de foco** em campos | `TextField`, `SearchField` | Borda azul de 2px e fundo branco no campo ativo |
| **Estado de erro** em campos | `TextField` | Borda vermelha + ícone + mensagem explicando como corrigir |
| **Estado selecionado** | `ChipGroup`, `LikeToggle`, abas | Preenchimento azul **+ ícone de check** (não só cor) |
| **Contador de caracteres** | Nova avaliação | `31/500`; fica vermelho e em negrito nos últimos 50 caracteres |
| **Contagem de resultados** | Buscar | "3 resultados", atualizada a cada tecla |
| **Destaque da própria avaliação** | Detalhe do álbum | Cartão com borda azul e "(você)"; botão passa a "Avaliar de novo" |
| **Estados vazios explicativos** | Feed, Buscar, Perfil, Detalhe | Ícone + título + explicação + ação sugerida |

O aviso aparece **logo abaixo do cabeçalho**, e não no topo absoluto nem
em baixo: assim nunca cobre o botão Voltar/Fechar, a barra de abas nem o
botão principal do rodapé. Some sozinho em ~3s ou com um toque.

Erros de validação de formulário **não** usam o aviso: eles ficam junto
do campo com problema (onde o usuário vai agir), e para quem usa leitor de
tela é anunciado um resumo ("Falta corrigir 2 campos").

## 5. Principais decisões de UX

### Lei de Fitts

O tempo para atingir um alvo cresce com a distância e diminui com o
tamanho do alvo. Aplicações no app:

- **Alvo mínimo de 48×48dp** em tudo que é tocável (`touch.min` em
  `src/theme/colors.ts`), acima dos 44pt da Apple. Botões só de ícone
  (voltar, fechar, engrenagem, limpar busca) têm ícone de 22dp mas área de
  toque de 48dp (`src/components/IconButton.tsx`).
- **Ação principal com 56dp de altura e largura total**
  (`PrimaryButton`) — alvo grande e largo, fácil de acertar com o polegar.
- **Ação principal fixa no rodapé** nas telas de Detalhe ("Avaliar este
  álbum") e Nova avaliação ("Publicar avaliação"): fica na zona do
  polegar e não muda de lugar quando o conteúdo rola.
- **Linha/cartão inteiro como alvo** no Feed, Buscar e grade do Perfil (e
  não só o título), aumentando a área útil.
- **Seletor gostei/não gostei** com dois alvos de metade da largura e
  88dp de altura: é a decisão mais importante do app, então é o maior
  controle da tela.
- **Ação destrutiva longe das frequentes**: "Sair da conta" fica isolado
  no fim das Configurações (atrás de uma engrenagem, dentro do Perfil),
  com espaço grande acima e confirmação — reduzir o erro importa mais que
  a velocidade aqui.
- **Nos diálogos**, os botões são empilhados em largura total, com a ação
  segura ("Continuar editando" / "Cancelar") embaixo, mais perto do polegar.

### Outras decisões

- **Nenhum beco sem saída**: toda tela tem como voltar e todo estado vazio
  oferece um próximo passo.
- **Prevenção de perda de dados** em vez de desfazer: sair da Nova
  avaliação com rascunho pede confirmação, cobrindo botão, gesto e Voltar
  do Android.
- **Validação com mensagem útil**, dizendo o que fazer ("A senha precisa
  ter pelo menos 6 caracteres"), e erro que some assim que o usuário
  começa a corrigir o campo.
- **Teclado encadeado** nos formulários ("próximo" leva ao campo seguinte;
  no último, envia) e tipo de teclado adequado (e-mail, senha).
- **Botão desabilitado explica o porquê**, em vez de simplesmente não
  responder.
- **Consistência**: mesmo cabeçalho, mesmos chips, mesmos botões e mesmos
  estados em todas as telas — tudo vindo de `src/components/`.
- **Identidade visual clara** (`userInterfaceStyle` corrigido de `dark`
  para `light` no `app.json`, coerente com a paleta branca e azul; o tema
  do React Navigation também passou de `DarkTheme` para `DefaultTheme`).

## 6. Medidas de acessibilidade

### Leitores de tela (TalkBack / VoiceOver / web)

- **Papéis semânticos** (`accessibilityRole`): `header` nos títulos (permite
  pular de título em título), `button` em botões e cartões tocáveis, `link`
  no "Criar conta", `radiogroup`/`radio` nos chips e no seletor gostei/não
  gostei, `alert` no aviso de feedback.
- **Estados expostos** (`accessibilityState`): `checked`/`selected` nos
  chips e no seletor, `disabled` e `busy` nos botões.
- **Rótulos falados** (`accessibilityLabel`) em todo controle sem texto
  visível (voltar, fechar, engrenagem, limpar busca, abas) e **rótulos
  completos** nos cartões — ex.: "Litoral, de Névoa Norte. Avaliado por
  você: gostou. Disco bonito…". O cartão é lido como uma unidade, em vez
  de o usuário ter que passar por título, subtítulo, selo e texto um a um.
- **Dicas** (`accessibilityHint`) dizem o que acontece ao ativar ("Abre o
  detalhe do álbum", "Pede confirmação antes de sair").
- **Agrupamento** (`accessible`) de estatísticas ("4 avaliações: 3 gostei,
  1 não gostei") e das linhas de configurações.
- **Elementos decorativos escondidos**: capas-placeholder (uma letra) e
  ícones ilustrativos usam `accessibilityElementsHidden` /
  `importantForAccessibility="no-hide-descendants"`.
- **Anúncios dinâmicos**: avisos de feedback são anunciados
  (`announceForAccessibility` no iOS/web, `accessibilityLiveRegion` no
  Android); a contagem de resultados do Buscar, as mensagens de erro dos
  campos e a dica do botão "Publicar" são regiões vivas.
- **Diálogos modais** com `accessibilityViewIsModal` (o leitor de tela não
  "vaza" para o conteúdo por trás) e fechamento pelo Voltar do Android.
- **Campos com rótulo visível** acima do campo (não só placeholder), o
  mesmo rótulo repassado ao leitor de tela, e o erro como dica do campo.

### Contraste (WCAG 2.1 AA)

Tokens revisados em `src/theme/colors.ts`. Razões de contraste calculadas
com a fórmula de luminância relativa da WCAG:

| Uso | Cores | Contraste | Requisito |
|---|---|---|---|
| Texto principal sobre fundo | `#0b1220` / `#ffffff` | 18,7:1 | 4,5:1 ✔ |
| Texto secundário sobre fundo | `#5b6474` / `#ffffff` | 6,0:1 | 4,5:1 ✔ |
| Texto secundário sobre cartão | `#5b6474` / `#f4f7fc` | 5,6:1 | 4,5:1 ✔ |
| Texto secundário sobre selo/capa | `#5b6474` / `#dfe9fb` | 4,9:1 | 4,5:1 ✔ |
| Texto branco sobre azul (botões, chips ativos) | `#ffffff` / `#045dd1` | 6,0:1 | 4,5:1 ✔ |
| Azul de destaque sobre fundo | `#045dd1` / `#ffffff` | 6,0:1 | 4,5:1 ✔ |
| Mensagens de erro | `#b3261e` / `#ffffff` | 6,5:1 | 4,5:1 ✔ |
| Contorno de campos e chips | `#7a8597` / `#f4f7fc` | 3,5:1 | 3:1 ✔ (WCAG 1.4.11) |

Mudanças em relação à Etapa 2: o texto secundário passou de `#66707f`
(4,7:1 sobre os cartões, no limite) para `#5b6474`, e foi criado o token
`borderStrong` para os contornos de controles interativos — a borda antiga
(`#e0e6f0`, 1,25:1) ficava quase invisível e agora é usada só em
divisórias decorativas.

**Informação nunca só por cor**: selecionado = cor + check; veredito = cor +
ícone de polegar + texto; erro = cor + ícone + mensagem; aba ativa = cor +
negrito.

### Texto legível

- Nenhum texto abaixo de **12pt** (antes havia 10,5pt e 11pt); corpo de
  texto em 15pt. Escala em `typography` (`src/theme/colors.ts`).
- Todo texto **acompanha o tamanho de fonte do sistema** (padrão do React
  Native). Títulos e rótulos de controles usam `maxFontSizeMultiplier` de
  1,6 só para o layout não quebrar em escalas extremas.
- Títulos de álbum podem ocupar duas linhas em vez de serem cortados em
  uma, e linhas usam `flexWrap`/`minWidth: 0` para acomodar fonte grande.

### Movimento

- O aviso de feedback respeita **"Reduzir movimento"** do sistema
  (`AccessibilityInfo.isReduceMotionEnabled`): nesse caso aparece sem
  animação de deslize.
- A tela de Configurações mostra, ao vivo, se o leitor de tela e o
  "Reduzir movimento" estão ativos no aparelho.

## 7. Componentes novos ou alterados nesta etapa

| Componente | Situação | Papel |
|---|---|---|
| `IconButton` | novo | Botão só de ícone com área de 48dp e rótulo obrigatório |
| `ScreenHeader` | novo | Cabeçalho padrão (título-cabeçalho + ações) |
| `ChipGroup` (`Chip.tsx`) | novo | Filtros de seleção única acessíveis (substitui chips duplicados em Buscar e Perfil) |
| `TextField` | novo | Campo com rótulo, foco, erro e ajuda |
| `ConfirmDialog` | novo | Confirmação de ações que perdem dados |
| `EmptyState` | novo | Estado vazio com explicação e próxima ação |
| `FeedbackProvider` / `useFeedback` | novo | Avisos de feedback globais |
| `AuthProvider` / `useAuth` | novo | Sessão em memória que dirige o fluxo de navegação |
| `PrimaryButton` | alterado | Altura 56dp, variantes `danger`, ícone, `loading`, estados acessíveis |
| `LikeToggle` | alterado | Alvos maiores, `radio`, check de selecionado |
| `SearchField` | alterado | Foco visível, botão "Limpar busca" |
| `AlbumListItem`, `VerdictBadge`, `AlbumCover` | alterados | Rótulos completos, ícone no selo, capa decorativa oculta ao leitor |

Também foi corrigido o `package.json`: `@expo/vector-icons` fixado em
`~14.0.4` (versão do SDK 51) e `expo-font` declarado como dependência. Com o
`^14.0.0` anterior o npm instalava a 14.1, que puxa um `expo-font` de SDK
mais novo e quebrava a execução no navegador.

## 8. Instruções para execução e teste da navegação

### Executar

```bash
npm install
npx expo install --fix     # alinha versões nativas com o SDK do Expo
npm start                  # abre o Metro; escaneie o QR code com o Expo Go
```

Pressione `a` (emulador Android) ou `i` (simulador iOS) no terminal do
Metro. Para rodar no navegador, instale uma vez o suporte web com
`npx expo install react-dom react-native-web @expo/metro-runtime` e depois
use `npm run web`.

### Roteiro de teste manual

1. **Validação do login** — toque em "Entrar" com os campos vazios: os dois
   campos ficam vermelhos com mensagem. Digite algo no e-mail: o erro
   daquele campo some.
2. **Cadastro** — toque em "Criar conta"; volte com a seta, com "Já tenho
   conta" e com o Voltar do Android (as três levam ao Login). Tente criar
   conta com dados inválidos (nome com 1 letra, e-mail sem domínio, senha
   curta, senhas diferentes) e veja as mensagens. Com dados válidos, o botão
   mostra "Criando conta…", as abas abrem e aparece "Conta criada!". O
   Perfil dessa conta nova começa vazio.
3. **Login** — (após sair) entre com qualquer e-mail válido e qualquer
   senha: botão "Entrando…", depois Feed com "Bem-vindo de volta, Paulo!".
   Aperte Voltar do Android: o app **não** volta para o Login.
4. **Abas** — alterne Feed/Buscar/Perfil. Role o Feed e toque de novo em
   "Feed": a lista volta ao topo.
5. **Busca** — digite "xyz": aparece "0 resultados" e o estado vazio com
   "Limpar busca e filtros". Use os chips Todos/Álbum/EP.
6. **Detalhe** — toque em um resultado (ou num cartão do Feed, ou numa capa
   do Perfil). Volte pela seta ou gesto: retorna exatamente à tela de
   origem.
7. **Nova avaliação** — em "Avaliar este álbum", observe o botão
   "Publicar" desabilitado com a dica do que falta. Escreva algo e toque
   em ×: aparece "Descartar avaliação?". Escolha "Continuar editando",
   selecione "Gostei" e publique: volta ao Detalhe com "Avaliação publicada"
   e o seu cartão destacado; o botão vira "Avaliar de novo".
8. **Perfil e Configurações** — no Perfil, filtre por veredito e toque numa
   capa (abre o Detalhe). Toque na engrenagem, depois em "Sair da conta" →
   "Sair": volta ao Login com "Você saiu da conta".

### Testar com leitor de tela

- **Android**: Configurações → Acessibilidade → TalkBack. Deslize para a
  direita/esquerda para percorrer os elementos; toque duplo para ativar.
  Confira que cada aba, botão de ícone, chip e cartão é anunciado com nome,
  papel e estado (ex.: "EP, botão de opção, selecionado").
- **iOS**: Ajustes → Acessibilidade → VoiceOver. Use o rotor em
  "Cabeçalhos" para pular entre títulos das telas.
- **Fonte grande**: aumente o tamanho da fonte do sistema e percorra as
  telas — os textos crescem e o layout se reorganiza.
- **Reduzir movimento**: ative no sistema e publique uma avaliação — o aviso
  aparece sem animação. A tela de Configurações mostra o estado atual.

### Evidências visuais

Capturas do app em execução (bundle web real, viewport de celular
390×844) em `docs/mockups/etapa-03/` — ver `docs/evidencias.md`. Elas
complementam, e não substituem, o código-fonte.
