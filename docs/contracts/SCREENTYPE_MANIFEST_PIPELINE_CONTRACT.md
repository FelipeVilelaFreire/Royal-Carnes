# Manifest, AppShell e screen types

Status: contrato ativo para client e admin.
Ownership: [contrato raiz](../../ROYALPRIME_ARCHITECTURE_CONTRACT.md).
Roteamento de leitura: [CODEX_ENTRYPOINTS.md](../CODEX_ENTRYPOINTS.md).

## Montagem simples

Admin nao implementa AppShell.
Admin declara manifest e consome AppShell da Foundation.

Fluxo:
shared-core/manifest + navigation + locales + routes + screen configs
-> bootstrap web -> AppShell Foundation -> screen ativa.

O mesmo vale para client. Nao criar engine, provider ou runtime grande apenas
para passar esses objetos ao AppShell.

## Donos

| Elemento | Dono |
| --- | --- |
| Header, Sidebar, Drawer, Footer, BottomTabBar, scroll, slots | frontend/foundation/shells/app-shell |
| Ativacao de regioes e defaults da surface | shared-core/manifest da surface |
| Itens, grupos, ordem, iconIntent, placements | shared-core/navigation da surface |
| Paths e aliases de rotas | shared-core/manifest/routes.ts da surface |
| Labels, grupos, aria e feedback | shared-core/locales da surface |
| Colunas, filtros, campos, composicao de tela | shared-core/manifest/pages ou config existente |
| Dados, carregamento e comandos | hooks/API/view-models do shared-core da surface |
| Router web e escolha da tela | bootstrap/render-app |

Use manifest no singular. Nunca recriar frontend/admin/manifest ou
frontend/client/manifest fora de shared-core.

## Exemplo de composicao

Exemplo de ligacao usando a API atual, nao um pedido para criar outro runtime:

```tsx
<AppShell
  mode="admin"
  config={adminAppShellConfig}
  navItems={adminNavigation}
  routesMap={adminRoutes}
  activePath={activeRoutePath}
  onNavigate={handleNavigate}
>
  {renderActiveScreen()}
</AppShell>
```

Config deve receber as strings ativas pelo mecanismo de i18n usado na surface.
O exemplo omite sua resolucao, nao autoriza importar pt-BR fixo na UI.

Admin desktop ativa sidebar; mobile ativa bottomTabBar.
Client desktop ativa header e mobile ativa bottomTabBar conforme manifest.
Native recebe a mesma intencao mobile e seu adapter equivalente.
AppShell executa a capacidade; manifest nao substitui codigo ausente.

## Navegacao e layout

- Referencie routeKey; resolva o path em routes.ts. Nao repetir URLs em JSX.
- Grupos/labels usam chaves do catalogo ativo; iconIntent usa Foundation.
- Config pode filtrar/ordenar placements declarados; documente essa precedencia
  no resolvedor existente e confira os itens efetivos, nao apenas o array fonte.
- Nao manter listas independentes para a mesma decisao sem relacao explicita
  de heranca, filtro ou override.
- enabled, width, gutter, align e viewport seguem o contrato real do AppShell.
- webIsMobile usa o mesmo comportamento de navegacao do mobile native.
- Nao presumir Drawer acessivel so porque enabled=true: confira o acionador.
- Nao criar header/sidebar/bottom bar artesanal nem no preview.

## Screen types e config

Reutilize ListPage, AddPage, DetailPage, DashboardPage e SettingsPage existentes
quando seu contrato servir a tarefa. Nao impor registro dinamico novo a uma
montagem simples. Render recebe config, dados e callbacks.
Config declara estrutura; hook fornece dados e comandos.
Rotas de detalhe precisam resolver a entidade ao reabrir/recarregar a pagina,
sem depender exclusivamente de uma linha selecionada em memoria.

Screen nao importa mock/API diretamente nem decide permissao/workflow.
Copy configuravel referencia locale; dados operacionais nao viram copy de UI.

## Builder e preview

A descricao editavel mora no config. O motor renderiza os controles existentes.
Toda opcao configuravel do draft precisa de campo declarativo e visibilidade
coerente. Adapter sem JSX normaliza e compoe persistencia.
Preview monta o runtime real, com o mesmo draft e atualizacao imediata.
Nova capacidade compartilhada respeita aprovacao do AGENTS/workspace.

## Transicao e verificacao

Shells antigos so podem ser retirados depois de rastrear imports/consumidores
e verificar a substituicao. Nao restaurar legado para evitar corrigir config.
Confira config -> resolver -> AppShell -> DOM e navegue pelos placements
desktop/mobile. Build isolado nao prova BottomTabBar visivel ou acao funcional.
Matriz de comandos em CODEX_ENTRYPOINTS.md.
