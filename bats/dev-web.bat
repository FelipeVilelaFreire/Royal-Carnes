@echo off
setlocal EnableExtensions
title RoyalPrime - Dev web

set "SCRIPT_DIR=%~dp0"

echo.
echo ============================================================
echo RoyalPrime - iniciando client e admin
echo ============================================================
echo Client: http://localhost:3000
echo Admin:  http://localhost:3001
echo ============================================================
echo.

start "RoyalPrime Client 3000" "%SCRIPT_DIR%client.bat"
start "RoyalPrime Admin 3001" "%SCRIPT_DIR%admin.bat"

echo Janelas iniciadas.
pause
