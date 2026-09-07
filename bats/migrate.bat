@echo off
setlocal EnableExtensions
title RoyalPrime - Migrate backend

set "BACKEND_DIR=%~dp0..\backend"
set "ROYALPRIME_CONDA_ENV=royalprime"

echo.
echo ============================================================
echo RoyalPrime - migrations backend
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

python manage.py migrate

if errorlevel 1 (
  echo.
  echo ERRO: migrations falharam.
  pause
  exit /b 1
)

echo.
echo Migrations concluidas.
pause
exit /b 0
