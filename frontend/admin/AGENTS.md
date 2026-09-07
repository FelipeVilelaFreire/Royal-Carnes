# RoyalPrime Admin

Escopo: shared-core e web administrativos.
Leia [../AGENTS.md](../AGENTS.md) e as linhas admin/fluxo/visual aplicaveis em
[../../docs/CODEX_ENTRYPOINTS.md](../../docs/CODEX_ENTRYPOINTS.md).

Contrato de montagem:
[../../docs/contracts/SCREENTYPE_MANIFEST_PIPELINE_CONTRACT.md](../../docs/contracts/SCREENTYPE_MANIFEST_PIPELINE_CONTRACT.md).

Admin declara manifest e consome AppShell Foundation. Nao criar shell/admin
paralelo nem um runtime novo para montar config/navigation/routes.
Dados e acoes vem de admin/shared-core; texto vem de strings ativas.
Declarar controle ja suportado em config nao exige alterar o motor.
