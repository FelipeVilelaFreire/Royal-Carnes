# Seed Strategy

Status inicial: `local scaffold`

Fase principal: Fase 1 - Backend Base Real

## Objetivo

Definir como os seeds do RoyalPrime devem nascer sem transformar Royal Carnes em
regra hardcoded.

Regra central:

```text
codigo define capacidade generica
seed/config veste a capacidade para cada negocio
```

## Tipos De Seed

### 1. Seed principal

Seed usado pelo produto real atual.

```text
RoyalPrime / Royal Carnes
```

Esse seed deve ser o mais completo primeiro, porque ele valida o produto real.

### 2. Seed exemplo

Seed pequeno usado para provar reuso.

Exemplos:

```text
BikeClub
CamisaClub
Restaurante
Clube de vinho
Barbearia
```

Esse seed nao precisa ser implementado completo. Ele serve para testar se o
modelo nao ficou preso em copy, produto ou regra Royal Carnes.

### 3. Seed dev

Seed local para desenvolvimento e testes manuais.

Exemplos:

```text
admin@royalprime.local
cliente@royalprime.local
produtos pequenos
pedidos de exemplo
```

### 4. Seed test

Seed minimo para testes automatizados.

Regra:

```text
test seed deve ser pequeno, deterministico e rapido
```

## Onde Seeds Devem Morar

Backend alvo:

```text
backend/seeds/royalprime/
backend/seeds/examples/bikeclub/
backend/seeds/examples/camisaclub/
backend/seeds/tests/
```

Dentro de cada seed, os dados ficam separados por kit:

```text
seed.manifest.json
kits/organizations.seed.json
kits/auth-users.seed.json
kits/customers.seed.json
kits/catalog.seed.json
kits/subscriptions.seed.json
```

O manifesto monta o seed completo. Cada arquivo dentro de
`backend/seeds/.../kits/` veste uma capacidade especifica.

Kits documentais:

```text
docs/kits/<capability>-kit.md
  -> descreve quais seeds esse kit espera
```

## Seed Principal Royal Carnes

Deve vestir as capacidades genericas com o negocio atual:

```text
Organization: RoyalPrime / Royal Carnes
Roles: owner, admin, operator, customer
Collections: inverno, verao, familia, churrasco premium
Categories: carnes, carvao, temperos, utensilios
Plans: Basic, Premium, Pro
Products: Picanha, Ancho, Fraldinha, Carvao
Commercial modes: subscription, delivery, box
Payment methods: pixManual, cashOnDelivery, cardManual
Delivery windows: hoje, amanha, agendado
```

## Seed Exemplo BikeClub

Nao e produto real agora. Serve para validar abstracao.

```text
Organization: BikeClub
Roles: owner, admin, mechanic, customer
Collections: urbano, performance, manutencao
Categories: bicicletas, acessorios, manutencao
Plans: Urbano, Performance, Pro
Products: Bike urbana, Capacete, Kit reparo, Revisao mensal
Commercial modes: subscription, delivery, pickup
```

Se o backend exigir alterar codigo para aceitar BikeClub, o modelo ainda esta
preso demais em Royal Carnes.

## Seed Exemplo CamisaClub

Nao e produto real agora. Serve para validar um ecommerce/assinatura simples
com produto nao perecivel.

```text
Organization: CamisaClub
Roles: owner, admin, operator, customer
Collections: basicos, verao, streetwear
Categories: camisetas, moletons, acessorios
Plans: Starter, Club
Products: Camiseta branca, Camiseta street, Moletom basic, Bone classic
Commercial modes: subscription, delivery, box
```

Se o backend exigir alterar codigo para aceitar CamisaClub, o modelo ainda esta
preso demais em Royal Carnes.

## Regras

- Seed pode conter nomes comerciais.
- Seed pode conter copy operacional curta, quando for dado.
- Seed nao pode virar condicional no codigo.
- Seed deve usar entidades genericas do MER.
- Seed real deve nascer antes de seed exemplo completo.
- Seed exemplo deve permanecer pequeno.

## Relacao Com Kits

Cada kit deve declarar:

```text
seed principal Royal Carnes
seed exemplo alternativo
dados obrigatorios
dados opcionais
o que nao pode virar hardcoded
```

Exemplo:

```text
Catalog Kit
  -> Royal Carnes: carnes/carvao/temperos
  -> BikeClub: bicicletas/acessorios/manutencao
```
