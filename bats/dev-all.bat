@echo off
echo ===================================================
echo   👑 ROYAL CARNES — INICIANDO CLIENT & ADMIN OS
echo ===================================================

echo Starting Client App on http://localhost:3000 ...
start "Royal Carnes Client (3000)" cmd /k "cd /d "%~dp0\.." && npm run dev:client"

echo Starting Admin OS on http://localhost:3001 ...
start "Royal Carnes Admin (3001)" cmd /k "cd /d "%~dp0\.." && npm run dev:admin"

echo ===================================================
echo   🔥 Client: http://localhost:3000
echo   🛡️ Admin:  http://localhost:3001
echo ===================================================
