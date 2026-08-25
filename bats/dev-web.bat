@echo off
title PrimeCutClub - Cliente (Web & Mobile)
echo ===================================================
echo   🥩 PrimeCutClub - Iniciando Surface do Cliente
echo ===================================================

cd /d "%~dp0\.."

if exist "frontend\client\.next" (
    echo [INFO] Limpando cache do Next.js...
    rmdir /s /q "frontend\client\.next"
)

if not exist "node_modules" (
    echo [INFO] Diretório node_modules não encontrado na raiz. Executando npm install...
    call npm install
)

if not exist "frontend\client\node_modules" (
    echo [INFO] Diretório node_modules do cliente não encontrado. Instalando dependências...
    cd /d "%~dp0\..\frontend\client"
    call npm install
    cd /d "%~dp0\.."
)

echo [INFO] Abrindo a aplicação no seu navegador (http://localhost:3000)...
start http://localhost:3000

echo [INFO] Iniciando o servidor Next.js em http://localhost:3000...
cd /d "%~dp0\..\frontend\client"
npm run dev
pause
