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

Abre uma unica janela do Windows Terminal com tres abas independentes:
Backend, Client e Admin. Cada aba preserva seus proprios logs e pode ser
encerrada individualmente:

```text
backend -> http://127.0.0.1:8000
client  -> http://localhost:3000
admin   -> http://localhost:3001
```

Use `Ctrl+C` na aba do servico que deseja encerrar. `dev-web.bat` inicia somente
o Client Web na porta 3000, no terminal atual. Antes de iniciar, ele encerra
somente o processo local que estiver escutando a porta 3000.

## Scripts separados

```text
start-backend.bat
client.bat
admin.bat
migrate.bat
seed.bat
dev-web.bat
```
