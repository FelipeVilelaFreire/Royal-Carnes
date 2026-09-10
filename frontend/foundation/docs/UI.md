# UI Standard

> Status: referencia ou registro de estado; nao e contrato ativo.
> Regras e leitura por tarefa: [CODEX_ENTRYPOINTS.md](../../../docs/CODEX_ENTRYPOINTS.md).
> Trees, exemplos, proximos passos e instrucoes antigas abaixo devem ser
> confrontados com os contratos ativos e o codigo; nao autorizam excecoes.

Tipo: guia pratico copiavel
Owner: `platform/foundation/design-system/ui`

## Ideia central

UI e a camada publica de componentes Usaveis por AppShell, Admin e produtos.
Ela veste receitas semi-composed e entrega comportamento, acessibilidade e props publicas.

## Componentes Canonicos:
- `Button`
- `Field` (Estrutura: header + controlSlot + feedback)
- `DataField`
- `FieldGrid`
- `DropdownPicker`
- `Select` (Compoe Field + DropdownPicker)
- `ColorField`
- `SegmentedControl`
- `Card`
- `Layout` (Container, Grid 20-cols, GridItem, Stack)

## Pendencia De Tree Web/Native

Estado atual do RoyalPrime:

```text
frontend/foundation/ui/
  -> componentes web

frontend/foundation/native/components/
  -> componentes native equivalentes
```

Essa convencao deve ser mantida por enquanto para evitar uma migracao ampla de
imports, aliases, AppShell, CSS modules e consumidores.

Pendencia futura:

```text
frontend/foundation/ui/web/
frontend/foundation/ui/native/
frontend/foundation/ui/core/
```

Essa reorganizacao e desejada, mas deve ser feita somente em um corte proprio,
com inventario de consumidores, aliases de compatibilidade, builds web/admin,
validacao native e plano de remocao gradual dos caminhos antigos. Nao misturar
essa migracao com melhorias pontuais de componentes ou telas.

## Chamada Minima Level-First
Toda UI pode ser chamada com o contrato minimo:
```tsx
<Button level="MD">Salvar</Button>
```
O resto vem dos `callDefaults` do manifesto.
