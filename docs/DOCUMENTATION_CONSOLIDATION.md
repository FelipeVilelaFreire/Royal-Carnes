# Consolidacao documental RoyalPrime

Data: 2026-09-07. Tipo: registro de alteracao documental, nao contrato.
Entrada operacional: [CODEX_ENTRYPOINTS.md](CODEX_ENTRYPOINTS.md).

## Resultado

Uma entrada inicial, um contrato central de ownership e leitura especializada
por tarefa. AGENTS locais encaminham para essa hierarquia sem novas listas globais.
Contratos ativos sao enumerados; roadmap, guia, auditoria, kit e handoff
nao mudam regras nem escolhem a tarefa atual.

## Orientacoes substituidas

- Ordem global de 24 documentos e listas concorrentes.
- Branch fixa como regra permanente de implementacao.
- API/hooks/mappers existentes descritos como trabalho futuro na tree central.
- Permissao ampla para mocks diretos e copy inline em codigo novo.
- Admin descrito como dono de runtime de casca da surface.
- Mock de autenticacao diferente por viewport como contrato vigente.
- Trees de manifest fora de shared-core e proposta antiga de MVP em tres dias.
- README backend acumulando proximos passos antigos como estado atual.

Versoes anteriores preservadas em
[archive/README.md](archive/README.md). Caminhos antigos de contratos substituidos
continuam com conteudo atual ou encaminhamento; nao foram quebrados por remocao.

## Preservacao e limites

Somente Markdown foi alterado por esta tarefa.
Mudancas preexistentes de codigo e de documentos operacionais foram preservadas.
Nos registros de trabalho em andamento, apenas foi acrescentada classificacao
documental; no handoff admin tambem foi esclarecido o ownership do AppShell.
Snapshots de AGENTS usam .snapshot.md para nao virar instrucoes locais automaticas.

A documentacao determina como trabalhar; nao certifica que todo codigo atual
ja cumpra os contratos. UI, backend real, fallback e native ainda precisam das
verificacoes correspondentes quando forem alterados.
Nenhum documento garante obediencia perfeita de um agente.

## Cenarios de leitura revisados

| Pedido | Encaminhamento e decisao |
| --- | --- |
| Ajustar BottomTabBar admin | AppShell contract -> admin config/navigation/locales -> Foundation existente; build admin e visual mobile |
| Criar acao de pedido client | API contract -> hook/API/mapper client -> backend do dominio; screen dispara acao |
| Alterar permissao de endpoint | Backend architecture/API -> permissions/services/models/testes; tenant no servidor |
| Ajustar raio de Card | Contrato Foundation -> manifest/receita/resolvedor/consumidor; verificacao Foundation e visual |
| Alterar sessao do portal | Contrato portal -> auth hook/consumer; sem login ficticio por viewport |
| Adicionar texto ou idioma | Contrato raiz -> catalogos separados e strings ativas; conferir chaves/fallback e consumidor |
| Alterar tela mobile | Contrato mobile -> shared-core comum e adapters; typecheck nao equivale a teste de dispositivo |
| Adicionar campo no builder | Config primeiro; controle existente sem engine nova; capacidade compartilhada nova respeita aprovacao |
| Alterar fallback ou seed | Contrato mocks -> fonte explicita, sem falso sucesso; seed no backend |
| Retomar chat antigo | AGENTS -> entrypoint -> handoff pertinente -> codigo/Git; historico nao redefine regras |
| Corrigir documentacao | docs/README -> dono unico, links e diff; sem build de aplicacao |

## Evidencias desta revisao

- 23 documentos de entrada/regras revisados no verificador de links: 76 links
  locais, nenhum destino ausente.
- 25 caminhos concretos extraidos do entrypoint: todos existem.
- Scripts npm documentados e compilador TypeScript local conferidos no disco.
- Nenhum AGENTS.md ativo dentro do historico arquivado.
- git diff --check dos documentos alterados passou; Git avisou conversao LF/CRLF.
- 11 cenarios de encaminhamento revisados na tabela acima.
- Builds e testes de runtime nao executados: a tarefa alterou apenas Markdown.

## Manutencao futura

Quando mudar uma regra, atualize o dono e o registro ativo se necessario.
Quando mudar apenas o progresso, atualize o handoff/ledger pertinente.
Nao adicionar outra lista obrigatoria ou copiar regras para novos resumos.
