# Setup script
$PSDefaultParameterValues['Stop-Process:ErrorAction'] = 'SilentlyContinue' # Ignore errors from `Stop-Process`

$SpotifyDirectory = "$env:APPDATA\Spotify"
$SpotifyExecutable = "$SpotifyDirectory\Spotify.exe"
$spotifyInstalled = (Test-Path -LiteralPath $SpotifyExecutable)

# Stop Spotify
Write-Host `n'Stopping Spotify...'`n
Stop-Process -Name Spotify
Stop-Process -Name SpotifyWebHelper

# Check if Microsoft Store version is installed
if (Get-AppxPackage -Name SpotifyAB.SpotifyMusic) {
    Write-Host 'The Microsoft Store version of Spotify has been detected which is not supported.'`n
    # Ask user if they want to uninstall Microsoft Store version
    $ch = Read-Host -Prompt "Uninstall Spotify Windows Store edition? (y/N) "
    if ($ch -eq 'y') {
        Write-Host 'Uninstalling Spotify.'`n
        Get-AppxPackage -Name SpotifyAB.SpotifyMusic | Remove-AppxPackage
    }
    else {
        Write-Host 'Exiting...'`n
        Pause
        exit
    }
}

# Check is Win32 version is installed
if (-not $spotifyInstalled) {
    Write-Host 'Spotify installation was not detected.'`n
    # Ask user if they want to install Win32 version
    $ch = Read-Host -Prompt "Install Spotify? (y/N) "
    if ($ch -eq 'y') {
        Write-Host 'Downloading Spotify Installer...'`n
        try {
            $webClient.DownloadFile(
                # Remote file URL
                'https://download.scdn.co/SpotifyFullSetup.exe',
                # Local file path
                "$PWD\SpotifyFullSetup.exe"
            )
        }
        catch {
            Write-Output $_
            Pause
            exit
        }
        mkdir $SpotifyDirectory >$null 2>&1
        Write-Host 'Installing Spotify...'`n
        Start-Process -FilePath "$PWD\SpotifyFullSetup.exe"
        while ($null -eq (Get-Process -name Spotify -ErrorAction SilentlyContinue)) {
            #waiting until installation complete
        }
        Write-Host 'Stopping Spotify...'`n
        Stop-Process -Name Spotify >$null 2>&1
        Stop-Process -Name SpotifyWebHelper >$null 2>&1
        Stop-Process -Name SpotifyFullSetup >$null 2>&1
    
    }
    else {
        Write-Host 'Exiting...'`n
        Pause
        exit
    }
}

# Setup environment
Push-Location -LiteralPath $env:TEMP
try {
    # Unique directory name based on time
    New-Item -Type Directory -Name "BlockTheSpot-$(Get-Date -UFormat '%Y-%m-%d_%H-%M-%S')" `
  | Convert-Path `
  | Set-Location
}
catch {
    Write-Output $_
    Pause
    exit
}

# Download patch
Write-Host 'Downloading latest patch...'`n
$webClient = New-Object -TypeName System.Net.WebClient
try {
    $webClient.DownloadFile(
        # Remote file URL
        'https://github.com/mrpond/BlockTheSpot/releases/latest/download/chrome_elf.zip',
        # Local file path
        "$PWD\chrome_elf.zip"
    )
}
catch {
    Write-Output $_
    Start-Sleep
}

Expand-Archive -Force -LiteralPath "$PWD\chrome_elf.zip" -DestinationPath $PWD
Remove-Item -LiteralPath "$PWD\chrome_elf.zip"

# Create a backup of patch
if (!(test-path $SpotifyDirectory/chrome_elf.dll.bak)) {
    Move-Item $SpotifyDirectory\chrome_elf.dll $SpotifyDirectory\chrome_elf.dll.bak >$null 2>&1
}

# Start patch
Write-Host 'Patching Spotify...'`n
$patchFiles = "$PWD\chrome_elf.dll", "$PWD\config.ini"
Copy-Item -LiteralPath $patchFiles -Destination "$SpotifyDirectory"

# Clean up
$tempDirectory = $PWD
Pop-Location
Remove-Item -Recurse -LiteralPath $tempDirectory
Write-Host 'Patching Complete!'`n

# Launch Spotify
Write-Host 'Starting Spotify...'`n
Start-Process -WorkingDirectory $SpotifyDirectory -FilePath $SpotifyExecutable
Write-Host 'Done.'

exit
