# VERINEX one-click deploy: build -> restart -> health check -> public verify
# Usage:
#   .\deploy.ps1            rebuild and restart all services
#   .\deploy.ps1 web        rebuild frontend only
#   .\deploy.ps1 api        rebuild backend only
# Note: keep this file ASCII-only (project path contains non-ASCII chars).

param([string]$Service = "")

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "==> [1/3] Building and restarting containers..."
if ($Service) {
    docker compose up -d --build $Service
} else {
    docker compose up -d --build
}
if ($LASTEXITCODE -ne 0) {
    Write-Host "!! BUILD FAILED - recent logs:"
    docker compose logs --tail 40
    exit 1
}

Write-Host "==> [2/3] Waiting for local health check (up to 3 min)..."
$ok = $false
for ($i = 0; $i -lt 36; $i++) {
    Start-Sleep -Seconds 5
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:8081/health/ready" -UseBasicParsing -TimeoutSec 5
        if ($r.StatusCode -eq 200) { $ok = $true; break }
    } catch {}
}
if (-not $ok) {
    Write-Host "!! HEALTH CHECK FAILED - recent logs:"
    docker compose logs web api --tail 60
    exit 1
}
Write-Host "    local health check passed."

Write-Host "==> [3/3] Verifying public site via Cloudflare..."
try {
    $r = Invoke-WebRequest -Uri "https://verinex.eu.cc/health/ready" -UseBasicParsing -TimeoutSec 20
    Write-Host "    public check passed: HTTP $($r.StatusCode) - $($r.Content)"
} catch {
    Write-Host "!! PUBLIC CHECK FAILED: $($_.Exception.Message)"
    Write-Host "    (site may still be propagating; check 'docker compose logs cloudflared --tail 20')"
    exit 1
}

Write-Host ""
Write-Host "==> DEPLOY SUCCESS: https://verinex.eu.cc is live."
docker compose ps --format "table {{.Name}}\t{{.Status}}"
