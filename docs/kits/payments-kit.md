# Payments Kit

Status atual: `local foundation`

Fase principal: Fase 5/6 - Pagamentos Operacionais

## 1. Objetivo

Documentar a capacidade de pagamentos do RoyalPrime: cobrancas manuais,
vencimento, status financeiro e vinculo com cliente, assinatura e pedido.

Este kit ainda nao e gateway. A V1 registra o financeiro operacional de forma
simples e persistida, para a loja conseguir acompanhar pendencias e pagos.

## 2. Produtos Que Podem Reutilizar

```text
ecommerce simples
assinatura mensal
delivery com pagamento manual
servico com cobranca recorrente
produto que futuramente tera Pix/gateway/conciliacao
```

## 3. Regra Central

```text
Backend persiste e valida o pagamento.
Shared-core formata valor, datas, status e relacoes.
Render apenas apresenta, cria e edita pelo data-source/hook.
```

## 4. Escopo Backend

Arquivos fonte:

```text
backend/apps/payments/models.py
backend/apps/payments/selectors.py
backend/apps/payments/serializers.py
backend/apps/payments/views.py
backend/apps/payments/urls.py
backend/apps/payments/tests.py
backend/apps/payments/migrations/0001_initial.py
backend/config/settings/base.py
backend/api/v1/urls.py
```

Entidade atual:

```text
Payment
  -> organization
  -> customer
  -> subscription opcional
  -> order opcional
  -> reference
  -> status
  -> currency
  -> amount_cents
  -> due_at
  -> paid_at
  -> notes
  -> metadata
```

Endpoints atuais:

```text
GET /api/v1/payments/admin/payments/
POST /api/v1/payments/admin/payments/
GET /api/v1/payments/admin/payments/:id/
PATCH /api/v1/payments/admin/payments/:id/
```

Regras reais:

```text
Payment pertence a organization.
Customer precisa pertencer a mesma organization.
Subscription e Order sao opcionais, mas quando informados devem pertencer ao
mesmo contexto.
Valor e salvo em centavos.
Status atual: pending, paid, failed, cancelled, refunded.
Reference e unica por organization.
```

## 5. Escopo Shared-Core Admin

Arquivos reais:

```text
frontend/admin/shared-core/contracts/payments.contract.ts
frontend/admin/shared-core/api/payments.api.ts
frontend/admin/shared-core/mappers/payments.mapper.ts
frontend/admin/shared-core/view-models/payments.view-model.ts
frontend/admin/shared-core/data-sources/standard.data-source.ts
frontend/admin/shared-core/manifest/pages/pagamentos.config.jsx
frontend/admin/shared-core/locales/pt-BR.ts
frontend/admin/shared-core/index.ts
```

Responsabilidades:

```text
normalizar DTO do backend
formatar moeda BRL a partir de amount_cents
formatar datas para exibicao e input datetime
expor statusLabelKey/statusTone
montar opcoes de cliente e assinatura vindas do backend
criar/editar pagamento pelo admin API client
alimentar aba Pagamentos dentro de Assinaturas
```

## 6. Escopo Render Admin

```text
ListPage
  -> Referencia, Cliente, Status, Valor, Vencimento

DetailPage
  -> referencia editavel
  -> cliente
  -> assinatura/plano
  -> pedido
  -> status editavel
  -> valor currency
  -> vencimento datetime
  -> data de pagamento datetime
  -> notas textarea

AddPage
  -> referencia
  -> cliente obrigatorio
  -> assinatura opcional
  -> status
  -> valor
  -> vencimento
  -> notas
```

Proibido no render:

```text
calcular valor real
confirmar pagamento sem persistir
mascarar erro de API como sucesso
chamar endpoint direto se existe data-source/api client
hardcodar copy/status em TSX
```

## 7. O Que E Generico

```text
status financeiro basico
valor em centavos
vinculo opcional com cliente, assinatura e pedido
referencia unica por organization
notas e metadata para integracoes futuras
```

## 8. O Que E Especifico Do RoyalPrime

```text
copy do admin
nomes de planos e clientes do seed Royal Carnes
decisao comercial de comecar manual antes de gateway
```

## 9. Como Copiar/Adaptar

1. Copiar `backend/apps/payments` e suas dependencias de organization/customer.
2. Ajustar permissoes e roles no seed do novo produto.
3. Copiar contracts/api/mapper/view-model do shared-core admin.
4. Criar manifest de Pagamentos com colunas e campos do produto.
5. Adicionar seed financeiro demo se a operacao precisar validar tela vazia.
6. Integrar gateway somente depois de fechar o fluxo manual.

## 10. Seeds Esperados

Atual:

```text
seed de pagamentos ainda nao foi adicionado
```

Recomendado para proximo corte:

```text
backend/seeds/royalprime/kits/payments.seed.json
  -> pagamento pendente de assinatura
  -> pagamento pago de assinatura
  -> pagamento pendente de pedido
```

## 11. Criterio Para Kit-Ready

```text
backend payments implementado
endpoints admin funcionando
tests de criar/listar/editar status passando
admin List/Detail/Add consumindo data-source real
aba Pagamentos em Assinatura consumindo pagamentos reais
seed demo criado
browser validado com create/edit/refresh
```

## 12. Criterio Para ServiceOS Candidate

Somente depois de reuso em outro produto e depois que o contrato suportar mais
de um formato real de cobranca sem regra RoyalPrime no core.
