$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..\..")
Set-Location $root
Write-Host "Wallet integration (Windows)"
Write-Host "Open http://127.0.0.1:8765/desktop/windows/demo/"
Write-Host "Hub     http://127.0.0.1:8765/"
python -m http.server 8765
