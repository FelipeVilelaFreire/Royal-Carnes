@echo off
setlocal EnableExtensions
title RoyalPrime - Backend 8000

set "BACKEND_DIR=%~dp0..\backend"
set "ROYALPRIME_CONDA_ENV=royalprime"

echo.
echo ============================================================
echo RoyalPrime backend
echo http://127.0.0.1:8000
echo ============================================================
echo.

cd /d "%BACKEND_DIR%"
call "%~dp0_conda-activate.bat"
if errorlevel 1 (
  echo.
  echo ERRO: nao foi possivel ativar o Conda env %ROYALPRIME_CONDA_ENV%.
  pause
  exit /b 1
)

python manage.py runserver 127.0.0.1:8000
set "BACKEND_EXIT_CODE=%ERRORLEVEL%"

if not "%BACKEND_EXIT_CODE%"=="0" (
  echo.
  echo Backend encerrado com codigo %BACKEND_EXIT_CODE%.
  echo Se houve respostas HTTP 200 acima, ele iniciou corretamente.
  echo Consulte as mensagens do Django acima para a causa do encerramento.
  pause
  exit /b %BACKEND_EXIT_CODE%
)
