# Customers App

`apps.customers` e dono da pessoa cliente dentro de uma organization.

Pertence aqui:

- `Customer`;
- perfil do cliente;
- enderecos;
- notas operacionais;
- referencias de metodo de pagamento.

Regra:

```text
User e login.
Customer e cliente comercial/operacional dentro de uma organization.
```

Um `User` pode ter `Customer` em mais de uma organization. Um `Customer` pode
existir sem `User` no inicio, por exemplo quando o admin cadastra um cliente
antes do primeiro login.

Endpoints:

```text
GET  /api/v1/customers/
POST /api/v1/customers/
GET  /api/v1/customers/:id/
```

Permissoes:

```text
customers.read
customers.manage
```

Tenant:

```text
customers sempre usa request.organization
```

Nao pertence aqui:

- regra de pedido;
- regra de assinatura;
- cobranca real;
- permissao de admin.
