# Client Portal Navigation and Auth State Contract

Este documento registra o contrato atual do portal do cliente em
`frontend/client/web`. Ele substitui a ideia anterior de "portal restrito com
sidebar" por uma experiencia de loja/conta com Header no desktop e BottomTabBar
no mobile.

## Objetivo

O portal nao deve parecer um sistema interno. Ele deve parecer uma experiencia
comercial continua da Royal Prime:

```text
Home -> Cortes -> Royal Box -> Royal Delivery -> Minha Conta
```

As cinco areas existem como abas fixas por enquanto, mesmo quando o usuario nao
esta logado.

## Abas fixas

A navegacao canonica do portal fica em
`frontend/client/shared-core/manifest/navigation.ts`:

```text
Home
Cortes
Royal Box
Royal Delivery
Minha Conta
```

Essas abas sao fixas no Header desktop e na BottomTabBar mobile. Nao existe mais
um estado em que a navegacao esconde Royal Box, Royal Delivery ou Minha Conta.

## Estado de autenticacao mockado

Enquanto nao existe autenticacao real, o estado e controlado em
`frontend/client/shared-core/manifest/portal/appshell.config.jsx`:

```js
auth: {
  mockAuthenticated: false,
  mobileMockAuthenticated: true,
  publicNavKeys: ["home", "cortes"],
  protectedNavKeys: ["minhaCaixa", "royalDelivery", "meuClube"]
}
```

Regras:

- Desktop usa `mockAuthenticated`.
- Mobile usa `mobileMockAuthenticated`.
- `Home` e `Cortes` sao publicas.
- `Royal Box`, `Royal Delivery` e `Minha Conta` sao protegidas.
- Quando uma area protegida e acessada sem login, a tela renderiza `EmptyState`.
- Nao existe botao `Entrar` no Header ou na BottomTabBar neste contrato atual.

Quando a autenticacao real entrar, a UI deve trocar apenas a fonte do booleano.
O contrato de navegacao e o comportamento visual permanecem iguais.

## Desktop

No desktop, o portal usa Header:

```js
layout: {
  desktop: "header"
}
```

Regras:

- Header visivel.
- Sidebar desligada.
- Marca Royal Prime, Home e Cortes ficam no bloco esquerdo.
- As demais abas continuam no mesmo eixo de navegacao.
- Acoes comerciais, como Carrinho, ficam no lado direito.
- O conteudo deve reservar espaco para o Header por `header.contentOffsetTop`.

Config atual:

```js
header: {
  enabled: true,
  layoutMode: "attached",
  surfaceStyle: "glassBlur",
  navAlignment: "left",
  contentOffsetTop: "92px",
  brandKicker: "Carnes premium",
  brandSurface: "elevated",
  brandRoutePath: "/home"
}
```

## Mobile

No mobile, o portal nao renderiza Header:

```js
header: {
  mobile: {
    enabled: false
  }
}
```

Regras:

- Header invisivel.
- Drawer nao e a navegacao primaria do portal.
- BottomTabBar e a unica navegacao principal.
- BottomTabBar exibe as cinco abas fixas.
- O conteudo deve reservar espaco inferior por `bottomTabBar.contentOffsetBottom`.

Config atual:

```js
bottomTabBar: {
  enabled: true,
  contentOffsetBottom: "76px"
}
```

## EmptyState

O estado vazio canonico foi criado na Foundation:

```text
frontend/foundation/ui/EmptyState/
```

Uso esperado:

- areas privadas sem login;
- carrinho vazio;
- Royal Box ainda nao montada;
- Royal Delivery ainda nao iniciado;
- busca sem resultados;
- historico de pedidos vazio.

O componente deve receber copy por props. Textos de produto devem continuar em
`locales/pt-BR.ts` ou catalogo equivalente.

## Rotas

Rotas atuais do portal:

```text
/home
/cortes
/minha-caixa
/royal-delivery
/meu-clube
```

`/minha-assinatura` ainda existe como compatibilidade, mas a direcao de produto
passa a ser `Minha Conta` e nao "portal de assinatura" como destino principal.

## Arquivos donos

```text
frontend/client/shared-core/manifest/routes.ts
frontend/client/shared-core/manifest/navigation.ts
frontend/client/shared-core/manifest/locales/pt-BR.ts
frontend/client/shared-core/manifest/portal/appshell.config.jsx
frontend/client/web/src/views/portal/PortalView.tsx
frontend/client/web/src/app/(portal)/royal-delivery/page.tsx
frontend/foundation/shells/appshell/AppShellRuntime.tsx
frontend/foundation/shells/appshell/Header.tsx
frontend/foundation/shells/appshell/HeaderDesktop.tsx
frontend/foundation/shells/appshell/BottomTabBar.tsx
frontend/foundation/ui/EmptyState/
```

## Validacao esperada

Sempre validar depois de alterar este contrato:

```text
npm run build
```

Validacao visual minima:

- desktop em `/meu-clube`: Header visivel, cinco abas, EmptyState quando
  `mockAuthenticated: false`;
- desktop: conteudo comecando abaixo do Header;
- mobile em `/meu-clube`: Header invisivel, BottomTabBar com cinco abas,
  conteudo logado quando `mobileMockAuthenticated: true`.
