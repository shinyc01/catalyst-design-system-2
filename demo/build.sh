#!/bin/bash
# Builds demo/index.html: shell.html + screens/*.jsx, with the local kit (dist/) inlined so the page works on its own.
# The NavBar settings (gear) button opens Display settings (density). Run after `node build.mjs`.
set -e
D="$(cd "$(dirname "$0")" && pwd)"; OUT="$D/index.html"; SRC="$D/.index.src.html"
{
  sed '/\/\* SCREENS \*\//,$d' "$D/shell.html"
  for f in "$D"/screens/*.jsx; do echo "// ---- $(basename "$f")"
    sed -e "s/ onSettings={() => toast('Settings')}//" -e 's/<NavBar /<NavBar onSettings={openSettings} /' "$f"; echo; done
  sed '1,/\/\* SCREENS \*\//d' "$D/shell.html"
} > "$SRC"
bash "$D/../tools/inline.sh" "$SRC" "$OUT" "$D/../dist" >/dev/null && rm -f "$SRC" && echo "Wrote $OUT"
