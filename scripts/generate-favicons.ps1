Add-Type -AssemblyName System.Drawing

$publicDir = Join-Path $PSScriptRoot '..\public'
$sourcePath = Join-Path $publicDir 'app-icon.png'

if (-not (Test-Path $sourcePath)) {
  throw "Missing source icon at $sourcePath"
}

# Zoom in slightly to trim outer green padding so the cart matches the mobile app icon.
$IconZoom = 1.24

function New-Graphics([System.Drawing.Bitmap]$Bitmap) {
  $g = [System.Drawing.Graphics]::FromImage($Bitmap)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  return $g
}

function New-RoundedIconBitmap {
  param(
    [int]$Size,
    [System.Drawing.Image]$Source
  )

  $renderSize = if ($Size -le 48) { $Size * 4 } else { $Size }

  $renderBmp = New-Object System.Drawing.Bitmap $renderSize, $renderSize,
    ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $renderG = New-Graphics $renderBmp
  $renderG.Clear([System.Drawing.Color]::Transparent)

  $cornerRadius = [Math]::Max(2, [int][Math]::Round($renderSize * 0.18))
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $diameter = $cornerRadius * 2
  $path.AddArc(0, 0, $diameter, $diameter, 180, 90)
  $path.AddArc($renderSize - $diameter, 0, $diameter, $diameter, 270, 90)
  $path.AddArc($renderSize - $diameter, $renderSize - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc(0, $renderSize - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  $renderG.SetClip($path)

  $drawSize = [int][Math]::Round($renderSize * $IconZoom)
  $offset = [int][Math]::Round(($renderSize - $drawSize) / 2)
  $renderG.DrawImage($Source, $offset, $offset, $drawSize, $drawSize)
  $renderG.Dispose()

  $finalBmp = New-Object System.Drawing.Bitmap $Size, $Size,
    ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $finalG = New-Graphics $finalBmp
  $finalG.Clear([System.Drawing.Color]::Transparent)
  $finalG.DrawImage($renderBmp, 0, 0, $Size, $Size)
  $finalG.Dispose()
  $renderBmp.Dispose()

  return $finalBmp
}

function Save-RoundedIcon {
  param(
    [string]$Path,
    [int]$Size,
    [System.Drawing.Image]$Source
  )

  $bmp = New-RoundedIconBitmap -Size $Size -Source $Source
  $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
}

function Write-IcoFile {
  param(
    [string]$Path,
    [System.Drawing.Bitmap[]]$Images
  )

  $pngStreams = New-Object System.Collections.Generic.List[byte[]]
  foreach ($img in $Images) {
    $ms = New-Object System.IO.MemoryStream
    $img.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $pngStreams.Add($ms.ToArray())
    $ms.Dispose()
  }

  $count = $pngStreams.Count
  $headerSize = 6 + (16 * $count)
  $offset = $headerSize
  $bytes = New-Object System.Collections.Generic.List[byte]

  $bytes.AddRange([byte[]](0, 0, 1, 0, [byte]$count, 0))

  foreach ($i in 0..($count - 1)) {
    $img = $Images[$i]
    $w = if ($img.Width -ge 256) { 0 } else { [byte]$img.Width }
    $h = if ($img.Height -ge 256) { 0 } else { [byte]$img.Height }
    $data = $pngStreams[$i]
    $bytes.AddRange([byte[]]($w, $h, 0, 0, 1, 0, 32, 0))
    $bytes.AddRange([BitConverter]::GetBytes([int32]$data.Length))
    $bytes.AddRange([BitConverter]::GetBytes([int32]$offset))
    $offset += $data.Length
  }

  foreach ($data in $pngStreams) {
    $bytes.AddRange($data)
  }

  [System.IO.File]::WriteAllBytes($Path, $bytes.ToArray())
}

function Save-MultiSizeIco {
  param(
    [string]$Path,
    [int[]]$Sizes,
    [System.Drawing.Image]$Source
  )

  $images = New-Object System.Collections.Generic.List[System.Drawing.Bitmap]
  try {
    foreach ($size in $Sizes) {
      $images.Add((New-RoundedIconBitmap -Size $size -Source $Source))
    }
    Write-IcoFile -Path $Path -Images $images.ToArray()
  }
  finally {
    foreach ($img in $images) {
      $img.Dispose()
    }
  }
}

$source = [System.Drawing.Image]::FromFile($sourcePath)

try {
  Save-RoundedIcon (Join-Path $publicDir 'apple-touch-icon.png') 180 $source
  Save-RoundedIcon (Join-Path $publicDir 'icon-192.png') 192 $source
  Save-RoundedIcon (Join-Path $publicDir 'icon-512.png') 512 $source
  Save-RoundedIcon (Join-Path $publicDir 'favicon-16.png') 16 $source
  Save-RoundedIcon (Join-Path $publicDir 'favicon-32.png') 32 $source
  Save-RoundedIcon (Join-Path $publicDir 'favicon-48.png') 48 $source
  Save-MultiSizeIco -Path (Join-Path $publicDir 'favicon.ico') -Sizes @(16, 32, 48) -Source $source

  Write-Output 'Rounded favicon assets generated from app-icon.png.'
}
finally {
  $source.Dispose()
}
