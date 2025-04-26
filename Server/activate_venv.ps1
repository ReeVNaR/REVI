function global:deactivate {
    if ($Env:VIRTUAL_ENV) {
        Remove-Item Env:\VIRTUAL_ENV -ErrorAction SilentlyContinue
        if ($Env:_OLD_VIRTUAL_PATH) {
            $Env:PATH = $Env:_OLD_VIRTUAL_PATH
            Remove-Item Env:_OLD_VIRTUAL_PATH -ErrorAction SilentlyContinue
        }
    }
}
$Env:_OLD_VIRTUAL_PATH = $Env:PATH
$Env:VIRTUAL_ENV = "$PSScriptRoot\venv"
$Env:PATH = "$Env:VIRTUAL_ENV\Scripts;$Env:PATH"
