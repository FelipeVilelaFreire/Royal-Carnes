# Admin Users Flow

List:

```text
admin screen render-only
  -> useAdminUsers().load(params)
  -> adminUsersApi.list(params)
  -> GET /api/v1/accounts/users/
  -> mapAdminUserDto()
  -> createAdminUsersViewModel()
```

Create:

```text
admin screen render-only
  -> useAdminUsers().create(input)
  -> adminUsersApi.create(input)
  -> POST /api/v1/accounts/users/
  -> mapAdminUserDto()
  -> local users state prepends created item
```

Detail helper:

```text
selected AdminUserDetailView | null
  -> useAdminUserDetail(user)
  -> derived render state only
```

Backend authority:

```text
settings.manage permission gates list/create
roles are validated and attached in backend service
frontend never decides real permission success
```
