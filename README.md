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

## Problema que a aplicação resolve

Sistemas de avaliação por nota (0–5, 0–10) exigem "calibração" e geram
comparações artificiais entre obras. Sleeve remove essa fricção: a decisão é
simples (gostei ou não) e o espaço que sobra é usado para a crítica em si,
que é o que realmente importa para quem lê.

## Tecnologias utilizadas

- **Mobile**: React Native (Expo) + TypeScript, React Navigation.
- **Backend**: Supabase (PostgreSQL + Auth).
- **APIs externas**: MusicBrainz (metadados) e Cover Art Archive (capas).
- **Persistência local**: AsyncStorage.

Detalhes e justificativas técnicas completas em
[`docs/proposta.md`](docs/proposta.md) e [`docs/arquitetura.md`](docs/arquitetura.md).

## Instruções para execução

Pré-requisitos: Node.js 18+ e o app **Expo Go** no celular (ou um
emulador Android/iOS configurado).

```bash
npm install
npm start
```

Em seguida, escaneie o QR code exibido no terminal com o app Expo Go, ou
pressione `a`/`i` no terminal para abrir em um emulador Android/iOS.

## Instruções para teste

```bash
npm test
```

(Etapa 1: apenas um teste placeholder validando a configuração do Jest.
Testes de lógica de negócio e componentes chegam na etapa de "testes" — ver
roadmap em `docs/arquitetura.md`.)

## Funcionalidades implementadas

- Estrutura do projeto (Expo + TypeScript) e navegação entre as 6 telas
  previstas (Login, Home/Feed, Buscar, Detalhe do álbum, Nova avaliação,
  Perfil), com dados ainda estáticos/placeholder.

## Funcionalidades previstas (próximas etapas)

- Persistência local das avaliações.
- Busca real de álbuns/EPs via MusicBrainz + Cover Art Archive.
- Autenticação e sincronização com Supabase.
- Feed social, recursos nativos, testes automatizados, otimização de
  desempenho e build de publicação.

Roadmap completo em [`docs/arquitetura.md`](docs/arquitetura.md#evolução-por-etapa-roadmap).

## Limitações conhecidas (Etapa 1)

- Nenhuma lógica de negócio real ainda: telas exibem dados estáticos.
- Sem autenticação, sem chamadas de API e sem persistência funcionando
  nesta etapa — isso é esperado, dado que esta é a etapa de proposta e
  planejamento.
