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

rem Avoid treating an already running development server as a startup failure.
netstat -ano | findstr /R /C:":3000 .*LISTENING" >nul
if not errorlevel 1 (
  echo Client ja esta em execucao na porta 3000.
  start "" "http://localhost:3000"
  exit /b 0
)

call npm run dev:client

if errorlevel 1 (
  echo.
  echo ERRO: falha ao iniciar o client.
  pause
  exit /b 1
)
