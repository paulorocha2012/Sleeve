# Sleeve

Um diário de álbuns e EPs. Sem notas, sem estrelas: apenas **gostei / não
gostei**, acompanhado da sua crítica.

Projeto desenvolvido de forma incremental para a disciplina Tecnologia de
Construção de Software II.

## Descrição da aplicação

Sleeve é um aplicativo mobile no espírito do Last.fm, Letterboxd e Rate Your
Music (RYM), mas focado exclusivamente em **álbuns e EPs** e com uma
diferença central: a avaliação nunca usa notas ou estrelas. Cada avaliação é
binária — **gostei** ou **não gostei** — sempre acompanhada de uma crítica
em texto escrita por quem avaliou.

## Tecnologias utilizadas

- **Mobile**: React Native (Expo) + TypeScript, React Navigation
  (native-stack + bottom-tabs).
- **Backend**: Supabase (PostgreSQL + Auth) — previsto para uma etapa
  futura; ainda não integrado.
- **APIs externas**: MusicBrainz (metadados) e Cover Art Archive (capas) —
  previstas para uma etapa futura; hoje a interface usa um catálogo mock.
- **Persistência local**: AsyncStorage (Etapa 4) — sessão, avaliações,
  rascunhos, escutas e lista "Quero ouvir" ficam salvos no aparelho.

Detalhes e justificativas técnicas completas em
[`docs/proposta.md`](docs/proposta.md), [`docs/arquitetura.md`](docs/arquitetura.md)
e, para o que foi implementado em cada etapa, em
[`docs/etapa-02.md`](docs/etapa-02.md) (protótipo de interface),
[`docs/etapa-03.md`](docs/etapa-03.md) (navegação, UX e acessibilidade) e
[`docs/etapa-04.md`](docs/etapa-04.md) (persistência local). O mapa do
código (pastas, caminho dos dados, onde mexer) está em
[`docs/estrutura.md`](docs/estrutura.md).

## Instruções para execução

Pré-requisitos: Node.js 18+ e o app **Expo Go** no celular (Android/iOS), ou
um emulador Android / simulador iOS configurado.

```bash
npm install
npx expo install --fix   # alinha as versões nativas com o SDK do Expo
npm start                # ou: npx expo start
```

O Metro abre um QR code no terminal/navegador — escaneie com o Expo Go para
rodar no celular, ou pressione `a`/`i` no terminal para abrir em um emulador
Android ou simulador iOS. Para rodar no navegador, instale uma vez o suporte
web (`npx expo install react-dom react-native-web @expo/metro-runtime`) e use
`npm run web`.

Não há autenticação real ainda: no Login, qualquer e-mail válido + qualquer
senha entra com o usuário de demonstração; "Criar conta" cria uma sessão
com o nome informado. A sessão e os dados ficam salvos no aparelho: ao
fechar e abrir o app, ele volta logado e com tudo como estava.

## Instruções para teste

Ainda não há testes automatizados (previstos para uma etapa futura — ver
roadmap em `docs/arquitetura.md`). A verificação é manual; o roteiro
completo de teste da navegação, incluindo teste com TalkBack/VoiceOver,
fonte grande e "Reduzir movimento", está em
[`docs/etapa-03.md`](docs/etapa-03.md#8-instruções-para-execução-e-teste-da-navegação).

Persistência (Etapa 4): roteiro em
[`docs/etapa-04.md`](docs/etapa-04.md#6-instruções-para-execução-e-teste),
incluindo como verificar os dados depois de fechar e reabrir o app.

Roteiro rápido da navegação: Login (teste a validação com campos vazios) → Criar conta →
voltar → Entrar → Feed → Buscar → Detalhe do álbum → Nova avaliação →
fechar com rascunho (confirmação) → publicar (aviso "Avaliação publicada")
→ Perfil → toque numa capa → Configurações → Sair da conta.

## Funcionalidades implementadas

### Etapa 4 — persistência local

- Dados salvos no aparelho com AsyncStorage e recuperados ao reabrir o
  app: sessão (abre logado), avaliações, rascunhos, escutas e "Quero
  ouvir", separados por usuário.
- Avaliação agora pode ser editada e apagada; rascunho de avaliação é
  salvo enquanto se digita e recuperado depois.
- Detalhe do álbum: "Ouvi hoje", "Quero ouvir" e a linha do tempo "Sua
  história com o álbum" (escutas, avaliação, edição).
- Perfil: contadores de avaliações/escutas/lista, barra gostei × não
  gostei, gráfico de escutas por mês e filtro "Quero ouvir".
- Configurações: o que está salvo no aparelho e "Apagar meus dados".
- Detalhes em [`docs/etapa-04.md`](docs/etapa-04.md).

### Etapa 3 — navegação, UX e acessibilidade

- Fluxo completo de navegação com autenticação: grupo sem sessão
  (Login ⇄ **Criar conta**) e grupo com sessão (abas Feed/Buscar/Perfil,
  Detalhe do álbum, Nova avaliação em modal e **Configurações**), com
  **Sair da conta**. O Voltar do Android nunca leva a telas do outro grupo.
- Todas as telas acessíveis e com retorno (seta/×, gesto e Voltar do
  sistema); capas do Perfil levam ao Detalhe; estados vazios oferecem o
  próximo passo.
- Feedback visual: avisos ("Avaliação publicada", "Conta criada"…),
  diálogos de confirmação (descartar avaliação, sair), estados de
  pressionado, foco, erro, selecionado, desabilitado com motivo e
  carregando.
- Lei de Fitts: alvos de no mínimo 48dp, ação principal de 56dp em
  largura total e fixa no rodapé, ação destrutiva isolada.
- Acessibilidade: papéis, estados, rótulos e dicas para TalkBack/VoiceOver;
  contraste WCAG AA revisado; texto mínimo de 12pt acompanhando a fonte do
  sistema; informação nunca só por cor; respeito a "Reduzir movimento".
- Detalhes em [`docs/etapa-03.md`](docs/etapa-03.md).

### Etapa 2 — protótipo de interface

- Estrutura do projeto Expo + TypeScript, com navegação real entre as 6
  telas previstas na proposta: Login/Cadastro, Feed, Buscar, Detalhe do
  álbum, Nova avaliação e Perfil (pilha + abas, via React Navigation).
- Avaliação binária gostei/não gostei com crítica em texto livre (tela Nova
  avaliação), sem qualquer sistema de notas.
- Busca com filtro por texto e por tipo (Álbum/EP) sobre um catálogo mock.
- Perfil com estatísticas (avaliações, gostei, não gostei) e grade de
  álbuns avaliados, filtrável por veredito.
- Estado das avaliações compartilhado em memória (`ReviewsContext`) entre
  todas as telas durante o uso do app — sem persistência entre execuções,
  como previsto para esta etapa.
- Componentes de interface reutilizáveis (botão, capa de álbum, badge de
  veredito, alternador gostei/não gostei, campo de busca, item de lista) e
  layout adaptável a diferentes tamanhos de tela — detalhes em
  [`docs/etapa-02.md`](docs/etapa-02.md).

## Funcionalidades previstas (próximas etapas)

- Busca real de álbuns/EPs via MusicBrainz + Cover Art Archive (capas reais
  no lugar do placeholder com a inicial do título).
- Autenticação e sincronização com Supabase.
- Feed social entre usuários reais, recursos nativos, testes automatizados,
  otimização de desempenho e build de publicação.

Roadmap completo em [`docs/arquitetura.md`](docs/arquitetura.md#evolução-por-etapa-roadmap).

## Limitações conhecidas (Etapa 4)

- Dados só no aparelho: trocar de celular ou desinstalar o app perde tudo
  (sincronização prevista com o Supabase).
- Catálogo de álbuns é mock (fixo no código), sem busca real via API.
- Login e cadastro não autenticam de verdade: a senha não é verificada e o
  usuário é identificado pelo nome.
- Sem testes automatizados ainda.
