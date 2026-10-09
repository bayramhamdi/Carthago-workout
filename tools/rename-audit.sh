#!/bin/bash
# CARTHAGO : gate 0 du renommage. Liste toutes les traces de l'ancien nom.
# Usage : ./tools/rename-audit.sh [dossier]   (defaut : app)
# Les seules occurrences tolerees : shim de migration des anciennes cles localStorage
# et config Firebase (projectId / authDomain). Tout le reste doit etre a zero.
TARGET="${1:-app}"
grep -rniE "burn[ _-]?the[ _-]?ships|burntheships|\bbts[A-Z_]|btsFirebase|btsOnAuthChange|the-ships" "$TARGET" \
  --include="*.html" --include="*.js" --include="*.json" --include="*.webmanifest" --include="*.css" \
  && echo "" && echo "^ Verifie que chaque ligne ci-dessus est une exception documentee." \
  || echo "OK : aucune trace de l'ancien nom."
