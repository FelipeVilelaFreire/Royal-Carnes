# Client Auth Flow

Login:

```text
screen render-only
  -> useClientLogin().login(input)
  -> clientAuthApi.login(input)
  -> POST /api/v1/auth/login/
  -> mapClientLoginResponse()
  -> ClientAuthSession
```

Session reload:

```text
screen/app bootstrap
  -> useClientAuthSession().loadCurrentSession(accessToken)
  -> clientAuthApi.me(accessToken)
  -> GET /api/v1/accounts/me/
  -> mapClientMeResponse()
  -> ClientAuthSession
```

Refresh:

```text
screen/app bootstrap
  -> useClientAuthSession().refresh(refreshToken)
  -> clientAuthApi.refresh({ refreshToken })
  -> POST /api/v1/auth/refresh/
  -> ClientRefreshResult
```

Register:

```text
screen render-only
  -> useClientRegister().register(input)
  -> clientAuthApi.register(input)
  -> POST /api/v1/auth/register/
  -> mapClientRegisterResponse()
```

Logout:

```text
screen render-only
  -> useClientLogout().logout()
  -> clientAuthApi.logout()
  -> POST /api/v1/auth/logout/
  -> clear local session even if backend logout is only contractual
```
