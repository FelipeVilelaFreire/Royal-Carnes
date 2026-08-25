@echo off
echo ===================================================
echo   👑 ROYAL PRIME — INICIANDO CLIENT & ADMIN OS
echo ===================================================

echo Starting Client App on http://localhost:3000 ...
start "Royal Prime Client (3000)" cmd /k "cd /d "%~dp0\..\frontend\client" && npm run dev"

echo Starting Admin OS on http://localhost:3001 ...
start "Royal Prime Admin (3001)" cmd /k "cd /d "%~dp0\..\frontend\admin" && npm run dev"

echo ===================================================
echo   🔥 Client: http://localhost:3000
echo   🛡️ Admin:  http://localhost:3001
echo ===================================================
