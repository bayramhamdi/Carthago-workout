# CARTHAGO (ex BURN THE SHIPS)

App d'entraînement personnelle de Bayram Hamdi. Lis ce fichier en entier au début de chaque session.
Le code dans `app/` est la source de vérité. Les docs dans `archive/` datent de mai/juin 2026 (v5.5) : si elles contredisent le code, le code gagne.

## Qui est l'utilisateur
- Bayram : dev, designer et seul utilisateur. Combattant BJJ / Muay-Thaï, home gym, apprenti électricien (CEFF Moutier + Willemin Électricité).
- Ton : direct, court, fraternel. Pas de préambule. Il corrige vite : prends ses corrections telles quelles.
- JAMAIS de tiret cadratin (em dash) dans la prose, les commits, les messages UI que tu ajoutes. Utilise deux-points, point, parenthèses.
- Français : formes masculines uniquement.
- Pour une vraie feature : explique ce qu'elle fait, esquisse l'UX, attends le feu vert, PUIS code. Pour un fix clair : fais-le.

## Stack
- `app/` = déploiement Netlify (dossier) : `index.html` + `manifest.json` + `sw.js` + 2 icônes. PWA installable sur téléphone (depuis v9.0).
- React 18 inline, SANS JSX (`React.createElement` partout). Pas de bundler, pas de build step.
- Firebase 10.x (Auth Google + Firestore `users/{uid}`), région eur3. localStorage = stockage primaire, Firebase = sync.
- Design system v8 : police Sora ; tokens `--ink`, `--coal`, `--ash`, `--full` (#3ECF8E ember), `--smoke`, `--dim`.
- Site live : the-ships.netlify.app (voir section Renommage avant de toucher au domaine).

## Version
- Version actuelle : v9.0. Elle reste v9.0 jusqu'à ce que Bayram déclare une nouvelle version. Ne bumpe jamais seul : demande.

## Les 3 gates (OBLIGATOIRES avant tout deploy)
1. `tools/preship.sh app/index.html` : syntaxe (extraction du script React + `node --check`) + validator si présent.
2. `rendertest.js` : montage headless jsdom, l'app doit rendre sans écran blanc.
3. `weektest.js` : mock de Date sur les 7 jours, vérifie le bon label du jour (hero).
Nées après le hotfix écran blanc (strip à 7 cases sur un tableau de 6 labels). Si `rendertest.js` / `weektest.js` / `burn-the-ships-validator.py` manquent dans le dossier de Bayram, signale-le et propose de les reconstruire dans `tools/`. Aucun deploy sans les 3 gates au vert.
Gate 0 en plus pendant le renommage : `tools/rename-audit.sh` (zéro occurrence de l'ancien nom hors exceptions documentées).

## Règles du programme (ne jamais casser)
- Aucun exercice orphelin : chaque exercice de la librairie reste en rotation active. Pour équilibrer une séance : déplacer / tourner des exercices ou ajuster les séries, JAMAIS supprimer.
- Pas de nouvel onglet sans demander. Pas de feature supprimée sans confirmation.
- Renommer un exercice : vérifier que la vidéo correspond toujours (voir `archive/VIDEO-REFERENCE.md`, noms canoniques et vidéos mortes à ne pas réutiliser).
- Exercices prescrits par le physio (Overhead Barbell Press, Behind-Neck Pull-Ups) : ne pas retirer.
- KB Shoulder Arm Bar s'appelle comme ça (pas "Loaded Windmill").
- Vue Nutrition : ne pas modifier doses / horaires des compléments sans confirmation de Bayram.
- Ancres (ne pas bouger sans accord explicite) : `ANCHOR_DATE = new Date(2026, 3, 27)`, `FIRST_TEST = new Date(2026, 4, 2)`, BJJ semaine 1 = 27.04.2026.

## Pièges techniques connus
- Insertion dans `tier6OverridesA/B` : utiliser un splice SCOPÉ (par jour + bloc). Un remplacement par string match multiple fait avorter (multi-match abort).
- JS `getDay()` : dimanche = 0. Toute logique d'auto-avance doit le gérer (bug historique : Monday fantôme le dimanche).
- Strip 7 jours (L M M J V S D), dimanche = repos permanent. Les gates d'index ont été migrés en conséquence.
- Bouton Rest Day : un jour sauté renvoie `role: "rest"` pour que `liftsBetween` l'ignore.
- Vague d'intensité FULL / LIGHT / RECOVERY intégrée à une queue de 12 séances, auto + override manuel. Garde de complétion via state `lastDone` (race condition corrigée).
- Set caps sur les jours Leg / Arms / Push FULL : 2 séries, avec exceptions par NOM de bloc (MAIN LIFT, T-SPINE PREP).
- `xSets` (boutons +Set / -Set par exercice) persisté en localStorage.
- Toute action destructive ("clear" de l'état courant, Mark Complete) doit persister de façon SYNCHRONE (`saveLS()` direct) avant toute lecture/écriture Firebase. Jamais via une cascade de `useEffect`.
- Format des clés `workoutHistory` : `YYYY-MM-DD`. Pas de changement sans migration.
- Vue publique (non connecté) : uniquement le programme, aucune donnée perso. Ne pas casser.

## Renommage BURN THE SHIPS -> CARTHAGO
Règle : tout ce que l'utilisateur VOIT et tout le code interne passe à Carthago. Ce qui stocke des DONNÉES ne change jamais sans migration.
- À renommer : `<title>`, logo / textes UI, `manifest.json` (`name`, `short_name`), composant principal (`BurnTheShips` -> `Carthago`), wrappers globaux (`window.btsFirebase` -> `window.carthagoFirebase`, `btsOnAuthChange` -> `carthagoOnAuthChange`), commentaires, nom de cache du service worker (nouveau nom = forcer le refresh du cache, c'est voulu), noms des outils dans `tools/`.
- Clés localStorage (préfixe `bts` ou autre) : NE PAS renommer à sec. Écrire un shim de migration au démarrage : si la nouvelle clé est vide et l'ancienne existe, copier l'ancienne vers la nouvelle. Garder la lecture de l'ancienne clé au moins une version. Sinon Bayram perd ses logs, ses xSets, son état.
- Firestore : chemin `users/{uid}` inchangé. Les noms de champs synchronisés restent identiques.
- Config Firebase (`projectId`, `authDomain`) : NE PAS toucher. Un ID de projet Firebase ne se renomme pas.
- Tagline "No Retreat" : ne pas changer sans que Bayram le décide.
- Domaine Netlify : ne pas renommer le site sans validation. Changer `the-ships.netlify.app` = nouvelle origine : localStorage vide sur le téléphone, PWA à réinstaller, ET le nouveau domaine doit être ajouté dans Firebase Console > Authentication > Authorized domains, sinon Google Sign-In casse.

## Git
- Une branche par chantier (`rename-carthago`, etc.), un commit par étape logique, message court sans em dash.
- Ne jamais commit de secrets. Les clés web Firebase ne sont pas secrètes au sens strict mais le repo reste PRIVÉ.

## Deploy
- Uniquement après les 3 gates au vert ET le "go" explicite de Bayram.
- `netlify deploy --dir=app` (preview) puis `netlify deploy --dir=app --prod` après validation.

## Hors périmètre de ce repo
- THE CODEX (life-OS séparé). Protocoles nutrition / suppléments détaillés (vivent hors de l'app).
- Futur mode invité (Ahmed, le frère de Bayram, avec ses propres séances) : idée notée, ne pas construire sans demande.
