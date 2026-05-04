@echo off
setlocal
cd /d "%~dp0"

echo ============================================
echo Accountability Partner - Inicio automatico
echo ============================================

docker --version >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Docker no esta instalado o no esta en PATH.
  echo Instala Docker Desktop y vuelve a intentar.
  pause
  exit /b 1
)

docker info >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Docker Desktop esta cerrado.
  echo Abre Docker Desktop y espera a que diga "Engine running".
  pause
  exit /b 1
)

echo [OK] Docker detectado. Iniciando proyecto...
docker compose up --build

endlocal
