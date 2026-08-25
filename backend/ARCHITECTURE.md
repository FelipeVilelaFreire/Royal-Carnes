# Arquitetura do Backend - PrimeCutClub

Este documento fixa as regras e convenções de arquitetura do backend Django do **PrimeCutClub**, projetado como um **Modular Monolith** autônomo com contratos 100% compatíveis com o ServiceOS.

---

## 1. Princípios de Arquitetura

### A. Multi-tenancy Nativo (`organization_id`)
- **Toda tabela/modelo** (com exceção de tabelas globais de auth/lookups) DEVE incluir o campo `organization_id`.
- No modo autônomo do PrimeCutClub, o `organization_id` será preenchido com a organização default do sistema.
- Quando este backend for promovido a serviço do ServiceOS (`services/subscriptions`), o suporte a múltiplos clientes/empresas funcionará nativamente sem alteração de schema.

### B. Fronteira de Responsabilidade

```text
Base da Plataforma (Consumido do ServiceOS no futuro):
  ├── Users / Auth        -> Login global, senhas e JWT
  ├── Organizations       -> Cadastro do tenant, assinaturas ativas e membros da equipe
  └── Customer Base       -> Cadastro único do cliente final (CRM)

Domínio Operacional do PrimeCut (Local em backend/apps/):
  ├── plans               -> Catalogo de cortes de carne, planos e ofertas
  ├── subscriptions       -> Contratos de assinatura, ciclos e status
  ├── billing             -> Cobrança recorrente, faturas e gateway de pagamento
  └── deliveries          -> Fila de entregas, lotes de expedição e montagem de caixas
```

---

## 2. Ficha Técnica Obrigatória por Django App

Todo app dentro de `backend/apps/` DEVE seguir rigorosamente a arquitetura em camadas (Layered Architecture):

```text
backend/apps/<nome_do_app>/
├── __init__.py
├── apps.py           <-- AppConfig
├── models.py         <-- Modelos do Banco (Com organization_id)
├── selectors.py      <-- CAMADA DE LEITURA (Consultas/Queries). Zero escrita.
├── services.py       <-- CAMADA DE ESCRITA (Regras de Negócio). Zero views/HTTP.
├── serializers.py    <-- DTOs/Serializers DRF combinando com o shared-core
├── permissions.py    <-- Validação de isolamento do tenant
├── views.py          <-- Thin Views (Recebe HTTP, chama selector/service, retorna JSON)
├── urls.py           <-- Roteamento de endpoints RESTful (/api/v1/...)
├── admin.py          <-- Interface Django Admin
└── tests/            <-- Testes unitários e de integração
```

---

## 3. As 5 Regras Obrigatórias de Código

1. **Leitura e Escrita Separadas**:
   - `selectors.py`: Responsável EXCLUSIVAMENTE por buscas e listas (`get_plan_by_id()`, `list_active_subscriptions()`).
   - `services.py`: Responsável EXCLUSIVAMENTE por mutações e regras de negócio (`create_subscription()`, `pause_subscription()`).

2. **Views Magras (Thin Views)**:
   - A `views.py` não executa regras de negócio nem monta queries SQL complexas. Ela valida a requisição, delega para `services.py` ou `selectors.py` e responde a requisição HTTP.

3. **Tenant Security**:
   - Todo `selector` e toda `service` validam obrigatoriamente o `organization_id` no contexto da requisição.

4. **DRF Serializers alinhados com o `shared-core`**:
   - Os nomes dos campos em JSON devem ser exatamente iguais às interfaces TypeScript em `frontend/shared-core/contracts/`.

5. **Nenhum Hardcode de Copy**:
   - Erros da API devem retornar chaves ou códigos de erro padrão (ex: `{"detail": "plan_not_found"}`), deixando a tradução textual para o repositório de `locales` do frontend.

---

## 4. Estrutura das 4 Apps Iniciais

| App | Responsabilidade Principal | Modelos Chave |
| :--- | :--- | :--- |
| `plans` | Gestão de cortes, pacotes e planos de assinatura | `Plan`, `PlanItem`, `CutProduct` |
| `subscriptions` | Ciclos de cobrança, contratos ativos, pausas e trocas | `Subscription`, `SubscriptionCycle`, `PauseLog` |
| `billing` | Transações, faturas e integração com gateway | `Invoice`, `Transaction`, `CustomerPaymentMethod` |
| `deliveries` | Expedição, lotes de envio mensal e montagem de caixas | `Shipment`, `ShipmentItem`, `DispatchBatch` |
