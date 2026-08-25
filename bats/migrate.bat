@echo off
setlocal EnableExtensions
chcp 65001 >nul
title PrimeCutClub Migrations

set "SCRIPT_DIR=%~dp0"
set "BACKEND_DIR=%SCRIPT_DIR%..\backend"

echo.
echo ============================================================
echo Executando Makemigrations e Migrate
echo ============================================================
echo.

cd /d "%BACKEND_DIR%"
py manage.py makemigrations core plans subscriptions billing deliveries
py manage.py migrate

echo.
echo Migracoes concluidas!
pause
endlocal
