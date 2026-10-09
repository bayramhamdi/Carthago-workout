#!/bin/bash
# CARTHAGO : gate 0 du renommage. Liste toutes les traces de l'ancien nom.
# Usage : ./tools/rename-audit.sh [dossier]   (defaut : app)
# Exceptions tolerees (lignes filtrees) :
#   - config Firebase : lignes avec authDomain / projectId / storageBucket
#   - shim de migration : lignes marquees "legacy-bts"
# Tout le reste doit etre a zero. Code retour 0 si propre, 1 sinon.
TARGET="${1:-app}"
PATTERN='burn[ _-]*(the[ _-]*)?ships|\bbts|the-ships'
HITS=$(grep -rniE "$PATTERN" "$TARGET" \
  --include="*.html" --include="*.js" --include="*.json" --include="*.webmanifest" --include="*.css" \
  | grep -vE 'authDomain|projectId|storageBucket|legacy-bts')
if [ -n "$HITS" ]; then
  echo "$HITS"
  echo ""
  echo "FAIL : traces de l'ancien nom (hors exceptions documentees)."
  exit 1
fi
echo "OK : aucune trace de l'ancien nom."
