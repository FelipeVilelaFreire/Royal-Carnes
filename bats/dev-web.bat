@echo off
setlocal EnableExtensions
title RoyalPrime - Dev web

cd /d "%~dp0.."
call node scripts\dev-local.mjs client
if errorlevel 1 (
  echo.
  echo O Client Web nao iniciou. Verifique a mensagem acima.
  echo Se a porta 3000 estiver em uso, feche o servidor anterior e tente de novo.
  pause
  exit /b 1
)
