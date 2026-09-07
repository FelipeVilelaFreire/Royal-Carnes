# Frontend Render-Only Handoff

> Status: referencia ou registro de estado; nao e contrato ativo.
> Regras e leitura por tarefa: [CODEX_ENTRYPOINTS.md](../../docs/CODEX_ENTRYPOINTS.md).
> Trees, exemplos, proximos passos e instrucoes antigas abaixo devem ser
> confrontados com os contratos ativos e o codigo; nao autorizam excecoes.

Use este pacote para outra IA continuar a migracao do frontend sem perder a
direcao arquitetural.

## Antes De Codar

Leia nesta ordem:

```text
1. AGENTS.md
2. ROYALPRIME_CODEX_RULES.md
3. ROYALPRIME_ARCHITECTURE_CONTRACT.md
4. docs/CODEX_ENTRYPOINTS.md
5. docs/frontend/TREE.md
6. docs/frontend/RENDER_ONLY_AUDIT.md
7. frontend/client/web/docs/ROYALPRIME_TO_SERVICEOS_ECOMMERCE_DEPARA.md
```

## Regra Central

```text
backend
  -> regra real

shared-core do escopo correto
  -> contratos, DTOs, API clients, hooks, mappers, view-models, manifest e mocks temporarios

web/mobile/admin-web
  -> render-only

foundation
  -> visual-only
```

## Como Trabalhar

```text
1. Nunca mover tudo de uma vez.
2. Preservar comportamento visual atual.
3. Primeiro criar contrato/API/hook/view-model.
4. Depois trocar a screen para consumir hook.
5. Depois mover copy/config repetida para locale/manifest.
6. Rodar build da surface editada.
```

## Arquivos Do Handoff

```text
01-client-orders-deliveries-shared-core.md
02-client-orders-screens-render-only.md
03-client-landing-manifest-copy.md
04-admin-render-only-screen-types.md
05-checklists-and-validation.md
06-frontend-orders-deliveries-contract-alignment.md
07-montarbox-pedidoview-phase1-map.md
08-perfil-minhaconta-phase1-audit.md
09-meus-pedidos-render-only-audit.md
10-minha-caixa-render-only-audit.md
11-admin-extraction-strategy.md
```

Audit complementar:

```text
../frontend/COPY_LOCALE_AUDIT.md
../frontend/KIT_FUNCTIONALITY_STRATEGY.md
```

## Estado Pos-Audit

O pacote de shared-core/render-only compila, mas ainda nao deve ser tratado
como integracao real completa.

Bloqueios antes de considerar pronto:

```text
client contracts de Orders/Deliveries ainda usam nomes legados de mock
admin API clients apontam para endpoints que nao existem no backend real
fallback retorna mock e pode marcar source=api indevidamente
status/tone ainda estao hardcoded em view-models
landing ainda tem copy inline em JSX
```

Antes de continuar, leia:

```text
docs/handoff/06-frontend-orders-deliveries-contract-alignment.md
```

## Ordem Recomendada

```text
1. Client segue por cortes de tela: MeusPedidos, MinhaCaixa e MeuClube.
2. Admin segue por 11-admin-extraction-strategy.md.
3. Admin Dashboard/ListPage/DetailPage devem ficar render-only com
   status/copy/columns/actions vindos de config/view-model/locales.
4. Avaliar product-components/ecommerce depois de prova em outra tela.
```

## Corte Copy-Only Recomendado

Antes de criar novas funcionalidades no shared-core, fazer uma rodada pequena
de copy/locales nas telas principais.

Leia:

```text
docs/frontend/COPY_LOCALE_AUDIT.md
```

## Regra Para Funcionalidades Por Kit

Antes de criar mais hooks, APIs, mappers ou manifest funcionais, leia:

```text
docs/frontend/KIT_FUNCTIONALITY_STRATEGY.md
```

Resumo:

```text
kit pensa a capacidade
shared-core implementa o minimo reutilizavel
screen prova o uso real
backend continua dono da regra
```

## Nao Fazer

```text
nao promover para frontend/shared-core global sem prova real
nao reescrever foundation
nao trocar visual sem pedido explicito
nao apagar mocks antes de hooks terem fallback
nao implementar scheduling/Royal Box recorrente agora
```
