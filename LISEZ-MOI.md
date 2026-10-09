# CARTHAGO : démarrage Claude Code

## Contenu du kit
- `CLAUDE.md` : la mémoire du projet. Claude Code le lit automatiquement à chaque session.
- `PREMIER-MESSAGE.md` : le message à coller en premier dans Claude Code.
- `app/` : VIDE. Tu y mets ta v9.0.
- `tools/preship.sh` : gate 1 (accepte l'ancien et le nouveau nom).
- `tools/rename-audit.sh` : gate 0 du renommage.
- `archive/` : référence vidéos + seed de mai (historique, le code prime).

## Étapes (10 minutes)
1. Dézippe `carthago/` où tu veux sur ton PC.
2. Copie dans `app/` ton dossier de deploy v9.0 actuel : `burn-the-ships-v9.0.html` renommé en `index.html`, plus `manifest.json`, `sw.js` et les 2 icônes. Garde aussi `burn-the-ships-v9.0-fallback.html` hors du repo, en sécurité.
3. Copie dans `tools/` tes `rendertest.js`, `weektest.js` et `burn-the-ships-validator.py` si tu les as. S'ils manquent, Claude Code les reconstruit.
4. Ouvre un terminal dans `carthago/`, lance `claude`.
5. Colle le contenu de `PREMIER-MESSAGE.md`.

## À faire toi-même plus tard (pas Claude Code)
- Renommer le projet claude.ai "BURN THE SHIPS" en "CARTHAGO" (réglages du projet).
- Domaine : si tu veux `carthago.netlify.app`, deux conséquences. Ton téléphone repart avec un localStorage vide (les données Firebase restent si tu es connecté) et la PWA est à réinstaller. Et AVANT le switch : Firebase Console > Authentication > Settings > Authorized domains > ajouter le nouveau domaine, sinon la connexion Google casse.
- Repo GitHub privé `carthago` si tu veux bosser depuis le téléphone ou le cloud.
