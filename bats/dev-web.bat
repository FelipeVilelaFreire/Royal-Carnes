@echo off
title Royal Carnes - Cliente (Web & Mobile)
echo ===================================================
echo   🥩 Royal Carnes - Iniciando Cliente App
echo ===================================================

cd /d "%~dp0\.."

if exist "frontend\client\web\.next" (
    echo [INFO] Limpando cache do Next.js...
    rmdir /s /q "frontend\client\web\.next"
)

if not exist "node_modules" (
    echo [INFO] Diretório node_modules não encontrado na raiz. Executando npm install...
    call npm install
)

echo [INFO] Abrindo a aplicação no seu navegador (http://localhost:3000)...
start http://localhost:3000

echo [INFO] Iniciando o servidor Next.js em http://localhost:3000...
call npm run dev:client
pause
