# Documentacao RoyalPrime

Status: contrato ativo de manutencao documental.

## Entrada unica

[AGENTS.md](../AGENTS.md) -> [contrato arquitetural](../ROYALPRIME_ARCHITECTURE_CONTRACT.md)
-> [leitura por tarefa](CODEX_ENTRYPOINTS.md) -> codigo e verificacao.

O registro de contratos ativos fica exclusivamente em CODEX_ENTRYPOINTS.md.
Nao existe uma segunda ordem obrigatoria em README, roadmap ou handoff.

## Classes de documento

| Classe | Autoridade e uso |
| --- | --- |
| AGENTS e contrato raiz | Protocolo e ownership obrigatorios |
| Contrato ativo registrado | Detalhe normativo no escopo declarado |
| Guia/README/tree/kit | Localizacao, exemplos e uso; confirmar no codigo |
| Roadmap/plano | Trabalho proposto, nao autorizacao ou estado concluido |
| Auditoria/ledger/handoff | Evidencia e estado de uma data; pode ficar desatualizado |
| archive | Historico substituido, excluido da leitura operacional |

Documentos fora do registro ativo sao referencia mesmo que conservem nomes como
RULES, CONTRACT, STANDARD ou "canonico". Nao seguir sua antiga ordem global,
sua branch fixa ou suas excecoes quando divergirem dos contratos ativos.
AGENTS locais continuam aplicaveis em seu escopo.

## Como manter

- Edite a regra no seu dono unico; outros arquivos devem apontar para ela.
- Nova regra geral pertence ao contrato raiz; nao criar outro contrato geral.
- Contrato especializado novo precisa de escopo distinto, necessidade real,
  registro no entrypoint e links validos. Nao criar por assunto repetido.
- Estado atual pertence a continuacao/handoff/ledger. Nao fixar branch,
  proxima tarefa ou resultado de build em regra permanente.
- Diferencie implementado, verificado, planejado e legado tolerado.
- Exemplos usam paths e APIs reais ou sao explicitamente conceituais.
- Ao alterar paths, atualize referencias afetadas, nao toda tree historica.
- Ao aposentar orientacao conflitante, preserve contexto util em archive e
  deixe encaminhamento no caminho antigo se houver referencias.
- Nao apagar handoffs, evidencias ou trabalho em andamento apenas porque sao antigos.
- Documento arquivado nunca e incluido automaticamente na leitura inicial.
- Atualize este registro/entrypoint no mesmo trabalho em que mudar uma regra.

## Verificacao documental

Confira links Markdown locais e paths usados nas entradas ativas.
Simule ao menos: tarefa de admin, client, backend, visual/tokens, mobile,
fallback, builder e documentacao. Cada caso deve identificar dono, regras,
arquivos de partida e verificacao sem depender de todos os handoffs.

Use git diff --check nos arquivos da tarefa. Nenhum build e necessario quando
apenas Markdown muda. Verificacao documental nao certifica o runtime.

## Referencias operacionais

- [Kits](kits/README.md)
- [Ledger de capacidades](kits/KITS_RUNTIME_LEDGER.md)
- [Handoffs](handoff/README.md)
- [Continuacao](../continuacao.md)
- [Registro desta consolidacao](DOCUMENTATION_CONSOLIDATION.md)
- [Historico substituido](archive/README.md)
