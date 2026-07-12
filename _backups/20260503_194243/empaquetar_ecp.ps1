$srcDir = "$PSScriptRoot\src"
$htmlFile = "$srcDir\index.html"
$tmpDir = "$PSScriptRoot\cdn_tmp"

Write-Host "ECP Empaquetador offline" -ForegroundColor Cyan

if (-not (Test-Path $htmlFile)) {
    Write-Host "ERROR: No se encontro $htmlFile" -ForegroundColor Red
    exit 1
}

New-Item -ItemType Directory -Force -Path $tmpDir | Out-Null

$html = [System.IO.File]::ReadAllText($htmlFile, [System.Text.Encoding]::UTF8)

function DescargarScript($url, $archivo) {
    $ruta = "$tmpDir\$archivo"
    if (Test-Path $ruta) {
        $kb = [math]::Round((Get-Item $ruta).Length / 1024)
        Write-Host "  Cache: $archivo ($kb KB)" -ForegroundColor Green
        return $ruta
    }
    Write-Host "  Descargando $archivo ..." -ForegroundColor White -NoNewline
    try {
        Invoke-WebRequest -Uri $url -OutFile $ruta -UseBasicParsing
        $kb = [math]::Round((Get-Item $ruta).Length / 1024)
        Write-Host " OK ($kb KB)" -ForegroundColor Green
        return $ruta
    } catch {
        Write-Host " FALLO" -ForegroundColor Red
        return $null
    }
}

$scripts = @(
    @{ url="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js";    file="react.min.js";     tag='<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>' },
    @{ url="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"; file="react-dom.min.js"; tag='<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"></script>' },
    @{ url="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.5/babel.min.js";        file="babel.min.js";     tag='<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.5/babel.min.js"></script>' }
)

foreach ($s in $scripts) {
    $ruta = DescargarScript $s.url $s.file
    if ($ruta) {
        $contenido = [System.IO.File]::ReadAllText($ruta, [System.Text.Encoding]::UTF8)
        $tagNuevo = "<script>" + $contenido + "</script>"
        $html = $html.Replace($s.tag, $tagNuevo)
        Write-Host "  Incrustado: $($s.file)" -ForegroundColor DarkGreen
    }
}

$xlsxRuta = DescargarScript "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js" "xlsx.min.js"
if ($xlsxRuta -and $html -notmatch "xlsx-bundle") {
    $xlsxContenido = [System.IO.File]::ReadAllText($xlsxRuta, [System.Text.Encoding]::UTF8)
    $xlsxTag = '<script id="xlsx-bundle">' + $xlsxContenido + '</script>'
    $html = $html.Replace("</body>", $xlsxTag + "</body>")
    Write-Host "  SheetJS incrustado" -ForegroundColor DarkGreen
}

$pdfRuta = DescargarScript "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" "jspdf.min.js"
if ($pdfRuta -and $html -notmatch "jspdf-bundle") {
    $pdfContenido = [System.IO.File]::ReadAllText($pdfRuta, [System.Text.Encoding]::UTF8)
    $pdfTag = '<script id="jspdf-bundle">' + $pdfContenido + '</script>'
    $html = $html.Replace("</body>", $pdfTag + "</body>")
    Write-Host "  jsPDF incrustado" -ForegroundColor DarkGreen
}

[System.IO.File]::WriteAllText($htmlFile, $html, [System.Text.Encoding]::UTF8)

$mb = [math]::Round((Get-Item $htmlFile).Length / 1MB, 1)
Write-Host ""
Write-Host "Listo! index.html: $mb MB" -ForegroundColor Green
Write-Host "Ahora ejecuta: npm run build" -ForegroundColor Cyan
