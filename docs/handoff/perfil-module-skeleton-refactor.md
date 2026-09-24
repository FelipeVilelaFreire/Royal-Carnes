# Handoff: refatorar Perfil em módulos autocontidos com skeletons

## Objetivo

Refatore a rota Client `http://localhost:3000/perfil` para que cada região do Perfil tenha ownership visual explícito e um skeleton correspondente. O resultado deve manter os dados reais e a navegação atual, mas remover o loading genérico de tela inteira em favor de placeholders que espelham a estrutura da região carregada.

Não copiar o HTML/Tailwind do Stitch. Ele é somente referência visual. A implementação deve usar os componentes, tokens, CSS Modules e contratos existentes do RoyalPrime.

## Estado atual comprovado

- Branch de trabalho: `feature/shared-core-kit-reset`.
- O worktree é compartilhado e contém alterações paralelas; não usar `git reset`, `git clean`, `git checkout` nem `git add .`.
- A rota é uma única URL (`/perfil`) com troca local de `activeTab`; as abas não são rotas separadas.
- `PerfilView.tsx` usa `useClientCustomer`; Web não pode chamar API diretamente, criar mocks ou decidir regras comerciais.
- `ProfileModuleContent.tsx` seleciona um módulo por vez.
- Apenas `OverviewModule` possui implementação própria; vários módulos são hoje facades (`index.ts`) que reexportam componentes do arquivo grande `minha-conta/components.tsx`.
- Há uma primitive Foundation existente em `@foundation/ui/web/Skeleton` e a receita correspondente já existe em Foundation.

## Árvore-alvo

```text
frontend/client/web/src/screens/portal/Perfil/
  PerfilView.tsx
  PerfilView.module.css (somente se a composição da rota precisar de CSS próprio)
  minha-conta/
    fixed/
      AccountProfileSummary/
        AccountProfileSummary.tsx
        AccountProfileSummary.module.css
        AccountProfileSummarySkeleton.tsx
        index.ts
      AccountSidebarNav/
        AccountSidebarNav.tsx
        AccountSidebarNav.module.css
        AccountSidebarNavSkeleton.tsx
        index.ts
    modules/
      ProfileModuleContent.tsx
      OverviewModule/
        OverviewModule.tsx
        OverviewModule.module.css
        OverviewModuleSkeleton.tsx
        index.ts
      SubscriptionModule/
        SubscriptionModule.tsx
        SubscriptionModule.module.css
        SubscriptionModuleSkeleton.tsx
        index.ts
      OrdersModule/
        OrdersModule.tsx
        OrdersModule.module.css
        OrdersModuleSkeleton.tsx
        index.ts
      PersonalDataModule/
        PersonalDataModule.tsx
        PersonalDataModule.module.css
        PersonalDataModuleSkeleton.tsx
        index.ts
      AddressesModule/
        AddressesModule.tsx
        AddressesModule.module.css
        AddressesModuleSkeleton.tsx
        index.ts
      PaymentModule/
        PaymentModule.tsx
        PaymentModule.module.css
        PaymentModuleSkeleton.tsx
        index.ts
      PreferencesModule/
        PreferencesModule.tsx
        PreferencesModule.module.css
        PreferencesModuleSkeleton.tsx
        index.ts
      SecurityModule/
        SecurityModule.tsx
        SecurityModule.module.css
        SecurityModuleSkeleton.tsx
        index.ts
```

Não criar wrappers vazios apenas para cumprir a árvore. O componente real precisa morar no módulo; o `index.ts` deve ser somente a fronteira pública de exportação.

## Composição funcional obrigatória

```text
PerfilView
  -> fixed/AccountProfileSummary
  -> main grid
       -> fixed/AccountSidebarNav
       -> ProfileModuleContent
            -> módulo real ativo OU skeleton do módulo ativo
```

`ProfileModuleContent` recebe o estado de carregamento. Para cada `activeTab`, ele renderiza o par correto:

- `overview`: capacidade do ciclo e pedidos recentes;
- `subscription`: três cards de plano;
- `orders`: cards/linhas de pedido;
- `data`: campos de informações pessoais;
- `addresses`: ação e cards de endereço;
- `payments`: métodos e histórico;
- `notifications`: preferências;
- `security`: linhas de segurança.

O skeleton precisa ter a mesma densidade e geometria aproximada do conteúdo final. Não use frases como "Carregando sua conta" durante o loading normal. Estado de erro e estado vazio continuam com feedback humano e ação de retry.

## Dados e comportamento que não podem regredir

- Cadeia obrigatória: backend -> client/shared-core -> JSX render-only.
- `useClientCustomer` continua como dono de customer, planos, ciclo, pedidos, endereços, preferências e ações.
- Plano ativo vem da assinatura real; nunca de `plans[0]`.
- Capacidade do ciclo vem do backend/view-model; não calcular quota na tela.
- Pedidos usam o view-model existente e fallback central de imagem.
- Endereços usam CEP-first e ViaCEP. Criação já é real via POST.
- O backend já oferece `PATCH /api/v1/customers/me/addresses/:id/`; só expor edição depois de criar API client, hook, contrato e UI reais. Não renderizar um botão que pareça salvar sem essa cadeia.
- Não há `avatar_url` no contrato atual do cliente. Manter o fallback `CR` em ouro/accent; não inventar foto de pessoa.
- Logout chama a ação real compartilhada e mantém confirmação.

## UI e i18n

- Todo novo texto de UI deve entrar em `frontend/client/shared-core/locales/pt-BR.ts` e usar strings ativas.
- Não usar emojis; usar `@foundation/ui/web/Icon/AppIcons` quando um ícone for necessário.
- Web usa TSX + CSS Modules. Não adicionar `style={{}}`, Tailwind, CSS em string, hex/rgba, bordas ou espaçamentos físicos locais.
- Theme -> Semi-composed -> UI. Usar tokens e receitas existentes.
- Skeletons usam a primitive Foundation `Skeleton`; não criar animação de shimmer local.
- O desktop mantém sidebar sticky; mobile mantém `ScreenHeader` e navegação compacta, sem copiar a composição desktop.

## Sequência segura de execução

1. Ler `AGENTS.md`, `ROYALPRIME_ARCHITECTURE_CONTRACT.md`, `docs/CODEX_ENTRYPOINTS.md`, `frontend/client/AGENTS.md` e `frontend/client/web/AGENTS.md`.
2. Conferir branch e `git status --short`; preservar as alterações existentes.
3. Mapear consumidores antes de mover cada export de `components.tsx`.
4. Migrar um módulo completo por vez: TSX real, CSS Module, Skeleton, `index.ts`, consumidor atualizado.
5. Só depois remover a implementação correspondente de `components.tsx` e confirmar ausência de importadores.
6. Migrar as regiões `fixed` com o mesmo critério.
7. Alterar `PerfilView` e `ProfileModuleContent` para selecionar skeletons por região/aba.
8. Verificar web mobile e o contrato Native; não presumir paridade visual por uma mudança Web.

## Critérios de aceitação

- Cada módulo e região fixa tem implementação real, CSS Module e skeleton no próprio diretório.
- Nenhum facade aponta para `components.tsx` após a migração completa.
- Durante loading, a rota preserva shell, resumo, navegação e geometria do módulo ativo com skeletons.
- Erro e vazio continuam acessíveis e não são mascarados por skeleton infinito.
- Nenhum mock, fallback comercial ou ação de falsa persistência foi introduzido.
- Todas as novas strings são localizadas.
- `npm run verify:rules` passa.
- `git diff --check` passa.
- Executar `npm run build:client` e registrar qualquer bloqueio preexistente separadamente.
- Fazer QA visual em `/perfil` desktop e web mobile; testar mudança de abas, loading, erro, CEP e modal de endereço quando existir.

## Entrega esperada

Relatar arquivos migrados, cadeia de dados preservada, verificações executadas e limites reais de QA. Não declarar paridade Native ou validação visual sem evidência em host real.
