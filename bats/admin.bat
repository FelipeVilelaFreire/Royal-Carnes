@echo off
echo ===================================================
echo   🛡️ ROYAL CARNES — INICIANDO ADMIN OS (Porta 3001)
echo ===================================================
cd /d "%~dp0\.."
call npm run dev:admin
pause
