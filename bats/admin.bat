@echo off
setlocal EnableExtensions
title RoyalPrime - Admin 3001

set "ROOT_DIR=%~dp0.."

echo.
echo ============================================================
echo RoyalPrime admin
echo http://localhost:3001
echo ============================================================
echo.

cd /d "%ROOT_DIR%"
call npm run dev:admin

if errorlevel 1 (
  echo.
  echo ERRO: falha ao iniciar o admin.
  pause
  exit /b 1
)
