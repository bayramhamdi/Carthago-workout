#!/usr/bin/env python3
"""CARTHAGO : Pre-Ship Validator
Runs every check before deploy. One command, full report."""
import re, sys, json, urllib.request, urllib.error

APP = sys.argv[1] if len(sys.argv) > 1 else "/home/claude/burn-new.html"
REF = "/mnt/project/BURN-THE-SHIPS-VIDEO-REFERENCE.md"
CHECK_LINKS = "--links" in sys.argv

with open(APP) as f:
    content = f.read()

issues = {"critical": [], "warning": [], "info": []}

def const_chunk(name):
    start = content.find(f"const {name}")
    if start == -1: return ""
    depth, i = 0, content.find("{", start)
    while i < len(content):
        if content[i] == "{": depth += 1
        elif content[i] == "}":
            depth -= 1
            if depth == 0: return content[start:i+1]
        i += 1
    return ""

def day_exercises(chunk, day):
    d_start = chunk.find(f"  {day}:")
    if d_start == -1: return set()
    d_end = len(chunk)
    for nd in ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"]:
        if nd != day:
            pos = chunk.find(f"  {nd}:", d_start + 10)
            if pos != -1 and pos < d_end: d_end = pos
    section = chunk[d_start:d_end]
    return set(m.replace("\\'","'") for m in re.findall(r'name:\s*"([^"]+)"', section)
               if not re.match(r'^[A-H]\d?\.\s', m))

DAYS = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"]
PREP = {"Facing Wall Hip Circle Rotations","Heel Clicks","Dead Hang","Figure 4 Flow",
        "Cat Camel Diagonal","Kneeling T-Spine with Shoulder Opener","Banded Face Pulls with ER Focus",
        "Elevated Heels Deep Squat Opener","Band Pull Aparts","Push-Up to Pike","Banded External Rotation",
        "Hip Flexor Rock Back","Crawl Shoulder Tap","Hip Flexor Plank","Shoulder CARs","Hip Airplane","Ankle CARs"}
CARRY = {"FARMER'S CARRY","Suitcase Carry","Towel Kettlebell Carry"}
COND = {"Sled Push","Incline Walk","Reverse Sled Drag"}

# ── CHECK 1: Same-week conflicts ──
for var in ["tier6OverridesA","tier6OverridesB"]:
    chunk = const_chunk(var)
    label = var[-1]
    de = {d: day_exercises(chunk, d) for d in DAYS}
    for i in range(len(DAYS)):
        for j in range(i+1, len(DAYS)):
            for ex in sorted(de[DAYS[i]] & de[DAYS[j]]):
                if ex not in PREP and ex not in CARRY and ex not in COND:
                    issues["critical"].append(f"Same-week conflict Wk{label}: {ex} on {DAYS[i][:3]}+{DAYS[j][:3]}")

# ── CHECK 2: Same-block duplicates (light + recovery) ──
rm = content[content.find("const rotationMap"):content.find("\n};", content.find("const rotationMap"))+3]
light_map, rec_map = {}, {}
for m in re.finditer(r'"([^"]+)":\s*\{[^}]*light:\s*\{[^}]*name:\s*"([^"]+)"', rm, re.DOTALL):
    light_map[m.group(1)] = m.group(2)
for m in re.finditer(r'"([^"]+)":\s*\{[^}]*recovery:\s*\{[^}]*name:\s*"([^"]+)"', rm, re.DOTALL):
    rec_map[m.group(1)] = m.group(2)

for struct in ["workoutsA","workoutsB","tier6OverridesA","tier6OverridesB","recoveryWorkouts"]:
    chunk = const_chunk(struct)
    for bm in re.finditer(r'name:\s*"([A-H]\d?\.\s[^"]+)"[^{]*exercises:\s*\[(.*?)\]', chunk, re.DOTALL):
        block, exs = bm.group(1), re.findall(r'name:\s*"([^"]+)"', bm.group(2))
        # direct dupes
        seen = {}
        for ex in exs:
            seen[ex] = seen.get(ex,0)+1
        for ex,c in seen.items():
            if c > 1: issues["critical"].append(f"Direct duplicate {struct}/{block}: {ex} x{c}")
        # rotation dupes
        for ex in exs:
            # Same-name rotation = parameter change, NOT a duplicate
            if ex in light_map and light_map[ex] != ex and light_map[ex] in exs and struct != "recoveryWorkouts":
                issues["critical"].append(f"Light-rotation dupe {struct}/{block}: {ex}→{light_map[ex]}")
            if ex in rec_map and rec_map[ex] != ex and rec_map[ex] in exs:
                issues["critical"].append(f"Recovery-rotation dupe {struct}/{block}: {ex}→{rec_map[ex]}")

# ── CHECK 3: Video IDs vs reference ──
ref_vids = {}
dead_vids = set()
import os
_here = os.path.dirname(os.path.abspath(__file__))
_cands = [os.environ.get("CARTHAGO_VIDEO_REF", ""), os.path.join(_here, "..", "archive", "VIDEO-REFERENCE.md"), REF]
_ref_path = next((c for c in _cands if c and os.path.isfile(c)), None)
if _ref_path is None:
    issues["warning"].append("Fichier de references video ABSENT : check 3 (IDs video) NON effectue")
else:
    with open(_ref_path, encoding="utf-8") as f: ref = f.read()
    _id = r'`([A-Za-z0-9_-]{11})`'
    # Tableaux "| Exercice | `mort` | `bon` |" (videos mortes) et "| Exercice | `vid` | semaine |"
    for line in ref.splitlines():
        cells = [c.strip() for c in line.strip().strip("|").split("|")] if line.strip().startswith("|") else []
        if len(cells) < 2 or not cells[0] or set(cells[0]) <= set("-: "): continue
        ids = [m.group(1) for c in cells[1:] for m in re.finditer(_id, c)]
        if not ids: continue
        if len(cells) >= 3 and re.fullmatch(_id, cells[1]) and re.fullmatch(_id, cells[2]):
            dead_vids.add(ids[0]); ref_vids[cells[0]] = ids[1]          # mort -> bon
        elif re.fullmatch(_id, cells[1]):
            ref_vids[cells[0]] = ids[0]
    # Listes "- Exercice : `vid`" et "- Ancien -> Nouveau : `vid`"
    for m in re.finditer(r'^- (?:[^\n]*?-> )?([^:\n`]+?) : ' + _id, ref, re.M):
        ref_vids[m.group(1).strip()] = m.group(2)
    # Videos reservees : "`id` appartient UNIQUEMENT a X"
    for m in re.finditer(_id + r' appartient UNIQUEMENT [^A-Za-z]*([^.\n]+)', ref):
        ref_vids.setdefault(m.group(2).strip(), m.group(1))
    if not ref_vids and not dead_vids:
        issues["warning"].append("References video lues (" + os.path.basename(_ref_path) + ") mais 0 entree reconnue : check 3 (IDs video) inoperant")

checked = set()
for m in re.finditer(r'name:\s*"([^"]+)"[^}]*?vid:\s*"([^"]+)"', content, re.DOTALL):
    name, vid = m.group(1).replace("\\'","'"), m.group(2)
    if re.match(r'^[A-H]\d?\.\s', name) or name in checked: continue
    checked.add(name)
    if name in ref_vids and ref_vids[name] != vid:
        issues["warning"].append(f"Vid mismatch: {name} app={vid} ref={ref_vids[name]}")

for _d in sorted(dead_vids):
    if re.search(r'vid:\s*"' + re.escape(_d) + '"', content):
        issues["critical"].append(f"Video morte reutilisee: {_d}")
print(f"[check 3] {len(ref_vids)} IDs de reference, {len(dead_vids)} videos mortes", file=sys.stderr)

# ── CHECK 4: Broken vid format ──
for m in re.finditer(r'vid:\s*"([^"]*)"', content):
    v = m.group(1)
    if v and v != "null" and (len(v) != 11 or "\\" in v):
        issues["critical"].append(f"Malformed vid: '{v}'")

# ── CHECK 5: Empty blocks during LIGHT ──
light_null = set(re.findall(r'"([^"]+)":\s*\{[^}]*light:\s*null', rm, re.DOTALL))
for struct in ["tier6OverridesA","tier6OverridesB"]:
    chunk = const_chunk(struct)
    for bm in re.finditer(r'name:\s*"([A-H]\d?\.\s[^"]+)"[^{]*exercises:\s*\[(.*?)\]', chunk, re.DOTALL):
        block, exs = bm.group(1), re.findall(r'name:\s*"([^"]+)"', bm.group(2))
        if exs and all(e.replace("\\'","'") in light_null for e in exs):
            issues["info"].append(f"Empty during LIGHT {struct}/{block}")

# ── CHECK 6: Warm-up adequacy ──
for struct in ["tier6OverridesA","tier6OverridesB"]:
    chunk = const_chunk(struct)
    for d in DAYS:
        d_start = chunk.find(f"  {d}:")
        if d_start == -1: continue
        fb = re.search(r'name:\s*"A\d?\.\s[^"]+?".*?exercises:\s*\[(.*?)\]', chunk[d_start:], re.DOTALL)
        if fb:
            exs = re.findall(r'name:\s*"([^"]+)"', fb.group(1))
            if len(exs) < 2:
                issues["warning"].append(f"Thin warm-up {struct[-1]}/{d[:3]}: {len(exs)} ex")


# ── CHECK: same-VIDEO duplicates in a block under any condition (name-blind) ──
name_vid = {}
for m in re.finditer(r'name:\s*"([^"]+)"[^}]*?vid:\s*"([a-zA-Z0-9_-]{11})"', content, re.DOTALL):
    nm = m.group(1)
    if not re.match(r'^[A-H]\d?\.\s', nm):
        name_vid.setdefault(nm.replace("\\'","'"), m.group(2))

_rm = content[content.find("const rotationMap"):content.find("\n};", content.find("const rotationMap"))+3]
def _rot(nm, kind):
    mm = re.search(r'"' + re.escape(nm) + r'":\s*\{((?:[^{}]|\{[^{}]*\})*)\}', _rm, re.DOTALL)
    if not mm: return (nm, name_vid.get(nm))
    tm = re.search(kind + r':\s*(null|\{[^}]*\})', mm.group(1))
    if not tm: return (nm, name_vid.get(nm))
    if tm.group(1) == "null": return None
    n2 = re.search(r'name:\s*"([^"]+)"', tm.group(1))
    v2 = re.search(r'vid:\s*"([^"]+)"', tm.group(1))
    return (n2.group(1) if n2 else nm, v2.group(1) if v2 else name_vid.get(nm))

for _struct in ["workoutsA","workoutsB","tier6OverridesA","tier6OverridesB","recoveryWorkouts"]:
    _chunk = const_chunk(_struct)
    for _cond in ["normal","light","recovery"]:
        for _bm in re.finditer(r'name:\s*"([A-H]\d?\.\s[^"]+)"[^[]*exercises:\s*\[(.*?)\]', _chunk, re.DOTALL):
            _blk = _bm.group(1)
            _exs = re.findall(r'name:\s*"([^"]+)"', _bm.group(2))
            _seen = {}
            for _e in _exs:
                _e = _e.replace("\\'","'")
                if _cond == "normal":
                    _res = (_e, name_vid.get(_e))
                else:
                    _res = _rot(_e, _cond)
                if _res is None: continue
                _nm, _vd = _res
                if _vd and _vd in _seen:
                    _other = _seen[_vd]
                    _label = f"'{_other}' + '{_nm}'" if _other != _nm else f"'{_nm}' x2"
                    issues["critical"].append(f"Same-video dup {_struct}/{_blk} [{_cond}]: {_label} share vid {_vd}")
                if _vd: _seen[_vd] = _nm

# ── REPORT ──
print("="*60)
print("CARTHAGO : PRE-SHIP VALIDATOR")
print("="*60)
for level, color in [("critical","🔴"),("warning","🟡"),("info","🔵")]:
    items = issues[level]
    print(f"\n{color} {level.upper()}: {len(items)}")
    for it in items: print(f"   • {it}")

total_blocking = len(issues["critical"])
print("\n" + "="*60)
print(f"{'❌ DO NOT SHIP — fix critical issues' if total_blocking else '✅ SAFE TO SHIP'}")
print("="*60)

# ── OPTIONAL: Dead link check ──
if CHECK_LINKS:
    print("\nDEAD LINK CHECK (YouTube oEmbed)...")
    vids = set(re.findall(r'vid:\s*"([a-zA-Z0-9_-]{11})"', content))
    dead = []
    for v in sorted(vids):
        try:
            url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={v}&format=json"
            urllib.request.urlopen(url, timeout=5)
        except urllib.error.HTTPError as e:
            if e.code in (401,403,404): dead.append(v)
        except: pass
    if dead:
        print(f"  🔴 {len(dead)} DEAD VIDEOS:")
        for v in dead:
            names = set(re.findall(rf'name:\s*"([^"]+)"[^}}]*?vid:\s*"{v}"', content, re.DOTALL))
            print(f"     {v} — {names}")
    else:
        print(f"  ✅ All {len(vids)} videos live")
    if dead:
        sys.exit(1)

if total_blocking:
    sys.exit(1)
