# Evidências — Sleeve

> Este arquivo reúne, a cada etapa, prints/gravações e uma breve descrição
> do que foi demonstrado em funcionamento.

## Etapa 1 — Proposta e planejamento

Etapa de proposta e planejamento: sem funcionalidade de negócio para
demonstrar ainda. Evidência mínima desta etapa é o conteúdo de
`docs/proposta.md` (nome, problema, público-alvo, telas previstas, fluxo de
navegação, tecnologias e estrutura planejada).

## Etapa 2 — Protótipo de interface

Evidência principal desta etapa é o código-fonte em `src/` e `App.tsx`
(telas, navegação e componentes reais, rodando via `npm start`), conforme
`docs/etapa-02.md`.

Como evidência visual complementar, `docs/mockups/` traz capturas do app
em execução (bundle real da aplicação, não protótipo estático),
percorrendo o fluxo completo:

| Arquivo | Tela |
|---|---|
| `01-login.png` | Login / Cadastro (tela inicial) |
| `02-feed.png` | Feed de avaliações |
| `03-buscar.png` | Buscar, com filtro por tipo |
| `04-detalhe-album.png` | Detalhe do álbum |
| `05-nova-avaliacao.png` | Nova avaliação (estado inicial, botão desabilitado) |
| `05b-nova-avaliacao-gostei.png` | Nova avaliação com "Gostei" selecionado |
| `06-perfil.png` | Perfil, com estatísticas e grade filtrável |

As capturas não substituem o código-fonte: tudo o que aparece nelas é
renderizado pelos componentes em `src/`.
