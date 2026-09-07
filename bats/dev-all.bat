@echo off
setlocal EnableExtensions
title RoyalPrime - Dev all

set "SCRIPT_DIR=%~dp0"

echo.
echo ============================================================
echo RoyalPrime - iniciando ambiente local
echo ============================================================
echo Backend: http://127.0.0.1:8000
echo Client:  http://localhost:3000
echo Admin:   http://localhost:3001
echo ============================================================
echo.

start "RoyalPrime Backend 8000" "%SCRIPT_DIR%start-backend.bat"
start "RoyalPrime Client 3000" "%SCRIPT_DIR%client.bat"
start "RoyalPrime Admin 3001" "%SCRIPT_DIR%admin.bat"

echo Janelas iniciadas. Aguarde os servidores compilarem.
pause
