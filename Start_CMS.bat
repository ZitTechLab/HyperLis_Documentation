@echo off
echo ========================================================
echo        KHOI DONG HETHONG HYPERLIS CMS
echo ========================================================
echo.
echo [1/3] Dang khoi dong Astro Live Preview (Cong 4321)...
start "Astro Live Preview" cmd /c "npm run dev"

timeout /t 3 /nobreak > nul

echo [2/3] Dang khoi dong Backend CMS (Cong 3001)...
start "HyperLis CMS Backend" cmd /c "npm run cms"

timeout /t 2 /nobreak > nul

echo [3/3] Dang mo trinh duyet...
start http://localhost:3001

echo.
echo Hoan tat! Ban co the tat cua so nay. Trinh duyet CMS se mo len ngay bay gio.
timeout /t 3 > nul
