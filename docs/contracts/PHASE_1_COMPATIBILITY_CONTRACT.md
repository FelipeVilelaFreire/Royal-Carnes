# Contrato de Arquitetura da Fase 1 - PrimeCutClub (ServiceOS Compatible)

Este documento registra a **Estratégia de Meio-Termo para a Fase 1** do **PrimeCutClub**, garantindo entrega rápida em 3 dias com total compatibilidade conceitual com o **ServiceOS**.

---

## 💡 Filosofia Central

> **ServiceOS** = Fonte conceitual e futuro owner ideal da plataforma.  
> **PrimeCutClub** = Implementação local temporária e autônoma para entrega do produto real.

---

## 🏛️ Estrutura Proposta da Fundação Local

```text
PrimeCutClub/
└── frontend/
    ├── foundation/
    │   ├── docs/
    │   │   ├── Theme.md             <-- Regras de tokens de cores, espaçamentos e fontes
    │   │   ├── SemiComposed.md       <-- Regras das superfícies (solid, glass)
    │   │   └── UI.md                 <-- Regras dos componentes primitivos mudos
    │   ├── theme/
    │   ├── semi-composed/
    │   └── ui/                       <-- Button, Text, Card, Input, Badge
    │
    └── shared-core/
        ├── client/
        │   └── manifest/             <-- Manifestos do cliente (designsystem, content, landing.config.ts)
        └── admin/
            └── manifest/             <-- Manifestos do admin (designsystem, content)
```

---

## 📋 As 6 Regras da Fase 1

1. **Documentação como Guia (MDs)**:
   - Registrar `Theme.md`, `SemiComposed.md` e `UI.md` dentro de `frontend/foundation/docs/` como fonte da verdade.
2. **Reorganização de `frontend/foundation/`**:
   - Manter a fundação local simples, independente de imports externos do ServiceOS.
3. **Conjunto Enxuto de Primitivos**:
   - Foco exclusivo em 5 componentes base: **Button**, **Text**, **Card**, **Input/Field** e **Badge**.
4. **Consumo Direto por Landing & Admin**:
   - Tanto a Landing Page quanto o Admin consomem esses primitivos tokenizados diretamente.
5. **Sem Builder Engine por Enquanto**:
   - Eliminar a complexidade de builders dinâmicos ou resolvers genéricos no MVP.
6. **Configuração Declarativa em `shared-core`**:
   - Tudo o que for configurável (textos, imagens, planos, rotas) fica isolado em `manifest/`, `locales/` e `shared-core/`.

---

## 🎯 Resultado da Fase 1

- **Entregável em 3 dias**: Produto completo (Web + Admin) rodando de forma autônoma e sem fricção.
- **Migração Futura sem Dor**: Quando o ServiceOS estiver maduro, a fundação local do PrimeCutClub é facilmente trocada pelos pacotes nativos do ServiceOS sem reescrever a aplicação.
