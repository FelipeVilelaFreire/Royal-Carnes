# Admin Auth Flow

Login:

```text
admin screen render-only
  -> useAdminLogin().login(input)
  -> adminAuthApi.login(input)
  -> POST /api/v1/auth/login/
  -> mapAdminLoginResponse()
  -> AdminAuthSession
```

Session reload:

```text
admin app bootstrap
  -> useAdminAuthSession().loadCurrentSession()
  -> adminAuthApi.me()
  -> GET /api/v1/accounts/me/
  -> mapAdminMeResponse()
  -> AdminAuthSession
```

Refresh:

```text
admin app bootstrap
  -> useAdminAuthSession().refresh(refreshToken)
  -> adminAuthApi.refresh({ refreshToken })
  -> POST /api/v1/auth/refresh/
  -> AdminRefreshResult
```

Permission display:

```text
AdminAuthSession.activeMembership.permissionKeys
  -> useAdminPermissions(session)
  -> hasPermission(permissionKey)
  -> screen only hides/shows render actions
```
