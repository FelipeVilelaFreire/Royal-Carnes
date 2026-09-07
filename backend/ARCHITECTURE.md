# RoyalPrime Backend Architecture

Status: contrato ativo de backend. Ownership geral em
[../ROYALPRIME_ARCHITECTURE_CONTRACT.md](../ROYALPRIME_ARCHITECTURE_CONTRACT.md).
Payloads/endpoints em [API_CONTRACTS.md](API_CONTRACTS.md).
Ambiente em [README.md](README.md).

## Responsabilidades

- Models/migrations representam entidades e integridade.
- Serializers validam formato e contrato da API.
- Services/use-cases executam regras, transicoes, calculos e escrita.
- Selectors/queries preparam leitura respeitando tenant/permissao.
- Views e urls conectam HTTP ao dominio; nao duplicam regra de services.
- Tests verificam caminhos de sucesso, erros e limites relevantes.
- Seeds configuram a organization e dados de negocio, sem if por marca no core.

Use a organizacao existente em backend/apps/<dominio>. Nao recriar backend
nem fechar um novo MER para uma funcionalidade que ja tem contrato/model.
MER, TREE e roadmap sao referencias a confrontar com codigo/migrations.

## Tenant e autorizacao

Organization delimita dados de negocio. Resolva o contexto pelos mecanismos
existentes, confira membership/permissoes e filtre leitura/escrita.
Header ou organizationId enviado pelo cliente nao e prova de autorizacao.
Relacoes entre entidades nao podem atravessar organizations indevidamente.
Nao confiar em esconder botao ou rota no frontend para proteger uma operacao.

## Contratos e regras

API_CONTRACTS.md e codigo real precisam permanecer alinhados no trecho alterado.
Confira nomes, ids/FKs, tipos, status keys, erros, paginacao e paths.
Nao copiar endpoint conceitual de um roadmap.
Erros tecnicos devem permitir mapeamento para o idioma da UI.

Backend decide preco persistido, quantidade elegivel, estoque, limites,
assinatura, pagamento, workflow e auditoria. Use dados/seed/config para variar
produto/empresa. Nao decidir regra por nome de plano, produto ou marca.
Shared-core mapeia DTO e organiza fluxo; tela apenas apresenta/dispara acao.

Mudancas acopladas, como pedido/reserva/estoque, devem preservar consistencia
transacional e evitar duplicacao de efeitos em repeticao quando aplicavel.
Nao presumir que criar registro isolado conclui o fluxo operacional.

## Seeds, ambiente e migrations

Leia backend/seeds/README.md e o comando existente antes de aplicar seed.
Verifique idempotencia e isolamento por organization.
Nao usar mock TS do frontend como schema de seed automaticamente.

Segredos ficam no ambiente, exemplos nao sensiveis em .env.example.
Respeite settings de desenvolvimento/producao e banco efetivo.
Confira migration gerada; nao apagar historico nem recriar banco para contornar erro.
Mudanca de producao ou ambiente externo exige autorizacao pertinente.

## Verificacao e escopo

Siga a matriz backend em docs/CODEX_ENTRYPOINTS.md a partir da raiz.
Teste permissao/tenant, validacao, sucesso e efeito persistido da regra alterada.
Atualize API_CONTRACTS.md se mudar interface publica.
Nao declarar integracao concluida com base em mocks ou build frontend.

Fases, prioridade de gateway, scheduling e ERP pertencem ao roadmap e a tarefa
atual; nao sao proibicoes permanentes deste contrato.
