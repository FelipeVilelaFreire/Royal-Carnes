@echo off
echo ===================================================
echo   👑 ROYAL PRIME — INICIANDO ADMIN OS (Porta 3001)
echo ===================================================
cd /d "%~dp0\..\frontend\admin"
npm run dev -- --port 3001 --open
pause
