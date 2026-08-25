@echo off
echo ===================================================
echo   👑 ROYAL CARNES — INICIANDO CLIENT APP (Porta 3000)
echo ===================================================
cd /d "%~dp0\.."
call npm run dev:client
pause
