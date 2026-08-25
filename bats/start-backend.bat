@echo off
setlocal EnableExtensions
chcp 65001 >nul
title PrimeCutClub Backend Server

set "SCRIPT_DIR=%~dp0"
set "BACKEND_DIR=%SCRIPT_DIR%..\backend"

echo.
echo ============================================================
echo Iniciando Servidor Django PrimeCutClub (http://127.0.0.1:8000)
echo ============================================================
echo.

cd /d "%BACKEND_DIR%"
py manage.py runserver 8000

if errorlevel 1 (
  echo ERRO: Falha ao iniciar servidor Django.
  pause
)
endlocal
