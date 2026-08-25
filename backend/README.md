# PrimeCutClub Backend

Django Modular Monolith para o sistema autônomo de assinaturas **PrimeCutClub**.

Para a documentação completa de arquitetura, padrões de código e convenção de camadas por app Django, consulte:
👉 [ARCHITECTURE.md](file:///C:/Users/felip_x6n9d9e/OneDrive/Documentos/FELIPE/PROGRAMA%C3%87%C3%83O/PrimeCutClub/backend/ARCHITECTURE.md)

## Estrutura de Apps

- `apps/plans/`: Gestão de planos, cortes de carne e preços.
- `apps/subscriptions/`: Motor de contratos de assinatura, ciclos e pausas.
- `apps/billing/`: Cobrança recorrente, faturas e gateway de pagamento.
- `apps/deliveries/`: Fila de expedição, montagem de caixas e envios mensais.
