# Admin Mappers

Mappers do fluxo administrativo.

Papel:

```text
API DTO -> view-model do admin
mock temporario -> view-model do admin
```

Nao duplicar regra do backend aqui. Mudanca de status, permissao, auditoria,
estoque, pagamento e assinatura pertencem ao backend.
