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

## Etapa 3 — Navegação, UX e acessibilidade

Evidência principal: código-fonte em `src/` (navegação em
`src/navigation/RootNavigator.tsx`, telas novas `SignUpScreen` e
`SettingsScreen`, componentes de acessibilidade e feedback em
`src/components/` e `src/feedback/`), descrito em `docs/etapa-03.md`.

Evidências complementares em `docs/mockups/etapa-03/`, feitas a partir do
bundle web real do app (viewport de celular 390×844) percorrendo o
roteiro de teste de `docs/etapa-03.md`:

- **`demo-navegacao.mp4`** (~70s): vídeo do roteiro completo — validação
  do login, cadastro, entrada, busca (com foco automático pela aba),
  filtros, detalhe, nova avaliação (cancelar com rascunho → confirmação →
  publicar), perfil, configurações e saída. Os círculos azuis marcam onde
  cada toque acontece.
- Capturas:

| Arquivo | O que mostra |
|---|---|
| `07-login-validacao.png` | Login com campos vazios: estado de erro + mensagens |
| `08-cadastro-validacao.png` | Tela nova "Criar conta" com validação de cada campo |
| `09-login-carregando.png` | Botão em estado de carregamento ("Entrando…") |
| `10-feed-boas-vindas.png` | Feed após entrar, com aviso de feedback e barra de abas |
| `11b-busca-foco-pela-aba.png` | Tocar na aba Buscar já foca o campo de busca (zona do polegar) |
| `11-busca-sem-resultado.png` | Buscar sem resultado: contagem, estado vazio e "Limpar busca e filtros" |
| `12-busca-filtro-ep.png` | Chips de filtro com estado selecionado (cor + check) |
| `13-detalhe-rodape-fixo.png` | Detalhe do álbum com a ação principal fixa no rodapé |
| `14-nova-avaliacao-dica.png` | Rodapé com "Cancelar" e "Publicar" (desabilitado, com a dica do que falta) |
| `15-descartar-confirmacao.png` | Diálogo "Descartar avaliação?" ao tocar em "Cancelar" com rascunho |
| `16-nova-avaliacao-pronta.png` | Seletor gostei/não gostei selecionado, botão habilitado |
| `17-avaliacao-publicada.png` | Volta ao Detalhe com o aviso e a própria avaliação destacada |
| `18-perfil.png` | Perfil com engrenagem de Configurações e grade tocável |
| `19-configuracoes.png` | Tela nova "Configurações" (conta, acessibilidade, sair) |
| `20-sair-confirmacao.png` | Confirmação antes de sair da conta |
