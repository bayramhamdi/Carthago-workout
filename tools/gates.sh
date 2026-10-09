#!/bin/bash
# CARTHAGO : toutes les gates + tests (utilise par la CI). Le hook pre-push ne lance que les 3 gates rapides.
cd "$(git rev-parse --show-toplevel)" || exit 1
FAIL=0
run() { echo "--- $1"; shift; "$@" || { echo "ECHEC : $*"; FAIL=1; }; }
run "gate 0 rename-audit" bash tools/rename-audit.sh
run "gate 1 preship" bash tools/preship.sh app/index.html
run "gate 2 rendertest" node tools/rendertest.js
run "gate 3 weektest" node tools/weektest.js
for t in migrationtest synctest backuptest loadtest pushtest icontest; do [ -f tools/$t.js ] && run "$t" node tools/$t.js; done
[ $FAIL -eq 0 ] && echo "TOUT VERT" || { echo "ROUGE"; exit 1; }
