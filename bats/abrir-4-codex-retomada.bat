@echo off
setlocal

rem Resolve a raiz RoyalPrime a partir de RoyalPrime\bats.
for %%I in ("%~dp0..") do set "PROJECT=%%~fI"

where codex >nul 2>nul
if errorlevel 1 (
  echo O comando "codex" nao foi encontrado no PATH.
  echo Instale ou configure o Codex CLI e tente novamente.
  pause
  exit /b 1
)

where wt.exe >nul 2>nul
if errorlevel 1 (
  echo O Windows Terminal nao foi encontrado.
  pause
  exit /b 1
)

rem Cada aba inicia uma leitura segura. Todas compartilham o mesmo worktree.
rem Nenhuma deve editar, adicionar, commitar ou publicar antes da sua decisao.
set "ADMIN_PROMPT=Leia AGENTS.md, ROYALPRIME_ARCHITECTURE_CONTRACT.md, continuacao.md e execute git status. Nao altere arquivos, nao use git add, commit ou push. Explique no chat em portugues onde paramos, as evidencias, os limites e o proximo passo seguro para Admin e backend."
set "CLIENT_PROMPT=Leia AGENTS.md, ROYALPRIME_ARCHITECTURE_CONTRACT.md, continuacao2.md e execute git status. Nao altere arquivos, nao use git add, commit ou push. Explique no chat em portugues onde paramos, as evidencias, os limites e o proximo passo seguro para Client e Checkout."
set "PERFIL_PROMPT=Leia AGENTS.md, ROYALPRIME_ARCHITECTURE_CONTRACT.md, continuacao3.md e execute git status. Nao altere arquivos, nao use git add, commit ou push. Explique no chat em portugues onde paramos, as evidencias, os limites e o proximo passo seguro para Perfil e Minha Conta."
set "HOME_PROMPT=Leia AGENTS.md, ROYALPRIME_ARCHITECTURE_CONTRACT.md, continuacao4.md e execute git status. Nao altere arquivos, nao use git add, commit ou push. Explique no chat em portugues onde paramos, as evidencias, os limites e o proximo passo seguro para Home e vitrine."

rem Abre quatro abas na mesma janela e envia o primeiro prompt para cada Codex.
wt.exe -w 0 new-tab --title "Codex Admin" -d "%PROJECT%" cmd /k codex "%ADMIN_PROMPT%" ; new-tab --title "Codex Client" -d "%PROJECT%" cmd /k codex "%CLIENT_PROMPT%" ; new-tab --title "Codex Perfil" -d "%PROJECT%" cmd /k codex "%PERFIL_PROMPT%" ; new-tab --title "Codex Home" -d "%PROJECT%" cmd /k codex "%HOME_PROMPT%"

endlocal
