# RoyalPrime Local Design System

Esta pasta contem componentes visuais locais criados para acelerar o MVP do RoyalPrime.

Ela nao representa a Foundation final do ServiceOS e nao deve crescer como uma biblioteca paralela.

Regras:

- Componentes visuais genericos novos devem nascer na Foundation/ServiceOS quando forem reutilizaveis.
- Componentes de produto ecommerce devem ficar em `src/product-components/ecommerce`.
- Telas em `src/screens` devem apenas compor dados, manifestos e componentes existentes.
- Componentes desta pasta podem continuar sendo usados ate a migracao gradual para ServiceOS.
- Nao mover regra de negocio, mocks, copy ou manifestos para esta pasta.

Destino futuro:

```text
ServiceOS/Foundation
  -> Button, Input, Card, Header, Footer, BottomTabBar, Icon primitives

RoyalPrime product-components/ecommerce
  -> ProductItemCard, PlanSummaryCard, OrderSummary, CatalogShowcaseCard
```
