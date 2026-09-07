@echo off
setlocal EnableExtensions

if not defined ROYALPRIME_CONDA_ENV set "ROYALPRIME_CONDA_ENV=royalprime"

set "CONDA_BAT="

if exist "%USERPROFILE%\miniconda3\condabin\conda.bat" (
  set "CONDA_BAT=%USERPROFILE%\miniconda3\condabin\conda.bat"
) else if exist "%USERPROFILE%\Miniconda3\condabin\conda.bat" (
  set "CONDA_BAT=%USERPROFILE%\Miniconda3\condabin\conda.bat"
) else if exist "%USERPROFILE%\anaconda3\condabin\conda.bat" (
  set "CONDA_BAT=%USERPROFILE%\anaconda3\condabin\conda.bat"
)

if not defined CONDA_BAT (
  for /f "delims=" %%C in ('where conda.bat 2^>nul') do (
    set "CONDA_BAT=%%C"
    goto found_conda
  )
)

:found_conda
if not defined CONDA_BAT (
  echo ERRO: conda.bat nao encontrado. Abra pelo Anaconda Prompt ou instale Miniconda.
  endlocal & exit /b 1
)

if /I "%~1"=="--create" (
  call "%CONDA_BAT%" env list | findstr /R /C:"^%ROYALPRIME_CONDA_ENV%[ ]" >nul
  if errorlevel 1 (
    echo [conda] Criando ambiente %ROYALPRIME_CONDA_ENV%...
    call "%CONDA_BAT%" env create -f "%~dp0..\environment.yml"
    if errorlevel 1 (
      endlocal & exit /b 1
    )
  )
)

endlocal & call "%CONDA_BAT%" activate "%ROYALPRIME_CONDA_ENV%"
