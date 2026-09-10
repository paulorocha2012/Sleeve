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
- **Persistência local**: AsyncStorage — prevista para uma etapa futura.

Detalhes e justificativas técnicas completas em
[`docs/proposta.md`](docs/proposta.md), [`docs/arquitetura.md`](docs/arquitetura.md)
e, para o que foi implementado nesta etapa, em [`docs/etapa-02.md`](docs/etapa-02.md).

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
Android ou simulador iOS. Também é possível rodar no navegador com `npm run web`.

## Instruções para teste

Não há testes automatizados nesta etapa (não fazem parte do escopo da
Etapa 2). A verificação é manual, navegando pelo fluxo: Login → Feed →
Buscar → Detalhe do álbum → Nova avaliação → volta ao Detalhe já com a nova
avaliação listada. A introdução de testes automatizados está prevista em
uma etapa futura (ver roadmap em `docs/arquitetura.md`).

## Funcionalidades implementadas (Etapa 2)

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

- Persistência local das avaliações (AsyncStorage).
- Busca real de álbuns/EPs via MusicBrainz + Cover Art Archive (capas reais
  no lugar do placeholder com a inicial do título).
- Autenticação e sincronização com Supabase.
- Feed social entre usuários reais, recursos nativos, testes automatizados,
  otimização de desempenho e build de publicação.

Roadmap completo em [`docs/arquitetura.md`](docs/arquitetura.md#evolução-por-etapa-roadmap).

## Limitações conhecidas (Etapa 2)

- Sem persistência: os dados (avaliações) somem ao encerrar o app —
  esperado, já que esta etapa não exige persistência nem comunicação com
  servidor.
- Catálogo de álbuns é mock (fixo no código), sem busca real via API.
- Login não autentica de verdade; apenas navega para a área principal.
- Sem testes automatizados ainda.
