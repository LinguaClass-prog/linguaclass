@echo off
chcp 65001 >nul
cd /d "%~dp0"

set "NODE=%LOCALAPPDATA%\LinguaClass\node"
if not exist "%NODE%\node.exe" (
  echo.
  echo  Не найден Node.js в "%NODE%".
  echo  Локальный доступ: start.bat
  echo.
  pause
  exit /b 1
)

echo.
echo  LinguaClass — доступ из интернета
echo  ---------------------------------
echo  Локально: http://localhost:4173

netstat -ano | findstr ":4173" | findstr "LISTENING" >nul
if errorlevel 1 (
  echo  Запускаю локальный сервер...
  start "LinguaClass server" /min python serve.py 4173
  timeout /t 3 >nul
)

echo.
echo  Публичная ссылка появится ниже.
echo  Не закрывайте это окно и окно сервера — доступ пропадёт.
echo.
echo  Первый раз браузер покажет страницу проверки:
echo  введите IP, который написан на ней, и нажмите Continue.
echo.

"%NODE%\lt.cmd" --port 4173 --subdomain lingua-class-app
if errorlevel 1 (
  echo.
  echo  Постоянный адрес занят, запускаю со случайным...
  "%NODE%\lt.cmd" --port 4173
)

echo.
echo  Туннель остановлен.
pause
