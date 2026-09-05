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
resolver native-ready de theme/tokens
resolver native-ready de UI primitives
origem obrigatoria de token, recipe, copy e navigation
```

Entrypoints internos:

```text
frontend/foundation/native/tokens.ts
  -> resolveNativeThemeTokens()

frontend/foundation/native/semi-composed.ts
  -> resolveNativeSemiComposedDescriptor()
  -> toNativeSurfaceStyle()
  -> toNativeTextStyle()
  -> toNativeIconStyle()

frontend/foundation/native/ui.ts
  -> resolveNativeUiManifest()
  -> createNativeFoundationBridge()
```

`frontend/foundation/shells/app-shell/native` resolve:

```text
brand
header region
drawer region
nativeTabBar region
designSystem
navigationStyles active/inactive
strings
themeColors
```

## Regra

```text
web mobile e native compartilham intencao
web muda apresentacao
native muda runtime
navigation/config/locales continuam no shared-core correto
theme/semi-composed/ui continuam vindo do manifest da surface
```

Fluxo de Design System native-ready:

```text
client/admin shared-core manifest
  -> theme modes e tokens
  -> ui.manifest/semi-composed manifest
  -> resolveNativeThemeTokens()
  -> resolveNativeSemiComposedDescriptor()
  -> resolveNativeUiManifest()
  -> foundation/shells/app-shell/native
  -> React Native runtime futuro
```

Estados de navegacao:

```text
inactive -> Button appearance transparent
active   -> Button appearance soft
regions  -> Surface descriptor
```

Nao criar no native futuro:

```text
outra lista de abas
outros nomes de icone para a mesma intencao
copy hardcoded de navegacao
cores locais fora do manifest
Button/Input/Surface paralelos fora de Foundation
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

O runtime React Native local pode mapear `Surface`, `Text`, `Icon`, `Button`,
`Input`, `Select`, `Field`, `Card`, `Badge`, `Divider`, `DropdownPicker`,
`SegmentedControl`, `EmptyState`, `Layout` e `AppShell` para componentes
nativos, mas nao deve mudar o contrato funcional.
