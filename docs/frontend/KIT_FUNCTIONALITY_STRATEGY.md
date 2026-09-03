# Frontend Kit Functionality Strategy

Data: 2026-08-28

## Objetivo

Definir como pensar funcionalidades por kit no shared-core sem piorar o
frontend com abstracao prematura.

## Decisao

O shared-core nao deve virar uma segunda aplicacao escondida.

Ele deve ser usado como camada fina de capacidade:

```text
contrato
api client
mapper
hook
view-model
manifest quando houver configuracao repetida
mock/fallback dev temporario
```

As telas continuam mostrando o fluxo real. Depois que o padrao se repetir, a
capacidade amadurece dentro do kit.

## Visao De Reuso

```text
backend
  -> reutilizavel por seed/config

frontend/shared-core, frontend/client/shared-core e frontend/admin/shared-core
  -> reutilizaveis por funcao/kit

frontend/client/web, frontend/client/mobile e frontend/admin/web
  -> render-only agora
  -> manifest-driven aos poucos
```

Exemplo:

```text
um kit de subscriptions nao deve ser "Royal Pro hardcoded"
ele deve ser "planos, beneficios, ciclos e assinatura atual"

um kit de catalog nao deve ser "carnes hardcoded"
ele deve ser "produtos, categorias, variants, medidas, collections e disponibilidade"

um kit de orders nao deve ser "Royal Delivery hardcoded"
ele deve ser "pedido, itens, status, timeline e detalhe"
```

O que muda entre carne, peixe, camisa ou outro produto:

```text
seed/config no backend
manifest/locale/navigation/tema/assets na surface
mock dev enquanto a API real nao esta ligada
```

O que nao deve mudar sem necessidade:

```text
contrato conceitual do kit
hook principal
mapper DTO -> view-model
API client do endpoint equivalente
```

## Ordem Correta

```text
1. Identificar capacidade real.
2. Criar ou atualizar o kit com objetivo e fronteira.
3. Mapear quais telas usam ou usarao essa capacidade.
4. Criar contrato minimo.
5. Criar mapper/API/hook apenas quando houver consumo real.
6. Aplicar em uma tela principal.
7. Validar build.
8. So entao aplicar em outras telas.
```

## Regra Curta

```text
kit pensa a capacidade
shared-core implementa o minimo reutilizavel
screen prova o uso real
manifest/locales removem hardcode editavel
backend continua dono da regra
```

## Exemplo Canonico: Adicionar Item

Este exemplo deve guiar novas funcionalidades.

Tela:

```tsx
<Button onClick={() => orderActions.addItem(product.id)}>
  {strings.add}
</Button>
```

Responsabilidade da tela:

```text
mostrar o botao
mostrar loading/erro visual
passar o id selecionado
renderizar o view-model retornado
```

Responsabilidade do shared-core do kit:

```text
definir contrato minimo
expor hook/action: addItem
montar payload esperado pelo backend
chamar API client
tratar loading/erro/fallback dev
mapear DTO para view-model
```

Responsabilidade do backend:

```text
validar organization
validar produto
validar estoque
validar limite do plano/ciclo
calcular preco, peso e unidade
persistir
auditar
retornar DTO
```

O que nunca fazer:

```text
screen decidir regra de estoque
screen calcular preco final persistido
screen validar limite de plano
screen chamar fetch direto para fluxo reutilizavel
shared-core global receber esse fluxo cedo demais
locale virar tabela de regra comercial
```

## O Que Nao Fazer

```text
nao criar hook sem tela consumidora clara
nao criar manifest gigante antes de saber o runtime
nao mover regra de negocio para locale
nao mover tudo para frontend/shared-core global
nao criar um kit para cada componente visual
nao tentar converter todas as telas de uma vez
```

## Como Dividir Por Kit

### Client Kits

```text
auth
  -> sessao, login, registro, usuario atual

customer
  -> dados pessoais, enderecos, preferencias

catalog
  -> produtos, categorias, collections, busca, filtros

subscriptions
  -> planos, assinatura ativa, ciclo atual, beneficios

orders
  -> criar pedido, listar meus pedidos, detalhe, timeline

deliveries
  -> acompanhar entrega, codigo, confirmacao visual

checkout
  -> montagem do pedido, etapas, frete/pagamento enquanto UI
```

### Admin Kits

```text
auth
  -> acesso admin e permissao

users
  -> usuarios da operacao

customers
  -> clientes, enderecos, contato

catalog
  -> produtos, categorias e disponibilidade

subscriptions
  -> planos, assinaturas e ciclos

inventory
  -> estoque simples, ajustes e reservas

orders
  -> pedidos recebidos, detalhe, transicao de status

deliveries
  -> entregas, status, confirmacao

dashboard
  -> resumo operacional, widgets e listas recentes
```

### Global Shared-Core

Use pouco:

```text
organization
money
address
identity base
manifest helpers
```

So subir algo para `frontend/shared-core` quando client, mobile e admin
realmente usarem o mesmo contrato.

## Criterio Para Criar Funcionalidade No Shared-Core

Pode criar quando pelo menos um item for verdadeiro:

```text
uma screen ja precisa consumir API real
web e mobile vao compartilhar o fluxo
duas telas repetem o mesmo estado/mapeamento
o backend ja tem contrato claro
um mock precisa virar fallback dev estruturado
```

Nao criar quando:

```text
e so previsao futura
e apenas copy visual
e apenas layout
e uma variacao pequena de card
o backend ainda nao tem contrato
```

## Relacao Com Copy/Locale

Copy-only e outra trilha.

```text
locales removem texto hardcoded
manifest organizam estruturas editaveis
kits organizam capacidade funcional
```

Nao usar shared-core funcional apenas para mover texto.

## Proxima Rodada Recomendada

Em vez de criar mais funcionalidade, fazer uma das duas trilhas pequenas:

### Trilha A - Copy-Only

```text
1. HeroMarketplaceView
2. LandingView
3. OrderDetailModal
4. MinhaContaView
```

Objetivo: reduzir hardcode visivel sem mexer em regra.

### Trilha B - Kit Inventory

```text
1. listar kits existentes
2. para cada kit, marcar: planned | local | api-ready | screen-connected
3. apontar telas consumidoras
4. apontar contrato backend correspondente
5. nao implementar nada novo ainda
```

Objetivo: ter mapa claro antes de novas extracoes.

## Prompt Para Proxima IA

```text
Voce esta no RoyalPrime.

Leia:
AGENTS.md
ROYALPRIME_CODEX_RULES.md
ROYALPRIME_ARCHITECTURE_CONTRACT.md
docs/CODEX_ENTRYPOINTS.md
docs/frontend/KIT_FUNCTIONALITY_STRATEGY.md
docs/frontend/COPY_LOCALE_AUDIT.md
docs/frontend/RENDER_ONLY_AUDIT.md

Objetivo:
organizar a estrategia de funcionalidades por kit sem criar abstracao prematura.

Regras:
- shared-core e camada fina, nao uma segunda aplicacao;
- kit documenta capacidade e fronteira;
- implementar hook/API/mapper so com tela consumidora ou contrato backend claro;
- copy-only deve ir para locales/manifest, nao para hooks;
- nao mover regra de negocio para frontend;
- nao promover para frontend/shared-core global sem prova;
- manter telas render-only aos poucos, uma tela por vez;
- validar build apenas se mexer em codigo de surface.

Entrega esperada:
um mapa por kit com status, arquivos reais, telas consumidoras e proximo passo
minimo.
```
