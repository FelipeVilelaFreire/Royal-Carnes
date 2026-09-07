# Mocks, ambiente e seeds

Status: contrato ativo.
Ownership: [contrato raiz](../../ROYALPRIME_ARCHITECTURE_CONTRACT.md).

## Fonte de dados

- Backend e fonte autoritativa de estado persistido e regra comercial.
- Dados de demonstracao ficam em mocks/ ou data-sources/ do shared-core dono.
  Use o padrao ja existente na capacidade, sem criar outra pasta por preferencia.
- Screen consome hook/view-model, nunca importa mock para fluxo novo.
- API client nao converte erro em sucesso mockado silencioso.
- Fallback e decisao explicita na camada de fluxo/data source. Resultado deve
  identificar sua origem, preservando a capacidade de distinguir API de fallback.
- Falhas de autenticacao, permissao ou gravacao nao podem aparecer como sucesso
  por fallback. Nao usar dados demonstrativos como prova de integracao real.
- Nova ativacao de fallback em producao exige decisao explicita de produto;
  existencia de fallbackOnError legado nao autoriza ampliar esse comportamento.
- Se backend faltar, exponha estado indisponivel/erro ou modo demonstracao
  explicitamente configurado. Nao inventar gravacao com fechamento de modal.

## Ambiente

Confira .env.example, settings e consumidores reais antes de citar uma variavel.
Nao inventar USE_MOCKS/API_URL que o codigo nao le.
Segredos nao entram em manifest publico, locale, commit ou saida de ferramenta.
Variaveis publicas do frontend nao podem conter credenciais privadas.
Documente nomes e valores de exemplo nao sensiveis em .env.example.
Nao mudar ambiente externo nem renovar credenciais como efeito colateral de docs.

## Seeds

backend/seeds e dono dos dados de seed, com validacoes e comandos existentes.
Mocks de frontend e seeds nao sao automaticamente o mesmo schema.
Mapeamento, ids/FKs, organization e compatibilidade com models precisam ser
verificados. Nao presumir paridade por nomes iguais nem executar seed destrutivo.
Leia backend/seeds/README.md e a implementacao do comando antes de executar.

## Verificacao

Teste API disponivel, API indisponivel, origem do fallback e falhas de gravacao
conforme o comportamento alterado. Confira isolamento por organization.
Relate ambiente e fonte realmente usados. Exibir mock nao prova persistencia.
