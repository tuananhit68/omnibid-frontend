# verify-fe-v4.ps1 - Omnibid frontend v4 conformance check (ASCII only, Windows PowerShell 5.1+)
# Usage (repo root): powershell -ExecutionPolicy Bypass -File .agents\skills\omnibid-fe-v4\scripts\verify-fe-v4.ps1
param([string]$Root = (Get-Location).Path)
$ErrorActionPreference = 'Stop'
$fail = 0
function Bad($m) { Write-Host "[FAIL] $m" -ForegroundColor Red; $script:fail++ }
function Good($m) { Write-Host "[ OK ] $m" -ForegroundColor Green }
function Warn($m) { Write-Host "[WARN] $m" -ForegroundColor Yellow }

$src = Join-Path $Root 'src'
$files = Get-ChildItem -Path $src -Recurse -Include *.ts,*.tsx

# 1. Legacy terms (case-sensitive regex)
$forbidden = @(
 'watchlist','Watchlist','Shipment','BidStatus','BID_STATUS_META','sockjs','SockJS','errorCode',
 '/ws-auction','/topic/auction/','user/queue','ReportType\b','ReportAction','reportType','iconUrl',
 '"/seller','''/seller','`/seller','audit-logs','unread-count','read-all','/bids/mine/summary','"/bids"',
 'MOCK_BANK','MOCK_WALLET','PAYMENT_IN_PROGRESS','PAYMENT_RATE_LIMITED','INVALID_CREDENTIALS',
 'allowedActions','viewerRole','serverTime','INVALIDATED','REMOVED','SimulatedOutcome','/admin/dashboard','/me/settings'
)
$before = $fail
foreach ($t in $forbidden) {
  $hits = $files | Select-String -Pattern $t -CaseSensitive
  if ($hits) { Bad ("legacy '" + $t + "' x" + $hits.Count + " e.g. " + $hits[0].Path.Replace($Root,'') + ":" + $hits[0].LineNumber) }
}
if ($fail -eq $before) { Good 'no legacy terms in src/' }

# 2. Styling guards (warnings)
$hex = $files | Where-Object { $_.Extension -eq '.tsx' } | Select-String -Pattern '\[#[0-9a-fA-F]{3,8}\]|style=\{\{[^}]*#[0-9a-fA-F]{3,6}'
if ($hex) { Warn ("hard-coded colors x" + $hex.Count + " e.g. " + $hex[0].Path.Replace($Root,'') + ":" + $hex[0].LineNumber) }
$upper = $files | Where-Object { $_.Extension -eq '.tsx' } | Select-String -Pattern '\buppercase\b|tracking-wide|tracking-wider|tracking-widest|border-l-4|border-t-4' -CaseSensitive
if ($upper) { Warn ("uppercase/tracking/one-side border x" + $upper.Count + " e.g. " + $upper[0].Path.Replace($Root,'') + ":" + $upper[0].LineNumber) }

# 3. Dependencies
$pkg = Get-Content (Join-Path $Root 'package.json') -Raw
if ($pkg -match 'sockjs') { Bad 'package.json still has sockjs' } else { Good 'no sockjs dependency' }
if ($pkg -match '"lucide-react"') { Good 'lucide-react installed' } else { Bad 'lucide-react missing (category icons)' }

# 4. Config
$nc = Join-Path $Root 'next.config.ts'
if ((Test-Path $nc) -and ((Get-Content $nc -Raw) -match '/uploads')) { Bad 'next.config.ts still allows /uploads images' }
$envEx = Join-Path $Root '.env.example'
if (Test-Path $envEx) {
  $e = Get-Content $envEx -Raw
  if ($e -notmatch 'NEXT_PUBLIC_WS_URL=wss?://[^\s]+/ws\b') { Bad '.env.example NEXT_PUBLIC_WS_URL must be ws://host:port/ws' } else { Good '.env.example WS URL ok' }
  if ($e -match 'NEXT_PUBLIC_API_MODE=mock') { Bad '.env.example must use NEXT_PUBLIC_API_MODE=live (mock only in .env.local)' }
  if ($e -notmatch 'NEXT_PUBLIC_API_MODE=') { Bad '.env.example missing NEXT_PUBLIC_API_MODE' }
}

# 4b. Contract and mock layer
if (Test-Path (Join-Path $src 'lib\api\contract.ts')) { Good 'contract.ts present' } else { Bad 'src/lib/api/contract.ts missing (copy of RESPONSE_DTO_v4)' }
if (Test-Path (Join-Path $src 'mocks\adapter.ts')) { Good 'mock adapter present' } else { Bad 'src/mocks/adapter.ts missing (MOCK_MODE.md)' }
$mockImports = $files | Where-Object { $_.FullName -notmatch '\\mocks\\' -and $_.FullName -notmatch '\\lib\\api\\' -and $_.FullName -notmatch '\\lib\\ws\\' -and $_.FullName -notmatch '\\app\\dev\\' } | Select-String -Pattern 'from [''"]@/mocks|from [''"]\.\./mocks'
if ($mockImports) { Bad ("mocks imported outside lib/api, lib/ws, app/dev: " + $mockImports[0].Path.Replace($Root,'')) } else { Good 'mocks isolated' }

# 5. Routes (page.tsx -> route, route groups stripped)
$appDir = Join-Path $src 'app'
$routes = Get-ChildItem -Path $appDir -Recurse -Filter page.tsx | ForEach-Object {
  $rel = $_.DirectoryName.Substring($appDir.Length).Replace('\','/')
  $segs = $rel.Split('/') | Where-Object { $_ -ne '' -and $_ -notmatch '^\(.*\)$' }
  $r = '/' + ($segs -join '/')
  [regex]::Replace($r, '\[[^\]]+\]', '[]')
} | Sort-Object -Unique
$must = @('/','/auctions','/auctions/[]','/login','/register','/me/profile','/me/products','/me/products/new','/me/products/[]/edit',
 '/me/auctions','/me/auctions/new','/me/auctions/[]','/me/bids','/me/orders','/me/notifications','/orders/[]',
 '/admin','/admin/users','/admin/categories','/admin/products','/admin/products/[]','/admin/auctions','/admin/auctions/[]',
 '/admin/orders','/admin/orders/[]','/admin/reports','/admin/profile','/403')
$mustNot = @('/watchlist','/notifications','/me/settings','/admin/dashboard','/admin/audit-logs')
$missing = $must | Where-Object { $routes -notcontains $_ }
$bad = $routes | Where-Object { $mustNot -contains $_ -or $_ -like '/seller*' -or $_ -like '*/shipment' }
if ($missing) { Bad ("missing routes (" + $missing.Count + "): " + ($missing -join ', ')) } else { Good ("all " + $must.Count + " v4 routes present") }
if ($bad) { Bad ("legacy routes present: " + ($bad -join ', ')) } else { Good 'no legacy routes' }
$extra = $routes | Where-Object { $must -notcontains $_ -and $_ -notlike '/dev*' -and $_ -ne '/admin/reports/[]' }
if ($extra) { Warn ("routes not in SCREENS_v4: " + ($extra -join ', ')) }

Write-Host ''
if ($fail -eq 0) { Write-Host 'ALL FE v4 CHECKS PASSED' -ForegroundColor Green; exit 0 } else { Write-Host "$fail check(s) failed" -ForegroundColor Red; exit 1 }
