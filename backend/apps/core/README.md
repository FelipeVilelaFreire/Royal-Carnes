# Core App

`apps.core` guarda infraestrutura compartilhada do backend.

Pertence aqui:

- base models;
- soft delete;
- helpers de erro/response;
- tenant context;
- validators comuns;
- health check.

Nao pertence aqui:

- regra de pedido;
- regra de assinatura;
- regra de pagamento;
- regra especifica de Royal Carnes.

Regra:

```text
core sustenta os apps de dominio
core nao vira deposito de regra de negocio
```

## Tenant Context

Arquivos:

```text
tenant/resolver.py
tenant/middleware.py
```

Contrato:

```text
request -> X-Organization-Slug -> request.organization
```

Se o header nao vier, o backend usa a organization default local para boot/dev.
Views e permissions devem consumir `request.organization`, nao chamar regra de
organization default diretamente.

## Errors

Arquivo:

```text
errors.py
```

Contrato:

```text
erros de API retornam code tecnico
copy final fica fora do backend
```
