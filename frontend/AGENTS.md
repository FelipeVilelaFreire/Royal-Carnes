# RoyalPrime Frontend

Primeira leitura para UI web:
[TSX e CSS Modules: regra e criterio de aceitacao](../ROYALPRIME_ARCHITECTURE_CONTRACT.md#tsx-e-css-modules).
Aplicar antes de editar e revisar o proprio diff antes de concluir, inclusive
em manutencao de tela legada. Este arquivo encaminha para a regra central;
nao cria excecoes locais.

Leia [../AGENTS.md](../AGENTS.md) e
[../ROYALPRIME_ARCHITECTURE_CONTRACT.md](../ROYALPRIME_ARCHITECTURE_CONTRACT.md).
Selecione a tarefa em [../docs/CODEX_ENTRYPOINTS.md](../docs/CODEX_ENTRYPOINTS.md).
Este arquivo nao cria outra sequencia global.

Antes de alterar frontend, identifique surface, hook/API e dono visual.
Rastreie manifest efetivo -> resolver -> componente -> consumidor.
Screens usam hooks do escopo; Foundation nao conhece regras de produto.
AppShell e unico; cada surface fornece manifest/navigation/locales/routes.
Legado encontrado nao e permissao para repetir seu padrao.

Para UI e AppShell compartilhados, respeite o limite de aprovacao do AGENTS
raiz e do workspace. Para config existente, use a capacidade ja suportada.
Valide surfaces afetadas conforme a matriz do entrypoint, incluindo native
quando houver contrato compartilhado com client mobile.
