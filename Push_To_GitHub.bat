@echo off
title Push JobPulse AI to GitHub
echo ======================================================================
echo                 Push JobPulse AI to GitHub
echo ======================================================================
echo.
set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/username/JobPulse.git): "
if "%REPO_URL%"=="" goto end

git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main
echo.
echo Pushing to GitHub (main branch)...
git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ======================================================================
    echo [SUCCESS] Successfully pushed to GitHub!
    echo ======================================================================
    echo.
    echo To make it live on GitHub Pages:
    echo 1. Open your repository on GitHub.
    echo 2. Go to Settings -^> Pages.
    echo 3. Under 'Source', select 'Deploy from a branch' -^> 'main' -^> '/docs'.
    echo 4. Click Save!
    echo.
    echo To make it live on Render (Free 24/7 Full-Stack):
    echo 1. Open https://dashboard.render.com/blueprints/new
    echo 2. Connect this repository and click Apply!
    echo.
) else (
    echo.
    echo [NOTICE] If prompted for credentials, use a GitHub Personal Access Token (PAT):
    echo Create one at: https://github.com/settings/tokens (select 'repo' scope).
)

:end
pause
