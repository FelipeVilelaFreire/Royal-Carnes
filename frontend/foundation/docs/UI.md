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
- `DropdownPicker`
- `Select` (Compoe Field + DropdownPicker)
- `ColorField`
- `SegmentedControl`
- `Card`
- `Layout` (Container, Grid 20-cols, GridItem, Stack)

## Chamada Minima Level-First
Toda UI pode ser chamada com o contrato minimo:
```tsx
<Button level="MD">Salvar</Button>
```
O resto vem dos `callDefaults` do manifesto.
