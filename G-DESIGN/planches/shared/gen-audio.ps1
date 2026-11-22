# Génère audio/<urgence>-<étape>.wav pour chaque étape de data.js
# avec la voix FR intégrée de Windows (Hortense = voix féminine, règle solo G).
# Hors ligne, sans clé. Remplaçable plus tard par Kokoro (même nommage).
# Usage : powershell -NoProfile -File shared/gen-audio.ps1   (depuis planches/)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$out = Join-Path $root 'audio'
New-Item -ItemType Directory -Force $out | Out-Null

# data.js -> JSON via node (le texte lu = exactement celui affiché)
$js = Join-Path $PSScriptRoot 'data.js'
$json = node -e "global.window={};require(process.argv[1]);process.stdout.write(JSON.stringify(window.URG))" $js
$urg = $json | ConvertFrom-Json

Add-Type -AssemblyName System.Speech
$s = New-Object System.Speech.Synthesis.SpeechSynthesizer
$v = $s.GetInstalledVoices() | Where-Object { $_.VoiceInfo.Culture.Name -like 'fr*' -and $_.VoiceInfo.Gender -eq 'Female' } | Select-Object -First 1
if (-not $v) { throw 'Aucune voix FR féminine installée.' }
$s.SelectVoice($v.VoiceInfo.Name)
$s.Rate = 0
$n = 0
foreach ($u in $urg) {
  $k = 0
  foreach ($st in $u.steps) {
    $k++
    $txt = "$($st.t). $($st.x)"
    if ($st.no) { $txt += " Ne pas : " + ($st.no -join ', ') + '.' }
    $s.SetOutputToWaveFile((Join-Path $out "$($u.id)-$k.wav"))
    $s.Speak($txt)
    $n++
  }
}
$s.SetOutputToNull(); $s.Dispose()
"$n fichiers audio -> $out (voix : $($v.VoiceInfo.Name))"
