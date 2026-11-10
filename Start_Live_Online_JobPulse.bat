@echo off
title JobPulse AI - Live Online Website Launcher
color 0B
echo ======================================================================
echo            JOBPULSE AI - LIVE ONLINE PUBLIC LAUNCHER
echo ======================================================================
echo.
echo [1/2] Starting Local JobPulse Server on Port 3000...
start "JobPulse Server" /B node web\server.js
timeout /t 3 /nobreak >nul

echo [2/2] Generating Public Live HTTPS Website Tunnel...
echo.
echo ----------------------------------------------------------------------
echo  YOUR LIVE PUBLIC WEBSITE IS GOING ONLINE!
echo  Endpoint password (if prompted): 103.217.123.160
echo ----------------------------------------------------------------------
echo.

npx localtunnel --port 3000
pause
