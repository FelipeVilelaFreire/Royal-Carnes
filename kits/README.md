# RoyalPrime Reusable Kits

Esta pasta documenta capacidades que podem virar kits reutilizaveis em futuros produtos.

O objetivo nao e criar uma biblioteca abstrata agora. O objetivo e deixar claro para uma IA ou desenvolvedor:

```text
qual capacidade existe
quais arquivos representam essa capacidade
quais partes podem ser copiadas/adaptadas
quais partes sao especificas do RoyalPrime
qual fase do roadmap amadurece essa capacidade
```

## Regra de Uso

Quando um novo produto precisar de uma capacidade, leia o kit correspondente antes de implementar.

Exemplo:

```text
Novo produto precisa de login, usuarios e perfis.
  -> leia kits/auth-users-kit.md
  -> identifique arquivos fonte no RoyalPrime
  -> copie/adapte contratos, backend, hooks e screens seguindo o escopo correto
```

## Formato Obrigatorio de Cada Kit

Cada kit deve ser pratico o suficiente para uma IA abrir o arquivo e saber onde olhar.

Estrutura minima:

```text
1. Objetivo
2. Produtos que podem reutilizar
3. Escopo backend
   -> pastas/arquivos fonte
   -> entidades
   -> services/use-cases
   -> endpoints
   -> regras reais
4. Escopo shared-core
   -> contratos
   -> API clients
   -> hooks
   -> mappers
   -> view-models
5. Escopo render
   -> screens
   -> modais
   -> componentes visuais
   -> estados visuais locais
6. O que e generico
7. O que e especifico do RoyalPrime
8. Como copiar/adaptar
9. Criterio para kit-ready
10. Criterio para ServiceOS candidate
```

Regra de arquivo:

```text
Se um kit nao aponta para arquivos reais ou planejados, ele ainda e apenas uma ideia.
Se aponta para arquivos reais e explica o papel de cada um, ele vira guia pratico.
```

## Status de Kit

```text
planned
  -> capacidade prevista no MER/roadmap, mas ainda nao implementada

local
  -> implementada para RoyalPrime, ainda muito especifica

kit-ready
  -> fronteira clara para copiar/adaptar em outro produto

serviceos-candidate
  -> ja provou reuso e pode virar capacidade formal do ServiceOS
```

## Kits Planejados

| Kit | Status inicial | Fase principal | Uso futuro |
| --- | --- | --- | --- |
| Auth & Users | planned | Fase 1 | Qualquer app com login, cliente/admin e permissoes |
| Organizations | planned | Fase 1 | Multiempresa, white-label, tenant-ready |
| Catalog | planned | Fase 1 | Ecommerce, assinatura, cardapio, servicos |
| Orders | planned | Fase 2 | Ecommerce, restaurante, delivery, pedidos internos |
| Scheduling | planned | Fase 3/5 | Entrega, agenda, reserva, appointments |
| Admin Operations | planned | Fase 3 | Painel operacional para loja/equipe |
| Inventory | planned | Fase 4 | Estoque simples de produto/insumo |
| Fulfillment & Delivery | planned | Fase 5 | Entrega, retirada, separacao, confirmacao |
| Payments | planned | Fase 6/7 | Manual, Pix, gateway, conciliacao |
| Wallet & Vouchers | planned | Fase 8 | Credito, voucher, saldo, estorno |

## Relacao Com ServiceOS

Os kits sao a ponte entre RoyalPrime e ServiceOS.

```text
RoyalPrime implementa a capacidade em produto real.
Kit documenta os arquivos e a fronteira de reuso.
Outro produto copia/adapta pelo kit.
ServiceOS absorve somente depois que existir reuso comprovado.
```

O kit nao deve tentar ser ServiceOS antes da hora.

## Como Uma IA Deve Usar Um Kit

Exemplo de prompt futuro:

```text
Leia kits/auth-users-kit.md.
Use os arquivos indicados como referencia.
Crie Auth & Users no novo produto seguindo o mesmo contrato.
Troque seed/config/copy/tema para a nova empresa.
Nao copie regra especifica do RoyalPrime.
```

Resposta esperada da IA:

```text
1. Ler o kit.
2. Abrir os arquivos fonte.
3. Separar backend, shared-core e render.
4. Copiar/adaptar somente o que e generico.
5. Recriar o que e especifico do novo produto.
6. Documentar os novos arquivos no kit equivalente.
```

## Regra Central

```text
RoyalPrime implementa primeiro.
Kit documenta a fronteira de reuso.
ServiceOS recebe depois apenas o que provar valor fora do RoyalPrime.
```
