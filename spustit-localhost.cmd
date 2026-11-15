@echo off
cd /d "%~dp0"
echo Otvor http://localhost:8000/ v prehliadaci.
echo Server zastavis klavesmi Ctrl+C.
py -3 -m http.server 8000 --bind 127.0.0.1
if errorlevel 1 pause
