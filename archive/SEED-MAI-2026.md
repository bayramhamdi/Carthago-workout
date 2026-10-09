# SEED (archive, 19 mai 2026, v5.5)
Carte historique. Beaucoup de choses ont bougé depuis (v8 reskin, v9.0 PWA, réorg Tier 6). Le code gagne toujours.

## Vues
4 onglets si connecté : workout, schedule, calendar, nutrition. Non connecté : workout seulement (vue publique, programme sans données perso).
Vacances : toggle à l'intérieur de Calendar (`showVacations`), pas un onglet.

## Tiers
4 = STANDARD (#4CAF50), 5 = ELITE (#F7C948), 6 = BE A PRO (#EF5350). State `tier`, défaut 4, synchronisé.
`tierRequired` sur un jour, `tierMax` sur un bloc (filtré au-dessus).
Tier 6 utilise `tier6OverridesA` / `tier6OverridesB`.

## Auto mode
`computeWeekAndCycle(date)` = source unique. Ne pas recalculer ailleurs.
Ancre `new Date(2026, 3, 27)` = semaine A, cycle 1. Macrocycle 5 semaines : 1-2 FULL, 3-4 LIGHT, 5 RECOVERY. A/B alterne chaque 7 jours.
Toucher semaine / cycle / condition / jour -> `autoMode = false` (badge MANUAL), tap sur le badge = retour au calendrier réel.
Note : la v8 a ajouté une queue de 12 séances avec vague d'intensité, vérifier comment elle cohabite avec ce calcul dans le code actuel.

## GBRS Performance Standards
Radar 7 axes (Standard / Elite / Pro) : Bench BW reps 10/15/20, Pull-Ups 10/15/20, Trap Bar DL xBW pour 5 reps 1.5/1.75/2.0, 800m 3:15/3:00/2:45, Broad Jump (in) 72/84/96, Plank (s) 120/150/180, Farmer's Carry (ft à BW) 175/225/250.
`FIRST_TEST = new Date(2026, 4, 2)`, puis tous les 3 mois. Veille et lendemain = repos auto.
State : `testDraft`, `testHistory`. Constantes : 182 cm, ~90 kg.

## BJJ blanche -> bleue
18 semaines, 3 phases (SURVIVAL / GUARD / TOP GAME), state `bjjProgress`. Le module curriculum s'affiche AU-DESSUS de la bannière fight night.

## Custom Session Builder
13 parties du corps, 4 régions (UPPER / LOWER / SUPPORT / RECOVERY). `customParts` synchronisé, `customRegion` UI seulement.
Forme d'un exercice : `{ name, detail, track ("Reps" | "Seconds" | "Reps + Weight" | "Dist + Weight"), vid, dr }`.

## Blessures
12 flags : r_shoulder, l_shoulder, r_knee, l_knee, lower_back, r_hip, l_hip, r_wrist, l_wrist, r_elbow, l_elbow, neck. Avertissement sur les exercices concernés, ils restent affichés.

## Firestore `users/{uid}` (clés synchronisées en mai, la v8+ en a peut-être ajouté)
week, completedEx, logData, condition, cycleWeek, injuries, customParts, workoutHistory, sessionTimer, autoMode, tier, testDraft, testHistory, bjjProgress
- `workoutHistory` : `{ "YYYY-MM-DD": { exerciseData, completedChecks, condition } }`
- Non synchronisé (UI) : selectedDay, view, customRegion, openTip, monthOffset, showVacations, fbUser, fbReady, syncStatus, now

Règles Firestore : lecture/écriture seulement si `request.auth.uid == userId`.

## Bugs historiques à ne pas réintroduire
- Mark Session Complete : persistance synchrone (`saveLS()` direct) + au chargement Firebase, ignorer `exerciseData` / `completedChecks` du jour si déjà marqué complet.
- KB Shoulder Arm Bar (pas Loaded Windmill).
- Contraste du footer : lisible, ne pas le rassombrir.
