@echo off
setlocal EnableExtensions

set "ROOT_DIR=%~dp0.."
set "WT_EXE="

where wt.exe >nul 2>nul
if not errorlevel 1 set "WT_EXE=wt.exe"
if "%WT_EXE%"=="" if exist "%LOCALAPPDATA%\Microsoft\WindowsApps\wt.exe" set "WT_EXE=%LOCALAPPDATA%\Microsoft\WindowsApps\wt.exe"

if "%WT_EXE%"=="" (
  echo.
  echo ERRO: Windows Terminal ^(wt.exe^) nao encontrado no PATH.
  echo Instale o Windows Terminal ou adicione wt.exe ao PATH.
  pause
  exit /b 1
)

echo Abrindo RoyalPrime em abas no Windows Terminal.
call :open_tab "RoyalPrime Backend" "%ROOT_DIR%" "call bats\start-backend.bat"
call :open_tab "RoyalPrime Client" "%ROOT_DIR%" "call bats\client.bat"
call :open_tab "RoyalPrime Admin" "%ROOT_DIR%" "call bats\admin.bat"
exit /b 0

:open_tab
set "TAB_TITLE=%~1"
set "TAB_PATH=%~2"
set "TAB_COMMAND=%~3"

if not exist "%TAB_PATH%" (
  echo [skip] %TAB_TITLE% nao encontrado: "%TAB_PATH%"
  exit /b 0
)

start "" "%WT_EXE%" -w 0 new-tab --title "%TAB_TITLE%" -d "%TAB_PATH%" cmd.exe /d /k "%TAB_COMMAND%"
timeout /t 1 /nobreak >nul
exit /b 0
