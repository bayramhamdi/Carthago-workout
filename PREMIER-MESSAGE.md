Salut. Ce repo est mon app d'entraînement, ex BURN THE SHIPS, qui devient CARTHAGO. Lis CLAUDE.md en entier avant de faire quoi que ce soit, puis les deux fichiers de archive/.

État : j'ai copié ma v9.0 dans app/ (index.html, manifest.json, sw.js, icônes) et mes scripts de test dans tools/ s'ils existaient chez moi.

Mission de cette session, dans cet ordre :

1. Inventaire. Liste ce qu'il y a dans app/ et tools/. Dis-moi clairement si rendertest.js, weektest.js ou le validator manquent.
2. Baseline. git init si pas fait, commit "v9.0 baseline BURN THE SHIPS" avec les fichiers tels quels, AVANT toute modif.
3. Gates sur la baseline. Lance les 3 gates sur la v9.0 d'origine. Si un outil manque, reconstruis-le dans tools/ (rendertest = montage jsdom sans écran blanc, weektest = mock Date sur les 7 jours + vérif du label du jour) et montre-moi qu'il passe sur la baseline.
4. Plan de renommage. Branche rename-carthago. Lance tools/rename-audit.sh et donne-moi la liste COMPLÈTE des occurrences de l'ancien nom, classées en : texte visible, code interne, clés localStorage, service worker / manifest, config Firebase, domaine. Pour chaque catégorie, ce que tu proposes (selon la section Renommage de CLAUDE.md). Attends mon go.
5. Après mon go : renommage complet, shim de migration localStorage, nouveau nom de cache sw, manifest. Un commit par catégorie.
6. Gate 0 (rename-audit) + les 3 gates au vert. Montre-moi les résultats.
7. Pas de deploy. Je valide d'abord en local, je te dirai quand.

Ne touche pas au domaine Netlify, à la config Firebase, aux ancres de dates ni au tagline. La version reste v9.0 sauf si je dis autre chose.
