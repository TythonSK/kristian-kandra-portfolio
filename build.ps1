# Package the static website without modifying its browser files.
$ErrorActionPreference = 'Stop'

$projectRoot = (Resolve-Path -LiteralPath $PSScriptRoot).Path
$outputPath = [System.IO.Path]::GetFullPath((Join-Path $projectRoot 'dist'))
$archivePath = Join-Path $projectRoot 'portfolio-hosting.zip'
$files = @(
    'index.html', 'style.css', 'fonts.css', '.nojekyll', 'LICENSE'
)
$directories = @('js', 'assets')

# Validate all inputs before replacing a previous build.
foreach ($file in $files) {
    if (-not (Test-Path -LiteralPath (Join-Path $projectRoot $file) -PathType Leaf)) {
        throw "Missing required file: $file"
    }
}
foreach ($directory in $directories) {
    if (-not (Test-Path -LiteralPath (Join-Path $projectRoot $directory) -PathType Container)) {
        throw "Missing required directory: $directory"
    }
}

# Recursive cleanup is restricted to this project's generated dist directory.
if ($outputPath -ne (Join-Path $projectRoot 'dist') -or
    -not $outputPath.StartsWith($projectRoot + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw 'Build output must be the dist directory inside the project.'
}
if (Test-Path -LiteralPath $outputPath) {
    $existingOutput = Get-Item -LiteralPath $outputPath -Force
    if (-not $existingOutput.PSIsContainer -or
        ($existingOutput.Attributes -band [System.IO.FileAttributes]::ReparsePoint)) {
        throw 'Refusing to replace dist: it must be a regular directory.'
    }
    Remove-Item -LiteralPath $outputPath -Recurse -Force
}

New-Item -ItemType Directory -Path $outputPath | Out-Null
foreach ($file in $files) {
    Copy-Item -LiteralPath (Join-Path $projectRoot $file) -Destination $outputPath -Force
}
foreach ($directory in $directories) {
    Copy-Item -LiteralPath (Join-Path $projectRoot $directory) -Destination $outputPath -Recurse -Force
}

# Archive the contents so index.html is at the ZIP root.
$archiveInputs = @(Get-ChildItem -LiteralPath $outputPath -Force | ForEach-Object { $_.FullName })
Compress-Archive -LiteralPath $archiveInputs -DestinationPath $archivePath -Force
Write-Output "Website files: $outputPath"
Write-Output "Hosting archive: $archivePath"
