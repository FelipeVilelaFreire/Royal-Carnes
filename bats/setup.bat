@echo off
title PrimeCutClub - Instalação & Setup Completo
echo ===================================================
echo   ⚡ PrimeCutClub - Executando Setup Completo
echo ===================================================

cd /d "%~dp0\.."

echo [1/3] Instalando dependências de pacotes do Frontend...
call npm install

echo [2/3] Instalando dependências da aplicação do Cliente...
cd /d "%~dp0\..\frontend\client"
call npm install

echo [3/3] Configurando o Banco de Dados Django Backend...
cd /d "%~dp0\..\backend"
python manage.py migrate
python manage.py seed_data

echo ===================================================
echo   ✅ Setup Concluído com Sucesso!
echo ===================================================
pause
