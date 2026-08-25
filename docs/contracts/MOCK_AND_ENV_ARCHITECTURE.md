# Arquitetura de Mocks, .env e Seed - PrimeCutClub

Este documento especifica a estratégia de **Mocks Isolados**, **Variáveis de Ambiente (.env)** e a **Dupla Utilidade dos Mocks como SEED do Banco de Dados** para o **PrimeCutClub**.

---

## 1. Estratégia de Mocks Isolados & Provider Pattern

Toda a massa de dados fictícios para o MVP é mantida estritamente isolada no diretório `manifest/` de cada surface (`client/` e `admin/`), sem poluir componentes de UI ou telas.

### Estrutura de Pastas de Mocks & Manifestos
```text
frontend/
├── client/
│   ├── manifest/                     <-- Dados fictícios do cliente (Planos, Ofertas, Assinantes)
│   │   ├── locales/pt-BR.ts
│   │   ├── routes.ts
│   │   ├── screens.ts
│   │   └── pages/                    (home.config.jsx, plans.config.jsx)
│   └── src/
│       └── views/                    <-- Renderizadores por ScreenType
│
└── admin/
    ├── manifest/                     <-- Dados fictícios operacionais (Métricas MRR, Assinantes, Entregas)
    │   ├── locales/pt-BR.ts
    │   ├── routes.ts
    │   ├── screens.ts
    │   └── pages/                    (dashboard.config.jsx, subscribers.config.jsx)
    └── src/
        └── engines/                  <-- Renderizadores operacionais por ScreenType
```

---

## 2. Padrão de Variáveis de Ambiente (.env) por Surface

Cada surface/projeto gerencia seu próprio arquivo `.env` alimentado por um `.env.example`:

### A. Surface Client / Next.js (`frontend/client/.env.example`)
```env
NEXT_PUBLIC_USE_MOCKS=true
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
```

### B. Surface Admin / Vite (`frontend/admin/.env.example`)
```env
VITE_USE_MOCKS=true
VITE_API_URL=http://127.0.0.1:8000/api/v1
```

### C. Backend Django / Python (`backend/.env.example`)
```env
SECRET_KEY=primecut-super-secret-key
DEBUG=True
ALLOWED_HOSTS=*
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
DEFAULT_ORGANIZATION_ID=primecut-club
```

---

## 3. Dupla Utilidade dos Mocks: Mocks de Frontend + SEED do Backend

Os dados mantidos em `manifest/` possuem **dupla função estratégica**:

1. **No Frontend**: Servem de fallback estático e massa de testes para telas do Client e Admin.
2. **No Backend (Django SEED)**: A mesma estrutura de dados em JSON/TS é utilizada pelo comando de seed do Django (`python manage.py seed_data`) para popular a base SQLite/PostgreSQL com registros reais idênticos!

```text
               ┌─────────────────────────────────────────┐
               │     MASSA DE DADOS ÚNICA DA MARCA       │
               │  (Planos: Essencial, Master, Wagyu)     │
               └────────────────────┬────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
[ FRONTEND MOCK MODE ]                           [ BACKEND DJANGO SEED ]
(Alimenta UIs sem precisar                        (Comando `python manage.py seed_data`
 de servidor ativo no MVP)                         popula o banco real com os mesmos dados)
```

Isso garante 100% de paridade entre a demonstração em Mock e o banco de dados rodando em produção.
