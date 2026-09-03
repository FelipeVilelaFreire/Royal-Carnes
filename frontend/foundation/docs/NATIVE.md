# Foundation Native Contract

## Status

Este corte e `native-ready`. Ele nao cria `client/native`, nao importa React
Native e nao implementa componentes visuais nativos ainda.

O objetivo e garantir que o app native futuro nasca usando os mesmos contratos
do web:

```text
shared-core manifest
shared-core navigation
shared-core locales
foundation tokens
foundation semi-composed
foundation app-shell contract
```

## Entrypoints

```text
frontend/foundation/native
frontend/foundation/shells/app-shell/native
```

`frontend/foundation/native` registra:

```text
primitives disponiveis
familias semi-composed disponiveis
origem obrigatoria de token, recipe, copy e navigation
```

`frontend/foundation/shells/app-shell/native` resolve:

```text
brand
header region
drawer region
nativeTabBar region
strings
themeColors
```

## Regra

```text
web mobile e native compartilham intencao
web muda apresentacao
native muda runtime
navigation/config/locales continuam no shared-core correto
```

Nao criar no native futuro:

```text
outra lista de abas
outros nomes de icone para a mesma intencao
copy hardcoded de navegacao
regra de permissao dentro da Foundation
fetch/API dentro da Foundation
```

## Fluxo Futuro

```text
client/native screen
  -> client/shared-core hook
  -> client/shared-core view-model
  -> client/shared-core manifest/navigation/locales
  -> foundation/native bridge
  -> foundation/shells/app-shell/native model
  -> React Native runtime local
```

O runtime React Native local pode mapear `Surface`, `Text`, `Icon`, `Button` e
`AppShell` para componentes nativos, mas nao deve mudar o contrato funcional.
