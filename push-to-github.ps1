# ============================================
# Script Push ke GitHub - Branch: Frontend
# Repo: https://github.com/Aljanuniverse/kelompok_2.git
# Author: soburrr34
# ============================================

$SOURCE = "C:\laragon\www\Frontend"
$TEMP   = "C:\laragon\www\_push_temp_frontend"
$REPO   = "https://github.com/Aljanuniverse/kelompok_2.git"
$BRANCH = "Frontend"

Write-Host ""
Write-Host "[*] Memulai push ke GitHub branch '$BRANCH'..." -ForegroundColor Cyan

# 1. Bersihkan folder temp lama jika ada
Remove-Item -Recurse -Force $TEMP -ErrorAction SilentlyContinue

# 2. Clone repo ke folder temp
Write-Host "[*] Clone repo..." -ForegroundColor Yellow
git clone $REPO $TEMP
Set-Location $TEMP

# 3. Set user identity
git config user.email "soburrr34@gmail.com"
git config user.name "soburrr34"

# 4. Checkout branch Frontend
git checkout -b $BRANCH "origin/$BRANCH"

# 5. Hapus isi folder frontend lama, copy yang baru (exclude folder-folder yang tidak perlu)
Write-Host "[*] Update folder frontend/..." -ForegroundColor Yellow
Remove-Item -Recurse -Force "$TEMP\frontend" -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path "$TEMP\frontend" -Force | Out-Null

$excludeList = @("node_modules", "push-to-github.ps1", ".git", "frontend", "dist")
Get-ChildItem $SOURCE -Exclude $excludeList | Copy-Item -Destination "$TEMP\frontend\" -Recurse -Force

# 6. Commit dan push
Write-Host "[*] Commit dan push..." -ForegroundColor Yellow
git add .

$changes = git status --porcelain
if ($changes) {
    git commit -m "feat: update frontend"
    git push origin $BRANCH
    Write-Host ""
    Write-Host "[OK] Berhasil push ke branch '$BRANCH'!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "[INFO] Tidak ada perubahan, skip commit." -ForegroundColor Gray
}

# 7. Cleanup
Set-Location "C:\laragon\www"
Remove-Item -Recurse -Force $TEMP
Write-Host "[*] Folder temp dihapus." -ForegroundColor DarkGray
Write-Host ""
Write-Host "[DONE] Cek: https://github.com/Aljanuniverse/kelompok_2/tree/$BRANCH" -ForegroundColor Green
Write-Host ""
