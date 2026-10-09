#!/bin/bash
# CARTHAGO : nouveau nom de cache sw.js = carthago-v<version>-<hash court du HEAD>.
# A lancer avant chaque deploiement, puis commiter sw.js. Usage : tools/bump-cache.sh
cd "$(git rev-parse --show-toplevel)" || exit 1
VER=$(grep -o '<title>CARTHAGO v[0-9.]*' app/index.html | grep -o 'v[0-9.]*$')
NAME="carthago-${VER}-$(git rev-parse --short HEAD)"
sed -i "s/^const CACHE = '.*';/const CACHE = '${NAME}';/" app/sw.js
echo "CACHE = ${NAME}"
