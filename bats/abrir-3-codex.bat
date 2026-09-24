@echo off
setlocal

rem Resolve a pasta PROGRAMACAO a partir de RoyalPrime\bats, sem depender de acentos.
for %%I in ("%~dp0..\..") do set "WORKSPACE=%%~fI"

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

rem Abre tres abas na mesma janela do Windows Terminal.
wt.exe -w 0 new-tab --title "Codex 1" -d "%WORKSPACE%" cmd /k codex ; new-tab --title "Codex 2" -d "%WORKSPACE%" cmd /k codex ; new-tab --title "Codex 3" -d "%WORKSPACE%" cmd /k codex

endlocal
