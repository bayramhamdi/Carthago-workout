// CARTHAGO : donnees du programme (seances, exercices, rotations, planning, nutrition). Charge avant le script de l'app.
// Constantes globales partagees avec le script de index.html (meme portee lexicale globale). Aucune dependance React.
const days = [
  { name: "MONDAY", subtitle: "PULL — Deadlift + Back", type: "training" },
  { name: "TUESDAY", subtitle: "BJJ", type: "fight" },
  { name: "WEDNESDAY", subtitle: "PUSH — Bench + Shoulders", type: "training" },
  { name: "THURSDAY", subtitle: "Muay-Thaï", type: "fight" },
  { name: "FRIDAY", subtitle: "LEGS — Squat + Carry", type: "training" },
  { name: "SATURDAY", subtitle: "ARMS + MOBILITY + STRETCH", type: "training" },
  { name: "SUNDAY", subtitle: "Full Rest", type: "rest" },
  { name: "CUSTOM", subtitle: "Pick Your Focus", type: "custom" },
  { name: "STANDARD", subtitle: "Performance Benchmarks", type: "standard" }
];

// Vacation blocks mapped to specific dates for calendar highlighting
const vacationData = [
  { name: "Summer Break 2026", emoji: "\u2600\uFE0F", color: "var(--full)", start: "2026-07-04", end: "2026-08-16", vacDays: 0 },
  { name: "Fall Toussaint", emoji: "\uD83C\uDFD6\uFE0F", color: "var(--light)", start: "2026-10-03", end: "2026-10-18", vacDays: 5 },
  { name: "Christmas Mega", emoji: "\uD83C\uDF84", color: "var(--recovery)", start: "2026-12-24", end: "2027-01-10", vacDays: 0 },
  { name: "Winter Ski", emoji: "\uD83C\uDFD4\uFE0F", color: "#4FC3F7", start: "2027-02-13", end: "2027-02-21", vacDays: 5 },
  { name: "Easter Giga Bridge", emoji: "\uD83C\uDF38", color: "#FF7043", start: "2027-03-26", end: "2027-04-11", vacDays: 4 },
  { name: "Ascension Bridge", emoji: "\u26F0\uFE0F", color: "var(--ember)", start: "2027-05-05", end: "2027-05-09", vacDays: 2 },
  { name: "Summer Balkans", emoji: "\uD83D\uDE90", color: "var(--full)", start: "2027-07-10", end: "2027-07-25", vacDays: 10 }
];

// Check if a date falls within a vacation
function getVacationForDate(d) {
  if (!d) return null;
  const dStr = d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
  return vacationData.find(v => dStr >= v.start && dStr <= v.end) || null;
}

// Custom session exercise library by body part
const customLib = {
  shoulders: { label: "Shoulders", icon: "\uD83D\uDEE1\uFE0F", color: "#1565C0", exercises: [
    { name: "Shoulder CARs", detail: "Slow controlled circles. Full range of motion.", track: "Reps", vid: "ZOP6RPjdAhA", dr: 8 },
    { name: "Banded External Rotation", detail: "8 reps each arm. Rotator cuff activation.", track: "Reps", vid: "7DqYesMRkzU", dr: 8 },
    { name: "Shoulder Angels", detail: "10 reps. Back against wall, arms up and down.", track: "Reps", vid: "Nkla4hz-1Q8", dr: 10 },
    { name: "Crawl Shoulder Tap", detail: "8 reps each arm. Shoulder stability.", track: "Reps", vid: "cMeBUqa4d3E", dr: 8 },
    { name: "Kneeling T-Spine with Shoulder Opener", detail: "8 reps each side.", track: "Reps", vid: "LnLsZ2gZUK4", dr: 8 },
    { name: "Banded Face Pulls with ER Focus", detail: "8 reps. Squeeze shoulder blades, external rotate.", track: "Reps", vid: "sQL4qGLDhX4", dr: 8 },
    { name: "TRX Facepull", detail: "8 reps. Squeeze shoulder blades.", track: "Reps", vid: "PoBbZrY9zTE", dr: 8 },
    { name: "Shoulder Arm Bar", detail: "5 reps each side. Shoulder stability under load.", track: "Reps + Weight", vid: "g2EhWlBX_Qw", dr: 5 },
    { name: "Banded Needle Through", detail: "8 reps each side. Thread arm under body with band tension.", track: "Reps", vid: "1uRNvra9LLk", dr: 8 },
    { name: "Banded Rotations", detail: "8 reps each side. Controlled rotation under band resistance.", track: "Reps", vid: "ViWJ1u2u4d0", dr: 8 },
    { name: "Shoulder Airplanes", detail: "6 reps each side. Hinged rotation. Balance + stability.", track: "Reps", vid: "T9j_ArUIxWw", dr: 6 },
    { name: "Face Pull with External Rotation", detail: "10 reps. Pull to face then rotate out. Full rear delt + rotator cuff.", track: "Reps", vid: "m8s7cblgdDQ", dr: 10 },
    { name: "Overhead Banded Shoulder Perturbations", detail: "20 sec each arm. Hold weight overhead, resist band shaking.", track: "Seconds", vid: "pp5yEKD3udc", dr: 20 },
    { name: "Shoulder Upright Isometric Hold", detail: "20 sec each arm. Isometric stability. Lock it in.", track: "Seconds", vid: "SCr3DEwIu_0", dr: 20 },
    { name: "Banded Shoulder External Rotation with Arm Behind", detail: "12 reps each side. Arm behind low back, band external rotation. Posterior cuff angle.", track: "Reps", vid: "tJDOsft6JJE", dr: 12 },
    { name: "DB Lateral Raises", detail: "8 reps. Moderate weight. Shoulder width.", track: "Reps + Weight", vid: "KkynA3FpkhE", dr: 8 },
    { name: "Half Kneeling SA Landmine Press", detail: "8 reps each side. Unilateral overhead.", track: "Reps + Weight", vid: "fx6lSVNvu-4", dr: 8 },
    { name: "Landmine Push Press", detail: "8 reps each side. Explosive angled press.", track: "Reps + Weight", vid: "PpMoR20QJQg", dr: 8 },
    { name: "Rotational Landmine Clean and Press", detail: "6 reps each side. Full body rotational power.", track: "Reps + Weight", vid: "bZRXZZXOEdQ", dr: 6 },
    { name: "Seated Dumbbell Shoulder Press", detail: "8 reps. Strict. Full ROM.", track: "Reps + Weight", vid: "AyFtEJiEFWc", dr: 8 },
    { name: "Shoulder Hovers", detail: "10 reps. Prone, hover arms. Scapular retraction.", track: "Reps", vid: "A0KY0DKZ1h4", dr: 10 },
    { name: "Spider Crawls", detail: "8 reps each side. Hands walk up the wall, control the descent. Scapular control + shoulder stability.", track: "Reps", vid: "ZpsDv8EONdc", dr: 8 },
    { name: "Posterior Capsule Stretch", detail: "30 sec each side. Cross-body shoulder.", track: "Seconds", vid: "a4ihXemdOZY", dr: 30 },
    { name: "Seated ER Stretch", detail: "30 sec each side. External rotation.", track: "Seconds", vid: "h6_gNo5Cd4Q", dr: 30 }
  ]},
  knees: { label: "Knees", icon: "\uD83E\uDDB5", color: "var(--full)", exercises: [
    { name: "Banded Terminal Knee Extension", detail: "15 reps each leg. Light band warm-up. Prime the VMO.", track: "Reps", vid: "CU7Fn11YMTw", dr: 15 },
    { name: "Poliquin Step Down with TKE", detail: "8 reps each leg. Slow eccentric.", track: "Reps", vid: "xFKCoWuP94Y", dr: 8 },
    { name: "Step Up with TKE", detail: "8 reps each leg.", track: "Reps", vid: "4cauIKTDIrk", dr: 8 },
    { name: "ISO Squat Hold", detail: "30 sec hold. Wall sit or free standing.", track: "Seconds", vid: "OpiE9QGKfuo", dr: 30 },
    { name: "Front Foot Elevated Split Jumps", detail: "5 reps each leg. Explosive but controlled.", track: "Reps", vid: "3qCQQl-fpOQ", dr: 5 },
    { name: "Hip Hike", detail: "10 reps each side. Stand on step, glute med.", track: "Reps", vid: "LOYtT-BRGdY", dr: 10 },
    { name: "Ankle Mobility", detail: "8 reps each side.", track: "Reps", vid: "qXvA35UHs2w", dr: 8 },
    { name: "Reverse Sled Drag", detail: "20m. Walk backwards pulling sled. VMO + knee.", track: "Dist + Weight", vid: "wa3tZH_yaRY", dr: 20 },
    { name: "Banded Hamstring Curls", detail: "12 reps. Prone, curl band toward glutes. Knee flexion.", track: "Reps", vid: "gTVC0qZJLzk", dr: 12 },
    { name: "TRX Jump Squat", detail: "5 reps. Hold TRX, assisted explosive jump. Gentle landing, knee-friendly power.", track: "Reps", vid: "o0b5XFfd0wQ", dr: 5 },
    { name: "BW Knee Extension (Reverse Nordic)", detail: "6-8 reps. Kneel, lean back with hips locked. Eccentric quad loading at long muscle length.", track: "Reps", vid: "5ZCgazq6Emk", dr: 8 },
    { name: "BACK SQUAT", detail: "4 reps. RPE 8. Benchmark lift.", track: "Reps + Weight", key: true, vid: "pWWBjAvJuoA", dr: 4 },
    { name: "Rear Foot Elevated Split Squat", detail: "8 reps each leg. Back foot on bench.", track: "Reps + Weight", vid: "um_OOswiPS4", dr: 8 },
    { name: "Skater Squat", detail: "6 reps each leg. Single-leg squat, opposite leg behind.", track: "Reps", vid: "xa2Dy8fyN1Q", dr: 6 },
    { name: "Dumbbell Lateral Squat Drop In", detail: "8 reps each side.", track: "Reps + Weight", vid: "O62PpPfpsis", dr: 8 },
    { name: "Seated Box Jump", detail: "5 reps. Dead stop. Explode. Broad jump builder.", track: "Reps", vid: "_vs2m-8NHTI", dr: 5 },
    { name: "Elevated Heels Deep Squat Opener", detail: "5 reps. Heels on plate. Slow eccentric. Squat warm-up.", track: "Reps", vid: "jKED44TDKIE", dr: 5 },
    { name: "Sled Push", detail: "30 steps. Heavy. Full body conditioning.", track: "Dist + Weight", vid: "t68aeTBXZ7s", dr: 30 }
  ]},
  hips: { label: "Hips", icon: "\uD83D\uDD04", color: "#FF6B35", exercises: [
    { name: "Banded Hip Distraction", detail: "30 sec each side. Ease in/out, push into extension.", track: "Seconds", vid: "mDUrMKDZS-U", dr: 30 },
    { name: "Hip Flexor Plank", detail: "20 sec each leg. Hold knee up in plank.", track: "Seconds", vid: "WCkrF6B4sdg", dr: 20 },
    { name: "Hip Flexor Loaded Arc Reach", detail: "8 reps each leg. KB eccentric.", track: "Reps + Weight", vid: "LuNnBWO8wZ8", dr: 8 },
    { name: "Adductor Rock to Hip Walk Out", detail: "8 reps. Open hips.", track: "Reps", vid: "JvQzXBr8sPQ", dr: 8 },
    { name: "Glute Mobilization", detail: "8 reps each leg.", track: "Reps", vid: "5vyJa0vXo7c", dr: 8 },
    { name: "Shin Box Fold", detail: "8 reps. Hip rotation.", track: "Reps", vid: "A9vhRbwH2Sw", dr: 8 },
    { name: "Hip Airplane", detail: "6 reps each leg. Single leg rotation.", track: "Reps", vid: "AA8zZh8Iz9I", dr: 6 },
    { name: "Figure 4 Flow", detail: "8 reps each side. Deep hip rotators.", track: "Reps", vid: "GAjN5llpzrE", dr: 8 },
    { name: "Hip Flexor Rock Back", detail: "6 reps each leg. Open hip flexors.", track: "Reps", vid: "a5kTnLk1Dks", dr: 6 },
    { name: "Facing Wall Hip Circle Rotations", detail: "8 reps each direction.", track: "Reps", vid: "odvEl4NkZuo", dr: 8 },
    { name: "Banded Split Squat Drifts", detail: "8 reps each leg. Hip activation.", track: "Reps", vid: "ynGQy_GOfrQ", dr: 8 },
    { name: "Leg Swings \u2014 Front/Back + Lateral", detail: "10 reps front/back each leg, then 10 reps lateral each leg. Full hip mobility.", track: "Reps", vid: "wF10oYsLUw0", dr: 10 },
    { name: "TRAP BAR DEADLIFT", detail: "6 reps. RPE 8. Benchmark lift.", track: "Reps + Weight", key: true, vid: "nZ4T7DPGa2g", dr: 6 },
    { name: "Single-Leg RDL", detail: "8 reps each leg. Slow hinge. Hamstring + glute focus.", track: "Reps + Weight", vid: "s32cCgmRV3I", dr: 8 },
    { name: "Single Leg Hinge KB Swing", detail: "5 reps each leg. Explosive single leg hip drive. Control the landing.", track: "Reps + Weight", vid: "VRnk5QEBevI", dr: 5 },
    { name: "Kettlebell Swing", detail: "6 reps. Hip hinge power. Explosive.", track: "Reps + Weight", vid: "moK1eINw7NY", dr: 6 },
    { name: "Hamstring Bridge with Pullover", detail: "10 reps. Bridge + DB pullover. Posterior chain.", track: "Reps + Weight", vid: "cU2YDlDA8Dw", dr: 10 },
    { name: "Banded Hip External Rotation (Seated)", detail: "15 reps. Seated, band above knees, drive knees apart and control back. Hip external rotators.", track: "Reps", vid: "GH_IQsyOKwI", dr: 15 },
    { name: "Banded Side-Lying Hip Abduction", detail: "12 reps each side. Lie on side, band on thighs, lift top leg slow. Glute medius for knee tracking.", track: "Reps", vid: "TCjssGsibKU", dr: 12 },
    { name: "Heel Clicks", detail: "8 reps. Prone, click heels. Glute + adductor activation.", track: "Reps", vid: "bBtfjTVPkus", dr: 8 },
    { name: "Dumbbell Snatch", detail: "6 reps each arm. Explosive single-arm power.", track: "Reps + Weight", vid: "-px4XoSZr1g", dr: 6 }
  ]},
  grip: { label: "Grip", icon: "\u270A", color: "#E65100", exercises: [
    { name: "Dead Hang", detail: "Max hold. Hang until you drop.", track: "Seconds", vid: "XPcT3capkyk", dr: 0 },
    { name: "Plate Pinch Hold", detail: "Max hold. Pinch two plates together.", track: "Seconds", vid: "woJifu7hSD8", dr: 0 },
    { name: "Dynamic Sled Row", detail: "20m. Pull sled toward you.", track: "Dist + Weight", vid: "xdOhwytr0M8", dr: 20 },
    
    { name: "Suitcase Carry", detail: "20m each hand. Anti-lateral flexion.", track: "Dist + Weight", vid: "iTjwbts8Djw", dr: 20 },
    { name: "FARMER'S CARRY", detail: "175ft (53m) at bodyweight. Benchmark.", track: "Dist + Weight", key: true, vid: "fPwwaXCgDNE", dr: 175 },
    { name: "KB Bottoms-Up Carry", detail: "20m each side. Bell upside down, walk tall and controlled. Shoulder stability + cuff. Start light.", track: "Reps", vid: "wtBDkYRHlr4", dr: 20 },
    { name: "Towel Kettlebell Carry", detail: "20 steps. Towel over KB handle. Grip + carry.", track: "Dist + Weight", vid: "NEkUGE_gOLg", dr: 20 }
  ]},
  forearms: { label: "Forearms", icon: "\uD83D\uDCAA", color: "var(--ember)", exercises: [
    { name: "Forearm Twist + Curl with Towel", detail: "12 reps. Rotate palm up under load.", track: "Reps + Weight", vid: "Bc3qLJnYwkI", dr: 12 },
    { name: "Forearm Pronation Curl", detail: "12 reps. Rotate palm down.", track: "Reps + Weight", vid: "6eAuMx5M0ho", dr: 12 },
    { name: "Wrist Roller", detail: "Roll up and down. Forearm pump.", track: "Reps", vid: "8ARDRJjhnSw", dr: 4 },
    { name: "Kettlebell Forearm Rotation", detail: "8 reps each direction. Hold KB by handle, rotate forearm in/out. Controlled tempo.", track: "Reps + Weight", vid: "FwCuyV208bU", dr: 8 },
    { name: "Seated DB Wrist Curl", detail: "8 reps. Palm up, forearm on knee, curl wrist. Forearm flexor.", track: "Reps + Weight", vid: "y-x14sVi12o", dr: 8 },
    { name: "Seated DB Reverse Wrist Curl", detail: "8 reps. Palm down, forearm on knee, extend wrist up. Forearm extensor.", track: "Reps + Weight", vid: "cRLJ86m00cU", dr: 8 }
  ]},
  neck: { label: "Neck", icon: "\uD83E\uDDB4", color: "#00897B", exercises: [
    { name: "Neck Circles", detail: "Slow controlled circles. 5 each direction.", track: "Reps", vid: "9zP1BHF5eqQ", dr: 5 },
    { name: "Barbell Trap & Neck Release", detail: "Roll barbell on traps/neck. Self-myofascial release.", track: "Seconds", vid: "S19RfrYqlsk", dr: 30 },
    { name: "Neck Bridge", detail: "Hold bridge position. Build neck strength progressively.", track: "Seconds", vid: "kgFFqbiqvW8", dr: 20 },
    { name: "Neck Lateral Band Resistance", detail: "8 reps each side. Band on side of head, resist lateral flexion.", track: "Reps", vid: "QEayGbDM1Do", dr: 8 },
    { name: "Neck Prone ROM & Strengthening", detail: "8 reps. Face down, controlled range of motion.", track: "Reps", vid: "cjIDKy6z3zY", dr: 8 },
    { name: "Neck Supine ROM & Strengthening", detail: "8 reps. Face up, controlled range of motion.", track: "Reps", vid: "Gxu9U-8NKes", dr: 8 },
    { name: "Neck Rotations", detail: "8 reps each direction. Slow, full ROM. Neck mobility.", track: "Reps", vid: "Fx4LvjovL_k", dr: 8 }
  ]},
  stretch: { label: "Stretch", icon: "\uD83E\uDDD8", color: "#009688", exercises: [
    { name: "Loaded Lat Stretch", detail: "30 sec each side. Hang from bar or rack.", track: "Seconds", vid: "9Pik5qPNgCo", dr: 30 },
    { name: "Seated Hip Stretch", detail: "30 sec each side.", track: "Seconds", vid: "VtcR9kUn5v8", dr: 30 },
    { name: "Deep Chest Stretch ISO", detail: "30 sec each side. Doorway or rack.", track: "Seconds", vid: "bbCEt0kphkA", dr: 30 },
    { name: "On Bench Lat Stretch to Hip Stretch", detail: "30 sec each side. Two stretches in one.", track: "Seconds", vid: "NmohIiacpK0", dr: 30 },
    { name: "Hip Flexor Rock Back", detail: "6 reps each leg. Open hip flexors.", track: "Reps", vid: "a5kTnLk1Dks", dr: 6 },
    { name: "Figure 4 Flow", detail: "8 reps each side. Deep hip rotators.", track: "Reps", vid: "GAjN5llpzrE", dr: 8 },
    { name: "Band Assisted Straight Leg Raise", detail: "8 reps each leg. Hamstring stretch under band tension.", track: "Reps", vid: "Wnhc8hsTtpI", dr: 8 }
  ]},
  chest: { label: "Chest", icon: "\uD83E\uDEC1", color: "var(--recovery)", exercises: [
    { name: "Weighted Push Up", detail: "8 reps. Plate on back or vest.", track: "Reps + Weight", vid: "auh9bmLsvUs", dr: 8 },
    { name: "Plyo Push-Up", detail: "5 reps. Explode off the floor, hands leave ground. Horizontal push power.", track: "Reps", vid: "zHqxyD9_364", dr: 5 },
    { name: "Standing Banded Pec Fly", detail: "10 reps. Squeeze at center.", track: "Reps", vid: "BUOVM8nMeIE", dr: 10 },
    { name: "Push-Up to Toe Touch", detail: "8 reps. Push-up then reach to opposite toe.", track: "Reps", vid: "L-K771jlxXE", dr: 8 },
    { name: "Push-Up to Pike", detail: "8 reps. Overhead mobility.", track: "Reps", vid: "oNj5I72Yskg", dr: 8 },
    { name: "Incline DB Press", detail: "8 reps. 30° incline. Upper chest focus.", track: "Reps + Weight", vid: "G1mCi5idEbk", dr: 8 },
    { name: "Banded Push-Up", detail: "10 reps. Band across back for added resistance at lockout.", track: "Reps", vid: "RYV6D14cI0s", dr: 10 },
    { name: "Deep Chest Stretch ISO", detail: "30 sec each side. Doorway or rack.", track: "Seconds", vid: "bbCEt0kphkA", dr: 30 },
    { name: "BENCH PRESS", detail: "4 reps. RPE 8. Benchmark lift.", track: "Reps + Weight", key: true, vid: "5lrpyee_asw", dr: 4 },
    { name: "Close Grip Barbell Bench Press", detail: "12 reps. Narrow grip. Tricep emphasis compound.", track: "Reps + Weight", key: true, vid: "Inj9b3jhREY", dr: 12 }
  ]},
  back: { label: "Back", icon: "\uD83D\uDD19", color: "#1565C0", exercises: [
    { name: "Pull-Ups", detail: "8 reps. Strict form.", track: "Reps", vid: "PbfFblcxWSo", dr: 8 },
    { name: "Inverted Row", detail: "8 reps. Ring or barbell. Squeeze scaps.", track: "Reps", vid: "pIMXcgvVg3U", dr: 8 },
    { name: "Anti-Rotational Bear Row", detail: "8 reps each arm. Quadruped position.", track: "Reps + Weight", vid: "khcHYAUb7CM", dr: 8 },
    { name: "Lat Sweep", detail: "8 reps each side. Cable or band.", track: "Reps", vid: "zdTbE1yHygQ", dr: 8 },
    { name: "Dynamic Sled Row", detail: "20m. Pull sled toward you.", track: "Dist + Weight", vid: "xdOhwytr0M8", dr: 20 },
    { name: "Band Pull Aparts", detail: "15 reps. Upper back activation.", track: "Reps", vid: "SuvO4TBwSu4", dr: 15 },
    { name: "Loaded Lat Stretch", detail: "30 sec each side. Hang from bar or rack.", track: "Seconds", vid: "9Pik5qPNgCo", dr: 30 },
    { name: "Chin Up", detail: "4 reps. 3 sec eccentric lowering. Supinated grip. Eccentric overload.", track: "Reps", vid: "jIvbJzs1V4I", dr: 4 },
    { name: "KB Vertical Pull", detail: "8 reps. Floor to overhead. Explosive pull.", track: "Reps + Weight", vid: "S7jLS4f2FTI", dr: 8 },
    { name: "Lateral Bridge with Row", detail: "8 reps each side. Side plank + row. Anti-rotation + pull.", track: "Reps + Weight", vid: "kiBDuPbWg2A", dr: 8 },
    { name: "Renegade Row", detail: "8 reps each side. Row from plank position. Fight the hip rotation.", track: "Reps + Weight", vid: "Q28cLuweLv4", dr: 8 },
    { name: "Single-Arm DB Row", detail: "8 reps each side. Strict unilateral row. Brace the core.", track: "Reps + Weight", vid: "i9BJwVCK5VQ", dr: 8 }
  ]},
  core: { label: "Core", icon: "\uD83C\uDFAF", color: "#FF6B35", exercises: [
    { name: "PLANK", detail: "60 sec hold. Benchmark.", track: "Seconds", key: true, vid: "8IwGcPsPpkw", dr: 60 },
    { name: "Deadbug", detail: "8 reps each leg. Keep low back pressed to floor.", track: "Reps", vid: "rvNkdS3qAyM", dr: 8 },
    { name: "Plank Kettlebell Saw", detail: "8 reps. Plank, slide KB side to side.", track: "Reps + Weight", vid: "KSNVUPybktI", dr: 8 },
    { name: "Loaded Leg Lifts", detail: "8 reps. Hang or lie. Controlled.", track: "Reps + Weight", vid: "PpZxg66ftYc", dr: 8 },
    { name: "Dumbbell Diagonal Chop", detail: "8 reps each side. Anti-rotation power.", track: "Reps + Weight", vid: "At6-Mna8za8", dr: 8 },
    { name: "Side Bridge Abduction from Elbow", detail: "8 reps. Side plank + top leg lift.", track: "Reps", vid: "ps9A_IO36b0", dr: 8 },
    { name: "Side Bridge Adductor March", detail: "8 reps. Side plank on bottom leg, march top.", track: "Reps", vid: "jY-9b4ZD-nc", dr: 8 },
    { name: "Pallof Press", detail: "8 reps each side. Band or cable anti-rotation.", track: "Reps", vid: "99evyH71IWs", dr: 8 },
    { name: "Med Ball Rotational Throw", detail: "5 reps each side. Explosive rotational power.", track: "Reps", vid: "02c2YLgF8iE", dr: 5 },
    { name: "Med Ball Slam", detail: "5 reps. Explosive slam, full extension to floor.", track: "Reps", vid: "CkO1mfSBvv4", dr: 5 },
    { name: "Rotational Banded Punch", detail: "8 reps each side. Muay Thaï transfer.", track: "Reps", vid: "UKsjca_cNUs", dr: 8 },
    { name: "Cat Camel Diagonal", detail: "6 reps. Slow spinal mobility.", track: "Reps", vid: "JrcOPzvdToQ", dr: 6 },
    { name: "Birddog to Gecko", detail: "6 reps each side. Crawl pattern + stability.", track: "Reps", vid: "ISp9hRUQQ3M", dr: 6 },
    { name: "Crawl to Kick Through", detail: "6 reps each side. Coordination.", track: "Reps", vid: "wqt9IdcUxig", dr: 6 }
  ]},
  arms: { label: "Arms", icon: "\uD83E\uDDBE", color: "var(--ember)", exercises: [
    { name: "DIPS", detail: "8 reps. Controlled descent. Tricep focus.", track: "Reps + Weight", key: true, vid: "0326dy_-CzM", dr: 8 },
    { name: "Incline DB Curl", detail: "8 reps. Incline bench, full stretch at bottom.", track: "Reps + Weight", vid: "aTYlqC_JacQ", dr: 8 },
    { name: "Overhead Tricep Extension", detail: "10 reps. Cable or DB.", track: "Reps + Weight", vid: "T3e390Dl3XU", dr: 10 },
    { name: "Hammer Curl", detail: "8 reps. Neutral grip. Brachialis + forearm.", track: "Reps + Weight", vid: "0qzSDAfBzSw", dr: 8 },
    { name: "Zottman Curl", detail: "8 reps. Curl up supinated, lower pronated. Bicep + forearm.", track: "Reps + Weight", vid: "ZrpRBgswtHs", dr: 8 },
    { name: "Barbell Bicep Curl", detail: "10 reps. Strict form. No swing.", track: "Reps + Weight", vid: "yRMQoSLOl6g", dr: 10 },
    { name: "Isolated Bicep Supinated Curl", detail: "12 reps each arm. Full supination at top.", track: "Reps + Weight", vid: "I_bKCYL2nL8", dr: 12 },
    { name: "Single-Arm Tricep Extension", detail: "8 reps each arm. Overhead or kickback.", track: "Reps + Weight", vid: "VgjAgAKaSPM", dr: 8 },
    { name: "Tricep Dive Ins with Rope", detail: "10 reps. Full extension squeeze.", track: "Reps + Weight", vid: "DrnY3A9p4Cs", dr: 10 }
  ]},
  ankles: { label: "Ankles", icon: "\uD83E\uDDB6", color: "#00897B", exercises: [
    { name: "Ankle Mobility (Wall)", detail: "8 reps each side. Knee over toe, drive forward.", track: "Reps", vid: "odvEl4NkZuo", dr: 8 },
    { name: "Loaded SL Calf Raise", detail: "12 reps each leg. Full range, pause at bottom.", track: "Reps + Weight", vid: "wZfr_svtSr0", dr: 12 },
    { name: "Ankle CARs", detail: "5 slow circles each direction, each ankle.", track: "Reps", vid: "UVtCSGJmGEY", dr: 5 },
    { name: "Banded Ankle Dorsiflexion", detail: "10 reps each side. Band pulls tibia forward.", track: "Reps", vid: "v-cxqr5OKEk", dr: 10 },
  ]},
  calves: { label: "Calves", icon: "\uD83C\uDFC3", color: "#546E7A", exercises: [
    { name: "Loaded SL Calf Raise", detail: "12 reps each leg. Full range, pause at bottom.", track: "Reps + Weight", vid: "wZfr_svtSr0", dr: 12 },
    { name: "Seated Calf Raise", detail: "12 reps. Weight on knees. Soleus focus.", track: "Reps + Weight", vid: "JbyjNymZOt0", dr: 12 },
    { name: "Eccentric Calf Drop", detail: "10 reps. Rise on both, lower on one. Achilles health.", track: "Reps", vid: "BaPKay895ks", dr: 10 },
  ]}
};

// ═══ EXERCISE ROTATION MAP ═══
// Keyed by exercise name. When condition = "light" → show light variant.
// When condition = "recovery" → show recovery variant (or null = skip).
// Cycle 1-2 (FULL/BUILD): default exercises
// Cycle 3-4 (LIGHT/MAINTAIN): light alternatives (same pattern, different angle)
// Cycle 5 (RECOVERY): rehab/mobility variants or null (skip)
const rotationMap = {
  "Rotational Banded Punch": { light: null, recovery: null },
  "Behind-Neck Pull-Ups": { light: null, recovery: null },
  "TRX Jump Squat": { light: null, recovery: null },
  "Landmine Push Press": { light: null, recovery: null },
  "Plyo Push-Up": { light: null, recovery: null },
  // ─── MONDAY PULL ───
  "Lat Sweep": {
    light: { name: "Band Pull Aparts", detail: "15 reps. Upper back activation. Light, high-rep.", track: "Reps", vid: "SuvO4TBwSu4", dr: 15 },
    recovery: { name: "Shoulder CARs", detail: "5 slow circles each direction. Full shoulder ROM.", track: "Reps", vid: "ZOP6RPjdAhA", dr: 5 }
  },
  "TRX Facepull": {
    light: { name: "Face Pull with External Rotation", detail: "10 reps. Band face pull with pause at external rotation.", track: "Reps", vid: "m8s7cblgdDQ", dr: 10 },
    recovery: { name: "Shoulder Angels", detail: "8 reps. Wall angels, full scapular control.", track: "Reps", vid: "Nkla4hz-1Q8", dr: 8 }
  },
  "Dynamic Sled Row": {
    light: { name: "TRX Row", detail: "8 reps. Bodyweight horizontal pull. Squeeze scaps.", track: "Reps", vid: "fAwrRJu5tw0", dr: 8 },
    recovery: null
  },

  // ─── PUSH (TUESDAY) ───
  "Weighted Push Up": {
    light: { name: "Banded Push-Up", detail: "10 reps. Band across back for variable resistance.", track: "Reps", vid: "RYV6D14cI0s", dr: 10 },
    recovery: { name: "Push-Up to Toe Touch", detail: "8 reps. Push-up then reach to opposite toe. Core + push.", track: "Reps", vid: "L-K771jlxXE", dr: 8 }
  },
  "Standing Banded Pec Fly": {
    light: null,
    recovery: null
  },
  "Plank Kettlebell Saw": {
    light: { name: "Pallof Press", detail: "8 reps each side. Band anti-rotation. Standing.", track: "Reps", vid: "99evyH71IWs", dr: 8 },
    recovery: { name: "Shoulder Upright Isometric Hold", detail: "20 sec each arm. Light weight, overhead stability.", track: "Seconds", vid: "SCr3DEwIu_0", dr: 20 }
  },
  "Dumbbell Diagonal Chop": {
    recovery: { name: "Banded Needle Through", detail: "8 reps each side. Thread arm under body. T-spine mobility.", track: "Reps", vid: "1uRNvra9LLk", dr: 8 }
  },
  "Plate Pinch Hold": {
    light: null,
    recovery: null
  },

  // ─── LEGS (THURSDAY) + MOBILITY (SATURDAY) ───
  "Seated Box Jump": {
    light: null,
    recovery: null
  },
  "Suitcase Carry": {
    light: null,
    recovery: null
  },
  "Reverse Sled Drag": {
    light: null,
    recovery: { name: "Banded Ankle Dorsiflexion", detail: "10 reps each side. Band pulls tibia forward.", track: "Reps", vid: "v-cxqr5OKEk", dr: 10 }
  },
  "Loaded SL Calf Raise": {
    light: { name: "Eccentric Calf Drop", detail: "10 reps. Rise on both, lower on one. Achilles health.", track: "Reps", vid: "BaPKay895ks", dr: 10 },
    recovery: { name: "Seated Calf Raise", detail: "12 reps. Weight on knees. Soleus focus. Light.", track: "Reps + Weight", vid: "JbyjNymZOt0", dr: 12 }
  },
  "Ankle Mobility": {
    light: null,
    recovery: { name: "Banded Ankle Dorsiflexion", detail: "10 reps each side. Band pulls tibia forward.", track: "Reps", vid: "v-cxqr5OKEk", dr: 10 }
  },
  "Incline Walk": {
    light: { name: "Incline Walk", detail: "10 min. Light pace. Active recovery.", track: "Minutes", vid: null, dr: 10 },
    recovery: { name: "Incline Walk", detail: "10 min. Easy pace.", track: "Minutes", vid: null, dr: 10 }
  },

  // ─── ARMS (FRIDAY) + MOBILITY (SATURDAY) ───
  "Close Grip Barbell Bench Press": {
    light: { name: "Banded Push-Up", detail: "10 reps. Band across back. Lighter push compound.", track: "Reps", vid: "RYV6D14cI0s", dr: 10 },
    recovery: { name: "Banded Push-Up", detail: "10 reps. Band across back. Tricep + chest.", track: "Reps", vid: "RYV6D14cI0s", dr: 10 }
  },
  "Tricep Dive Ins with Rope": {
    light: null,
    recovery: null
  },
  "Barbell Bicep Curl": {
    light: { name: "Incline DB Curl", detail: "8 reps. Incline bench, full stretch at bottom.", track: "Reps + Weight", vid: "aTYlqC_JacQ", dr: 8 },
    recovery: { name: "Zottman Curl", detail: "8 reps. Curl up supinated, lower pronated. Light.", track: "Reps + Weight", vid: "ZrpRBgswtHs", dr: 8 }
  },
  "Forearm Twist + Curl with Towel": {
    light: { name: "Forearm Pronation Curl", detail: "10 reps. Isolated pronation under load.", track: "Reps + Weight", vid: "6eAuMx5M0ho", dr: 10 },
    recovery: null
  },
  "Isolated Forearm Dumbbell Front, Back, Side": {
    light: null,
    recovery: null
  },
  "Neck Rotations": {
    light: { name: "Neck Circles", detail: "5 slow circles each direction. Full ROM.", track: "Reps", vid: "9zP1BHF5eqQ", dr: 5 },
    recovery: { name: "Neck Supine ROM & Strengthening", detail: "8 reps. Face up, gentle nods and turns.", track: "Reps", vid: "Gxu9U-8NKes", dr: 8 }
  },
  "Deep Chest Stretch ISO": {
    recovery: { name: "Pec Doorway Stretch", detail: "30 sec each side. Doorway pec stretch, full extension.", track: "Seconds", vid: "W1WcacpQ_RM", dr: 30 }
  },
  "Loaded Lat Stretch": {},
  // ─── POWER + CORE (ALL DAYS) ───
  "Med Ball Rotational Throw": {
    light: null,
    recovery: null
  },
  "Hanging Knee Raise": {
    light: { name: "Deadbug", detail: "8 reps each side. Slow, controlled. Low back pressed to floor.", track: "Reps", vid: "rvNkdS3qAyM", dr: 8 },
    recovery: null
  },
  "Med Ball Slam": {
    light: null,
    recovery: null
  },
  "Pallof Press": {
    light: null,
    recovery: null
  },
  "Landmine Rotational Press": {
    light: { name: "Landmine Rotations", detail: "8 reps each side. Lighter rotation, no press.", track: "Reps + Weight", vid: "r4tfGcPWYuI", dr: 8 },
    recovery: null
  },
  "Front Foot Elevated Split Jumps": {
    light: { name: "Banded Split Squat Drifts", detail: "8 reps each side. Stability, not explosive.", track: "Reps", vid: "ynGQy_GOfrQ", dr: 8 },
    recovery: null
  },
  "Single Leg Hinge KB Swing": {
    light: null,
    recovery: null
  }
};

// ═══ v9 INNOVATION HELPERS ═══
let __swapIdx = null;
const blockKind = (bn) => String(bn || "").replace(/^[A-Z][0-9]?\.\s*/, "").toUpperCase().trim();
const SWAP_WORDS = ["CORE", "POWER", "SHOULDER", "PUSH", "PULL", "BACK", "ROW", "FOREARM", "NECK", "BICEP", "TRICEP", "KNEE", "POSTERIOR", "UNILATERAL", "CARRY", "CONDITIONING", "HIP", "STRETCH", "CALVES", "T-SPINE"];
const getSwapIndex = () => {
  if (__swapIdx) return __swapIdx;
  const idx = {};
  const scan = (obj) => { try { Object.values(obj || {}).forEach(d => ((d && d.blocks) || []).forEach(b => (b.exercises || []).forEach(ex => { if (!ex || !ex.name || ex.key) return; const k = blockKind(b.name); idx[k] = idx[k] || {}; if (!idx[k][ex.name]) idx[k][ex.name] = ex; }))); } catch (e) {} };
  [workoutsA, workoutsB, tier6OverridesA, tier6OverridesB].forEach(scan);
  __swapIdx = idx; return idx;
};
const patternOf = (n) => { const s = String(n || "").toLowerCase();
  if (/carry/.test(s)) return "Carry";
  if (/plank|pallof|chop|rotation|tilt|deadbug|dead bug|saw|birddog|leg lift|leg raise|hip flexion|knee raise|oblique|hollow|crunch|slam/.test(s)) return "Core";
  if (/deadlift|rdl|swing|hinge|bridge|hamstring|kang|nordic|good morning|hip thrust|snatch|clean/.test(s)) return "Hinge";
  if (/squat|lunge|split|step up|step down|box jump|jump|knee extension|skater|calf/.test(s)) return "Squat";
  if (/row|pull|chin|face pull|lat |lat$|pullover|shrug|hang|curl|rear delt|sweep|hover/.test(s)) return "Pull";
  if (/press|push|dip|fly|bench|pike|extension|tricep|raise|punch/.test(s)) return "Push";
  return null; };


// ═══ RECOVERY WEEK THERAPY SESSIONS ═══
// Week 5 of each macrocycle. Purpose-built therapy, not filtered training.
const recoveryWorkouts = {
  MONDAY: {
    title: "POSTERIOR CHAIN THERAPY",
    time: "~30 min",
    note: "Rebuild: spine decompression, lat/hamstring release, hip opening.",
    blocks: [{
      name: "A. SPINAL DECOMPRESSION",
      sets: 2,
      color: "#009688",
      exercises: [{
        name: "Dead Hang", detail: "30 sec. Spinal decompression.", track: "Seconds", vid: "XPcT3capkyk", dr: 30
      }, {
        name: "Cat Camel Diagonal", detail: "6 reps. Spinal segmental mobility.", track: "Reps", vid: "JrcOPzvdToQ", dr: 6
      }, {
        name: "Low Back Swivels", detail: "8 reps each side. Spinal rotation.", track: "Reps", vid: "gb5KeyG9i14", dr: 8
      }]
    }, {
      name: "B. HIP + HAMSTRING RELEASE",
      sets: 2,
      color: "var(--full)",
      exercises: [{
        name: "Banded Hip Distraction", detail: "30 sec each side. Joint decompression.", track: "Seconds", vid: "mDUrMKDZS-U", dr: 30
      }, {
        name: "Hip Flexor Rock Back", detail: "6 reps each leg. Open hip flexors.", track: "Reps", vid: "a5kTnLk1Dks", dr: 6
      }, {
        name: "Shin Box Fold", detail: "8 reps. Deep hip rotation.", track: "Reps", vid: "A9vhRbwH2Sw", dr: 8
      }]
    }, {
      name: "C. LAT + UPPER BACK RELEASE",
      sets: 2,
      color: "#1565C0",
      exercises: [{
        name: "Loaded Lat Stretch", detail: "30 sec each side. Hang from bar.", track: "Seconds", vid: "9Pik5qPNgCo", dr: 30
      }, {
        name: "On Bench Lat Stretch to Hip Stretch", detail: "30 sec. Flow between lat and hip.", track: "Seconds", vid: "NmohIiacpK0", dr: 30
      }, {
        name: "Birddog to Gecko", detail: "6 reps each side. Crawl pattern.", track: "Reps", vid: "ISp9hRUQQ3M", dr: 6
      }]
    }, {
      name: "D. JOINT HEALTH",
      sets: 1,
      color: "#E65100",
      exercises: [{
        name: "Banded External Rotation", detail: "10 reps each arm. Light. Rotator cuff.", track: "Reps", vid: "7DqYesMRkzU", dr: 10
      }, {
        name: "Ankle CARs", detail: "5 circles each direction, each ankle.", track: "Reps", vid: "UVtCSGJmGEY", dr: 5
      }]
    }]
  },
  TUESDAY: {
    title: "CORE + HIP THERAPY",
    time: "~35 min",
    note: "Rebuild: hip flexor release, core gentle mobility, light cardio.",
    blocks: [{
      name: "A. HIP OPENING",
      sets: 2,
      color: "var(--full)",
      exercises: [{
        name: "Facing Wall Hip Circle Rotations", detail: "8 reps each direction.", track: "Reps", vid: "odvEl4NkZuo", dr: 8
      }, {
        name: "Heel Clicks", detail: "10 reps. Prone, click heels. Glute activation.", track: "Reps", vid: "bBtfjTVPkus", dr: 10
      }, {
        name: "Hip Airplane", detail: "6 reps each leg. Single leg hip rotation.", track: "Reps", vid: "AA8zZh8Iz9I", dr: 6
      }]
    }, {
      name: "B. CORE GENTLE MOBILITY",
      sets: 2,
      color: "#FF6B35",
      exercises: [{
        name: "Deadbug", detail: "8 reps each side. Slow, controlled.", track: "Reps", vid: "rvNkdS3qAyM", dr: 8
      }, {
        name: "Figure 4 Flow", detail: "8 reps each side. Hip rotation + core.", track: "Reps", vid: "GAjN5llpzrE", dr: 8
      }, {
        name: "Crawl to Kick Through", detail: "6 reps each side. Coordination.", track: "Reps", vid: "wqt9IdcUxig", dr: 6
      }]
    }, {
      name: "C. STRETCH",
      sets: 1,
      color: "#009688",
      exercises: [{
        name: "Seated Hip Stretch", detail: "30 sec each side. Deep hip flexor release.", track: "Seconds", vid: "VtcR9kUn5v8", dr: 30
      }, {
        name: "Deep Chest Stretch ISO", detail: "30 sec each side. Doorway or rack.", track: "Seconds", vid: "bbCEt0kphkA", dr: 30
      }]
    }, {
      name: "D. LIGHT CARDIO",
      sets: 1,
      color: "#37474F",
      exercises: [{
        name: "Incline Walk", detail: "15 min. Easy pace. Blood flow recovery.", track: "Minutes", vid: null, dr: 15
      }]
    }]
  },
  WEDNESDAY: {
    title: "CHEST + SHOULDER THERAPY",
    time: "~30 min",
    note: "Rebuild: pec release, t-spine opening, shoulder mobility, scapular health.",
    blocks: [{
      name: "A. T-SPINE MOBILITY",
      sets: 2,
      color: "var(--full)",
      exercises: [{
        name: "Kneeling T-Spine with Shoulder Opener", detail: "8 reps each side.", track: "Reps", vid: "LnLsZ2gZUK4", dr: 8
      }, {
        name: "Cat Camel Diagonal", detail: "6 reps. Slow.", track: "Reps", vid: "JrcOPzvdToQ", dr: 6
      }, {
        name: "Banded Needle Through", detail: "8 reps each side. Thread arm under body with band tension.", track: "Reps", vid: "1uRNvra9LLk", dr: 8
      }]
    }, {
      name: "B. SHOULDER THERAPY",
      sets: 2,
      color: "#1565C0",
      exercises: [{
        name: "Shoulder CARs", detail: "5 slow circles each direction.", track: "Reps", vid: "ZOP6RPjdAhA", dr: 5
      }, {
        name: "Shoulder Angels", detail: "8 reps. Wall angels, full scapular control.", track: "Reps", vid: "Nkla4hz-1Q8", dr: 8
      }, {
        name: "Posterior Capsule Stretch", detail: "30 sec each side. Cross-body shoulder.", track: "Seconds", vid: "a4ihXemdOZY", dr: 30
      }]
    }, {
      name: "C. PEC + SCAPULAR RELEASE",
      sets: 2,
      color: "var(--recovery)",
      exercises: [{
        name: "Deep Chest Stretch ISO", detail: "30 sec each side. Doorway or rack.", track: "Seconds", vid: "bbCEt0kphkA", dr: 30
      }, {
        name: "Band Pull Aparts", detail: "12 reps. Light band. Open chest.", track: "Reps", vid: "SuvO4TBwSu4", dr: 12
      }, {
        name: "Shoulder Hovers", detail: "8 reps. Prone, hover arms.", track: "Reps", vid: "A0KY0DKZ1h4", dr: 8
      }]
    }, {
      name: "D. WRIST + MOBILITY",
      sets: 1,
      color: "#E65100",
      exercises: [{
        name: "Banded External Rotation", detail: "10 reps each arm. Light.", track: "Reps", vid: "7DqYesMRkzU", dr: 10
      }, {
        name: "Push-Up to Toe Touch", detail: "8 reps. Mobility pattern.", track: "Reps", vid: "L-K771jlxXE", dr: 8
      }]
    }]
  },
  THURSDAY: {
    title: "ROTATOR CUFF + NECK THERAPY",
    time: "~28 min",
    note: "Rebuild: rotator cuff rehab, neck ROM, upper back release.",
    blocks: [{
      name: "A. ROTATOR CUFF THERAPY",
      sets: 2,
      color: "#1565C0",
      exercises: [{
        name: "Face Pull with External Rotation", detail: "10 reps. Light band.", track: "Reps", vid: "m8s7cblgdDQ", dr: 10
      }, {
        name: "Banded External Rotation", detail: "10 reps each arm. Elbow pinned.", track: "Reps", vid: "7DqYesMRkzU", dr: 10
      }, {
        name: "Shoulder Airplanes", detail: "8 reps each side. Scapular control.", track: "Reps", vid: "T9j_ArUIxWw", dr: 8
      }]
    }, {
      name: "B. NECK THERAPY",
      sets: 2,
      color: "#546E7A",
      exercises: [{
        name: "Neck Prone ROM & Strengthening", detail: "8 reps. Gentle.", track: "Reps", vid: "cjIDKy6z3zY", dr: 8
      }, {
        name: "Neck Supine ROM & Strengthening", detail: "8 reps. Gentle.", track: "Reps", vid: "Gxu9U-8NKes", dr: 8
      }, {
        name: "Barbell Trap & Neck Release", detail: "60 sec. Bar on traps, gentle pressure.", track: "Seconds", vid: "S19RfrYqlsk", dr: 60
      }, {
        name: "Neck Circles", detail: "5 slow circles each direction.", track: "Reps", vid: "9zP1BHF5eqQ", dr: 5
      }]
    }, {
      name: "C. UPPER BACK RELEASE",
      sets: 2,
      color: "#009688",
      exercises: [{
        name: "Birddog to Gecko", detail: "6 reps each side.", track: "Reps", vid: "ISp9hRUQQ3M", dr: 6
      }, {
        name: "Shoulder Upright Isometric Hold", detail: "15 sec each side. Gentle isometric.", track: "Seconds", vid: "SCr3DEwIu_0", dr: 8
      }, {
        name: "Loaded Lat Stretch", detail: "30 sec each side.", track: "Seconds", vid: "9Pik5qPNgCo", dr: 30
      }]
    }]
  },
  FRIDAY: {
    title: "LEG + KNEE THERAPY",
    time: "~32 min",
    note: "Rebuild: hip decompression, knee therapy, ankle/calf recovery.",
    blocks: [{
      name: "A. HIP DECOMPRESSION",
      sets: 2,
      color: "var(--full)",
      exercises: [{
        name: "Banded Hip Distraction", detail: "30 sec each side.", track: "Seconds", vid: "mDUrMKDZS-U", dr: 30
      }, {
        name: "Shin Box Fold", detail: "8 reps. Deep hip rotation.", track: "Reps", vid: "A9vhRbwH2Sw", dr: 8
      }, {
        name: "Low Back Swivels", detail: "8 reps each side.", track: "Reps", vid: "gb5KeyG9i14", dr: 8
      }]
    }, {
      name: "B. KNEE THERAPY",
      sets: 2,
      color: "var(--ember)",
      exercises: [{
        name: "Banded Terminal Knee Extension", detail: "15 reps each leg. Light.", track: "Reps", vid: "CU7Fn11YMTw", dr: 15
      }, {
        name: "Elevated Heels Deep Squat Opener", detail: "6 reps. Heels on plate.", track: "Reps", vid: "jKED44TDKIE", dr: 6
      }, {
        name: "ISO Squat Hold", detail: "20 sec. Light, not deep. Blood flow.", track: "Seconds", vid: "OpiE9QGKfuo", dr: 20
      }]
    }, {
      name: "C. ANKLE + CALF RECOVERY",
      sets: 2,
      color: "#546E7A",
      exercises: [{
        name: "Ankle CARs", detail: "5 circles each direction, each ankle.", track: "Reps", vid: "UVtCSGJmGEY", dr: 5
      }, {
        name: "Banded Ankle Dorsiflexion", detail: "10 reps each side.", track: "Reps", vid: "v-cxqr5OKEk", dr: 10
      }, {
        name: "Eccentric Calf Drop", detail: "8 reps each leg. Slow.", track: "Reps", vid: "BaPKay895ks", dr: 8
      }]
    }, {
      name: "D. STRETCH",
      sets: 1,
      color: "#009688",
      exercises: [{
        name: "Seated Hip Stretch", detail: "30 sec each side.", track: "Seconds", vid: "VtcR9kUn5v8", dr: 30
      }, {
        name: "On Bench Lat Stretch to Hip Stretch", detail: "30 sec.", track: "Seconds", vid: "NmohIiacpK0", dr: 30
      }]
    }]
  },
  SATURDAY: {
    title: "FULL BODY FLOW",
    time: "~30 min",
    note: "Consolidation: all joints, general mobility, loaded stretches, reset for next cycle.",
    blocks: [{
      name: "A. JOINT CARs",
      sets: 1,
      color: "var(--full)",
      exercises: [{
        name: "Shoulder CARs", detail: "5 each direction.", track: "Reps", vid: "ZOP6RPjdAhA", dr: 5
      }, {
        name: "Hip Airplane", detail: "6 reps each leg.", track: "Reps", vid: "AA8zZh8Iz9I", dr: 6
      }, {
        name: "Ankle CARs", detail: "5 each direction, each ankle.", track: "Reps", vid: "UVtCSGJmGEY", dr: 5
      }]
    }, {
      name: "B. FULL BODY MOBILITY",
      sets: 2,
      color: "#FF6B35",
      exercises: [{
        name: "Crawl Shoulder Tap", detail: "8 reps each side.", track: "Reps", vid: "cMeBUqa4d3E", dr: 8
      }, {
        name: "Figure 4 Flow", detail: "8 reps each side.", track: "Reps", vid: "GAjN5llpzrE", dr: 8
      }, {
        name: "Heel Clicks", detail: "10 reps.", track: "Reps", vid: "bBtfjTVPkus", dr: 10
      }, {
        name: "Facing Wall Hip Circle Rotations", detail: "8 reps each direction.", track: "Reps", vid: "odvEl4NkZuo", dr: 8
      }]
    }, {
      name: "C. LOADED STRETCHES",
      sets: 2,
      color: "#009688",
      exercises: [{
        name: "Dead Hang", detail: "30 sec. Decompress.", track: "Seconds", vid: "XPcT3capkyk", dr: 30
      }, {
        name: "Loaded Lat Stretch", detail: "30 sec each side.", track: "Seconds", vid: "9Pik5qPNgCo", dr: 30
      }, {
        name: "Deep Chest Stretch ISO", detail: "30 sec each side.", track: "Seconds", vid: "bbCEt0kphkA", dr: 30
      }, {
        name: "Seated ER Stretch", detail: "30 sec each side.", track: "Seconds", vid: "h6_gNo5Cd4Q", dr: 30
      }]
    }, {
      name: "D. GENTLE CORE",
      sets: 1,
      color: "#1565C0",
      exercises: [{
        name: "Pallof Press", detail: "8 reps each side. Light band.", track: "Reps", vid: "99evyH71IWs", dr: 8
      }, {
        name: "Deadbug", detail: "8 reps each side.", track: "Reps", vid: "rvNkdS3qAyM", dr: 8
      }]
    }]
  }
};


// ═══ TIER 6 DAY OVERRIDES (Week A) ═══
// At Tier 6 (BE A PRO), the week reorganizes to 6-day split.
// ═══════════════════════════════════════════════════════════
// CARTHAGO : TIER 6 6-DAY PROGRAM
// Mirrors Performance exactly, using our exercise library
// No A/B rotation yet — same program both weeks
// ═══════════════════════════════════════════════════════════

const tier6OverridesA = {
  // ─── MONDAY: DEADLIFT ───
  // Monday: DL + Pulls + Aerobic
  MONDAY: {
    trainTitle: "PULL — Deadlift + Back + Aerobic",
    trainTime: "~65 min",
    trainNote: "Pull day. Hip prep, KB swing, deadlift, back volume, sled row, 20 min aerobic.",
    blocks: [{
      name: "A. PREP",
      sets: 1,
      color: "var(--full)",
      exercises: [{
        name: "Facing Wall Hip Circle Rotations",
        detail: "6 reps each direction. Hip CARs.",
        track: "Reps",
        vid: "odvEl4NkZuo",
        dr: 6
      }, {
        name: "Heel Clicks",
        detail: "8 reps. Prone, click heels. Glute + adductor activation.",
        track: "Reps",
        vid: "bBtfjTVPkus",
        dr: 8
      }, {
        name: "Deadbug",
        detail: "8 reps each leg. Low back pressed to floor. Anti-extension brace before pulling.",
        track: "Reps",
        vid: "rvNkdS3qAyM",
        dr: 8
      }, {
        name: "Hip Flexor Loaded Arc Reach",
        detail: "8 reps each leg. KB eccentric. Hip flexor prep for the hinge.",
        track: "Reps + Weight",
        vid: "LuNnBWO8wZ8",
        dr: 8
      }, {
        name: "Band Assisted Straight Leg Raise",
        detail: "8 reps each leg. Band-assisted hamstring stretch. Prime the hinge.",
        track: "Reps",
        vid: "Wnhc8hsTtpI",
        dr: 8
      }]
    }, {
      name: "A2. POWER",
      sets: 4,
      color: "#E65100",
      exercises: [{
        name: "Kettlebell Swing",
        detail: "6 reps. Hip hinge power. Explosive.",
        track: "Reps + Weight",
        vid: "moK1eINw7NY",
        dr: 6
      }]
    }, {
      name: "B. MAIN LIFT",
      sets: 4,
      color: "var(--recovery)",
      exercises: [{
        name: "TRAP BAR DEADLIFT",
        detail: "6 reps. RPE 8. Benchmark lift.",
        track: "Reps + Weight",
        key: true,
        vid: "nZ4T7DPGa2g",
        dr: 6
      }]
    }, {
      name: "C. MAIN PULL",
      sets: 3,
      color: "#1565C0",
      exercises: [{
        name: "Behind-Neck Pull-Ups",
        detail: "6 reps. STRICT + controlled, only to comfortable depth. Physio-prescribed. Stop if pinching.",
        track: "Reps + Weight",
        vid: "RRJ9Rz3ZW9M",
        dr: 6
      }, {
        name: "Pull-Ups",
        detail: "8 reps. Full ROM. Add weight if needed.",
        track: "Reps + Weight",
        vid: "PbfFblcxWSo",
        dr: 8
      }]
    }, {
      name: "D. SECONDARY",
      sets: 3,
      color: "#FF6B35",
      exercises: [{
        name: "Inverted Row",
        detail: "8 reps. Strict. Horizontal pull.",
        track: "Reps",
        vid: "pIMXcgvVg3U",
        dr: 8
      }, {
        name: "Hamstring Bridge with Pullover",
        detail: "10 reps. Bridge + DB pullover. Posterior chain.",
        track: "Reps + Weight",
        vid: "cU2YDlDA8Dw",
        dr: 10
      }]
    }, {
      name: "E. BACK VOLUME",
      sets: 3,
      color: "var(--ember)",
      exercises: [{
        name: "Shoulder Hovers",
        detail: "10 reps. Prone, hover arms. Scapular retraction.",
        track: "Reps",
        vid: "A0KY0DKZ1h4",
        dr: 10
      }, {
        name: "Lat Sweep",
        detail: "8 reps. Single-arm lat pulldown sweep.",
        track: "Reps + Weight",
        vid: "zdTbE1yHygQ",
        dr: 8
      }, {
        name: "TRX Facepull",
        detail: "12 reps. Squeeze scaps, external rotation at top.",
        track: "Reps",
        vid: "PoBbZrY9zTE",
        dr: 12
      }]
    }, {
      name: "F. FINISHER",
      sets: 3,
      color: "#37474F",
      exercises: [{
        name: "Dynamic Sled Row",
        detail: "8 reps. Pull sled toward you. Back + grip.",
        track: "Reps + Weight",
        vid: "xdOhwytr0M8",
        dr: 8
      }]
    }]
  },

  // ─── TUESDAY: BENCH ───
  // Tuesday: Bench + Push + Core + Sled
  TUESDAY: {
    trainTitle: "PUSH — Bench + Shoulders + Core + Sled",
    trainTime: "~53 min",
    trainNote: "Push day. T-spine prep, bench 4x4, push volume, core, sled finisher.",
    blocks: [{
      name: "A. T-SPINE PREP",
      sets: 1,
      color: "var(--full)",
      exercises: [{
        name: "Cat Camel Diagonal",
        detail: "6 reps. Slow spinal mobility.",
        track: "Reps",
        vid: "JrcOPzvdToQ",
        dr: 6
      }, {
        name: "Kneeling T-Spine with Shoulder Opener",
        detail: "8 reps each side. T-spine rotation + shoulder.",
        track: "Reps",
        vid: "LnLsZ2gZUK4",
        dr: 8
      }, {
        name: "Banded Face Pulls with ER Focus",
        detail: "8 reps. Band face pull with external rotation hold.",
        track: "Reps",
        vid: "sQL4qGLDhX4",
        dr: 8
      },
        { name: "Banded T-Spine Rotations", detail: "8 reps each side. Banded thoracic rotation. Rotates with Needle Through week to week.", track: "Reps", vid: "75hleCEfV_I", dr: 8 },
        { name: "Banded Overhead Mobilization", detail: "10 reps. Band overhead, open the shoulders and lats before pressing.", track: "Reps", vid: "OuaUM7xZ1ls", dr: 10 }
      , { name: "Wall Contours", detail: "Slow scap protraction against the wall, arms overhead. Pressing stability primer.", track: "Reps", vid: "u9tP-C1BTO0", dr: 10 }, { name: "Scap Shrugs", detail: "Hang or plank, shrug the shoulder blades without bending the elbows. Serratus activation.", track: "Reps", vid: "1Et35cxbCgo", dr: 12 }]
    }, {
      name: "A2. SHOULDER STABILITY",
      sets: 1,
      color: "var(--full)",
      exercises: [{
        name: "Banded External Rotation",
        detail: "8 reps each arm. Elbow pinned. Rotator cuff.",
        track: "Reps",
        vid: "7DqYesMRkzU",
        dr: 8
      },
        { name: "Banded Shoulder External Rotation with Arm Behind", detail: "12 reps each side. Arm behind low back, band external rotation. Posterior cuff angle.", track: "Reps", vid: "tJDOsft6JJE", dr: 12 },
        { name: "Swiss Ball Push", detail: "3 x 10 sec. Press into a swiss ball against the wall, brace and protract. Serratus and scapular stability.", track: "Seconds", vid: "STCC2DY96Mo", dr: 10 },
        { name: "Banded Shoulder Internal Rotation", detail: "10 reps each arm. Elbow pinned, band internal rotation. Balances the external rotation work.", track: "Reps", vid: "xZQP0IkYmUs", dr: 10 },
        { name: "Band Pull Aparts", detail: "15 reps. Light band, pull apart at chest height. Upper-back and posture balance.", track: "Reps", vid: "SuvO4TBwSu4", dr: 15 }
      , { name: "Bottoms-Up KB Shoulder Stability", detail: "Kettlebell upside down at shoulder height, crush the grip to keep it vertical. Cuff + grip.", track: "Seconds", vid: "P7Nd4SAK1KM", dr: 20 }]
    }, { name: "A3. POWER", sets: 3, color: "#E65100", exercises: [ { name: "Rotational Banded Punch", detail: "8 reps each side. Muay Thaï transfer.", track: "Reps", vid: "UKsjca_cNUs", dr: 8 } ] },
      {
      name: "B. BENCH PRESS",
      sets: 4,
      color: "var(--recovery)",
      exercises: [{
        name: "BENCH PRESS",
        detail: "4 reps. RPE 8. Benchmark lift.",
        track: "Reps + Weight",
        key: true,
        vid: "5lrpyee_asw",
        dr: 4
      }]
    }, {
      name: "C. PUSH VOLUME",
      sets: 3,
      color: "#FF6B35",
      exercises: [{
        name: "Overhead Barbell Press",
        detail: "6 reps. Light-moderate. Strict, ribs down, full lockout. Physio-approved shoulder builder.",
        track: "Reps + Weight",
        vid: "G2qpTG1Eh40",
        dr: 6
      }, {
        name: "Weighted Push Up",
        detail: "12 reps. Plate on back or band.",
        track: "Reps + Weight",
        vid: "auh9bmLsvUs",
        dr: 12
      }, {
        name: "Seated Dumbbell Shoulder Press",
        detail: "8 reps. Strict. Full ROM.",
        track: "Reps + Weight",
        vid: "AyFtEJiEFWc",
        dr: 8
      },
        { name: "Standing Banded Pec Fly", detail: "12 reps. Band anchored behind, hug the arms across. Chest under tension.", track: "Reps", vid: "BUOVM8nMeIE", dr: 12 }
      ]
    }, {
      name: "D. CORE",
      sets: 4,
      color: "#1565C0",
      exercises: [{
        name: "Plank Kettlebell Saw",
        detail: "8 reps. Plank, push KB forward and back.",
        track: "Reps + Weight",
        vid: "KSNVUPybktI",
        dr: 8
      }, {
        name: "Landmine Rotations",
        detail: "8 reps each side, hip to hip. Rotational power from the ground.",
        track: "Reps + Weight",
        vid: "r4tfGcPWYuI",
        dr: 8
      }, { name: "Half-Kneeling Overhead Cable Tilts", detail: "Half kneeling, arm overhead, resist the cable's lateral pull. Lateral core + overhead stability.", track: "Reps", vid: "EVNJwnlsklc", dr: 8 }]
    }, {
      name: "E. CONDITIONING",
      sets: 4,
      color: "#37474F",
      exercises: [{
        name: "Sled Push",
        detail: "30 steps. Heavy. Full body conditioning.",
        track: "Dist + Weight",
        vid: "t68aeTBXZ7s",
        dr: 30
      }]
    }]
  },

  // ─── WEDNESDAY: WORK CAPACITY ───
  // Wednesday: Rows + Carries + Forearms + Tempo Runs
  WEDNESDAY: {
    trainTitle: "WORK CAPACITY — Rows + Carries + Grip + Conditioning",
    trainTime: "~50 min",
    trainNote: "Work Capacity. Loaded rows, carry circuit, eccentric pull, forearms, conditioning.",
    blocks: [{
      name: "A. WARM-UP",
      sets: 1,
      color: "var(--full)",
      exercises: [{
        name: "Figure 4 Flow",
        detail: "8 reps each side. Hip rotation + core stability.",
        track: "Reps",
        vid: "GAjN5llpzrE",
        dr: 8
      }, {
        name: "Crawl Shoulder Tap",
        detail: "8 reps each side. Core + shoulder activation for rows.",
        track: "Reps",
        vid: "cMeBUqa4d3E",
        dr: 8
      },
        { name: "KB Bottoms-Up Carry", detail: "20m each side. Bell upside down, walk tall and controlled. Shoulder stability + cuff. Start light.", track: "Reps", vid: "wtBDkYRHlr4", dr: 20 }
      ]
    }, {
      name: "A2. DEAD HANG",
      sets: 3,
      color: "var(--full)",
      exercises: [{
        name: "Dead Hang",
        detail: "30 sec. Full hang. Grip endurance + shoulder and spinal decompression.",
        track: "Seconds",
        vid: "XPcT3capkyk",
        dr: 30
      }]
    }, {
      name: "A3. POWER PRIMER",
      sets: 3,
      color: "#E65100",
      exercises: [{
        name: "Med Ball Rotational Throw",
        detail: "5 reps each side. Explosive rotational power.",
        track: "Reps",
        vid: "02c2YLgF8iE",
        dr: 5
      }, {
        name: "Rotational Landmine Clean and Press",
        detail: "6 reps each side. Clean to shoulder, press, control. Full-body rotational power.",
        track: "Reps + Weight",
        vid: "bZRXZZXOEdQ",
        dr: 6
      }]
    }, {
      name: "B. LOADED ROWS",
      sets: 2,
      color: "#1565C0",
      exercises: [{
        name: "Barbell Bent Over Row",
        detail: "10 reps. Hinge to ~45°, flat back, pull to the lower ribs, control the way down. Heavy horizontal pull.",
        track: "Reps + Weight",
        vid: "bm0_q9bR_HA",
        dr: 10
      }, {
        name: "Overhead Banded Shoulder Perturbations",
        detail: "8 reps each side. Resist perturbation. Shoulder stability.",
        track: "Reps",
        vid: "pp5yEKD3udc",
        dr: 8
      }]
    }, {
      name: "C. PULL + CARRY CIRCUIT",
      sets: 3,
      color: "var(--recovery)",
      exercises: [{
        name: "Anti-Rotational Bear Row",
        detail: "8 reps each side. Bear crawl hold + single-arm row.",
        track: "Reps + Weight",
        vid: "khcHYAUb7CM",
        dr: 8
      }, {
        name: "Chin Up",
        detail: "4 reps. 3 sec eccentric lowering. Supinated grip. Eccentric overload.",
        track: "Reps",
        vid: "jIvbJzs1V4I",
        dr: 4
      }, {
        name: "Towel Kettlebell Carry",
        detail: "20 steps. Towel over KB handle. Grip + carry.",
        track: "Dist + Weight",
        vid: "NEkUGE_gOLg",
        dr: 20
      }]
    }, {
      name: "D. FOREARMS",
      sets: 2,
      color: "#E65100",
      exercises: [{
        name: "Kettlebell Forearm Rotation",
        detail: "8 reps. KB rotation for forearm strength.",
        track: "Reps",
        vid: "FwCuyV208bU",
        dr: 8
      }, {
        name: "Forearm Twist + Curl with Towel",
        detail: "8 reps. Towel over bar, twist and curl.",
        track: "Reps",
        vid: "Bc3qLJnYwkI",
        dr: 8
      }]
    }, {
      name: "E. CONDITIONING FINISHER",
      sets: 3,
      color: "#37474F",
      exercises: [{
        name: "Reverse Sled Drag",
        detail: "20 steps. Walk backwards. Knee health + conditioning.",
        track: "Dist + Weight",
        vid: "wa3tZH_yaRY",
        dr: 20
      }]
    }]
  },

  // ─── THURSDAY: SQUAT ───
  // Thursday: Squat + Carries + Sled + Walk
  THURSDAY: {
    trainTitle: "LEGS — Squat + Carry + Sled + Walk",
    trainTime: "~55 min",
    trainNote: "Leg day. Squat 4x4, knee health, split squat, carries, sled, 20 min walk.",
    blocks: [{
      name: "A. PREP",
      sets: 1,
      color: "var(--full)",
      exercises: [{
        name: "Hip Flexor Rock Back",
        detail: "6 reps each leg. Open hip flexors for squat depth.",
        track: "Reps",
        vid: "a5kTnLk1Dks",
        dr: 6
      }, {
        name: "Elevated Heels Deep Squat Opener",
        detail: "5 reps. Heels on plate. Slow eccentric. Squat warm-up.",
        track: "Reps",
        vid: "jKED44TDKIE",
        dr: 5
      }, {
        name: "Adductor Rock to Hip Walk Out",
        detail: "8 reps. Open the adductors and hips for squat depth.",
        track: "Reps",
        vid: "JvQzXBr8sPQ",
        dr: 8
      }, 
        { name: "Banded Side-Lying Hip Abduction", detail: "12 reps each side. Lie on side, band on thighs, lift top leg slow. Glute medius for knee tracking.", track: "Reps", vid: "TCjssGsibKU", dr: 12 }
      ]
    }, { name: "A2. POWER", sets: 3, color: "#E65100", exercises: [ { name: "Seated Box Jump", detail: "5 reps. Dead stop. Explode. Broad jump builder.", track: "Reps", vid: "_vs2m-8NHTI", dr: 5 }, { name: "Front Foot Elevated Split Jumps", detail: "5 reps each leg. Explosive but controlled.", track: "Reps", vid: "3qCQQl-fpOQ", dr: 5 } ] },
      {
      name: "B. MAIN LIFT",
      sets: 4,
      color: "var(--recovery)",
      exercises: [{
        name: "BACK SQUAT",
        detail: "4 reps. RPE 8. Benchmark lift.",
        track: "Reps + Weight",
        key: true,
        vid: "pWWBjAvJuoA",
        dr: 4
      }]
    }, {
      name: "C. KNEE HEALTH",
      sets: 3,
      color: "var(--ember)",
      exercises: [{
        name: "BW Knee Extension (Reverse Nordic)",
        detail: "8 reps. Slow eccentric. Quad + knee health.",
        track: "Reps",
        vid: "5ZCgazq6Emk",
        dr: 8
      }, {
        name: "Poliquin Step Down with TKE",
        detail: "8 reps each leg. Slow controlled step down. Knee tracking.",
        track: "Reps",
        vid: "xFKCoWuP94Y",
        dr: 8
      }]
    }, {
      name: "C2. POSTERIOR CHAIN",
      sets: 3,
      color: "var(--ember)",
      exercises: [{
        name: "Single-Leg RDL",
        detail: "8 reps each leg. Slow hinge. Hamstring + glute focus.",
        track: "Reps + Weight",
        vid: "s32cCgmRV3I",
        dr: 8
      }, { name: "Plate Kang Squats", detail: "Plate at the chest, hinge then sink into a squat, reverse it. Hamstring + hip strength under control.", track: "Reps + Weight", vid: "f4fnfrKUfHE", dr: 6 }]
    }, {
      name: "D. UNILATERAL",
      sets: 3,
      color: "#FF6B35",
      exercises: [{
        name: "Rear Foot Elevated Split Squat",
        detail: "8 reps each leg. Back foot on bench.",
        track: "Reps + Weight",
        vid: "um_OOswiPS4",
        dr: 8
      },
        { name: "Dumbbell Lateral Squat Drop In", detail: "8 reps each side.", track: "Reps + Weight", vid: "O62PpPfpsis", dr: 8 },
        { name: "ISO Squat Hold", detail: "30 sec hold. Wall sit or free standing.", track: "Seconds", vid: "OpiE9QGKfuo", dr: 30 }
      ]
    }, {
      name: "E. CARRY",
      sets: 3,
      color: "#E65100",
      exercises: [{
        name: "FARMER'S CARRY",
        detail: "175ft (53m) at bodyweight. Benchmark.",
        track: "Dist + Weight",
        key: true,
        vid: "fPwwaXCgDNE",
        dr: 175
      }, {
        name: "Suitcase Carry",
        detail: "80ft each hand. Core anti-lateral flexion.",
        track: "Dist + Weight",
        vid: "iTjwbts8Djw",
        dr: 80
      }]
    }, {
      name: "F. CONDITIONING",
      sets: 4,
      color: "#37474F",
      exercises: [
        { name: "Loaded Leg Lifts", detail: "8 reps. Hanging or lying, weight between feet. Core finisher.", track: "Reps + Weight", vid: "PpZxg66ftYc", dr: 8 }
      , { name: "Seated Hip Flexion", detail: "Seated, drive the knee up against resistance, control the lower. Hip flexor strength for kicks and knees.", track: "Reps + Weight", vid: "ImcibRWv09E", dr: 10 }]
    }]
  },

  // ─── FRIDAY: ARMS ───
  // Friday: Close Grip Bench + Biceps + Triceps + Forearms
  FRIDAY: {
    trainTitle: "ARMS — Close Grip + Biceps + Triceps + Forearms",
    trainTime: "~44 min",
    trainNote: "Arms day. Compound push, bicep + tricep isolation, forearm work.",
    blocks: [{
      name: "A. WARM-UP",
      sets: 2,
      color: "var(--full)",
      exercises: [{
        name: "Band Pull Aparts",
        detail: "12 reps. Light band. Open chest, warm shoulders.",
        track: "Reps",
        vid: "SuvO4TBwSu4",
        dr: 12
      }, {
        name: "Banded External Rotation",
        detail: "10 reps each arm. Rotator cuff prep before pressing.",
        track: "Reps",
        vid: "7DqYesMRkzU",
        dr: 10
      }, {
        name: "Push-Up to Pike",
        detail: "8 reps. Push-up then pike up. Shoulder + tricep activation.",
        track: "Reps",
        vid: "oNj5I72Yskg",
        dr: 8
      }]
    }, { name: "A2. POWER", sets: 3, color: "#E65100", exercises: [ { name: "Landmine Push Press", detail: "8 reps each side. Explosive angled press.", track: "Reps + Weight", vid: "PpMoR20QJQg", dr: 8 } ] },
      {
      name: "B. COMPOUND PUSH",
      sets: 3,
      color: "var(--recovery)",
      exercises: [{
        name: "Close Grip Barbell Bench Press",
        detail: "12 reps. Narrow grip. Tricep emphasis compound.",
        track: "Reps + Weight",
        key: true,
        vid: "Inj9b3jhREY",
        dr: 12
      },
        { name: "DIPS", detail: "8 reps. Controlled descent. Tricep focus.", track: "Reps + Weight", key: true, vid: "0326dy_-CzM", dr: 8 }
      ]
    }, { name: "B2. SHOULDERS", sets: 3, color: "#EF6C00", exercises: [ { name: "DB Lateral Raises", detail: "8 reps. Moderate weight. Shoulder width.", track: "Reps + Weight", vid: "KkynA3FpkhE", dr: 8 }, { name: "Shoulder Arm Bar", detail: "5 reps each side. KB held overhead, roll under control. Loaded shoulder stability.", track: "Reps + Weight", vid: "g2EhWlBX_Qw", dr: 5 } ] },
      {
      name: "C. BICEPS",
      sets: 3,
      color: "#FF6B35",
      exercises: [{
        name: "Barbell Bicep Curl",
        detail: "10 reps. Strict form. No swing.",
        track: "Reps + Weight",
        vid: "yRMQoSLOl6g",
        dr: 10
      }, {
        name: "Isolated Bicep Supinated Curl",
        detail: "12 reps each arm. Full supination at top.",
        track: "Reps + Weight",
        vid: "I_bKCYL2nL8",
        dr: 12
      }]
    }, {
      name: "D. TRICEPS",
      sets: 3,
      color: "#1565C0",
      exercises: [{
        name: "Tricep Dive Ins with Rope",
        detail: "10 reps. Full extension squeeze.",
        track: "Reps + Weight",
        vid: "DrnY3A9p4Cs",
        dr: 10
      }, {
        name: "Single-Arm Tricep Extension",
        detail: "8 reps each arm. Overhead or kickback.",
        track: "Reps + Weight",
        vid: "VgjAgAKaSPM",
        dr: 8
      }]
    }, {
      name: "E. FOREARMS",
      sets: 2,
      color: "#E65100",
      exercises: [{
        name: "Seated DB Wrist Curl",
        detail: "8 reps. Palm up, forearm on knee, curl wrist. Forearm flexor.",
        track: "Reps + Weight",
        vid: "y-x14sVi12o",
        dr: 8
      }, {
        name: "Seated DB Reverse Wrist Curl",
        detail: "8 reps. Palm down, forearm on knee, extend wrist up. Forearm extensor.",
        track: "Reps + Weight",
        vid: "cRLJ86m00cU",
        dr: 8
      },
        { name: "Banded Wrist Rotation", detail: "10 reps each direction. Band around the hand, rotate through the wrist. Wrist + forearm health.", track: "Reps", vid: "vXaF4LVlaic", dr: 10 }
      ]
    }, {
      name: "F. NECK",
      sets: 2,
      color: "#546E7A",
      exercises: [{
        name: "Neck Lateral Band Resistance",
        detail: "10 reps each side. Light band, controlled. Neck stability.",
        track: "Reps",
        vid: "QEayGbDM1Do",
        dr: 10
      }, {
        name: "Neck Rotations",
        detail: "8 reps each direction. Slow, full ROM. Neck mobility.",
        track: "Reps",
        vid: "Fx4LvjovL_k",
        dr: 8
      }]
    }]
  },

  // ─── SATURDAY: MOBILITY ───
  // Saturday: Full body mobility + recovery
  SATURDAY: {
    trainTitle: "MOBILITY — Full Body Recovery",
    trainTime: "~29 min",
    trainNote: "Active recovery. Joint CARs, hip + t-spine mobility, calves, neck, loaded stretches.",
    blocks: [{
      name: "A. JOINT CARs",
      sets: 1,
      color: "var(--full)",
      exercises: [{
        name: "Shoulder CARs",
        detail: "5 slow circles each direction. Full ROM.",
        track: "Reps",
        vid: "ZOP6RPjdAhA",
        dr: 5
      }, {
        name: "Hip Airplane",
        detail: "6 reps each leg. Single leg hip rotation.",
        track: "Reps",
        vid: "AA8zZh8Iz9I",
        dr: 6
      }]
    }, {
      name: "B. HIP MOBILITY",
      sets: 2,
      color: "#009688",
      exercises: [{
        name: "Shin Box Fold",
        detail: "8 reps. Deep hip rotation.",
        track: "Reps",
        vid: "A9vhRbwH2Sw",
        dr: 8
      }, {
        name: "Banded Hip Distraction",
        detail: "30 sec each side. Joint decompression.",
        track: "Seconds",
        vid: "mDUrMKDZS-U",
        dr: 30
      }, {
        name: "Heel Clicks",
        detail: "10 reps. Prone, click heels.",
        track: "Reps",
        vid: "bBtfjTVPkus",
        dr: 10
      }]
    }, {
      name: "C. T-SPINE + SHOULDER",
      sets: 2,
      color: "#1565C0",
      exercises: [{
        name: "Kneeling T-Spine with Shoulder Opener",
        detail: "8 reps each side.",
        track: "Reps",
        vid: "LnLsZ2gZUK4",
        dr: 8
      }, {
        name: "Shoulder Airplanes",
        detail: "8 reps each side. Scapular control.",
        track: "Reps",
        vid: "T9j_ArUIxWw",
        dr: 8
      }, {
        name: "Birddog to Gecko",
        detail: "6 reps each side. Crawl pattern + stability.",
        track: "Reps",
        vid: "ISp9hRUQQ3M",
        dr: 6
      }, {
        name: "Banded Rotations",
        detail: "8 reps each side. Controlled rotation under band resistance.",
        track: "Reps",
        vid: "ViWJ1u2u4d0",
        dr: 8
      },
        { name: "Crawl to Kick Through", detail: "6 reps each side. Coordination.", track: "Reps", vid: "wqt9IdcUxig", dr: 6 }
      ]
    }, {
      name: "D. CALVES + ANKLES",
      sets: 2,
      color: "var(--ember)",
      exercises: [{
        name: "Ankle CARs",
        detail: "5 circles each direction, each ankle.",
        track: "Reps",
        vid: "UVtCSGJmGEY",
        dr: 5
      }, {
        name: "Loaded SL Calf Raise",
        detail: "10 reps each leg. Slow eccentric.",
        track: "Reps + Weight",
        vid: "wZfr_svtSr0",
        dr: 10
      }, {
        name: "Ankle Mobility",
        detail: "8 reps each side. Wall knee drives.",
        track: "Reps",
        vid: "qXvA35UHs2w",
        dr: 8
      }]
    }, {
      name: "E. NECK",
      sets: 2,
      color: "#546E7A",
      exercises: [{
        name: "Neck Prone ROM & Strengthening",
        detail: "8 reps. Gentle.",
        track: "Reps",
        vid: "cjIDKy6z3zY",
        dr: 8
      }, {
        name: "Neck Circles",
        detail: "5 slow circles each direction.",
        track: "Reps",
        vid: "9zP1BHF5eqQ",
        dr: 5
      },
        { name: "Neck Bridge", detail: "Hold bridge position. Build neck strength progressively.", track: "Seconds", vid: "kgFFqbiqvW8", dr: 20 }
      ]
    }, {
      name: "F. LOADED STRETCHES",
      sets: 1,
      color: "#009688",
      exercises: [{
        name: "Loaded Lat Stretch",
        detail: "30 sec each side. Hang from bar.",
        track: "Seconds",
        vid: "9Pik5qPNgCo",
        dr: 30
      }, {
        name: "Seated Hip Stretch",
        detail: "30 sec each side. Deep hip flexor release.",
        track: "Seconds",
        vid: "VtcR9kUn5v8",
        dr: 30
      }, {
        name: "Deep Chest Stretch ISO",
        detail: "30 sec each side. Doorway or rack.",
        track: "Seconds",
        vid: "bbCEt0kphkA",
        dr: 30
      }, { name: "QL Hip Drop from Bench", detail: "Side-lying off a bench, drop the hip then lift back to neutral. QL length and control.", track: "Reps", vid: "7mFHWar-EVY", dr: 10 }]
    }]
  }
};



const tier6OverridesB = {
  // ─── MONDAY B: DEADLIFT ───
  MONDAY: {
    trainTitle: "PULL B — Deadlift + Back + Aerobic",
    trainTime: "~65 min",
    trainNote: "Pull day B. Snatch power, deadlift, chin-ups, back volume, sled row, aerobic.",
    blocks: [{
      name: "A. PREP",
      sets: 1,
      color: "var(--full)",
      exercises: [{
        name: "Facing Wall Hip Circle Rotations",
        detail: "6 reps each direction. Hip CARs.",
        track: "Reps",
        vid: "odvEl4NkZuo",
        dr: 6
      }, {
        name: "Heel Clicks",
        detail: "8 reps. Prone, click heels. Glute + adductor activation.",
        track: "Reps",
        vid: "bBtfjTVPkus",
        dr: 8
      }, {
        name: "Deadbug",
        detail: "8 reps each leg. Low back pressed to floor. Anti-extension brace before pulling.",
        track: "Reps",
        vid: "rvNkdS3qAyM",
        dr: 8
      }, {
        name: "Hip Flexor Loaded Arc Reach",
        detail: "8 reps each leg. KB eccentric. Hip flexor prep for the hinge.",
        track: "Reps + Weight",
        vid: "LuNnBWO8wZ8",
        dr: 8
      }, {
        name: "Band Assisted Straight Leg Raise",
        detail: "8 reps each leg. Band-assisted hamstring stretch. Prime the hinge.",
        track: "Reps",
        vid: "Wnhc8hsTtpI",
        dr: 8
      }, {
        name: "Birddog to Gecko",
        detail: "8 reps each side. Crawl pattern + scapular stability.",
        track: "Reps",
        vid: "ISp9hRUQQ3M",
        dr: 8
      }]
    }, {
      name: "A2. POWER",
      sets: 4,
      color: "#E65100",
      exercises: [{
        name: "Dumbbell Snatch",
        detail: "6 reps each arm. Explosive single-arm power.",
        track: "Reps + Weight",
        vid: "-px4XoSZr1g",
        dr: 6
      }]
    }, {
      name: "B. MAIN LIFT",
      sets: 4,
      color: "var(--recovery)",
      exercises: [{
        name: "TRAP BAR DEADLIFT",
        detail: "6 reps. RPE 8. Benchmark lift.",
        track: "Reps + Weight",
        key: true,
        vid: "nZ4T7DPGa2g",
        dr: 6
      }]
    }, {
      name: "C. MAIN PULL",
      sets: 3,
      color: "#1565C0",
      exercises: [{
        name: "Pull-Ups",
        detail: "8 reps. Full ROM. Add weight if needed.",
        track: "Reps + Weight",
        vid: "PbfFblcxWSo",
        dr: 8
      }]
    }, {
      name: "D. SECONDARY",
      sets: 3,
      color: "#FF6B35",
      exercises: [{
        name: "KB Vertical Pull",
        detail: "8 reps. Floor to overhead. Explosive pull.",
        track: "Reps + Weight",
        vid: "S7jLS4f2FTI",
        dr: 8
      }, {
        name: "Hamstring Bridge with Pullover",
        detail: "10 reps. Bridge + DB pullover. Posterior chain.",
        track: "Reps + Weight",
        vid: "cU2YDlDA8Dw",
        dr: 10
      }]
    }, {
      name: "E. BACK VOLUME",
      sets: 3,
      color: "var(--ember)",
      exercises: [{
        name: "Lat Sweep",
        detail: "8 reps. Single-arm lat pulldown sweep.",
        track: "Reps + Weight",
        vid: "zdTbE1yHygQ",
        dr: 8
      }, {
        name: "Face Pull with External Rotation",
        detail: "12 reps. Band face pull with ER hold.",
        track: "Reps",
        vid: "m8s7cblgdDQ",
        dr: 12
      }]
    }, {
      name: "F. FINISHER",
      sets: 3,
      color: "#37474F",
      exercises: [{
        name: "Dynamic Sled Row",
        detail: "8 reps. Pull sled toward you.",
        track: "Reps + Weight",
        vid: "xdOhwytr0M8",
        dr: 8
      }]
    }]
  },

  // ─── TUESDAY B: BENCH ───
  TUESDAY: {
    trainTitle: "PUSH B — Bench + Landmine + Core + Sled",
    trainTime: "~53 min",
    trainNote: "Push day B. T-spine prep, bench 4x4, landmine variations, core, sled.",
    blocks: [{
      name: "A. T-SPINE PREP",
      sets: 1,
      color: "var(--full)",
      exercises: [{
        name: "Cat Camel Diagonal",
        detail: "6 reps. Slow spinal mobility.",
        track: "Reps",
        vid: "JrcOPzvdToQ",
        dr: 6
      }, {
        name: "Kneeling T-Spine with Shoulder Opener",
        detail: "8 reps each side.",
        track: "Reps",
        vid: "LnLsZ2gZUK4",
        dr: 8
      }, {
        name: "Banded Face Pulls with ER Focus",
        detail: "8 reps. Band face pull with external rotation.",
        track: "Reps",
        vid: "sQL4qGLDhX4",
        dr: 8
      },
        { name: "Banded Needle Through", detail: "8 reps each side. Thread arm under body with band tension. Rotates with T-Spine Rotations week to week.", track: "Reps", vid: "1uRNvra9LLk", dr: 8 },
        { name: "Banded Overhead Mobilization", detail: "10 reps. Band overhead, open the shoulders and lats before pressing.", track: "Reps", vid: "OuaUM7xZ1ls", dr: 10 }
      , { name: "Lying Scap Lift Off", detail: "Prone, lift the shoulder blades off the floor without arching the low back. Isolated scap control.", track: "Reps", vid: "VTRg7NR83QQ", dr: 12 }]
    }, {
      name: "A2. SHOULDER STABILITY",
      sets: 1,
      color: "var(--full)",
      exercises: [{
        name: "Banded External Rotation",
        detail: "8 reps each arm. Rotator cuff.",
        track: "Reps",
        vid: "7DqYesMRkzU",
        dr: 8
      },
        { name: "Spider Crawls", detail: "8 reps each side. Hands walk up the wall, control the descent. Scapular control + shoulder stability.", track: "Reps", vid: "ZpsDv8EONdc", dr: 8 },
        { name: "Swiss Ball Push", detail: "3 x 10 sec. Press into a swiss ball against the wall, brace and protract. Serratus and scapular stability.", track: "Seconds", vid: "STCC2DY96Mo", dr: 10 },
        { name: "Banded Shoulder Internal Rotation", detail: "10 reps each arm. Elbow pinned, band internal rotation. Balances the external rotation work.", track: "Reps", vid: "xZQP0IkYmUs", dr: 10 },
        { name: "Band Pull Aparts", detail: "15 reps. Light band, pull apart at chest height. Upper-back and posture balance.", track: "Reps", vid: "SuvO4TBwSu4", dr: 15 }
      , { name: "Banded KB Shoulder Press", detail: "Light kettlebell press with a band loading the top. Joint-friendly overhead pattern.", track: "Reps + Weight", vid: "pp9YsHEzrV0", dr: 8 }]
    }, { name: "A3. POWER", sets: 3, color: "#E65100", exercises: [ { name: "Med Ball Slam", detail: "5 reps. Explosive slam, full extension to floor.", track: "Reps", vid: "CkO1mfSBvv4", dr: 5 } ] },
      {
      name: "B. BENCH PRESS",
      sets: 4,
      color: "var(--recovery)",
      exercises: [{
        name: "BENCH PRESS",
        detail: "4 reps. RPE 8. Benchmark lift.",
        track: "Reps + Weight",
        key: true,
        vid: "5lrpyee_asw",
        dr: 4
      }]
    }, {
      name: "C. PUSH VOLUME",
      sets: 3,
      color: "#FF6B35",
      exercises: [{
        name: "Overhead Barbell Press",
        detail: "8 reps. LIGHT support \u2014 bench is heavy this block. Strict, no leg drive.",
        track: "Reps + Weight",
        vid: "G2qpTG1Eh40",
        dr: 8
      }, {
        name: "Half Kneeling SA Landmine Press",
        detail: "8 reps each side. Unilateral overhead.",
        track: "Reps + Weight",
        vid: "fx6lSVNvu-4",
        dr: 8
      }, {
        name: "Incline DB Press",
        detail: "10 reps. 30-45° incline. Upper chest + front delt. Progressive load.",
        track: "Reps + Weight",
        vid: "G1mCi5idEbk",
        dr: 10
      },
        { name: "Standing Banded Pec Fly", detail: "12 reps. Band anchored behind, hug the arms across. Chest under tension.", track: "Reps", vid: "BUOVM8nMeIE", dr: 12 }
      ]
    }, {
      name: "D. CORE",
      sets: 4,
      color: "#1565C0",
      exercises: [{
        name: "Plank",
        detail: "45-60 sec. Forearms down, body in a straight line, brace hard. Anti-extension hold.",
        track: "Seconds",
        vid: "O83fmDwTYpg",
        dr: 60
      }, {
        name: "Dumbbell Diagonal Chop",
        detail: "8 reps each side. Anti-rotation power.",
        track: "Reps + Weight",
        vid: "At6-Mna8za8",
        dr: 8
      }, { name: "Half-Kneeling Cable Rope Torso Rotations", detail: "Half kneeling, rotate against the cable and control the return. Rotational control.", track: "Reps", vid: "JU_P4iLU-dM", dr: 10 }]
    }, {
      name: "E. CONDITIONING",
      sets: 4,
      color: "#37474F",
      exercises: [{
        name: "Sled Push",
        detail: "30 steps. Heavy. Full body conditioning.",
        track: "Dist + Weight",
        vid: "t68aeTBXZ7s",
        dr: 30
      }]
    }]
  },

  // ─── WEDNESDAY B: WORK CAPACITY ───
  WEDNESDAY: {
    trainTitle: "WORK CAPACITY B — Rows + Carries + Grip + Conditioning",
    trainTime: "~50 min",
    trainNote: "Work Capacity B. Different rows, carry variations, grip, conditioning.",
    blocks: [{
      name: "A. WARM-UP",
      sets: 1,
      color: "var(--full)",
      exercises: [{
        name: "Figure 4 Flow",
        detail: "8 reps each side. Hip rotation + core stability.",
        track: "Reps",
        vid: "GAjN5llpzrE",
        dr: 8
      }, {
        name: "Hip Flexor Plank",
        detail: "20 sec each leg. Core activation for carries.",
        track: "Seconds",
        vid: "WCkrF6B4sdg",
        dr: 20
      },
        { name: "KB Bottoms-Up Carry", detail: "20m each side. Bell upside down, walk tall and controlled. Shoulder stability + cuff. Start light.", track: "Reps", vid: "wtBDkYRHlr4", dr: 20 }
      ]
    }, {
      name: "A2. DEAD HANG",
      sets: 3,
      color: "var(--full)",
      exercises: [{
        name: "Dead Hang",
        detail: "30 sec. Full hang. Grip endurance + shoulder and spinal decompression.",
        track: "Seconds",
        vid: "XPcT3capkyk",
        dr: 30
      }]
    }, {
      name: "A3. POWER PRIMER",
      sets: 3,
      color: "#E65100",
      exercises: [{ name: "Rotational Banded Punch", detail: "8 reps each side. Muay Thaï transfer.", track: "Reps", vid: "UKsjca_cNUs", dr: 8 }]
    }, {
      name: "B. LOADED ROWS",
      sets: 2,
      color: "#1565C0",
      exercises: [{
        name: "Renegade Row",
        detail: "8 reps each side. Row from plank position. Fight the hip rotation.",
        track: "Reps + Weight",
        vid: "Q28cLuweLv4",
        dr: 8
      }, {
        name: "TRX Facepull",
        detail: "8 reps. Squeeze scaps, external rotation.",
        track: "Reps",
        vid: "PoBbZrY9zTE",
        dr: 8
      }]
    }, {
      name: "C. PULL + CARRY CIRCUIT",
      sets: 3,
      color: "var(--recovery)",
      exercises: [{
        name: "Lateral Bridge with Row",
        detail: "8 reps each side. Side plank + row. Anti-rotation + pull.",
        track: "Reps + Weight",
        vid: "kiBDuPbWg2A",
        dr: 8
      }, {
        name: "Inverted Row",
        detail: "4 reps. 3 sec eccentric lowering. Eccentric overload.",
        track: "Reps",
        vid: "pIMXcgvVg3U",
        dr: 4
      }, {
        name: "Single-Arm DB Row",
        detail: "8 reps each side. Strict unilateral row. Brace the core.",
        track: "Reps + Weight",
        vid: "i9BJwVCK5VQ",
        dr: 8
      }, {
        name: "Towel Kettlebell Carry",
        detail: "20 steps. Towel over KB handle. Grip + carry.",
        track: "Dist + Weight",
        vid: "NEkUGE_gOLg",
        dr: 20
      }]
    }, {
      name: "D. FOREARMS",
      sets: 2,
      color: "#E65100",
      exercises: [{
        name: "Plate Pinch Hold",
        detail: "Max hold. Pinch grip endurance.",
        track: "Seconds + Weight",
        vid: "woJifu7hSD8",
        dr: 30
      }, {
        name: "Wrist Roller",
        detail: "Roll up and down. Forearm pump.",
        track: "Reps",
        vid: "8ARDRJjhnSw",
        dr: 4
      }]
    }, {
      name: "E. CONDITIONING FINISHER",
      sets: 3,
      color: "#37474F",
      exercises: [{
        name: "Reverse Sled Drag",
        detail: "20 steps. Walk backwards. Knee health + conditioning.",
        track: "Dist + Weight",
        vid: "wa3tZH_yaRY",
        dr: 20
      }]
    }]
  },

  // ─── THURSDAY B: SQUAT ───
  THURSDAY: {
    trainTitle: "LEGS B — Squat + Carry + Sled + Walk",
    trainTime: "~60 min",
    trainNote: "Leg day B. Squat 4x4, knee health, split jumps, carries, sled, walk.",
    blocks: [{
      name: "A. PREP",
      sets: 1,
      color: "var(--full)",
      exercises: [{
        name: "Hip Flexor Rock Back",
        detail: "6 reps each leg. Open hip flexors for squat depth.",
        track: "Reps",
        vid: "a5kTnLk1Dks",
        dr: 6
      }, {
        name: "Elevated Heels Deep Squat Opener",
        detail: "5 reps. Heels on plate. Slow eccentric.",
        track: "Reps",
        vid: "jKED44TDKIE",
        dr: 5
      }, {
        name: "Adductor Rock to Hip Walk Out",
        detail: "8 reps. Open the adductors and hips for squat depth.",
        track: "Reps",
        vid: "JvQzXBr8sPQ",
        dr: 8
      }, 
        { name: "Banded Hip External Rotation (Seated)", detail: "15 reps. Seated, band above knees, drive knees apart and control back. Hip external rotators.", track: "Reps", vid: "GH_IQsyOKwI", dr: 15 }
      ]
    }, { name: "A2. POWER", sets: 3, color: "#E65100", exercises: [ { name: "TRX Jump Squat", detail: "5 reps. Hold TRX, assisted explosive jump. Gentle landing, knee-friendly power.", track: "Reps", vid: "o0b5XFfd0wQ", dr: 5 }, { name: "Single Leg Hinge KB Swing", detail: "5 reps each leg. Explosive single leg hip drive. Control the landing.", track: "Reps + Weight", vid: "VRnk5QEBevI", dr: 5 } , {
        name: "Front Foot Elevated Split Jumps",
        detail: "5 reps each leg. Explosive single-leg power.",
        track: "Reps",
        vid: "3qCQQl-fpOQ",
        dr: 5
      }] },
      {
      name: "B. MAIN LIFT",
      sets: 4,
      color: "var(--recovery)",
      exercises: [{
        name: "BACK SQUAT",
        detail: "4 reps. RPE 8. Benchmark lift.",
        track: "Reps + Weight",
        key: true,
        vid: "pWWBjAvJuoA",
        dr: 4
      }]
    }, {
      name: "C. KNEE HEALTH",
      sets: 3,
      color: "var(--ember)",
      exercises: [{
        name: "Banded Terminal Knee Extension",
        detail: "15 reps each leg. Band around knee.",
        track: "Reps",
        vid: "CU7Fn11YMTw",
        dr: 15
      }, {
        name: "Poliquin Step Down with TKE",
        detail: "8 reps each leg. Slow controlled step down. Knee tracking.",
        track: "Reps",
        vid: "xFKCoWuP94Y",
        dr: 8
      }]
    }, {
      name: "C2. POSTERIOR CHAIN",
      sets: 3,
      color: "var(--ember)",
      exercises: [{
        name: "Banded Hamstring Curls",
        detail: "12 reps. Prone, curl band toward glutes.",
        track: "Reps",
        vid: "gTVC0qZJLzk",
        dr: 12
      }, { name: "Plate Kang Squats", detail: "Plate at the chest, hinge then sink into a squat, reverse it. Hamstring + hip strength under control.", track: "Reps + Weight", vid: "f4fnfrKUfHE", dr: 6 }]
    }, {
      name: "D. UNILATERAL",
      sets: 3,
      color: "#FF6B35",
      exercises: [{
        name: "Skater Squat",
        detail: "6 reps each leg. Single-leg squat, opposite leg behind.",
        track: "Reps",
        vid: "xa2Dy8fyN1Q",
        dr: 6
      },
        { name: "Step Up with TKE", detail: "8 reps each leg.", track: "Reps", vid: "4cauIKTDIrk", dr: 8 }
      , { name: "Landmine Lateral Split Squat Iso", detail: "Lateral split stance on the landmine, hold at depth. Frontal-plane single-leg strength.", track: "Seconds", vid: "70mzPCghYhA", dr: 20 }]
    }, {
      name: "E. CARRY",
      sets: 3,
      color: "#E65100",
      exercises: [{
        name: "FARMER\'S CARRY",
        detail: "175ft (53m) at bodyweight. Benchmark.",
        track: "Dist + Weight",
        key: true,
        vid: "fPwwaXCgDNE",
        dr: 175
      }, {
        name: "Towel Kettlebell Carry",
        detail: "80ft. Towel over KB handle. Grip carry.",
        track: "Dist + Weight",
        vid: "NEkUGE_gOLg",
        dr: 80
      }]
    }, {
      name: "F. CONDITIONING",
      sets: 4,
      color: "#37474F",
      exercises: [
        { name: "Loaded Leg Lifts", detail: "8 reps. Hanging or lying, weight between feet. Core finisher.", track: "Reps + Weight", vid: "PpZxg66ftYc", dr: 8 }
      ]
    }]
  },

  // ─── FRIDAY B: ARMS ───
  FRIDAY: {
    trainTitle: "ARMS B — Close Grip + Biceps + Triceps + Forearms",
    trainTime: "~44 min",
    trainNote: "Arms day B. Compound push, arm variations, forearm work.",
    blocks: [{
      name: "A. WARM-UP",
      sets: 2,
      color: "var(--full)",
      exercises: [{
        name: "Band Pull Aparts",
        detail: "12 reps. Light band. Open chest.",
        track: "Reps",
        vid: "SuvO4TBwSu4",
        dr: 12
      }, {
        name: "Banded External Rotation",
        detail: "10 reps each arm. Rotator cuff prep before pressing.",
        track: "Reps",
        vid: "7DqYesMRkzU",
        dr: 10
      }, {
        name: "Push-Up to Pike",
        detail: "8 reps. Shoulder + tricep activation.",
        track: "Reps",
        vid: "oNj5I72Yskg",
        dr: 8
      }]
    }, { name: "A2. POWER", sets: 3, color: "#E65100", exercises: [ { name: "Plyo Push-Up", detail: "5 reps. Explode off the floor, hands leave ground. Horizontal push power.", track: "Reps", vid: "zHqxyD9_364", dr: 5 } ] },
      {
      name: "B. COMPOUND PUSH",
      sets: 3,
      color: "var(--recovery)",
      exercises: [{
        name: "Close Grip Barbell Bench Press",
        detail: "12 reps. Narrow grip. Tricep compound.",
        track: "Reps + Weight",
        key: true,
        vid: "Inj9b3jhREY",
        dr: 12
      },
        { name: "DIPS", detail: "8 reps. Controlled descent. Tricep focus.", track: "Reps + Weight", key: true, vid: "0326dy_-CzM", dr: 8 }
      ]
    }, { name: "B2. SHOULDERS", sets: 3, color: "#EF6C00", exercises: [ { name: "DB Lateral Raises", detail: "8 reps. Moderate weight. Shoulder width.", track: "Reps + Weight", vid: "KkynA3FpkhE", dr: 8 }, { name: "Shoulder Arm Bar", detail: "5 reps each side. KB held overhead, roll under control. Loaded shoulder stability.", track: "Reps + Weight", vid: "g2EhWlBX_Qw", dr: 5 } ] },
      {
      name: "C. BICEPS",
      sets: 3,
      color: "#FF6B35",
      exercises: [{
        name: "Barbell Bicep Curl",
        detail: "10 reps. Strict.",
        track: "Reps + Weight",
        vid: "yRMQoSLOl6g",
        dr: 10
      }, {
        name: "Hammer Curl",
        detail: "10 reps each arm. Neutral grip. Brachialis.",
        track: "Reps + Weight",
        vid: "0qzSDAfBzSw",
        dr: 10
      }]
    }, {
      name: "D. TRICEPS",
      sets: 3,
      color: "#1565C0",
      exercises: [{
        name: "Tricep Dive Ins with Rope",
        detail: "10 reps. Full extension.",
        track: "Reps + Weight",
        vid: "DrnY3A9p4Cs",
        dr: 10
      }, {
        name: "Overhead Tricep Extension",
        detail: "10 reps. Cable or DB. Long head stretch.",
        track: "Reps + Weight",
        vid: "T3e390Dl3XU",
        dr: 10
      }]
    }, {
      name: "E. FOREARMS",
      sets: 2,
      color: "#E65100",
      exercises: [{
        name: "Kettlebell Forearm Rotation",
        detail: "8 reps. KB rotation for forearm strength.",
        track: "Reps",
        vid: "FwCuyV208bU",
        dr: 8
      }, {
        name: "Forearm Twist + Curl with Towel",
        detail: "8 reps. Towel over bar, twist and curl.",
        track: "Reps",
        vid: "Bc3qLJnYwkI",
        dr: 8
      },
        { name: "Banded Wrist Rotation", detail: "10 reps each direction. Band around the hand, rotate through the wrist. Wrist + forearm health.", track: "Reps", vid: "vXaF4LVlaic", dr: 10 }
      ]
    }, {
      name: "F. NECK",
      sets: 2,
      color: "#546E7A",
      exercises: [{
        name: "Neck Prone ROM & Strengthening",
        detail: "10 reps. Prone, controlled lift. Neck extensor strength.",
        track: "Reps",
        vid: "cjIDKy6z3zY",
        dr: 10
      }, {
        name: "Neck Circles",
        detail: "5 reps each direction. Slow, gentle. Neck mobility.",
        track: "Reps",
        vid: "9zP1BHF5eqQ",
        dr: 5
      }]
    }]
  },

  // ─── SATURDAY B: MOBILITY ───
  SATURDAY: {
    trainTitle: "MOBILITY B — Full Body Recovery",
    trainTime: "~29 min",
    trainNote: "Active recovery B. T-spine focus, hip mobility, calves, neck, stretches.",
    blocks: [{
      name: "A. JOINT CARs",
      sets: 1,
      color: "var(--full)",
      exercises: [{
        name: "Shoulder CARs",
        detail: "5 slow circles each direction. Full ROM.",
        track: "Reps",
        vid: "ZOP6RPjdAhA",
        dr: 5
      }, {
        name: "Ankle CARs",
        detail: "5 slow circles each direction, each ankle.",
        track: "Reps",
        vid: "UVtCSGJmGEY",
        dr: 5
      }]
    }, {
      name: "A2. T-SPINE + SHOULDER",
      sets: 2,
      color: "var(--full)",
      exercises: [{
        name: "Cat Camel Diagonal",
        detail: "6 reps. Slow spinal mobility.",
        track: "Reps",
        vid: "JrcOPzvdToQ",
        dr: 6
      }, {
        name: "Shoulder Hovers",
        detail: "8 reps. Prone, hover arms. Posterior shoulder.",
        track: "Reps",
        vid: "A0KY0DKZ1h4",
        dr: 8
      }, {
        name: "Crawl Shoulder Tap",
        detail: "8 reps each side. Core + shoulder stability.",
        track: "Reps",
        vid: "cMeBUqa4d3E",
        dr: 8
      },
        { name: "Crawl to Kick Through", detail: "6 reps each side. Coordination.", track: "Reps", vid: "wqt9IdcUxig", dr: 6 },
        { name: "Shoulder Airplanes", detail: "6 reps each side. Hinged rotation. Balance + stability.", track: "Reps", vid: "T9j_ArUIxWw", dr: 6 },
        { name: "Banded Rotations", detail: "8 reps each side. Controlled rotation under band resistance.", track: "Reps", vid: "ViWJ1u2u4d0", dr: 8 }
      ]
    }, {
      name: "B. HIP MOBILITY",
      sets: 2,
      color: "#009688",
      exercises: [{
        name: "Shin Box Fold",
        detail: "8 reps. Deep hip rotation.",
        track: "Reps",
        vid: "A9vhRbwH2Sw",
        dr: 8
      }, {
        name: "Hip Airplane",
        detail: "6 reps each leg.",
        track: "Reps",
        vid: "AA8zZh8Iz9I",
        dr: 6
      }, {
        name: "Facing Wall Hip Circle Rotations",
        detail: "8 reps each direction.",
        track: "Reps",
        vid: "odvEl4NkZuo",
        dr: 8
      }]
    }, {
      name: "C. CALVES + ANKLES",
      sets: 2,
      color: "var(--ember)",
      exercises: [{
        name: "Loaded SL Calf Raise",
        detail: "10 reps each. Slow eccentric.",
        track: "Reps + Weight",
        vid: "wZfr_svtSr0",
        dr: 10
      }, {
        name: "Ankle Mobility",
        detail: "8 reps each. Wall knee drives.",
        track: "Reps",
        vid: "qXvA35UHs2w",
        dr: 8
      }]
    }, {
      name: "D. NECK",
      sets: 2,
      color: "#546E7A",
      exercises: [{
        name: "Neck Lateral Band Resistance",
        detail: "8 reps each side. Band around head.",
        track: "Reps",
        vid: "QEayGbDM1Do",
        dr: 8
      }, {
        name: "Neck Supine ROM & Strengthening",
        detail: "8 reps. Gentle.",
        track: "Reps",
        vid: "Gxu9U-8NKes",
        dr: 8
      },
        { name: "Neck Bridge", detail: "Hold bridge position. Build neck strength progressively.", track: "Seconds", vid: "kgFFqbiqvW8", dr: 20 }
      ]
    }, {
      name: "E. LOADED STRETCHES",
      sets: 1,
      color: "#009688",
      exercises: [{
        name: "On Bench Lat Stretch to Hip Stretch",
        detail: "30 sec. Flow between lat and hip.",
        track: "Seconds",
        vid: "NmohIiacpK0",
        dr: 30
      }, {
        name: "Posterior Capsule Stretch",
        detail: "30 sec each side. Cross-body shoulder.",
        track: "Seconds",
        vid: "a4ihXemdOZY",
        dr: 30
      }, {
        name: "Seated ER Stretch",
        detail: "30 sec each side. External rotation.",
        track: "Seconds",
        vid: "h6_gNo5Cd4Q",
        dr: 30
      }, { name: "Half-Kneeling Loaded Lateral Tilts", detail: "Half kneeling, loaded side bend and return. Obliques and QL under load.", track: "Reps", vid: "JMah290u6tM", dr: 10 }]
    }]
  }
};


const workoutsA = {
  // ─── MONDAY PULL A (Pull) ───
  MONDAY: {
    title: "PULL A — DL + Row + Lat + Facepull",
    time: "~71 min",
    note: "Pull day order. Hip prep → KB Swing → DL → Pulls → Shoulder health → Sled Row + Dead Hang.",
    blocks: [{
      name: "A. PREP",
      sets: 2,
      color: "var(--full)",
      exercises: [{
        name: "Adductor Rock to Hip Walk Out",
        detail: "8 reps. Open hips for deadlift.",
        track: "Reps",
        vid: "JvQzXBr8sPQ",
        dr: 8
      }, {
        name: "Glute Mobilization",
        detail: "8 reps each leg",
        track: "Reps",
        vid: "5vyJa0vXo7c",
        dr: 8
      }, {
        name: "Crawl Shoulder Tap",
        detail: "8 reps each arm. Shoulder stability.",
        track: "Reps",
        vid: "cMeBUqa4d3E",
        dr: 8
      }, {
        name: "Banded Hip Distraction",
        detail: "30 sec each side. Ease in/out of tension, push hips into extension.",
        track: "Seconds",
        vid: "mDUrMKDZS-U",
        dr: 30
      }, {
        name: "Hip Flexor Plank",
        detail: "20 sec each leg. Hold knee up in plank.",
        track: "Seconds",
        vid: "WCkrF6B4sdg",
        dr: 20
      }, {
        name: "Hip Flexor Loaded Arc Reach",
        detail: "8 reps each leg. KB eccentric hip flexor.",
        track: "Reps + Weight",
        vid: "LuNnBWO8wZ8",
        dr: 8
      }]
    }, {
      name: "A2. POWER",
      sets: 3,
      color: "#E65100",
      exercises: [{
        name: "Kettlebell Swing",
        detail: "10 reps. Explosive hip drive. Squeeze glutes at top.",
        track: "Reps + Weight",
        vid: "moK1eINw7NY",
        dr: 10
      }]
    }, {
      name: "B. MAIN LIFT",
      sets: 4,
      color: "var(--recovery)",
      exercises: [{
        name: "TRAP BAR DEADLIFT",
        detail: "6 reps x 4 sets. RPE 8. Elevate bar if needed.",
        track: "Reps + Weight",
        key: true,
        vid: "nZ4T7DPGa2g",
        dr: 6
      }]
    }, {
      name: "C. MAIN PULL",
      sets: 3,
      color: "var(--recovery)",
      exercises: [{
        name: "PULL-UPS",
        detail: "8 reps. Strict form. Benchmark.",
        track: "Reps",
        key: true,
        vid: "PbfFblcxWSo",
        dr: 8
      }, { name: "Face Pull with External Rotation", detail: "10 reps. Pull to face, externally rotate. Rear delt + shoulder health.", track: "Reps", vid: "m8s7cblgdDQ", dr: 10 }]
    }, {
      name: "D. SECONDARY",
      sets: 3,
      color: "#FF6B35",
      exercises: [{
        name: "Inverted Row",
        detail: "10 reps. Chest to bar. Weighted vest option.",
        track: "Reps",
        vid: "pIMXcgvVg3U",
        dr: 10
      }, {
        name: "Hamstring Bridge with Pullover",
        detail: "5 reps. Chin on chest, abs tight.",
        track: "Reps + Weight",
        vid: "cU2YDlDA8Dw",
        dr: 5
      }, {
        name: "Anti-Rotational Bear Row",
        detail: "8 reps each arm. Row + resist rotation. BJJ stability.",
        track: "Reps + Weight",
        vid: "khcHYAUb7CM",
        dr: 8
      }]
    }, {
      name: "E. BACK VOLUME",
      sets: 3,
      color: "var(--ember)",
      exercises: [{
        name: "Lat Sweep",
        detail: "8 reps. Pause on squeeze. Band option.",
        track: "Reps + Weight",
        vid: "zdTbE1yHygQ",
        dr: 8
      }, { name: "Barbell Bent Over Row", detail: "10 reps. Hinge forward, flat back, pull to lower ribs. Heavy horizontal pull.", track: "Reps + Weight", vid: "bm0_q9bR_HA", dr: 10 }, { name: "Single-Arm DB Row", detail: "8 reps each arm. Hinge, row to hip, control the stretch.", track: "Reps + Weight", vid: "i9BJwVCK5VQ", dr: 8 }]
    }, {
      name: "F. SHOULDER HEALTH",
      sets: 3,
      tierMax: 5,
      color: "#1565C0",
      exercises: [{
        name: "TRX Facepull",
        detail: "8 reps. Squeeze shoulder blades.",
        track: "Reps",
        vid: "PoBbZrY9zTE",
        dr: 8
      }]
    }, {
      name: "G. FINISHER",
      sets: 3,
      color: "#E65100",
      exercises: [{
        name: "Dynamic Sled Row",
        detail: "20m. Pull sled toward you. Back + grip conditioning.",
        track: "Dist + Weight",
        vid: "xdOhwytr0M8",
        dr: 20
      }, {
        name: "Dead Hang",
        detail: "Max hold. Just hang until you drop. Grip endurance for pull-ups + carries.",
        track: "Seconds",
        vid: "XPcT3capkyk",
        dr: 0
      }]
    }]
  },
  // ─── WEDNESDAY PUSH A (Push) ───
  WEDNESDAY: {
    title: "PUSH A — Bench + Push-up + Pec Fly + Core",
    time: "~52 min",
    note: "Push day order. Weighted Push-up + Pec Fly. Core: KB Saw + Leg Lifts. Landmine Lunge.",
    blocks: [{
      name: "A. T-SPINE PREP",
      sets: 1,
      color: "var(--full)",
      exercises: [{
        name: "Off Set Cat Camel",
        detail: "6 reps. Slow, controlled.",
        track: "Reps",
        vid: "JrcOPzvdToQ",
        dr: 6
      }, {
        name: "Kneeling T-Spine with Shoulder Opener",
        detail: "8 reps each side",
        track: "Reps",
        vid: "LnLsZ2gZUK4",
        dr: 8
      }, {
        name: "Push-Up to Toe Touch",
        detail: "8 reps. Push-up then reach to opposite toe.",
        track: "Reps",
        vid: "L-K771jlxXE",
        dr: 8
      }, {
        name: "Banded Face Pulls with ER Focus",
        detail: "8 reps. Scaps move, ribs down.",
        track: "Reps",
        vid: "sQL4qGLDhX4",
        dr: 8
      }, {
        name: "KB SHOULDER ARM BAR",
        detail: "4-5 reps each side. Light KB. Lie on back, press KB up, roll to side. Shoulder stability + T-spine mobility.",
        track: "Reps + Weight",
        vid: "u6TjcV0YKZ8",
        dr: 5
      },
        { name: "Banded Shoulder External Rotation with Arm Behind", detail: "12 reps each side. Arm behind low back, band external rotation. Posterior cuff angle.", track: "Reps", vid: "tJDOsft6JJE", dr: 12 },
        { name: "KB Bottoms-Up Carry", detail: "20m each side. Bell upside down, walk tall and controlled. Shoulder stability + cuff. Start light.", track: "Reps", vid: "wtBDkYRHlr4", dr: 20 }
      , { name: "Banded T-Spine Rotations", detail: "8 reps each side. Banded thoracic rotation.", track: "Reps", vid: "75hleCEfV_I", dr: 8 }, { name: "Banded Shoulder Internal Rotation", detail: "10 reps each arm. Elbow pinned, band internal rotation.", track: "Reps", vid: "xZQP0IkYmUs", dr: 10 }, { name: "Banded Overhead Mobilization", detail: "10 reps. Band overhead, open shoulders and lats before pressing.", track: "Reps", vid: "OuaUM7xZ1ls", dr: 10 }, { name: "Banded Needle Through", detail: "8 reps each side. Thread the needle, thoracic rotation.", track: "Reps", vid: "1uRNvra9LLk", dr: 8 }, { name: "Banded Rotations", detail: "8 reps each side. Banded rotational mobility.", track: "Reps", vid: "ViWJ1u2u4d0", dr: 8 }, { name: "Shoulder Arm Bar", detail: "5 reps each side. KB overhead, roll under control. Loaded shoulder stability.", track: "Reps + Weight", vid: "g2EhWlBX_Qw", dr: 5 }, { name: "Swiss Ball Push", detail: "3 x 10 sec. Press into swiss ball on wall, brace and protract. Serratus stability.", track: "Seconds", vid: "STCC2DY96Mo", dr: 10 }]
    }, {
      name: "B. MAIN LIFT",
      sets: 4,
      color: "var(--recovery)",
      exercises: [{
        name: "BENCH PRESS",
        detail: "4 reps x 4 sets. RPE 8. Walk weights up.",
        track: "Reps + Weight",
        key: true,
        vid: "5lrpyee_asw",
        dr: 4
      }]
    }, {
      name: "C. PUSH VOLUME",
      sets: 3,
      color: "#FF6B35",
      exercises: [{
        name: "Weighted Push Up",
        detail: "12 reps. Plate on back or vest.",
        track: "Reps + Weight",
        vid: "auh9bmLsvUs",
        dr: 12
      }, {
        name: "Standing Banded Pec Fly",
        detail: "8 reps. Slow squeeze.",
        track: "Reps",
        vid: "BUOVM8nMeIE",
        dr: 8
      }, { name: "Incline DB Press", detail: "8 reps. Incline bench, dumbbells, full ROM. Upper chest.", track: "Reps + Weight", vid: "G1mCi5idEbk", dr: 8 }]
    }, {
      name: "D. LANDMINE",
      sets: 2,
      color: "#E65100",
      exercises: [{
        name: "Rotational Landmine Clean and Press",
        detail: "6 reps each side. Explosive rotation + clean + press. Muay-Thaï power.",
        track: "Reps + Weight",
        vid: "bZRXZZXOEdQ",
        dr: 6
      }, {
        name: "Half Kneeling SA Landmine Press",
        detail: "6 reps each arm. Fixed kneeling, one arm press.",
        track: "Reps + Weight",
        vid: "fx6lSVNvu-4",
        dr: 6
      }]
    }, {
      name: "E. CORE",
      sets: 3,
      color: "#1565C0",
      exercises: [{
        name: "Plank Kettlebell Saw",
        detail: "8 reps. KB slides side to side.",
        track: "Reps + Weight",
        vid: "KSNVUPybktI",
        dr: 8
      }, {
        name: "Loaded Leg Lifts",
        detail: "8 reps. Band or weight on raised leg. Resist down.",
        track: "Reps + Weight",
        vid: "PpZxg66ftYc",
        dr: 8
      }, {
        name: "Dumbbell Diagonal Chop",
        detail: "8 reps each side. Kneeling, low to high. Rotational core.",
        track: "Reps + Weight",
        vid: "At6-Mna8za8",
        dr: 8
      }]
    }, {
      name: "F. GRIP FINISHER",
      sets: 2,
      color: "#E65100",
      exercises: [{
        name: "Plate Pinch Hold",
        detail: "Max hold each hand. Two plates smooth-side-out. Thumb + finger strength.",
        track: "Seconds",
        vid: "woJifu7hSD8",
        dr: 0
      }]
    }]
  },
  // ─── FRIDAY LEGS A (Legs + carries carries) ───
  FRIDAY: {
    title: "LEGS A — Squat + Split Squat + Farmer's Carry",
    time: "~60 min",
    note: "Legs day order + Wednesday carries. Core activation → Power → Squat → Accessories → Carry → Knee → Ankle.",
    blocks: [{
      name: "A. CORE ACTIVATION",
      sets: 1,
      color: "var(--full)",
      exercises: [{
        name: "OH to Toe Tap w/ Med Ball",
        detail: "8 reps. Full body warm-up.",
        track: "Reps + Weight",
        vid: "1TVwZgmpOhI",
        dr: 8
      }, {
        name: "PLANK",
        detail: "60 sec hold. Benchmark.",
        track: "Seconds",
        key: true,
        vid: "8IwGcPsPpkw",
        dr: 60
      }, {
        name: "Deadbug",
        detail: "8 reps each leg",
        track: "Reps",
        vid: "rvNkdS3qAyM",
        dr: 8
      }, {
        name: "Figure 4 Flow",
        detail: "8 reps each side. Deep hip rotators. BJJ guard.",
        track: "Reps",
        vid: "GAjN5llpzrE",
        dr: 8
      }, {
        name: "Side Bridge Abduction from Elbow",
        detail: "20 sec each side",
        track: "Seconds",
        vid: "ps9A_IO36b0",
        dr: 20
      }, {
        name: "Hip Hike",
        detail: "10 reps each side. Stand on step, drop hip, hike back up. Glute med + QL.",
        track: "Reps",
        vid: "LOYtT-BRGdY",
        dr: 10
      }, {
        name: "Leg Swings \u2014 Front/Back + Lateral",
        detail: "10 reps front/back each leg, then 10 reps lateral each leg. Full hip mobility.",
        track: "Reps",
        vid: "wF10oYsLUw0",
        dr: 10
      },
        { name: "Banded Side-Lying Hip Abduction", detail: "12 reps each side. Lie on side, band on thighs, lift top leg slow. Glute medius for knee tracking.", track: "Reps", vid: "TCjssGsibKU", dr: 12 }
      ]
    }, {
      name: "A2. POWER PRIMER",
      sets: 3,
      color: "#E65100",
      exercises: [{
        name: "Seated Box Jump",
        detail: "5 reps. Dead stop. Explode. Broad jump builder.",
        track: "Reps",
        vid: "_vs2m-8NHTI",
        dr: 5
      }]
    }, {
      name: "B. MAIN LIFT",
      sets: 4,
      color: "var(--recovery)",
      exercises: [{
        name: "BACK SQUAT",
        detail: "4 reps x 4 sets. RPE 8.",
        track: "Reps + Weight",
        key: true,
        vid: "pWWBjAvJuoA",
        dr: 4
      }]
    }, {
      name: "C. LEGS",
      sets: 3,
      color: "#FF6B35",
      exercises: [{
        name: "Rear Foot Elevated Split Squat",
        detail: "8 reps each leg.",
        track: "Reps + Weight",
        vid: "um_OOswiPS4",
        dr: 8
      }, {
        name: "Single-Leg RDL",
        detail: "8 reps each leg. True single leg balance.",
        track: "Reps + Weight",
        vid: "s32cCgmRV3I",
        dr: 8
      }]
    }, {
      name: "D. CARRY",
      sets: 3,
      tierMax: 4,
      color: "#E65100",
      exercises: [{
        name: "FARMER'S CARRY",
        detail: "Both hands. Bodyweight goal. Benchmark.",
        track: "Dist + Weight",
        key: true,
        vid: "fPwwaXCgDNE",
        dr: 20
      }, {
        name: "Suitcase Carry",
        detail: "20 steps each side. One hand. Anti-lateral flexion.",
        track: "Dist + Weight",
        vid: "iTjwbts8Djw",
        dr: 20
      }]
    }, {
      name: "E. KNEE HEALTH",
      sets: 2,
      color: "var(--ember)",
      exercises: [{
        name: "Banded Terminal Knee Extension",
        detail: "15 reps each leg. Light band warm-up. Prime the VMO.",
        track: "Reps",
        vid: "CU7Fn11YMTw",
        dr: 15
      }, {
        name: "Reverse Sled Drag",
        detail: "20 steps. Walk backwards. Bulletproof knees.",
        track: "Dist + Weight",
        vid: "wa3tZH_yaRY",
        dr: 20
      }, {
        name: "BW Knee Extension (Reverse Nordic)",
        detail: "6-8 reps. Kneel, lean back with hips locked. Eccentric quad loading at long muscle length. Go slow.",
        track: "Reps",
        vid: "5ZCgazq6Emk",
        dr: 8
      }, { name: "Band Assisted Straight Leg Raise", detail: "8 reps each leg. Band-assisted hamstring stretch.", track: "Reps", vid: "Wnhc8hsTtpI", dr: 8 }]
    }, {
      name: "G. CALVES + ANKLE",
      sets: 2,
      color: "#546E7A",
      exercises: [{
        name: "Loaded SL Calf Raise",
        detail: "8 reps each leg. Slow, full ROM.",
        track: "Reps + Weight",
        vid: null,
        dr: 8
      }, {
        name: "Ankle Mobility",
        detail: "8 reps each ankle.",
        track: "Reps",
        vid: "qXvA35UHs2w",
        dr: 8
      }]
    }]
  },
  // ─── SATURDAY A (from Arms day arms + Saturday mobility + Wednesday forearms) ───
  SATURDAY: {
    title: "ARMS A + HIP MOBILITY + GRIP + STRETCH + SAUNA",
    time: "~67 min",
    note: "Power primer wake-up + Arms day + Saturday hip mobility + Wednesday forearms. Evening: 20 min sauna session (CHF 29). Hydrate well before and after.",
    blocks: [{
      name: "A1. POWER PRIMER",
      sets: 3,
      color: "#E65100",
      exercises: [{
        name: "TRX Jump Squat",
        detail: "5 reps. Hold TRX, assisted explosive jump. Gentle landing, full hip drive. CNS wake-up.",
        track: "Reps",
        vid: "o0b5XFfd0wQ",
        dr: 5
      }]
    }, {
      name: "A. HIP MOBILITY (Mobility day)",
      sets: 2,
      color: "var(--full)",
      exercises: [{
        name: "Low Back Swivels",
        detail: "8 reps each side. Spinal mobility.",
        track: "Reps",
        vid: "gb5KeyG9i14",
        dr: 8
      }, {
        name: "Shin Box Fold",
        detail: "8 reps. Deep hip rotation.",
        track: "Reps",
        vid: "A9vhRbwH2Sw",
        dr: 8
      }, {
        name: "Heel Clicks",
        detail: "8 reps. Open groin.",
        track: "Reps",
        vid: "bBtfjTVPkus",
        dr: 8
      }, {
        name: "Facing Wall Hip Circle Rotations",
        detail: "6 reps each direction",
        track: "Reps",
        vid: "odvEl4NkZuo",
        dr: 6
      }, {
        name: "Overhead Banded Shoulder Perturbations",
        detail: "8 reps each side. Band around wrists, resist perturbation.",
        track: "Reps",
        vid: "pp5yEKD3udc",
        dr: 8
      }, { name: "Ankle CARs", detail: "5 reps each direction. Controlled ankle circles.", track: "Reps", vid: "UVtCSGJmGEY", dr: 5 }]
    }, {
      name: "A2. SHOULDER WARM-UP (Arms day)",
      sets: 2,
      color: "var(--full)",
      exercises: [{
        name: "Band Pull Aparts",
        detail: "12 reps. Light band. Open chest.",
        track: "Reps",
        vid: "SuvO4TBwSu4",
        dr: 12
      }]
    }, {
      name: "B. TRICEPS (Arms day)",
      sets: 3,
      color: "var(--recovery)",
      exercises: [{
        name: "Close Grip Barbell Bench Press",
        detail: "12 reps. Hands shoulder-width. Heaviest tricep movement first.",
        track: "Reps + Weight",
        vid: "Inj9b3jhREY",
        dr: 12
      }, {
        name: "DIPS",
        detail: "8-12 reps. Add weight if too easy. RPE 8.",
        track: "Reps + Weight",
        key: true,
        vid: null,
        dr: 10
      }, {
        name: "Tricep Dive Ins with Rope",
        detail: "10 reps. Full extension squeeze.",
        track: "Reps + Weight",
        vid: "DrnY3A9p4Cs",
        dr: 10
      }, { name: "Overhead Tricep Extension", detail: "10 reps. Overhead, full stretch, control. Long head.", track: "Reps + Weight", vid: "T3e390Dl3XU", dr: 10 }]
    }, {
      name: "C. BICEPS (Arms day)",
      sets: 3,
      color: "#FF6B35",
      exercises: [{
        name: "Barbell Bicep Curl",
        detail: "10 reps. Strict, no swinging.",
        track: "Reps + Weight",
        vid: "adJ7uPewTlg",
        dr: 10
      }, {
        name: "DB Lateral Raises",
        detail: "8 reps. Moderate weight. Shoulder width.",
        track: "Reps + Weight",
        vid: "KkynA3FpkhE",
        dr: 8
      }, { name: "Hammer Curl", detail: "8 reps. Neutral grip, control. Brachialis + forearm.", track: "Reps + Weight", vid: "0qzSDAfBzSw", dr: 8 }]
    }, {
      name: "D. FOREARMS (Forearms day)",
      sets: 2,
      color: "#E65100",
      exercises: [{
        name: "Grip Plate Walk",
        detail: "45lb plates pinch grip, 30-40ft.",
        track: "Dist + Weight",
        vid: "KaP9yXoFeNU",
        dr: 0
      }, {
        name: "Forearm Twist + Curl with Towel",
        detail: "8 reps. Towel over KB.",
        track: "Reps + Weight",
        vid: "Bc3qLJnYwkI",
        dr: 8
      }, {
        name: "Isolated Forearm Dumbbell Front, Back, Side",
        detail: "8 reps each direction. Wrist curls front, back, and side.",
        track: "Reps + Weight",
        vid: null,
        dr: 8
      }, {
        name: "Kettlebell Forearm Rotation",
        detail: "8 reps each direction. Hold KB by handle, rotate forearm in/out. Controlled tempo.",
        track: "Reps + Weight",
        vid: "FwCuyV208bU",
        dr: 8
      }, {
        name: "Grip Roller",
        detail: "Heavy weight, up and down twice.",
        track: "Reps + Weight",
        vid: "4Ue3XwpK4G4",
        dr: 2
      }, { name: "Banded Wrist Rotation", detail: "10 reps each direction. Band around hand, rotate through wrist. Wrist + forearm health.", track: "Reps", vid: "vXaF4LVlaic", dr: 10 }, { name: "Seated DB Wrist Curl", detail: "8 reps. Forearms on thighs, curl wrists up. Flexors.", track: "Reps + Weight", vid: "y-x14sVi12o", dr: 8 }]
    }, {
      name: "E. NECK",
      sets: 2,
      tierMax: 5,
      color: "#546E7A",
      exercises: [{
        name: "Neck Bridge",
        detail: "Hold 20 sec. BJJ foundation. Front and back.",
        track: "Seconds",
        vid: "kgFFqbiqvW8",
        dr: 20
      }, {
        name: "Neck Rotations",
        detail: "8 reps each direction. Slow.",
        track: "Reps",
        vid: "Fx4LvjovL_k",
        dr: 8
      }, { name: "Neck Prone ROM & Strengthening", detail: "8 reps. Prone, controlled neck ROM.", track: "Reps", vid: "cjIDKy6z3zY", dr: 8 }]
    }, {
      name: "F. STRETCH",
      sets: 1,
      tierMax: 5,
      color: "#009688",
      exercises: [{
        name: "Loaded Lat Stretch",
        detail: "30 sec each side.",
        track: "Seconds",
        vid: "9Pik5qPNgCo",
        dr: 30
      }, {
        name: "Seated Hip Stretch",
        detail: "30 sec each side.",
        track: "Seconds",
        vid: "VtcR9kUn5v8",
        dr: 30
      }, {
        name: "Deep Chest Stretch ISO",
        detail: "30 sec each side.",
        track: "Seconds",
        vid: "bbCEt0kphkA",
        dr: 30
      }]
    }]
  },
  WEDNESDAY: {
    title: "PUSH A — Bench + Push-up + Pec Fly + Core",
    time: "~52 min",
    note: "Push day order. Weighted Push-up + Pec Fly. Core: KB Saw + Leg Lifts. Landmine Lunge.",
    blocks: [{
      name: "A. T-SPINE PREP",
      sets: 1,
      color: "var(--full)",
      exercises: [{
        name: "Off Set Cat Camel",
        detail: "6 reps. Slow, controlled.",
        track: "Reps",
        vid: "JrcOPzvdToQ",
        dr: 6
      }, {
        name: "Kneeling T-Spine with Shoulder Opener",
        detail: "8 reps each side",
        track: "Reps",
        vid: "LnLsZ2gZUK4",
        dr: 8
      }, {
        name: "Push-Up to Toe Touch",
        detail: "8 reps. Push-up then reach to opposite toe.",
        track: "Reps",
        vid: "L-K771jlxXE",
        dr: 8
      }, {
        name: "Banded Face Pulls with ER Focus",
        detail: "8 reps. Scaps move, ribs down.",
        track: "Reps",
        vid: "sQL4qGLDhX4",
        dr: 8
      }, {
        name: "KB SHOULDER ARM BAR",
        detail: "4-5 reps each side. Light KB. Lie on back, press KB up, roll to side. Shoulder stability + T-spine mobility.",
        track: "Reps + Weight",
        vid: "u6TjcV0YKZ8",
        dr: 5
      }]
    }, {
      name: "B. MAIN LIFT",
      sets: 4,
      color: "var(--recovery)",
      exercises: [{
        name: "BENCH PRESS",
        detail: "4 reps x 4 sets. RPE 8. Walk weights up.",
        track: "Reps + Weight",
        key: true,
        vid: "5lrpyee_asw",
        dr: 4
      }]
    }, {
      name: "C. PUSH VOLUME",
      sets: 3,
      color: "#FF6B35",
      exercises: [{
        name: "Weighted Push Up",
        detail: "12 reps. Plate on back or vest.",
        track: "Reps + Weight",
        vid: "auh9bmLsvUs",
        dr: 12
      }, {
        name: "Standing Banded Pec Fly",
        detail: "8 reps. Slow squeeze.",
        track: "Reps",
        vid: "BUOVM8nMeIE",
        dr: 8
      }]
    }, {
      name: "D. LANDMINE",
      sets: 2,
      color: "#E65100",
      exercises: [{
        name: "Rotational Landmine Clean and Press",
        detail: "6 reps each side. Explosive rotation + clean + press. Muay-Thaï power.",
        track: "Reps + Weight",
        vid: "bZRXZZXOEdQ",
        dr: 6
      }, {
        name: "Half Kneeling SA Landmine Press",
        detail: "6 reps each arm. Fixed kneeling, one arm press.",
        track: "Reps + Weight",
        vid: "fx6lSVNvu-4",
        dr: 6
      }]
    }, {
      name: "E. CORE",
      sets: 3,
      color: "#1565C0",
      exercises: [{
        name: "Plank Kettlebell Saw",
        detail: "8 reps. KB slides side to side.",
        track: "Reps + Weight",
        vid: "KSNVUPybktI",
        dr: 8
      }, {
        name: "Loaded Leg Lifts",
        detail: "8 reps. Band or weight on raised leg. Resist down.",
        track: "Reps + Weight",
        vid: "PpZxg66ftYc",
        dr: 8
      }, {
        name: "Dumbbell Diagonal Chop",
        detail: "8 reps each side. Kneeling, low to high. Rotational core.",
        track: "Reps + Weight",
        vid: "At6-Mna8za8",
        dr: 8
      }]
    }, {
      name: "F. GRIP FINISHER",
      sets: 2,
      color: "#E65100",
      exercises: [{
        name: "Plate Pinch Hold",
        detail: "Max hold each hand. Two plates smooth-side-out. Thumb + finger strength.",
        track: "Seconds",
        vid: "woJifu7hSD8",
        dr: 0
      }]
    }]
  },
  // ─── FRIDAY LEGS A (Legs + carries carries) ───
  FRIDAY: {
    title: "LEGS A — Squat + Split Squat + Farmer's Carry",
    time: "~60 min",
    note: "Legs day order + Wednesday carries. Core activation → Power → Squat → Accessories → Carry → Knee → Ankle.",
    blocks: [{
      name: "A. CORE ACTIVATION",
      sets: 1,
      color: "var(--full)",
      exercises: [{
        name: "OH to Toe Tap w/ Med Ball",
        detail: "8 reps. Full body warm-up.",
        track: "Reps + Weight",
        vid: "1TVwZgmpOhI",
        dr: 8
      }, {
        name: "PLANK",
        detail: "60 sec hold. Benchmark.",
        track: "Seconds",
        key: true,
        vid: "8IwGcPsPpkw",
        dr: 60
      }, {
        name: "Deadbug",
        detail: "8 reps each leg",
        track: "Reps",
        vid: "rvNkdS3qAyM",
        dr: 8
      }, {
        name: "Figure 4 Flow",
        detail: "8 reps each side. Deep hip rotators. BJJ guard.",
        track: "Reps",
        vid: "GAjN5llpzrE",
        dr: 8
      }, {
        name: "Side Bridge Abduction from Elbow",
        detail: "20 sec each side",
        track: "Seconds",
        vid: "ps9A_IO36b0",
        dr: 20
      }, {
        name: "Hip Hike",
        detail: "10 reps each side. Stand on step, drop hip, hike back up. Glute med + QL.",
        track: "Reps",
        vid: "LOYtT-BRGdY",
        dr: 10
      }, {
        name: "Leg Swings \u2014 Front/Back + Lateral",
        detail: "10 reps front/back each leg, then 10 reps lateral each leg. Full hip mobility.",
        track: "Reps",
        vid: "wF10oYsLUw0",
        dr: 10
      }]
    }, {
      name: "A2. POWER PRIMER",
      sets: 3,
      color: "#E65100",
      exercises: [{
        name: "Seated Box Jump",
        detail: "5 reps. Dead stop. Explode. Broad jump builder.",
        track: "Reps",
        vid: "_vs2m-8NHTI",
        dr: 5
      }]
    }, {
      name: "B. MAIN LIFT",
      sets: 4,
      color: "var(--recovery)",
      exercises: [{
        name: "BACK SQUAT",
        detail: "4 reps x 4 sets. RPE 8.",
        track: "Reps + Weight",
        key: true,
        vid: "pWWBjAvJuoA",
        dr: 4
      }]
    }, {
      name: "C. LEGS",
      sets: 3,
      color: "#FF6B35",
      exercises: [{
        name: "Rear Foot Elevated Split Squat",
        detail: "8 reps each leg.",
        track: "Reps + Weight",
        vid: "um_OOswiPS4",
        dr: 8
      }, {
        name: "Single-Leg RDL",
        detail: "8 reps each leg. True single leg balance.",
        track: "Reps + Weight",
        vid: "s32cCgmRV3I",
        dr: 8
      }]
    }, {
      name: "D. CARRY",
      sets: 3,
      tierMax: 4,
      color: "#E65100",
      exercises: [{
        name: "FARMER'S CARRY",
        detail: "Both hands. Bodyweight goal. Benchmark.",
        track: "Dist + Weight",
        key: true,
        vid: "fPwwaXCgDNE",
        dr: 20
      }, {
        name: "Suitcase Carry",
        detail: "20 steps each side. One hand. Anti-lateral flexion.",
        track: "Dist + Weight",
        vid: "iTjwbts8Djw",
        dr: 20
      }]
    }, {
      name: "E. KNEE HEALTH",
      sets: 2,
      color: "var(--ember)",
      exercises: [{
        name: "Banded Terminal Knee Extension",
        detail: "15 reps each leg. Light band warm-up. Prime the VMO.",
        track: "Reps",
        vid: "CU7Fn11YMTw",
        dr: 15
      }, {
        name: "Reverse Sled Drag",
        detail: "20 steps. Walk backwards. Bulletproof knees.",
        track: "Dist + Weight",
        vid: "wa3tZH_yaRY",
        dr: 20
      }, {
        name: "BW Knee Extension (Reverse Nordic)",
        detail: "6-8 reps. Kneel, lean back with hips locked. Eccentric quad loading at long muscle length. Go slow.",
        track: "Reps",
        vid: "5ZCgazq6Emk",
        dr: 8
      }]
    }, {
      name: "G. CALVES + ANKLE",
      sets: 2,
      color: "#546E7A",
      exercises: [{
        name: "Loaded SL Calf Raise",
        detail: "8 reps each leg. Slow, full ROM.",
        track: "Reps + Weight",
        vid: null,
        dr: 8
      }, {
        name: "Ankle Mobility",
        detail: "8 reps each ankle.",
        track: "Reps",
        vid: "qXvA35UHs2w",
        dr: 8
      }]
    }]
  },
  // ─── SATURDAY A (from Arms day arms + Saturday mobility + Wednesday forearms) ───
  SATURDAY: {
    title: "ARMS A + HIP MOBILITY + GRIP + STRETCH + SAUNA",
    time: "~67 min",
    note: "Power primer wake-up + Arms day + Saturday hip mobility + Wednesday forearms. Evening: 20 min sauna session (CHF 29). Hydrate well before and after.",
    blocks: [{
      name: "A1. POWER PRIMER",
      sets: 3,
      color: "#E65100",
      exercises: [{
        name: "TRX Jump Squat",
        detail: "5 reps. Hold TRX, assisted explosive jump. Gentle landing, full hip drive. CNS wake-up.",
        track: "Reps",
        vid: "o0b5XFfd0wQ",
        dr: 5
      }]
    }, {
      name: "A. HIP MOBILITY (Mobility day)",
      sets: 2,
      color: "var(--full)",
      exercises: [{
        name: "Low Back Swivels",
        detail: "8 reps each side. Spinal mobility.",
        track: "Reps",
        vid: "gb5KeyG9i14",
        dr: 8
      }, {
        name: "Shin Box Fold",
        detail: "8 reps. Deep hip rotation.",
        track: "Reps",
        vid: "A9vhRbwH2Sw",
        dr: 8
      }, {
        name: "Heel Clicks",
        detail: "8 reps. Open groin.",
        track: "Reps",
        vid: "bBtfjTVPkus",
        dr: 8
      }, {
        name: "Facing Wall Hip Circle Rotations",
        detail: "6 reps each direction",
        track: "Reps",
        vid: "odvEl4NkZuo",
        dr: 6
      }, {
        name: "Overhead Banded Shoulder Perturbations",
        detail: "8 reps each side. Band around wrists, resist perturbation.",
        track: "Reps",
        vid: "pp5yEKD3udc",
        dr: 8
      }]
    }, {
      name: "A2. SHOULDER WARM-UP (Arms day)",
      sets: 2,
      color: "var(--full)",
      exercises: [{
        name: "Band Pull Aparts",
        detail: "12 reps. Light band. Open chest.",
        track: "Reps",
        vid: "SuvO4TBwSu4",
        dr: 12
      }]
    }, {
      name: "B. TRICEPS (Arms day)",
      sets: 3,
      color: "var(--recovery)",
      exercises: [{
        name: "Close Grip Barbell Bench Press",
        detail: "12 reps. Hands shoulder-width. Heaviest tricep movement first.",
        track: "Reps + Weight",
        vid: "Inj9b3jhREY",
        dr: 12
      }, {
        name: "DIPS",
        detail: "8-12 reps. Add weight if too easy. RPE 8.",
        track: "Reps + Weight",
        key: true,
        vid: null,
        dr: 10
      }, {
        name: "Tricep Dive Ins with Rope",
        detail: "10 reps. Full extension squeeze.",
        track: "Reps + Weight",
        vid: "DrnY3A9p4Cs",
        dr: 10
      }]
    }, {
      name: "C. BICEPS (Arms day)",
      sets: 3,
      color: "#FF6B35",
      exercises: [{
        name: "Barbell Bicep Curl",
        detail: "10 reps. Strict, no swinging.",
        track: "Reps + Weight",
        vid: "adJ7uPewTlg",
        dr: 10
      }, {
        name: "DB Lateral Raises",
        detail: "8 reps. Moderate weight. Shoulder width.",
        track: "Reps + Weight",
        vid: "KkynA3FpkhE",
        dr: 8
      }]
    }, {
      name: "D. FOREARMS (Forearms day)",
      sets: 2,
      color: "#E65100",
      exercises: [{
        name: "Grip Plate Walk",
        detail: "45lb plates pinch grip, 30-40ft.",
        track: "Dist + Weight",
        vid: "KaP9yXoFeNU",
        dr: 0
      }, {
        name: "Forearm Twist + Curl with Towel",
        detail: "8 reps. Towel over KB.",
        track: "Reps + Weight",
        vid: "Bc3qLJnYwkI",
        dr: 8
      }, {
        name: "Isolated Forearm Dumbbell Front, Back, Side",
        detail: "8 reps each direction. Wrist curls front, back, and side.",
        track: "Reps + Weight",
        vid: null,
        dr: 8
      }, {
        name: "Kettlebell Forearm Rotation",
        detail: "8 reps each direction. Hold KB by handle, rotate forearm in/out. Controlled tempo.",
        track: "Reps + Weight",
        vid: "FwCuyV208bU",
        dr: 8
      }, {
        name: "Grip Roller",
        detail: "Heavy weight, up and down twice.",
        track: "Reps + Weight",
        vid: "4Ue3XwpK4G4",
        dr: 2
      }]
    }, {
      name: "E. NECK",
      sets: 2,
      tierMax: 5,
      color: "#546E7A",
      exercises: [{
        name: "Neck Bridge",
        detail: "Hold 20 sec. BJJ foundation. Front and back.",
        track: "Seconds",
        vid: "kgFFqbiqvW8",
        dr: 20
      }, {
        name: "Neck Rotations",
        detail: "8 reps each direction. Slow.",
        track: "Reps",
        vid: "Fx4LvjovL_k",
        dr: 8
      }]
    }, {
      name: "F. STRETCH",
      sets: 1,
      tierMax: 5,
      color: "#009688",
      exercises: [{
        name: "Loaded Lat Stretch",
        detail: "30 sec each side.",
        track: "Seconds",
        vid: "9Pik5qPNgCo",
        dr: 30
      }, {
        name: "Seated Hip Stretch",
        detail: "30 sec each side.",
        track: "Seconds",
        vid: "VtcR9kUn5v8",
        dr: 30
      }, {
        name: "Deep Chest Stretch ISO",
        detail: "30 sec each side.",
        track: "Seconds",
        vid: "bbCEt0kphkA",
        dr: 30
      }]
    }]
  },
  TUESDAY: {
    title: "Jiu-Jitsu Brésilien",
    fightTitle: "Jiu-Jitsu Brésilien",
    trainTitle: "CONDITIONING + LOADED PULLS A",
    time: "75 min",
    trainTime: "~50 min",
    note: "No lifting today.",
    trainNote: "Day 5: Loaded pulls, carry capacity, conditioning, grip endurance.",
    tierRequired: 6,
    blocks: [{
      name: "A. MOVEMENT PREP",
      sets: 1,
      color: "var(--full)",
      exercises: [{
        name: "Dead Hang",
        detail: "30 sec. Shoulder decompression + grip wake-up.",
        track: "Seconds",
        vid: "XPcT3capkyk",
        dr: 30
      }, {
        name: "Hip Flexor Plank",
        detail: "20 sec each leg. Hold knee up in plank.",
        track: "Seconds",
        vid: "WCkrF6B4sdg",
        dr: 20
      }]
    }, {
      name: "B. LOADED PULLS",
      sets: 3,
      color: "#1565C0",
      exercises: [{
        name: "Lateral Bridge with Row",
        detail: "8 reps each side. Side plank + row combo. Anti-rotation + pull.",
        track: "Reps + Weight",
        vid: "kiBDuPbWg2A",
        dr: 8
      }, {
        name: "KB Vertical Pull",
        detail: "8 reps. Floor to overhead. Explosive pull.",
        track: "Reps + Weight",
        vid: "S7jLS4f2FTI",
        dr: 8
      }]
    }, {
      name: "C. CARRY + CONDITIONING",
      sets: 3,
      color: "var(--recovery)",
      exercises: [{
        name: "FARMER\'S CARRY",
        detail: "175ft (53m) at bodyweight. Benchmark.",
        track: "Dist + Weight",
        key: true,
        vid: "fPwwaXCgDNE",
        dr: 175
      }, {
        name: "Sled Push",
        detail: "20 steps. Heavy. Full body conditioning.",
        track: "Dist + Weight",
        vid: "t68aeTBXZ7s",
        dr: 20
      }]
    }, {
      name: "D. CORE",
      sets: 2,
      color: "#FF6B35",
      exercises: [{
        name: "Side Bridge Abduction from Elbow",
        detail: "8 reps each side. Side plank + top leg lift.",
        track: "Reps",
        vid: "ps9A_IO36b0",
        dr: 8
      }, {
        name: "Side Bridge Adductor March",
        detail: "8 reps each side. Side plank on bottom leg, march top.",
        track: "Reps",
        vid: "jY-9b4ZD-nc",
        dr: 8
      }]
    }, {
      name: "E. GRIP",
      sets: 1,
      color: "#E65100",
      exercises: [{
        name: "Wrist Roller",
        detail: "2 sets up + down. Roll weight up, lower slow. Forearm endurance.",
        track: "Reps",
        vid: "8ARDRJjhnSw",
        dr: 2
      }, {
        name: "Kettlebell Forearm Rotation",
        detail: "10 reps each way. KB rotation, wrist control. Grip + forearm.",
        track: "Reps + Weight",
        vid: "FwCuyV208bU",
        dr: 8
      }]
    }]
  },
  THURSDAY: {
    title: "Muay-Thaï",
    fightTitle: "Muay-Thaï",
    trainTitle: "POWER + ACCESSORIES A",
    time: "90 min",
    trainTime: "~45 min",
    note: "No lifting today.",
    trainNote: "Day 6: Rotational power, single-leg strength, neck durability. No fighting at BE A PRO.",
    tierRequired: 5,
    blocks: [{
      name: "A. SHOULDER + HIP PREP",
      sets: 1,
      color: "var(--full)",
      exercises: [{
        name: "Shoulder CARs",
        detail: "5 slow circles each direction. Full ROM.",
        track: "Reps",
        vid: "ZOP6RPjdAhA",
        dr: 5
      }, {
        name: "KB SHOULDER ARM BAR",
        detail: "4-5 reps each side. Light KB. Shoulder stability.",
        track: "Reps + Weight",
        vid: "u6TjcV0YKZ8",
        dr: 5
      }, {
        name: "Shin Box Fold",
        detail: "8 reps. Deep hip internal/external rotation.",
        track: "Reps",
        vid: "A9vhRbwH2Sw",
        dr: 8
      }]
    }, {
      name: "B. POWER",
      sets: 3,
      color: "var(--recovery)",
      exercises: [{
        name: "Med Ball Rotational Throw",
        detail: "6 reps each side. Hip-driven, against wall. Rotational power.",
        track: "Reps + Weight",
        key: true,
        vid: "02c2YLgF8iE",
        dr: 6
      }, {
        name: "Hanging Knee Raise",
        detail: "8 reps. Slow controlled. Hip flexor + core.",
        track: "Reps",
        vid: "RD_A-Z15ER4",
        dr: 8
      }]
    }, {
      name: "C. SINGLE-LEG",
      sets: 3,
      color: "#FF6B35",
      exercises: [{
        name: "Skater Squat",
        detail: "5 reps each leg. Controlled descent. Single-leg strength.",
        track: "Reps",
        vid: "xa2Dy8fyN1Q",
        dr: 5
      }, {
        name: "Single-Leg RDL",
        detail: "6 reps each leg. Bodyweight or light KB. Balance + posterior chain.",
        track: "Reps + Weight",
        vid: "s32cCgmRV3I",
        dr: 6
      }]
    }, {
      name: "D. NECK",
      sets: 2,
      color: "#546E7A",
      exercises: [{
        name: "Neck Bridge",
        detail: "4 reps. Slow, controlled bridge. Isometric hold at top.",
        track: "Reps",
        vid: "kgFFqbiqvW8",
        dr: 4
      }, {
        name: "Neck Rotations",
        detail: "8 reps each direction. Band or manual resistance.",
        track: "Reps",
        vid: "Fx4LvjovL_k",
        dr: 8
      }]
    }, {
      name: "E. STRETCH",
      sets: 1,
      color: "#009688",
      exercises: [{
        name: "Loaded Lat Stretch",
        detail: "30 sec each side. Hang from bar or rack.",
        track: "Seconds",
        vid: "9Pik5qPNgCo",
        dr: 30
      }, {
        name: "Deep Chest Stretch ISO",
        detail: "30 sec each side. Doorway or rack.",
        track: "Seconds",
        vid: "bbCEt0kphkA",
        dr: 30
      }]
    }]
  },
  SUNDAY: {
    title: "Sacred Rest",
    time: "—",
    note: "Zero training. Full recovery.",
    blocks: []
  }
};

// ═══════════════════════════════════════════════════════════
// WEEK B — Same hierarchy. Accessories rotate. Main lifts stay.
// ═══════════════════════════════════════════════════════════
const workoutsB = {
  // ─── MONDAY PULL B ───
  MONDAY: {
    title: "PULL B — DL + Chin-up + KB Pull + Glute Bridge",
    time: "~69 min",
    note: "Pull day order. Hip prep → DB Snatch → DL → Pulls → Posterior → Lateral Core → Sled Row + Dead Hang.",
    blocks: [{
      name: "A. PREP",
      sets: 2,
      color: "var(--full)",
      exercises: [{
        name: "Adductor Rock to Hip Walk Out",
        detail: "8 reps. Open hips.",
        track: "Reps",
        vid: "JvQzXBr8sPQ",
        dr: 8
      }, {
        name: "Glute Mobilization",
        detail: "8 reps each leg",
        track: "Reps",
        vid: "5vyJa0vXo7c",
        dr: 8
      }, {
        name: "Banded Split Squat Drifts",
        detail: "8 reps each leg. Hip activation.",
        track: "Reps",
        vid: "ynGQy_GOfrQ",
        dr: 8
      }, {
        name: "Banded Hip Distraction",
        detail: "30 sec each side. Ease in/out of tension, push hips into extension.",
        track: "Seconds",
        vid: "mDUrMKDZS-U",
        dr: 30
      }, {
        name: "Hip Flexor Plank",
        detail: "20 sec each leg. Hold knee up in plank.",
        track: "Seconds",
        vid: "WCkrF6B4sdg",
        dr: 20
      }, {
        name: "Hip Flexor Loaded Arc Reach",
        detail: "8 reps each leg. KB eccentric hip flexor.",
        track: "Reps + Weight",
        vid: "LuNnBWO8wZ8",
        dr: 8
      }]
    }, {
      name: "A2. POWER",
      sets: 3,
      color: "#E65100",
      exercises: [{
        name: "Dumbbell Snatch",
        detail: "5 reps each arm. Floor to overhead. Explosive.",
        track: "Reps + Weight",
        vid: "-px4XoSZr1g",
        dr: 5
      }]
    }, {
      name: "B. MAIN LIFT",
      sets: 4,
      color: "var(--recovery)",
      exercises: [{
        name: "TRAP BAR DEADLIFT",
        detail: "6 reps x 4 sets. RPE 8.",
        track: "Reps + Weight",
        key: true,
        vid: "nZ4T7DPGa2g",
        dr: 6
      }]
    }, {
      name: "C. MAIN PULL",
      sets: 3,
      color: "var(--recovery)",
      exercises: [{
        name: "PULL-UPS",
        detail: "8 reps. Strict. Benchmark.",
        track: "Reps",
        key: true,
        vid: "PbfFblcxWSo",
        dr: 8
      }, { name: "Face Pull with External Rotation", detail: "10 reps. Pull to face, externally rotate. Rear delt + shoulder health.", track: "Reps", vid: "m8s7cblgdDQ", dr: 10 }, { name: "Renegade Row", detail: "8 reps each arm. Plank position, row alternating. Anti-rotation pull.", track: "Reps + Weight", vid: "Q28cLuweLv4", dr: 8 }]
    }, {
      name: "D. SECONDARY",
      sets: 3,
      color: "#FF6B35",
      exercises: [{
        name: "Chin Up",
        detail: "Max reps. Supinated grip.",
        track: "Reps",
        vid: "jIvbJzs1V4I",
        dr: 8
      }, {
        name: "KB Vertical Pull",
        detail: "8 reps. Explosive from floor.",
        track: "Reps + Weight",
        vid: "S7jLS4f2FTI",
        dr: 8
      }]
    }, {
      name: "E. POSTERIOR",
      sets: 3,
      color: "var(--ember)",
      exercises: [{
        name: "Hamstring Bridge with Pullover",
        detail: "5 reps. Chin on chest.",
        track: "Reps + Weight",
        vid: "cU2YDlDA8Dw",
        dr: 5
      }, {
        name: "On Bench SL Glute Bridge",
        detail: "8 reps each leg.",
        track: "Reps",
        vid: "LsPF-8U8hak",
        dr: 8
      }]
    }, {
      name: "F. LATERAL CORE",
      sets: 2,
      color: "#1565C0",
      exercises: [{
        name: "Lateral Bridge with Row",
        detail: "8 reps each side. Side plank + row combo.",
        track: "Reps + Weight",
        vid: "kiBDuPbWg2A",
        dr: 8
      }]
    }, {
      name: "G. FINISHER",
      sets: 3,
      color: "#E65100",
      exercises: [{
        name: "Dynamic Sled Row",
        detail: "20m. Pull sled toward you. Back + grip conditioning.",
        track: "Dist + Weight",
        vid: "xdOhwytr0M8",
        dr: 20
      }, {
        name: "Dead Hang",
        detail: "Max hold. Just hang until you drop. Grip endurance for pull-ups + carries.",
        track: "Seconds",
        vid: "XPcT3capkyk",
        dr: 0
      }]
    }]
  },
  // ─── WEDNESDAY PUSH B ───
  WEDNESDAY: {
    title: "PUSH B — Bench + Shoulder Press + Landmine Rot + Core",
    time: "~48 min",
    note: "Push day order. Shoulder Press + Landmine Rotations. Core: KB Saw + Leg Lifts.",
    blocks: [{
      name: "A. SHOULDER PREP",
      sets: 1,
      color: "var(--full)",
      exercises: [{
        name: "Cat Camel Diagonal",
        detail: "6 reps. Slow.",
        track: "Reps",
        vid: "JrcOPzvdToQ",
        dr: 6
      }, {
        name: "Shoulder Hovers",
        detail: "8 reps. Prone, hover arms.",
        track: "Reps",
        vid: "A0KY0DKZ1h4",
        dr: 8
      }, {
        name: "Push-Up to Pike",
        detail: "8 reps. Overhead mobility.",
        track: "Reps",
        vid: "oNj5I72Yskg",
        dr: 8
      }, {
        name: "Banded Low-to-High Rotation",
        detail: "8 reps each side. Shoulder activation for pressing.",
        track: "Reps",
        vid: "kZZIGy0G57A",
        dr: 8
      }, {
        name: "Banded Face Pulls with ER Focus",
        detail: "8 reps.",
        track: "Reps",
        vid: "sQL4qGLDhX4",
        dr: 8
      }, {
        name: "KB SHOULDER ARM BAR",
        detail: "4-5 reps each side. Light KB. Lie on back, press KB up, roll to side. Shoulder stability + T-spine mobility.",
        track: "Reps + Weight",
        vid: "u6TjcV0YKZ8",
        dr: 5
      },
        { name: "Spider Crawls", detail: "8 reps each side. Hands walk up the wall, control the descent. Scapular control + shoulder stability.", track: "Reps", vid: "ZpsDv8EONdc", dr: 8 },
        { name: "KB Bottoms-Up Carry", detail: "20m each side. Bell upside down, walk tall and controlled. Shoulder stability + cuff. Start light.", track: "Reps", vid: "wtBDkYRHlr4", dr: 20 }
      , { name: "Banded T-Spine Rotations", detail: "8 reps each side. Banded thoracic rotation.", track: "Reps", vid: "75hleCEfV_I", dr: 8 }, { name: "Banded Shoulder Internal Rotation", detail: "10 reps each arm. Elbow pinned, band internal rotation.", track: "Reps", vid: "xZQP0IkYmUs", dr: 10 }, { name: "Banded Overhead Mobilization", detail: "10 reps. Band overhead, open shoulders and lats before pressing.", track: "Reps", vid: "OuaUM7xZ1ls", dr: 10 }, { name: "Banded Needle Through", detail: "8 reps each side. Thread the needle, thoracic rotation.", track: "Reps", vid: "1uRNvra9LLk", dr: 8 }, { name: "Banded Rotations", detail: "8 reps each side. Banded rotational mobility.", track: "Reps", vid: "ViWJ1u2u4d0", dr: 8 }, { name: "Shoulder Arm Bar", detail: "5 reps each side. KB overhead, roll under control. Loaded shoulder stability.", track: "Reps + Weight", vid: "g2EhWlBX_Qw", dr: 5 }, { name: "Swiss Ball Push", detail: "3 x 10 sec. Press into swiss ball on wall, brace and protract. Serratus stability.", track: "Seconds", vid: "STCC2DY96Mo", dr: 10 }]
    }, {
      name: "B. MAIN LIFT",
      sets: 4,
      color: "var(--recovery)",
      exercises: [{
        name: "BENCH PRESS",
        detail: "4 reps x 4 sets. RPE 8.",
        track: "Reps + Weight",
        key: true,
        vid: "5lrpyee_asw",
        dr: 4
      }]
    }, {
      name: "C. PUSH VOLUME",
      sets: 3,
      color: "#FF6B35",
      exercises: [{
        name: "Seated Dumbbell Shoulder Press",
        detail: "8 reps. No momentum.",
        track: "Reps + Weight",
        vid: "AyFtEJiEFWc",
        dr: 8
      }, {
        name: "Weighted Push Up",
        detail: "12 reps.",
        track: "Reps + Weight",
        vid: "auh9bmLsvUs",
        dr: 12
      }, { name: "Plyo Push-Up", detail: "5 reps. Explosive push-up, hands leave floor. Upper-body power.", track: "Reps", vid: "zHqxyD9_364", dr: 5 }]
    }, {
      name: "D. LANDMINE",
      sets: 2,
      color: "#E65100",
      exercises: [{
        name: "Landmine Rotations",
        detail: "8 reps hip to hip. Force from ground.",
        track: "Reps + Weight",
        vid: "r4tfGcPWYuI",
        dr: 8
      }, {
        name: "Landmine Push Press",
        detail: "6 reps each arm. Drive with legs, finish on toes.",
        track: "Reps + Weight",
        vid: "PpMoR20QJQg",
        dr: 6
      }]
    }, {
      name: "E. CORE",
      sets: 3,
      color: "#1565C0",
      exercises: [{
        name: "Plank Kettlebell Saw",
        detail: "8 reps.",
        track: "Reps + Weight",
        vid: "KSNVUPybktI",
        dr: 8
      }, {
        name: "Loaded Leg Lifts",
        detail: "8 reps. Band or weight. Resist down.",
        track: "Reps + Weight",
        vid: "PpZxg66ftYc",
        dr: 8
      }]
    }, {
      name: "F. GRIP FINISHER",
      sets: 2,
      color: "#E65100",
      exercises: [{
        name: "Plate Pinch Hold",
        detail: "Max hold each hand. Two plates smooth-side-out. Thumb + finger strength.",
        track: "Seconds",
        vid: "woJifu7hSD8",
        dr: 0
      }]
    }]
  },
  // ─── FRIDAY LEGS B ───
  FRIDAY: {
    title: "LEGS B — Squat + Lateral + Towel Carry + Sled",
    time: "~67 min",
    note: "Legs day order + Wednesday carries. Lateral Squat + RDL + Towel Carry + Sled Push + TKE Steps.",
    blocks: [{
      name: "A. CORE ACTIVATION",
      sets: 1,
      color: "var(--full)",
      exercises: [{
        name: "Crawl to Kick Through",
        detail: "6 reps each side. Coordination.",
        track: "Reps",
        vid: "wqt9IdcUxig",
        dr: 6
      }, {
        name: "Elevated Heels Deep Squat Opener",
        detail: "6 reps. Heels on plate.",
        track: "Reps",
        vid: "jKED44TDKIE",
        dr: 6
      }, {
        name: "PLANK",
        detail: "60 sec hold. Benchmark.",
        track: "Seconds",
        key: true,
        vid: "8IwGcPsPpkw",
        dr: 60
      }, {
        name: "Deadbug",
        detail: "8 reps each leg",
        track: "Reps",
        vid: "rvNkdS3qAyM",
        dr: 8
      }, {
        name: "Figure 4 Flow",
        detail: "8 reps each side. Deep hip rotators.",
        track: "Reps",
        vid: "GAjN5llpzrE",
        dr: 8
      }, {
        name: "Side Bridge Abduction from Elbow",
        detail: "20 sec each side",
        track: "Seconds",
        vid: "ps9A_IO36b0",
        dr: 20
      }, {
        name: "Hip Hike",
        detail: "10 reps each side. Stand on step, drop hip, hike back up. Glute med + QL.",
        track: "Reps",
        vid: "LOYtT-BRGdY",
        dr: 10
      }, {
        name: "Leg Swings \u2014 Front/Back + Lateral",
        detail: "10 reps front/back each leg, then 10 reps lateral each leg. Full hip mobility.",
        track: "Reps",
        vid: "wF10oYsLUw0",
        dr: 10
      },
        { name: "Banded Hip External Rotation (Seated)", detail: "15 reps. Seated, band above knees, drive knees apart and control back. Hip external rotators.", track: "Reps", vid: "GH_IQsyOKwI", dr: 15 }
      ]
    }, {
      name: "A2. POWER PRIMER",
      sets: 3,
      color: "#E65100",
      exercises: [{
        name: "Single Leg Hinge KB Swing",
        detail: "5 reps each leg. Explosive single leg hip drive. Control the landing.",
        track: "Reps + Weight",
        vid: "VRnk5QEBevI",
        dr: 5
      }]
    }, {
      name: "B. MAIN LIFT",
      sets: 4,
      color: "var(--recovery)",
      exercises: [{
        name: "BACK SQUAT",
        detail: "4 reps x 4 sets. RPE 8.",
        track: "Reps + Weight",
        key: true,
        vid: "pWWBjAvJuoA",
        dr: 4
      }]
    }, {
      name: "C. LEGS",
      sets: 3,
      color: "#FF6B35",
      exercises: [{
        name: "Dumbbell Lateral Squat Drop In",
        detail: "8 reps each side.",
        track: "Reps + Weight",
        vid: "O62PpPfpsis",
        dr: 8
      }, {
        name: "Landmine Single Leg Squat",
        detail: "8 reps each leg. 45° angle guides path. Anterior-loaded, knee-friendly.",
        track: "Reps + Weight",
        vid: "S0Yrpu5CMKM",
        dr: 8
      },
        { name: "Banded Hamstring Curls", detail: "12 reps. Prone, curl band toward glutes. Hamstring.", track: "Reps", vid: "gTVC0qZJLzk", dr: 12 }
      ]
    }, {
      name: "D. CARRY",
      sets: 3,
      tierMax: 4,
      color: "#E65100",
      exercises: [{
        name: "Towel Kettlebell Carry",
        detail: "20 steps. Towel over handle = grip killer.",
        track: "Dist + Weight",
        key: true,
        vid: "NEkUGE_gOLg",
        dr: 20
      }, {
        name: "Sled Push",
        detail: "30 steps heavy. Leg drive, full extension.",
        track: "Dist + Weight",
        vid: "t68aeTBXZ7s",
        dr: 30
      }]
    }, {
      name: "E. KNEE HEALTH",
      sets: 2,
      color: "var(--ember)",
      exercises: [{
        name: "Step Up with TKE",
        detail: "6 reps each leg.",
        track: "Reps",
        vid: "4cauIKTDIrk",
        dr: 6
      }, {
        name: "Poliquin Step Down with TKE",
        detail: "6 reps each leg. Slow eccentric.",
        track: "Reps",
        vid: "xFKCoWuP94Y",
        dr: 6
      }, {
        name: "BW Knee Extension (Reverse Nordic)",
        detail: "6-8 reps. Kneel, lean back with hips locked. Eccentric quad loading at long muscle length. Go slow.",
        track: "Reps",
        vid: "5ZCgazq6Emk",
        dr: 8
      }, { name: "Band Assisted Straight Leg Raise", detail: "8 reps each leg. Band-assisted hamstring stretch.", track: "Reps", vid: "Wnhc8hsTtpI", dr: 8 }]
    }, {
      name: "F. ROTATION",
      sets: 2,
      color: "#E65100",
      exercises: [{
        name: "Rotational Banded Punch",
        detail: "8 reps each side. Muay Thaï transfer.",
        track: "Reps",
        vid: "UKsjca_cNUs",
        dr: 8
      }]
    }, {
      name: "G. CALVES + ANKLE",
      sets: 2,
      color: "#546E7A",
      exercises: [{
        name: "Loaded SL Calf Raise",
        detail: "8 reps each leg.",
        track: "Reps + Weight",
        vid: null,
        dr: 8
      }, {
        name: "Ankle Mobility",
        detail: "8 reps each ankle.",
        track: "Reps",
        vid: "qXvA35UHs2w",
        dr: 8
      }]
    }]
  },
  // ─── SATURDAY B ───
  SATURDAY: {
    title: "ARMS B + T-SPINE MOBILITY + GRIP + STRETCH + SAUNA",
    time: "~58 min",
    note: "Power primer wake-up + Arms day B + Saturday T-spine/shoulder mobility + Wednesday forearms B. Evening: 20 min sauna session (CHF 29). Hydrate well before and after.",
    blocks: [{
      name: "A1. POWER PRIMER",
      sets: 3,
      color: "#E65100",
      exercises: [{
        name: "TRX Jump Squat",
        detail: "5 reps. Hold TRX, assisted explosive jump. Gentle landing, full hip drive. CNS wake-up.",
        track: "Reps",
        vid: "o0b5XFfd0wQ",
        dr: 5
      }]
    }, {
      name: "A. T-SPINE + SHOULDER MOBILITY (Mobility day)",
      sets: 2,
      color: "var(--full)",
      exercises: [{
        name: "Kneeling T-Spine with Shoulder Opener",
        detail: "8 reps each side",
        track: "Reps",
        vid: "LnLsZ2gZUK4",
        dr: 8
      }, {
        name: "Cat Camel Diagonal",
        detail: "6 reps.",
        track: "Reps",
        vid: "JrcOPzvdToQ",
        dr: 6
      }, { name: "Banded External Rotation", detail: "12 reps each arm. Elbow at side, rotate out. Rotator cuff health.", track: "Reps", vid: "7DqYesMRkzU", dr: 12 }, {
        name: "Birddog to Gecko",
        detail: "6 reps each side.",
        track: "Reps",
        vid: "ISp9hRUQQ3M",
        dr: 6
      }, {
        name: "Hip Flexor Rock Back",
        detail: "6 reps each leg. Open hip flexors.",
        track: "Reps",
        vid: "a5kTnLk1Dks",
        dr: 6
      }, {
        name: "Hip Airplane",
        detail: "6 reps each leg. Single leg hip rotation. Balance + mobility.",
        track: "Reps",
        vid: "AA8zZh8Iz9I",
        dr: 6
      }, { name: "Ankle CARs", detail: "5 reps each direction. Controlled ankle circles.", track: "Reps", vid: "UVtCSGJmGEY", dr: 5 }]
    }, {
      name: "B. TRICEPS (Arms day)",
      sets: 3,
      color: "var(--recovery)",
      exercises: [{
        name: "DB Skull Crushers",
        detail: "8 reps. Long head stretch.",
        track: "Reps + Weight",
        vid: "1BDGIcMTSXc",
        dr: 8
      }, { name: "Single-Arm Tricep Extension", detail: "8 reps each arm. Single-arm overhead extension.", track: "Reps + Weight", vid: "VgjAgAKaSPM", dr: 8 }]
    }, {
      name: "C. BICEPS (Arms day)",
      sets: 3,
      color: "#FF6B35",
      exercises: [{
        name: "Isolated Bicep Supinated Curl",
        detail: "12 reps. 2-3 sec down.",
        track: "Reps + Weight",
        vid: "I_bKCYL2nL8",
        dr: 12
      }, {
        name: "Hammer Curl Hold Carry",
        detail: "5 curls → hold 90° → walk 20ft → 5 more → walk back.",
        track: "Reps + Weight",
        vid: "EQRvLdkJxEw",
        dr: 5
      }]
    }, {
      name: "D. FOREARMS (Forearms day)",
      sets: 2,
      color: "#E65100",
      exercises: [{
        name: "Forearm Twist + Curl with Towel",
        detail: "8 reps. Towel over KB.",
        track: "Reps + Weight",
        vid: "Bc3qLJnYwkI",
        dr: 8
      }, {
        name: "Isolated Forearm Dumbbell Front, Back, Side",
        detail: "8 reps each direction. Wrist curls front, back, and side.",
        track: "Reps + Weight",
        vid: null,
        dr: 8
      }, {
        name: "Kettlebell Forearm Rotation",
        detail: "8 reps each direction. Hold KB by handle, rotate forearm in/out. Controlled tempo.",
        track: "Reps + Weight",
        vid: "FwCuyV208bU",
        dr: 8
      }, {
        name: "Grip Roller",
        detail: "Heavy weight, up and down twice.",
        track: "Reps + Weight",
        vid: "4Ue3XwpK4G4",
        dr: 2
      }, { name: "Banded Wrist Rotation", detail: "10 reps each direction. Band around hand, rotate through wrist. Wrist + forearm health.", track: "Reps", vid: "vXaF4LVlaic", dr: 10 }, { name: "Seated DB Reverse Wrist Curl", detail: "8 reps. Reverse grip wrist curl. Extensors.", track: "Reps + Weight", vid: "cRLJ86m00cU", dr: 8 }]
    }, {
      name: "E. KNEE CONDITIONING",
      sets: 3,
      color: "var(--ember)",
      exercises: [{
        name: "ISO Squat Hold",
        detail: "30 sec. Deep flexion.",
        track: "Seconds",
        vid: "OpiE9QGKfuo",
        dr: 30
      }]
    }, {
      name: "E2. NECK",
      sets: 2,
      tierMax: 5,
      color: "#546E7A",
      exercises: [{
        name: "Neck Extension (Harness + Weight)",
        detail: "12 reps. Harness loaded. Slow.",
        track: "Reps + Weight",
        vid: "cjIDKy6z3zY",
        dr: 12
      }, {
        name: "Neck Rotations",
        detail: "8 reps each direction.",
        track: "Reps",
        vid: "Fx4LvjovL_k",
        dr: 8
      }, { name: "Neck Prone ROM & Strengthening", detail: "8 reps. Prone, controlled neck ROM.", track: "Reps", vid: "cjIDKy6z3zY", dr: 8 }]
    }, {
      name: "F. STRETCH",
      sets: 1,
      tierMax: 5,
      color: "#009688",
      exercises: [{
        name: "On Bench Lat Stretch to Hip Stretch",
        detail: "30 sec each side.",
        track: "Seconds",
        vid: "NmohIiacpK0",
        dr: 30
      }, {
        name: "Posterior Capsule Stretch",
        detail: "30 sec each side. Shoulder health.",
        track: "Seconds",
        vid: "a4ihXemdOZY",
        dr: 30
      }, {
        name: "Seated ER Stretch",
        detail: "30 sec each side. Rotator cuff.",
        track: "Seconds",
        vid: "h6_gNo5Cd4Q",
        dr: 30
      }]
    }]
  },
  WEDNESDAY: {
    title: "PUSH B — Bench + Shoulder Press + Landmine Rot + Core",
    time: "~48 min",
    note: "Push day order. Shoulder Press + Landmine Rotations. Core: KB Saw + Leg Lifts.",
    blocks: [{
      name: "A. SHOULDER PREP",
      sets: 1,
      color: "var(--full)",
      exercises: [{
        name: "Cat Camel Diagonal",
        detail: "6 reps. Slow.",
        track: "Reps",
        vid: "JrcOPzvdToQ",
        dr: 6
      }, {
        name: "Shoulder Hovers",
        detail: "8 reps. Prone, hover arms.",
        track: "Reps",
        vid: "A0KY0DKZ1h4",
        dr: 8
      }, {
        name: "Push-Up to Pike",
        detail: "8 reps. Overhead mobility.",
        track: "Reps",
        vid: "oNj5I72Yskg",
        dr: 8
      }, {
        name: "Banded Low-to-High Rotation",
        detail: "8 reps each side. Shoulder activation for pressing.",
        track: "Reps",
        vid: "kZZIGy0G57A",
        dr: 8
      }, {
        name: "Banded Face Pulls with ER Focus",
        detail: "8 reps.",
        track: "Reps",
        vid: "sQL4qGLDhX4",
        dr: 8
      }, {
        name: "KB SHOULDER ARM BAR",
        detail: "4-5 reps each side. Light KB. Lie on back, press KB up, roll to side. Shoulder stability + T-spine mobility.",
        track: "Reps + Weight",
        vid: "u6TjcV0YKZ8",
        dr: 5
      }]
    }, {
      name: "B. MAIN LIFT",
      sets: 4,
      color: "var(--recovery)",
      exercises: [{
        name: "BENCH PRESS",
        detail: "4 reps x 4 sets. RPE 8.",
        track: "Reps + Weight",
        key: true,
        vid: "5lrpyee_asw",
        dr: 4
      }]
    }, {
      name: "C. PUSH VOLUME",
      sets: 3,
      color: "#FF6B35",
      exercises: [{
        name: "Seated Dumbbell Shoulder Press",
        detail: "8 reps. No momentum.",
        track: "Reps + Weight",
        vid: "AyFtEJiEFWc",
        dr: 8
      }, {
        name: "Weighted Push Up",
        detail: "12 reps.",
        track: "Reps + Weight",
        vid: "auh9bmLsvUs",
        dr: 12
      }]
    }, {
      name: "D. LANDMINE",
      sets: 2,
      color: "#E65100",
      exercises: [{
        name: "Landmine Rotations",
        detail: "8 reps hip to hip. Force from ground.",
        track: "Reps + Weight",
        vid: "r4tfGcPWYuI",
        dr: 8
      }, {
        name: "Landmine Push Press",
        detail: "6 reps each arm. Drive with legs, finish on toes.",
        track: "Reps + Weight",
        vid: "PpMoR20QJQg",
        dr: 6
      }]
    }, {
      name: "E. CORE",
      sets: 3,
      color: "#1565C0",
      exercises: [{
        name: "Plank Kettlebell Saw",
        detail: "8 reps.",
        track: "Reps + Weight",
        vid: "KSNVUPybktI",
        dr: 8
      }, {
        name: "Loaded Leg Lifts",
        detail: "8 reps. Band or weight. Resist down.",
        track: "Reps + Weight",
        vid: "PpZxg66ftYc",
        dr: 8
      }]
    }, {
      name: "F. GRIP FINISHER",
      sets: 2,
      color: "#E65100",
      exercises: [{
        name: "Plate Pinch Hold",
        detail: "Max hold each hand. Two plates smooth-side-out. Thumb + finger strength.",
        track: "Seconds",
        vid: "woJifu7hSD8",
        dr: 0
      }]
    }]
  },
  // ─── FRIDAY LEGS B ───
  FRIDAY: {
    title: "LEGS B — Squat + Lateral + Towel Carry + Sled",
    time: "~67 min",
    note: "Legs day order + Wednesday carries. Lateral Squat + RDL + Towel Carry + Sled Push + TKE Steps.",
    blocks: [{
      name: "A. CORE ACTIVATION",
      sets: 1,
      color: "var(--full)",
      exercises: [{
        name: "Crawl to Kick Through",
        detail: "6 reps each side. Coordination.",
        track: "Reps",
        vid: "wqt9IdcUxig",
        dr: 6
      }, {
        name: "Elevated Heels Deep Squat Opener",
        detail: "6 reps. Heels on plate.",
        track: "Reps",
        vid: "jKED44TDKIE",
        dr: 6
      }, {
        name: "PLANK",
        detail: "60 sec hold. Benchmark.",
        track: "Seconds",
        key: true,
        vid: "8IwGcPsPpkw",
        dr: 60
      }, {
        name: "Deadbug",
        detail: "8 reps each leg",
        track: "Reps",
        vid: "rvNkdS3qAyM",
        dr: 8
      }, {
        name: "Figure 4 Flow",
        detail: "8 reps each side. Deep hip rotators.",
        track: "Reps",
        vid: "GAjN5llpzrE",
        dr: 8
      }, {
        name: "Side Bridge Abduction from Elbow",
        detail: "20 sec each side",
        track: "Seconds",
        vid: "ps9A_IO36b0",
        dr: 20
      }, {
        name: "Hip Hike",
        detail: "10 reps each side. Stand on step, drop hip, hike back up. Glute med + QL.",
        track: "Reps",
        vid: "LOYtT-BRGdY",
        dr: 10
      }, {
        name: "Leg Swings \u2014 Front/Back + Lateral",
        detail: "10 reps front/back each leg, then 10 reps lateral each leg. Full hip mobility.",
        track: "Reps",
        vid: "wF10oYsLUw0",
        dr: 10
      }]
    }, {
      name: "A2. POWER PRIMER",
      sets: 3,
      color: "#E65100",
      exercises: [{
        name: "Single Leg Hinge KB Swing",
        detail: "5 reps each leg. Explosive single leg hip drive. Control the landing.",
        track: "Reps + Weight",
        vid: "VRnk5QEBevI",
        dr: 5
      }]
    }, {
      name: "B. MAIN LIFT",
      sets: 4,
      color: "var(--recovery)",
      exercises: [{
        name: "BACK SQUAT",
        detail: "4 reps x 4 sets. RPE 8.",
        track: "Reps + Weight",
        key: true,
        vid: "pWWBjAvJuoA",
        dr: 4
      }]
    }, {
      name: "C. LEGS",
      sets: 3,
      color: "#FF6B35",
      exercises: [{
        name: "Dumbbell Lateral Squat Drop In",
        detail: "8 reps each side.",
        track: "Reps + Weight",
        vid: "O62PpPfpsis",
        dr: 8
      }, {
        name: "Landmine Single Leg Squat",
        detail: "8 reps each leg. 45° angle guides path. Anterior-loaded, knee-friendly.",
        track: "Reps + Weight",
        vid: "S0Yrpu5CMKM",
        dr: 8
      },
        { name: "Banded Hamstring Curls", detail: "12 reps. Prone, curl band toward glutes. Hamstring.", track: "Reps", vid: "gTVC0qZJLzk", dr: 12 }
      ]
    }, {
      name: "D. CARRY",
      sets: 3,
      tierMax: 4,
      color: "#E65100",
      exercises: [{
        name: "Towel Kettlebell Carry",
        detail: "20 steps. Towel over handle = grip killer.",
        track: "Dist + Weight",
        key: true,
        vid: "NEkUGE_gOLg",
        dr: 20
      }, {
        name: "Sled Push",
        detail: "30 steps heavy. Leg drive, full extension.",
        track: "Dist + Weight",
        vid: "t68aeTBXZ7s",
        dr: 30
      }]
    }, {
      name: "E. KNEE HEALTH",
      sets: 2,
      color: "var(--ember)",
      exercises: [{
        name: "Step Up with TKE",
        detail: "6 reps each leg.",
        track: "Reps",
        vid: "4cauIKTDIrk",
        dr: 6
      }, {
        name: "Poliquin Step Down with TKE",
        detail: "6 reps each leg. Slow eccentric.",
        track: "Reps",
        vid: "xFKCoWuP94Y",
        dr: 6
      }, {
        name: "BW Knee Extension (Reverse Nordic)",
        detail: "6-8 reps. Kneel, lean back with hips locked. Eccentric quad loading at long muscle length. Go slow.",
        track: "Reps",
        vid: "5ZCgazq6Emk",
        dr: 8
      }]
    }, {
      name: "F. ROTATION",
      sets: 2,
      color: "#E65100",
      exercises: [{
        name: "Rotational Banded Punch",
        detail: "8 reps each side. Muay Thaï transfer.",
        track: "Reps",
        vid: "UKsjca_cNUs",
        dr: 8
      }]
    }, {
      name: "G. CALVES + ANKLE",
      sets: 2,
      color: "#546E7A",
      exercises: [{
        name: "Loaded SL Calf Raise",
        detail: "8 reps each leg.",
        track: "Reps + Weight",
        vid: null,
        dr: 8
      }, {
        name: "Ankle Mobility",
        detail: "8 reps each ankle.",
        track: "Reps",
        vid: "qXvA35UHs2w",
        dr: 8
      }]
    }]
  },
  // ─── SATURDAY B ───
  SATURDAY: {
    title: "ARMS B + T-SPINE MOBILITY + GRIP + STRETCH + SAUNA",
    time: "~58 min",
    note: "Power primer wake-up + Arms day B + Saturday T-spine/shoulder mobility + Wednesday forearms B. Evening: 20 min sauna session (CHF 29). Hydrate well before and after.",
    blocks: [{
      name: "A1. POWER PRIMER",
      sets: 3,
      color: "#E65100",
      exercises: [{
        name: "TRX Jump Squat",
        detail: "5 reps. Hold TRX, assisted explosive jump. Gentle landing, full hip drive. CNS wake-up.",
        track: "Reps",
        vid: "o0b5XFfd0wQ",
        dr: 5
      }]
    }, {
      name: "A. T-SPINE + SHOULDER MOBILITY (Mobility day)",
      sets: 2,
      color: "var(--full)",
      exercises: [{
        name: "Kneeling T-Spine with Shoulder Opener",
        detail: "8 reps each side",
        track: "Reps",
        vid: "LnLsZ2gZUK4",
        dr: 8
      }, {
        name: "Cat Camel Diagonal",
        detail: "6 reps.",
        track: "Reps",
        vid: "JrcOPzvdToQ",
        dr: 6
      }, { name: "Banded External Rotation", detail: "12 reps each arm. Elbow at side, rotate out. Rotator cuff health.", track: "Reps", vid: "7DqYesMRkzU", dr: 12 }, {
        name: "Birddog to Gecko",
        detail: "6 reps each side.",
        track: "Reps",
        vid: "ISp9hRUQQ3M",
        dr: 6
      }, {
        name: "Hip Flexor Rock Back",
        detail: "6 reps each leg. Open hip flexors.",
        track: "Reps",
        vid: "a5kTnLk1Dks",
        dr: 6
      }, {
        name: "Hip Airplane",
        detail: "6 reps each leg. Single leg hip rotation. Balance + mobility.",
        track: "Reps",
        vid: "AA8zZh8Iz9I",
        dr: 6
      }]
    }, {
      name: "B. TRICEPS (Arms day)",
      sets: 3,
      color: "var(--recovery)",
      exercises: [{
        name: "DB Skull Crushers",
        detail: "8 reps. Long head stretch.",
        track: "Reps + Weight",
        vid: "1BDGIcMTSXc",
        dr: 8
      }]
    }, {
      name: "C. BICEPS (Arms day)",
      sets: 3,
      color: "#FF6B35",
      exercises: [{
        name: "Isolated Bicep Supinated Curl",
        detail: "12 reps. 2-3 sec down.",
        track: "Reps + Weight",
        vid: "I_bKCYL2nL8",
        dr: 12
      }, {
        name: "Hammer Curl Hold Carry",
        detail: "5 curls → hold 90° → walk 20ft → 5 more → walk back.",
        track: "Reps + Weight",
        vid: "EQRvLdkJxEw",
        dr: 5
      }]
    }, {
      name: "D. FOREARMS (Forearms day)",
      sets: 2,
      color: "#E65100",
      exercises: [{
        name: "Forearm Twist + Curl with Towel",
        detail: "8 reps. Towel over KB.",
        track: "Reps + Weight",
        vid: "Bc3qLJnYwkI",
        dr: 8
      }, {
        name: "Isolated Forearm Dumbbell Front, Back, Side",
        detail: "8 reps each direction. Wrist curls front, back, and side.",
        track: "Reps + Weight",
        vid: null,
        dr: 8
      }, {
        name: "Kettlebell Forearm Rotation",
        detail: "8 reps each direction. Hold KB by handle, rotate forearm in/out. Controlled tempo.",
        track: "Reps + Weight",
        vid: "FwCuyV208bU",
        dr: 8
      }, {
        name: "Grip Roller",
        detail: "Heavy weight, up and down twice.",
        track: "Reps + Weight",
        vid: "4Ue3XwpK4G4",
        dr: 2
      }]
    }, {
      name: "E. KNEE CONDITIONING",
      sets: 3,
      color: "var(--ember)",
      exercises: [{
        name: "ISO Squat Hold",
        detail: "30 sec. Deep flexion.",
        track: "Seconds",
        vid: "OpiE9QGKfuo",
        dr: 30
      }]
    }, {
      name: "E2. NECK",
      sets: 2,
      tierMax: 5,
      color: "#546E7A",
      exercises: [{
        name: "Neck Extension (Harness + Weight)",
        detail: "12 reps. Harness loaded. Slow.",
        track: "Reps + Weight",
        vid: "cjIDKy6z3zY",
        dr: 12
      }, {
        name: "Neck Rotations",
        detail: "8 reps each direction.",
        track: "Reps",
        vid: "Fx4LvjovL_k",
        dr: 8
      }]
    }, {
      name: "F. STRETCH",
      sets: 1,
      tierMax: 5,
      color: "#009688",
      exercises: [{
        name: "On Bench Lat Stretch to Hip Stretch",
        detail: "30 sec each side.",
        track: "Seconds",
        vid: "NmohIiacpK0",
        dr: 30
      }, {
        name: "Posterior Capsule Stretch",
        detail: "30 sec each side. Shoulder health.",
        track: "Seconds",
        vid: "a4ihXemdOZY",
        dr: 30
      }, {
        name: "Seated ER Stretch",
        detail: "30 sec each side. Rotator cuff.",
        track: "Seconds",
        vid: "h6_gNo5Cd4Q",
        dr: 30
      }]
    }]
  },
  TUESDAY: {
    title: "Jiu-Jitsu Brésilien",
    fightTitle: "Jiu-Jitsu Brésilien",
    trainTitle: "CONDITIONING + LOADED PULLS B",
    time: "75 min",
    trainTime: "~50 min",
    note: "No lifting today.",
    trainNote: "Day 5B: Loaded pulls, carry variations, conditioning, grip.",
    tierRequired: 6,
    blocks: [{
      name: "A. MOVEMENT PREP",
      sets: 1,
      color: "var(--full)",
      exercises: [{
        name: "Dead Hang",
        detail: "30 sec. Shoulder decompression + grip wake-up.",
        track: "Seconds",
        vid: "XPcT3capkyk",
        dr: 30
      }, {
        name: "Hip Flexor Plank",
        detail: "20 sec each leg. Hold knee up in plank.",
        track: "Seconds",
        vid: "WCkrF6B4sdg",
        dr: 20
      }]
    }, {
      name: "B. LOADED PULLS",
      sets: 3,
      color: "#1565C0",
      exercises: [{
        name: "Anti-Rotational Bear Row",
        detail: "8 reps each side. Bear crawl hold + single-arm row. Core + pull.",
        track: "Reps + Weight",
        vid: "khcHYAUb7CM",
        dr: 8
      }, {
        name: "Inverted Row",
        detail: "10 reps. Strict. Bodyweight horizontal pull.",
        track: "Reps",
        vid: "pIMXcgvVg3U",
        dr: 10
      }]
    }, {
      name: "C. CARRY + CONDITIONING",
      sets: 3,
      color: "var(--recovery)",
      exercises: [{
        name: "Towel Kettlebell Carry",
        detail: "80ft. Towel over KB handle. Grip + carry.",
        track: "Dist + Weight",
        key: true,
        vid: "NEkUGE_gOLg",
        dr: 80
      }, {
        name: "Reverse Sled Drag",
        detail: "20 steps. Walk backwards. Knee health + conditioning.",
        track: "Dist + Weight",
        vid: "wa3tZH_yaRY",
        dr: 20
      }]
    }, {
      name: "D. CORE",
      sets: 2,
      color: "#FF6B35",
      exercises: [{
        name: "Dumbbell Diagonal Chop",
        detail: "8 reps each side. Anti-rotation power. Hip-driven.",
        track: "Reps + Weight",
        vid: "At6-Mna8za8",
        dr: 8
      }, {
        name: "Pallof Press",
        detail: "8 reps each side. Band anti-rotation. Standing.",
        track: "Reps",
        vid: "99evyH71IWs",
        dr: 8
      }]
    }, {
      name: "E. GRIP",
      sets: 1,
      color: "#E65100",
      exercises: [{
        name: "Grip Plate Walk",
        detail: "30m. Pinch plates, walk. Crushing grip + carry.",
        track: "Meters",
        vid: "KaP9yXoFeNU",
        dr: 30
      }, {
        name: "Wrist Roller",
        detail: "Roll up and down. Forearm pump.",
        track: "Reps",
        vid: "8ARDRJjhnSw",
        dr: 4
      }]
    }]
  },
  THURSDAY: {
    title: "Muay-Thaï",
    fightTitle: "Muay-Thaï",
    trainTitle: "POWER + ACCESSORIES B",
    time: "90 min",
    trainTime: "~45 min",
    note: "No lifting today.",
    trainNote: "Day 6B: Explosive power, knee health, neck strength. No fighting at BE A PRO.",
    tierRequired: 5,
    blocks: [{
      name: "A. SHOULDER + HIP PREP",
      sets: 1,
      color: "var(--full)",
      exercises: [{
        name: "Shoulder Airplanes",
        detail: "8 reps each side. Hinge, rotate arm. Scapular control.",
        track: "Reps",
        vid: "T9j_ArUIxWw",
        dr: 8
      }, {
        name: "KB SHOULDER ARM BAR",
        detail: "4-5 reps each side. Light KB. Shoulder stability under load.",
        track: "Reps + Weight",
        vid: "u6TjcV0YKZ8",
        dr: 8
      }, {
        name: "Heel Clicks",
        detail: "10 reps. Prone, click heels. Glute activation.",
        track: "Reps",
        vid: "bBtfjTVPkus",
        dr: 10
      }, {
        name: "Facing Wall Hip Circle Rotations",
        detail: "8 reps each direction. Hip CARs against wall.",
        track: "Reps",
        vid: "odvEl4NkZuo",
        dr: 8
      }]
    }, {
      name: "B. POWER",
      sets: 3,
      color: "var(--recovery)",
      exercises: [{
        name: "Med Ball Slam",
        detail: "6 reps. Overhead, full extension. Full body power.",
        track: "Reps + Weight",
        key: true,
        vid: "CkO1mfSBvv4",
        dr: 6
      }, {
        name: "Landmine Rotational Press",
        detail: "6 reps each side. Hip-driven rotational power.",
        track: "Reps + Weight",
        vid: "bZRXZZXOEdQ",
        dr: 6
      }]
    }, {
      name: "C. EXPLOSIVE LEGS + KNEE HEALTH",
      sets: 3,
      color: "#FF6B35",
      exercises: [{
        name: "Front Foot Elevated Split Jumps",
        detail: "5 reps each leg. Explosive but controlled. Single-leg power.",
        track: "Reps",
        vid: "3qCQQl-fpOQ",
        dr: 5
      }, {
        name: "ISO Squat Hold",
        detail: "30 sec. Deep flexion. Isometric quad strength.",
        track: "Seconds",
        vid: "OpiE9QGKfuo",
        dr: 30
      }]
    }, {
      name: "D. NECK",
      sets: 2,
      color: "#546E7A",
      exercises: [{
        name: "Neck Lateral Band Resistance",
        detail: "8 reps each side. Band around head. Lateral neck strength.",
        track: "Reps",
        vid: "QEayGbDM1Do",
        dr: 8
      }, {
        name: "Neck Circles",
        detail: "5 slow circles each direction. Neck mobility.",
        track: "Reps",
        vid: "9zP1BHF5eqQ",
        dr: 5
      }]
    }, {
      name: "E. STRETCH",
      sets: 1,
      color: "#009688",
      exercises: [{
        name: "Seated ER Stretch",
        detail: "30 sec each side. External rotation flexibility.",
        track: "Seconds",
        vid: "h6_gNo5Cd4Q",
        dr: 30
      }, {
        name: "On Bench Lat Stretch to Hip Stretch",
        detail: "30 sec. Flow between lat and hip.",
        track: "Seconds",
        vid: "NmohIiacpK0",
        dr: 30
      }]
    }]
  },
  SUNDAY: {
    title: "Sacred Rest",
    time: "—",
    note: "Zero training. Full recovery.",
    blocks: []
  }
};
const benchmarks = [{
  test: "Bench Press",
  metric: "BW reps",
  standard: "10",
  elite: "15",
  status: "weak",
  day: "WED"
}, {
  test: "Pull-ups",
  metric: "Reps",
  standard: "10",
  elite: "15",
  status: "at",
  day: "MON+BJJ"
}, {
  test: "Trap Bar DL",
  metric: "BW x%",
  standard: "1.5x",
  elite: "1.75x",
  status: "weak",
  day: "MON"
}, {
  test: "800m Run",
  metric: "Time",
  standard: "3:15",
  elite: "3:00",
  status: "at",
  day: "BJJ+MT"
}, {
  test: "Plank",
  metric: "Time",
  standard: "2:00",
  elite: "2:30",
  status: "at",
  day: "FRI"
}, {
  test: "Farmer's Carry",
  metric: "lbs",
  standard: "175",
  elite: "225",
  status: "weak",
  day: "FRI-A"
}, {
  test: "Broad Jump",
  metric: "Dist",
  standard: "Height",
  elite: "Hgt+12",
  status: "weak",
  day: "FRI"
}];

const dayTypeColors = {
  training: { accent: "var(--recovery)", label: "TRAIN" },
  fight: { accent: "var(--light)", label: "FIGHT" },
  rest: { accent: "#1565C0", label: "REST" }
};


// ═══════════════════════════════════════════════════════════
// SCHEDULE DATA — Daily Protocol
// ═══════════════════════════════════════════════════════════
const schedule = {
  training: [
    { time: "05:20", activity: "Salt Water + H2", detail: "Baja Gold sea salt + hydrogen tablet", icon: "💧" },
    { time: "05:25", activity: "PEMF + Red Light", detail: "Koanna 23Hz + Hooga HG1000 simultaneous. 10 front, 10 back.", icon: "⚡" },
    { time: "05:45", activity: "EWOT", detail: "Echo Bike 12 min: 3 min light → 30s intense × 3", icon: "🫁" },
    { time: "05:57", activity: "Shake", detail: "Whey + banana + blueberries + maple syrup · Multi ×2 + Omega ×1", icon: "🥤" },
    { time: "06:10", activity: "Get Ready", detail: "Prep for work", icon: "👔" },
    { time: "06:20", activity: "LEAVE HOME", detail: "Drive to Willemin. Work 07:00-16:30.", icon: "⚡" },
    { time: "12:00", activity: "Lunch", detail: "Beef/chicken + rice + vegetables + salad", icon: "🥩" },
    { time: "16:30", activity: "End Work", detail: "Head home or to gym", icon: "🏠" },
    { time: "17:30", activity: "WORKOUT", detail: "Pull/Push/Legs session ~45-65 min", icon: "🏋️" },
    { time: "18:35", activity: "Post-Workout Shake", detail: "Whey + creatine (see Shake Options)", icon: "🥤" },
    { time: "18:45", activity: "Dinner", detail: "Big meal — beef/chicken + rice + vegetables", icon: "🍽️" },
    { time: "21:00", activity: "Colostrum + Magnesium", detail: "QuraDea Raw Cow Colostrum before bed + PURE Mg glycinate (2 on heavy weeks)", icon: "🥛" },
    { time: "21:30", activity: "PEMF Sleep", detail: "Koanna Mat 3 Hz — every single night", icon: "😴" }
  ],
  friday: [
    { time: "05:20", activity: "Salt Water + H2", detail: "Baja Gold sea salt + hydrogen tablet", icon: "💧" },
    { time: "05:25", activity: "PEMF + Red Light", detail: "Koanna 23Hz + Hooga HG1000 simultaneous. 10 front, 10 back.", icon: "⚡" },
    { time: "05:45", activity: "EWOT", detail: "Echo Bike 12 min: 3 min light → 30s intense × 3", icon: "🫁" },
    { time: "05:57", activity: "Shake", detail: "Whey + banana + blueberries + maple syrup · Multi ×2 + Omega ×1", icon: "🥤" },
    { time: "06:10", activity: "Get Ready", detail: "Prep for work", icon: "👔" },
    { time: "06:20", activity: "LEAVE HOME", detail: "Drive to Willemin. Work 07:00-16:30.", icon: "⚡" },
    { time: "12:00", activity: "Lunch", detail: "Beef/chicken + rice + vegetables + salad", icon: "🥩" },
    { time: "16:30", activity: "End Work", detail: "Head home or to gym", icon: "🏠" },
    { time: "17:30", activity: "WORKOUT", detail: "Legs + Carry + Incline Walk ~60-65 min", icon: "🏋️" },
    { time: "18:40", activity: "Post-Workout Shake", detail: "Whey + creatine (see Shake Options)", icon: "🥤" },
    { time: "18:45", activity: "Sauna", detail: "20 min. Post-legs recovery. Tomorrow is off.", icon: "🧖" },
    { time: "19:15", activity: "PEMF Recovery", detail: "Koanna Mat 7.8 Hz after sauna", icon: "⚡" },
    { time: "19:30", activity: "Dinner", detail: "Big meal — beef/chicken + rice + vegetables", icon: "🍽️" },
    { time: "21:00", activity: "Colostrum + Magnesium", detail: "QuraDea before bed + PURE Mg glycinate (2 on heavy weeks)", icon: "🥛" },
    { time: "21:30", activity: "PEMF Sleep", detail: "Koanna Mat 3 Hz", icon: "😴" }
  ],
  fight_bjj: [
    { time: "05:20", activity: "Salt Water + H2", detail: "Baja Gold sea salt + hydrogen tablet", icon: "💧" },
    { time: "05:25", activity: "PEMF + Red Light", detail: "Koanna 23Hz + Hooga HG1000 simultaneous", icon: "⚡" },
    { time: "05:45", activity: "EWOT", detail: "Echo Bike 12 min", icon: "🫁" },
    { time: "05:57", activity: "Shake", detail: "Whey + banana + blueberries + maple syrup · Multi ×2 + Omega ×1", icon: "🥤" },
    { time: "06:10", activity: "Get Ready", detail: "Prep for work", icon: "👔" },
    { time: "06:20", activity: "LEAVE HOME", detail: "Drive to Willemin. Work 07:00-16:30.", icon: "⚡" },
    { time: "12:00", activity: "Lunch", detail: "Big meal — beef + rice + vegetables", icon: "🥩" },
    { time: "16:30", activity: "End Work", detail: "Head home, eat early", icon: "🏠" },
    { time: "17:30", activity: "Light Snack", detail: "Banana + nuts. No heavy food before fighting.", icon: "🍌" },
    { time: "19:45", activity: "BJJ", detail: "19:45-21:00 (75 min)", icon: "🥋" },
    { time: "21:15", activity: "Post-Fight Shake", detail: "Whey + banana + blueberries + creatine", icon: "🥤" },
    { time: "21:20", activity: "Magnesium", detail: "PURE Mg glycinate (2 on heavy weeks)", icon: "🌙" },
    { time: "21:30", activity: "PEMF Sleep", detail: "Koanna Mat 3 Hz. NO SAUNA on fight days.", icon: "😴" }
  ],
  fight_mt: [
    { time: "05:20", activity: "Salt Water + H2", detail: "Baja Gold sea salt + hydrogen tablet", icon: "💧" },
    { time: "05:25", activity: "PEMF + Red Light", detail: "Koanna 23Hz + Hooga HG1000 simultaneous", icon: "⚡" },
    { time: "05:45", activity: "EWOT", detail: "Echo Bike 12 min", icon: "🫁" },
    { time: "05:57", activity: "Shake", detail: "Whey + banana + blueberries + maple syrup · Multi ×2 + Omega ×1", icon: "🥤" },
    { time: "06:10", activity: "Get Ready", detail: "Prep for work", icon: "👔" },
    { time: "06:20", activity: "LEAVE HOME", detail: "Drive to Willemin. Work 07:00-16:30.", icon: "⚡" },
    { time: "12:00", activity: "Lunch", detail: "Big meal — beef + rice + vegetables", icon: "🥩" },
    { time: "16:30", activity: "End Work", detail: "Head home, eat early", icon: "🏠" },
    { time: "17:15", activity: "Light Snack", detail: "Banana + nuts. No heavy food before fighting.", icon: "🍌" },
    { time: "18:30", activity: "Muay-Thaï", detail: "18:30-20:00 (90 min)", icon: "🥊" },
    { time: "20:15", activity: "Post-Fight Shake", detail: "Whey + banana + blueberries + creatine", icon: "🥤" },
    { time: "20:30", activity: "Dinner", detail: "Light — chicken/tuna + salad", icon: "🍽️" },
    { time: "21:00", activity: "Magnesium", detail: "PURE Mg glycinate (2 on heavy weeks)", icon: "🌙" },
    { time: "21:30", activity: "PEMF Sleep", detail: "Koanna Mat 3 Hz. NO SAUNA on fight days.", icon: "😴" }
  ],
  saturday: [
    { time: "07:00", activity: "Salt Water + H2", detail: "Baja Gold sea salt + hydrogen tablet", icon: "💧" },
    { time: "07:15", activity: "PEMF + Red Light", detail: "Koanna 23Hz + Hooga HG1000 simultaneous", icon: "⚡" },
    { time: "07:35", activity: "EWOT", detail: "Echo Bike 12 min", icon: "🫁" },
    { time: "07:47", activity: "Shake", detail: "Whey + banana + blueberries · Multi ×2 + Omega ×1", icon: "🥤" },
    { time: "09:00", activity: "WORKOUT", detail: "Arms + Mobility + Stretch ~40-42 min", icon: "🏋️" },
    { time: "09:45", activity: "Post-Workout Shake", detail: "Whey + creatine (see Shake Options)", icon: "🥤" },
    { time: "10:00", activity: "Sauna", detail: "20 min. Prime weekly recovery window.", icon: "🧖" },
    { time: "10:30", activity: "PEMF Recovery", detail: "Koanna Mat 7.8 Hz grounding after sauna", icon: "⚡" },
    { time: "12:30", activity: "Lunch", detail: "Big relaxed meal", icon: "🍳" },
    { time: "21:00", activity: "Colostrum + Magnesium", detail: "QuraDea before bed + PURE Mg glycinate (2 on heavy weeks)", icon: "🥛" },
    { time: "21:30", activity: "PEMF Sleep", detail: "Koanna Mat 3 Hz", icon: "😴" }
  ],
  rest: [
    { time: "08:00", activity: "Salt Water + H2", detail: "Baja Gold sea salt + hydrogen tablet", icon: "💧" },
    { time: "08:15", activity: "PEMF + Red Light", detail: "Koanna 10Hz gentle + Hooga HG1000", icon: "⚡" },
    { time: "08:35", activity: "EWOT", detail: "Echo Bike very light 12 min", icon: "🫁" },
    { time: "08:47", activity: "Shake", detail: "Whey + banana + blueberries + creatine · Multi ×2 + Omega ×1", icon: "🥤" },
    { time: "12:30", activity: "Lunch", detail: "Relaxed big meal", icon: "🍳" },
    { time: "18:30", activity: "Sauna", detail: "Optional light session 20 min", icon: "🧖" },
    { time: "21:00", activity: "Colostrum + Magnesium", detail: "QuraDea before bed + PURE Mg glycinate (2 on heavy weeks)", icon: "🥛" },
    { time: "21:30", activity: "PEMF Sleep", detail: "Koanna Mat 3 Hz", icon: "😴" }
  ],
  wednesday: [
    { time: "05:20", activity: "Salt Water + H2", detail: "Baja Gold sea salt + hydrogen tablet", icon: "💧" },
    { time: "05:25", activity: "PEMF + Red Light", detail: "Koanna 23Hz + Hooga HG1000 simultaneous", icon: "⚡" },
    { time: "05:45", activity: "AIR BIKE INTERVALS", detail: "6-8 rounds: 30s max / 60s rest. Replaces EWOT.", icon: "🔥" },
    { time: "05:57", activity: "Shake", detail: "Whey + banana + blueberries + maple syrup · Multi ×2 + Omega ×1", icon: "🥤" },
    { time: "06:10", activity: "Get Ready", detail: "Prep for work", icon: "👔" },
    { time: "06:20", activity: "LEAVE HOME", detail: "Drive to Willemin. Work 07:00-16:30.", icon: "⚡" },
    { time: "12:00", activity: "Lunch", detail: "Beef/chicken + rice + vegetables", icon: "🥩" },
    { time: "16:30", activity: "End Work", detail: "Head home or to gym", icon: "🏠" },
    { time: "17:30", activity: "WORKOUT", detail: "Push session ~40-42 min", icon: "🏋️" },
    { time: "18:15", activity: "Post-Workout Shake", detail: "Whey + creatine (see Shake Options)", icon: "🥤" },
    { time: "18:30", activity: "Dinner", detail: "Big meal — beef/chicken + rice + vegetables", icon: "🍽️" },
    { time: "21:00", activity: "Colostrum + Magnesium", detail: "QuraDea before bed + PURE Mg glycinate (2 on heavy weeks)", icon: "🥛" },
    { time: "21:30", activity: "PEMF Sleep", detail: "Koanna Mat 3 Hz", icon: "😴" }
  ]
};

const nutritionData = {
  mealPlan: [
    { day: "MONDAY", train: "Pull (Heavy)", target: 180, color: "var(--recovery)", meals: [
      { icon: "🥤", name: "AM Shake", desc: "Whey + banana + blueberries", p: 30 },
      { icon: "🥩", name: "Lunch", desc: "250g beef strips + rice + vegetables", p: 55 },
      { icon: "🥚", name: "Snack", desc: "3 eggs + handful nuts", p: 25 },
      { icon: "🥤", name: "Post-Workout Shake", desc: "Whey + creatine (see Shake Options)", p: 30 },
      { icon: "🍗", name: "Dinner", desc: "250g chicken + rice + broccoli", p: 60 }
    ]},
    { day: "TUESDAY", train: "BJJ Fight Day", target: 165, color: "var(--light)", meals: [
      { icon: "🥤", name: "AM Shake", desc: "Whey + banana", p: 30 },
      { icon: "🍗", name: "Lunch", desc: "200g chicken + rice + vegetables (light pre-fight)", p: 45 },
      { icon: "🍌", name: "Pre-fight 18:30", desc: "Banana + handful nuts", p: 5 },
      { icon: "🥩", name: "Post-BJJ 21:30", desc: "250g beef + rice + vegetables + whey shake + creatine", p: 80 }
    ]},
    { day: "WEDNESDAY", train: "Push", target: 175, color: "var(--recovery)", meals: [
      { icon: "🥤", name: "AM Shake", desc: "Whey + blueberries", p: 30 },
      { icon: "🥩", name: "Lunch", desc: "200g beef + rice + vegetables", p: 50 },
      { icon: "🐟", name: "Snack", desc: "2 tuna cans + cheese block", p: 40 },
      { icon: "🥤", name: "Post-Workout Shake", desc: "Whey + creatine (see Shake Options)", p: 30 },
      { icon: "🍗", name: "Dinner", desc: "250g chicken + rice + vegetables", p: 55 }
    ]},
    { day: "THURSDAY", train: "Muay Thaï Fight Day", target: 165, color: "var(--light)", meals: [
      { icon: "🥤", name: "AM Shake", desc: "Whey + banana", p: 30 },
      { icon: "🍗", name: "Lunch", desc: "200g chicken + rice + vegetables (light pre-fight)", p: 45 },
      { icon: "🧀", name: "Pre-MT 17:30", desc: "Banana + cheese slice", p: 10 },
      { icon: "🥩", name: "Post-MT 20:30", desc: "250g beef + rice + vegetables + whey shake + creatine", p: 80 }
    ]},
    { day: "FRIDAY", train: "Legs (Heavy)", target: 180, color: "var(--recovery)", meals: [
      { icon: "🥤", name: "AM Shake", desc: "Whey + banana + blueberries", p: 30 },
      { icon: "🥩", name: "Lunch", desc: "250g beef + rice + vegetables", p: 55 },
      { icon: "🥚", name: "Snack", desc: "3 eggs + handful nuts", p: 25 },
      { icon: "🥤", name: "Post-Workout Shake", desc: "Whey + creatine (see Shake Options)", p: 30 },
      { icon: "🍗", name: "Dinner", desc: "250g chicken + rice + vegetables", p: 60 }
    ]},
    { day: "SATURDAY", train: "Arms + Mobility", target: 155, color: "var(--full)", meals: [
      { icon: "🥤", name: "AM Shake", desc: "Whey + banana", p: 30 },
      { icon: "🥤", name: "Post-Workout Shake", desc: "Whey + creatine (see Shake Options)", p: 30 },
      { icon: "🥚", name: "Brunch", desc: "4 eggs + cheese + vegetables", p: 35 },
      { icon: "🍗", name: "Late Lunch", desc: "200g chicken + rice + vegetables", p: 50 },
      { icon: "🐟", name: "Dinner", desc: "2 tuna cans + salad + nuts", p: 40 }
    ]},
    { day: "SUNDAY", train: "Sacred Rest", target: 140, color: "#1565C0", meals: [
      { icon: "🥤", name: "AM Shake", desc: "Whey + blueberries + creatine", p: 30 },
      { icon: "🥚", name: "Brunch", desc: "3 eggs + cheese block", p: 28 },
      { icon: "🥩", name: "Lunch", desc: "200g beef + rice + vegetables", p: 50 },
      { icon: "🐟", name: "Light Dinner", desc: "1 tuna can + rice + salad + nuts", p: 35 }
    ]}
  ],
  supplements: [
    { name: "Baja Gold Sea Salt", timing: "On waking, in water" },
    { name: "H2 Hydrogen Tablet", timing: "On waking, in salt water" },
    { name: "BodyHealth Multi Complete", timing: "2 at breakfast, with fat" },
    { name: "BodyHealth Omega 3", timing: "1 at breakfast" },
    { name: "Whey Protein", timing: "AM shake + post-training" },
    { name: "Creatine", timing: "Post-training (breakfast on rest days)" },
    { name: "QuraDea Colostrum", timing: "AM + 21:00" },
    { name: "PURE Magnesium Glycinate", timing: "Bedtime (2 on heavy weeks)" }
  ],
  quarkBase: "Base: 250g lean quark + 1 scoop plain whey + splash of milk (~55g protein). Mix whey + spices with a little milk into a smooth paste first, then add quark: no lumps.",
  quarkBowls: [
    { icon: "\uD83E\uDED0", name: "Vanilla Berry", mix: "\u00BC tsp Rapunzel vanilla + 1 tsp honey", top: "Blueberries + raspberries (thawed 10 min) + flaked almonds" },
    { icon: "\uD83C\uDF4C", name: "Choco Banana", mix: "1 tsp cocoa + 1 tsp honey + pinch of salt", top: "\u00BD banana + crushed hazelnuts + dark chocolate shavings" },
    { icon: "\uD83C\uDF4E", name: "Apple Cinnamon", mix: "Ceylon cinnamon + \u00BC tsp vanilla + honey", top: "Grated or diced apple + walnuts + drizzle of honey" },
    { icon: "\u2615", name: "Tiramisu", mix: "1 tsp instant coffee + vanilla + honey", top: "Sifted cocoa + 2-3 crumbled biscuits", note: "Morning only (coffee)" },
    { icon: "\uD83E\uDD63", name: "Blueberry Crumble", mix: "Vanilla + honey", top: "Warm blueberries (30s microwave) + dry-toasted oats + cinnamon" },
    { icon: "\uD83C\uDF19", name: "Overnight Bowl", mix: "Base + 40g oats + extra milk, overnight in the fridge", top: "Banana + blueberries + honey", note: "Most filling: long site days" }
  ],
  shakeBase: "Base: fridge-cold water, shake hard, pinch of salt",
  shakeOptions: [
    { when: "Morning", note: "Caffeine OK", color: "var(--light)", items: [
      { icon: "☕", name: "Mocha", desc: "1 tsp instant coffee + 1 tsp cocoa + Ceylon cinnamon + pinch of salt + honey" },
      { icon: "🍵", name: "Matcha", desc: "½ tsp ceremonial matcha + honey" },
      { icon: "🥣", name: "Quark Bowl", desc: "Stir whey into lean quark: 6 recipes in Quark Bowls below" }
    ]},
    { when: "Post-Training", note: "No caffeine", color: "var(--full)", items: [
      { icon: "🍎", name: "Juice", desc: "Apple or orange juice, 100% pressed" },
      { icon: "🍋", name: "Lemon Ginger", desc: "Lemon juice + honey + pinch of ground ginger" },
      { icon: "🥛", name: "Ovomaltine", desc: "1 tsp Ovomaltine in water" }
    ]}
  ],  protein: {
    training: "~170-180g",
    fight: "~160-170g",
    weekend: "~140-170g",
    average: "~170g/day = 1.9g/kg at 90kg"
  }
};

const pemfGuide = [
  { hz: "3 Hz", mode: "Sleep", when: "Every night 21:30", c: "#283593" },
  { hz: "7.8 Hz", mode: "Grounding", when: "After sauna", c: "var(--full)" },
  { hz: "10 Hz", mode: "Alpha", when: "Weekend mornings", c: "#F9A825" },
  { hz: "23 Hz", mode: "Focus", when: "Every morning 05:45", c: "var(--recovery)" }
];

// Body part stress mapping - keywords in exercise names → body parts they load
const bodyZones = {
  shoulder: ["Pull-Up","Pull Up","Chin-Up","Chin Up","Bench Press","Push-up","Push Up","Shoulder Press","Landmine Press","Facepull","Face Pull","Shoulder Arm Bar","Inverted Row","Bear Row","KB Vertical","Lat Sweep","Cable Vertical","Dumbbell Snatch","Plank Kettlebell Saw","Pec Fly","Overhead","Crawl Shoulder Tap","TRX Facepull","Banded Face","Lateral Bridge with Row","Kettlebell Vertical","Shoulder CARs","Shoulder Angel","Shoulder Airplane","Banded External Rotation","Banded Needle","Banded Rotation","Perturbation"],
  knee: ["Squat","Split Squat","Lunge","Step Up","Step Down","TKE","Sled Drag","ISO Squat","Box Jump","Split Jump","Incline Walk","Lateral Squat","Calf Raise","Sled Push","Poliquin","Banded Terminal"],
  lower_back: ["Deadlift","Hamstring Bridge","Glute Bridge","Farmer","Suitcase Carry","Dynamic Sled Row","Kettlebell Swing","Dumbbell Snatch","Shoulder Arm Bar","Neck Bridge"],
  hip: ["Hip Flexor","Hip Distraction","Hip Airplane","Hip Hike","Hip Walk","Hip Circle","Hip Stretch","Adductor","Glute Mobilization","Shin Box","Figure 4","Split Squat Drift","Back Squat","Split Squat","Lateral Squat","Landmine Single Leg"],
  neck: ["Neck Circle","Neck Bridge","Neck Lateral","Neck Prone","Neck Supine","Neck Release","Barbell Trap"],
  wrist: ["Farmer","Suitcase Carry","Towel Kettlebell Carry","Dead Hang","Plate Pinch","Wrist Roller","Dynamic Sled Row","Forearm Supination","Forearm Pronation"],
  elbow: ["Bench Press","Push-up","Push Up","Tricep","Close Grip","Forearm Supination","Forearm Pronation","Wrist Roller","Pull-Up","Pull Up","Chin-Up","Chin Up","Inverted Row","Barbell Curl","Bayesian Curl","Cable Curl"]
};
function getZones(name) {
  const z = [];
  Object.keys(bodyZones).forEach(part => { if (bodyZones[part].some(kw => name.toLowerCase().includes(kw.toLowerCase()))) z.push(part); });
  return z;
}
function zoneToInjury(z, injuries) {
  if (z === "shoulder") return injuries.r_shoulder || injuries.l_shoulder;
  if (z === "knee") return injuries.r_knee || injuries.l_knee;
  if (z === "hip") return injuries.r_hip || injuries.l_hip;
  if (z === "wrist") return injuries.r_wrist || injuries.l_wrist;
  if (z === "elbow") return injuries.r_elbow || injuries.l_elbow;
  if (z === "neck") return injuries.neck;
  if (z === "lower_back") return injuries.lower_back;
  return false;
}
function zoneLabel(z) {
  const labels = { shoulder: "Shoulder", knee: "Knee", lower_back: "Low Back", hip: "Hip", neck: "Neck", wrist: "Wrist", elbow: "Elbow" };
  return labels[z] || z;
}
// Block types that are always shown in RECOVERY mode
const recoveryBlocks = ["PREP","MOBILITY","CORE ACTIVATION","HIP MOBILITY","HEALTH","ANKLE","STRETCH","T-SPINE","SHOULDER PREP","SHOULDER HEALTH"];
function isRecoveryBlock(blockName) { return recoveryBlocks.some(rb => blockName.toUpperCase().includes(rb)); }

