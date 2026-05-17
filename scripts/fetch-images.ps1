# Downloads product + lifestyle images from Pexels (free license)
$ErrorActionPreference = "Continue"
$root = Split-Path $PSScriptRoot -Parent
$outDir = Join-Path $root "assets\images"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$bottles = @(3363831, 1104771, 3019315, 2929996, 2077937, 189349, 3649195, 4467687, 965989, 3373736, 3685530, 5824837)
$lifestyle = @(6214717, 4202325, 3993449, 1082341, 6288892, 1082341, 6214717, 4202325)

function Save-Pexels($id, $destPath) {
  if (Test-Path $destPath) { $len = (Get-Item $destPath).Length; if ($len -gt 5000) { return $true } }
  $url = "https://images.pexels.com/photos/$id/pexels-photo-$id.jpeg?auto=compress&cs=tinysrgb&w=640&h=800&fit=crop"
  try {
    Invoke-WebRequest -Uri $url -OutFile $destPath -UseBasicParsing -TimeoutSec 90
    return $true
  } catch {
    Write-Warning "Failed $id -> $destPath"
    return $false
  }
}

for ($i = 1; $i -le 30; $i++) {
  $num = "{0:D2}" -f $i
  $b = $bottles[($i - 1) % $bottles.Length]
  $l = $lifestyle[($i - 1) % $lifestyle.Length]
  $primary = Join-Path $outDir "$num.optimized.jpg"
  $hover = Join-Path $outDir "$num.lifestyle.optimized.jpg"
  if (-not (Save-Pexels $b $primary)) { Save-Pexels 3363831 $primary | Out-Null }
  if (-not (Save-Pexels $l $hover)) { Save-Pexels 6214717 $hover | Out-Null }
  Copy-Item $primary (Join-Path $outDir "$num.jpg") -Force
  Write-Host "OK $num"
}

Write-Host "Finished: $outDir"
