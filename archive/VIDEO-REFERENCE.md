# VIDEO REFERENCE (archive v5.5, juin 2026)
## Source de vérité historique pour les IDs vidéo. Le code dans app/ prime s'il diffère.

## Vidéos mortes (ne jamais revenir dessus)
| Exercice | Mort | Utiliser |
|---|---|---|
| Pull-Ups | `XB_7En-xu3k` | `PbfFblcxWSo` |
| Loaded SL Calf Raise | `b4VCnxq2g0k` | `wZfr_svtSr0` |
| Banded Ankle Dorsiflexion | `w3UMserfHdQ` | `v-cxqr5OKEk` |
| Single-Leg RDL | `u_xWrq70iPI` | `s32cCgmRV3I` |
| Isolated Tricep Extension (ancien) | `FGqvQdLCxSY` | voir Single-Arm Tricep Extension |
| Barbell Bicep Curl (ancien) | `j3QBFqWsgYQ` | `yRMQoSLOl6g` |

## Corrections directes
- On Bench Lat Stretch to Hip Stretch : `NmohIiacpK0`
- Shin Box Fold : `A9vhRbwH2Sw` (PAS `xFKCoWuP94Y`, qui est Poliquin Step Down)
- Pec Doorway Stretch : `W1WcacpQ_RM`
- TRX Row : `fAwrRJu5tw0`
- Plyo Push-Up : `zHqxyD9_364`

## Glute medius (prep jour jambes, A/B codé en dur, PAS rotationMap)
| Exercice | Vid | Semaine |
|---|---|---|
| Banded Side-Lying Hip Abduction | `TCjssGsibKU` | A |
| Banded Hip External Rotation (Seated) | `GH_IQsyOKwI` | B |

## Trio prep épaules (jour push)
| Exercice | Vid | Semaine |
|---|---|---|
| Banded Shoulder External Rotation with Arm Behind | `tJDOsft6JJE` | A |
| Spider Crawls | `ZpsDv8EONdc` | B |
| KB Bottoms-Up Carry | `wtBDkYRHlr4` | A et B (ancre) |

## Power primer Tier 6 (un par jour d'entraînement, disparaît en deload)
| Jour | Semaine A | Semaine B |
|---|---|---|
| Lun (A2. POWER) | Kettlebell Swing | Dumbbell Snatch |
| Mar (A3. POWER) | Rotational Banded Punch | Med Ball Slam |
| Mer (A2. POWER PRIMER) | Med Ball Rotational Throw | Rotational Banded Punch |
| Jeu (A2. POWER) | Seated Box Jump | TRX Jump Squat |
| Ven (A2. POWER) | Landmine Push Press | Plyo Push-Up |
Deload : les 7 power primers ont `light: null, recovery: null` dans rotationMap, les blocs se cachent en light/recovery.
Note : la réorganisation Tier 6 a changé les jours depuis (Mar = Push, Mer = Conditioning, Jeu = Legs, Ven = Arms, Sam = Mobility). Vérifier dans le code.

## Renommages
- Isolated Tricep Extension -> Single-Arm Tricep Extension : `VgjAgAKaSPM`
- Isolated Dumbbell Flexor -> Seated DB Wrist Curl : `y-x14sVi12o`
- Isolated Dumbbell Extensor -> Seated DB Reverse Wrist Curl : `cRLJ86m00cU`
- `FwCuyV208bU` appartient UNIQUEMENT à Kettlebell Forearm Rotation.

## Noms canoniques (utiliser uniquement ceux-ci)
| Canonique | Variante supprimée |
|---|---|
| Band Pull Aparts | Band Pull-Apart |
| Push-Up to Toe Touch | Push Ups to Toe Touch |
| Side Bridge Abduction from Elbow | Side Bridge Abduction |
| Kneeling T-Spine with Shoulder Opener | Kneeling T-Spine Rotations on Wall |
| Forearm Twist + Curl with Towel | Forearm Supination Curl |
| Single-Leg RDL | Single Leg KB Romanian Deadlift |
| Kettlebell Forearm Rotation | KB Pronation/Supination |

## Décisions ouvertes (NE PAS fusionner sans Bayram)
- Ankle Mobility (Wall) vs Facing Wall Hip Circle Rotations : partagent à tort `odvEl4NkZuo`, il faut une vraie vidéo.
- Landmine Rotational Press vs Rotational Landmine Clean and Press : peut-être deux mouvements (partagent `bZRXZZXOEdQ`).
- Shoulder Arm Bar (customLib, `g2EhWlBX_Qw`) vs KB SHOULDER ARM BAR (workouts, `u6TjcV0YKZ8`) : même exercice, deux vidéos. Choisir puis unifier.
- Chin Up : `vid: null`.
