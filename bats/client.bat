@echo off
setlocal EnableExtensions
title RoyalPrime - Client 3000

set "ROOT_DIR=%~dp0.."

echo.
echo ============================================================
echo RoyalPrime client
echo http://localhost:3000
echo ============================================================
echo.

cd /d "%ROOT_DIR%"
call npm run dev:client

if errorlevel 1 (
  echo.
  echo ERRO: falha ao iniciar o client.
  pause
  exit /b 1
)
