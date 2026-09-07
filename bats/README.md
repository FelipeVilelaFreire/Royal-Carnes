# RoyalPrime local scripts

Use estes arquivos por duplo clique no Windows.

## Primeira vez ou quando dependencias mudarem

```text
setup.bat
```

Faz:

```text
cria .env local quando nao existir
cria/ativa Conda env royalprime
instala dependencias npm
instala requirements Python
roda migrations
aplica seed royalprime
```

O ambiente Conda padrao fica definido em:

```text
environment.yml
```

## Dia a dia

```text
dev-all.bat
```

Abre em janelas separadas:

```text
backend -> http://127.0.0.1:8000
client  -> http://localhost:3000
admin   -> http://localhost:3001
```

## Scripts separados

```text
start-backend.bat
client.bat
admin.bat
migrate.bat
seed.bat
dev-web.bat
```
