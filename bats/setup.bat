@echo off
setlocal EnableExtensions
title RoyalPrime - Setup local

set "ROOT_DIR=%~dp0.."
set "BACKEND_DIR=%ROOT_DIR%\backend"
set "ROYALPRIME_CONDA_ENV=royalprime"

echo.
echo ============================================================
echo RoyalPrime - setup local
echo ============================================================
echo.

cd /d "%ROOT_DIR%"

if not exist "backend\.env" (
  echo [env] Criando backend\.env a partir de backend\.env.example
  copy "backend\.env.example" "backend\.env" >nul
)

if not exist "frontend\admin\web\.env.local" (
  echo [env] Criando frontend\admin\web\.env.local
  copy "frontend\admin\web\.env.example" "frontend\admin\web\.env.local" >nul
)

if not exist "frontend\client\web\.env.local" (
  echo [env] Criando frontend\client\web\.env.local
  copy "frontend\client\web\.env.example" "frontend\client\web\.env.local" >nul
)

echo [1/5] Instalando dependencias npm da raiz/workspaces...
call npm install
if errorlevel 1 goto fail

echo [2/5] Preparando ambiente Conda %ROYALPRIME_CONDA_ENV%...
cd /d "%ROOT_DIR%"
call "%~dp0_conda-activate.bat" --create
if errorlevel 1 goto fail

echo [3/5] Instalando dependencias Python do backend...
python -m pip install -r backend\requirements.txt
if errorlevel 1 goto fail

echo [4/5] Aplicando migrations...
cd /d "%BACKEND_DIR%"
python manage.py migrate
if errorlevel 1 goto fail

echo [5/5] Aplicando seed royalprime...
python manage.py seed_backend --seed royalprime
if errorlevel 1 goto fail

echo.
echo Setup concluido.
echo Para rodar tudo, abra bats\dev-all.bat
pause
exit /b 0

:fail
echo.
echo ERRO: setup local falhou.
pause
exit /b 1
