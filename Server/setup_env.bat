@echo off
setlocal EnableDelayedExpansion

echo Checking Python installation...
where python >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Python is not installed or not in PATH
    echo Please install Python and try again
    pause
    exit /b 1
)

echo Checking if virtual environment exists...
if exist venv (
    echo Virtual environment already exists
    choice /C YN /M "Do you want to delete and recreate it"
    if !ERRORLEVEL!==1 (
        echo Removing existing virtual environment...
        rmdir /s /q venv
    ) else (
        echo Setup cancelled
        exit /b 0
    )
)

echo Creating virtual environment...
python -m venv venv || (
    echo Failed to create virtual environment
    pause
    exit /b 1
)

echo Creating PowerShell activation script...
(
echo function global:deactivate {
echo     if ^($Env:VIRTUAL_ENV^) {
echo         Remove-Item Env:\VIRTUAL_ENV -ErrorAction SilentlyContinue
echo         if ^($Env:_OLD_VIRTUAL_PATH^) {
echo             $Env:PATH = $Env:_OLD_VIRTUAL_PATH
echo             Remove-Item Env:_OLD_VIRTUAL_PATH -ErrorAction SilentlyContinue
echo         }
echo     }
echo }
echo $Env:_OLD_VIRTUAL_PATH = $Env:PATH
echo $Env:VIRTUAL_ENV = "$PSScriptRoot\venv"
echo $Env:PATH = "$Env:VIRTUAL_ENV\Scripts;$Env:PATH"
) > activate_venv.ps1

echo Activating virtual environment...
call venv\Scripts\activate.bat || (
    echo Failed to activate virtual environment
    pause
    exit /b 1
)

echo Installing dependencies...
pip install -r requirements.txt || (
    echo Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Setup complete! To activate the virtual environment:
echo - In PowerShell: run '.\activate_venv.ps1'
echo - To deactivate in PowerShell: run 'deactivate'
echo.

pause
