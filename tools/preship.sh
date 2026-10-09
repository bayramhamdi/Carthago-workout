#!/bin/bash
# CARTHAGO : gate 1, syntaxe + validator
# Usage : ./tools/preship.sh app/index.html [--links]
set -e
APP="${1:-app/index.html}"
DIR="$(cd "$(dirname "$0")" && pwd)"
export PYTHONUTF8=1
PY=python3; python3 -c "" >/dev/null 2>&1 || PY=python
TMP="${TMPDIR:-/tmp}/preship_check.js"
echo "=== CARTHAGO PRE-SHIP ==="
echo "App : $APP"
$PY - "$APP" "$TMP" <<'PY'
import re, sys
c = open(sys.argv[1], encoding="utf-8").read()
for s in re.findall(r'<script[^>]*>(.*?)</script>', c, re.DOTALL):
    if ('Carthago' in s or 'BurnTheShips' in s) and 'ReactDOM' in s:
        open(sys.argv[2], 'w', encoding="utf-8").write(s); break
else:
    raise SystemExit('Bloc script de l app introuvable')
PY
node --check "$TMP" && echo "OK 1/2 SYNTAXE"
for V in "$DIR/carthago-validator.py" "$DIR/burn-the-ships-validator.py"; do
  if [ -f "$V" ]; then $PY "$V" "$APP" $2; exit 0; fi
done
echo "ATTENTION : validator absent dans tools/, etape 2/2 sautee"
