@echo off
setlocal EnableExtensions
title RoyalPrime - Seed backend

set "BACKEND_DIR=%~dp0..\backend"
set "ROYALPRIME_CONDA_ENV=royalprime"

echo.
echo ============================================================
echo RoyalPrime - seed backend
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

python manage.py seed_backend --seed royalprime

if errorlevel 1 (
  echo.
  echo ERRO: seed falhou.
  pause
  exit /b 1
)

echo.
echo Seed concluido.
pause
exit /b 0
