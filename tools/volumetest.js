// CARTHAGO : volume de seance. Regression : 0 kg quand on logge les poids sans taper les reps (reps par defaut non stockees).
const { JSDOM, VirtualConsole } = require("jsdom");
const { APP, wait, readApp } = require("./_harness");
(async () => {
  const fails = []; const chk = (c, m) => { if (!c) fails.push(m); };
  const dom = new JSDOM(readApp(APP), { url: "http://localhost/", runScripts: "dangerously", virtualConsole: new VirtualConsole(), beforeParse(w) { w.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {} }); } });
  await wait(600);
  const w = dom.window;
  const ex = w.eval(`(() => { for (const W of [workoutsA, workoutsB, tier6OverridesA, tier6OverridesB]) for (const d of Object.keys(W)) { const wo = W[d]; if (!wo || !wo.blocks) continue; for (const b of wo.blocks) for (const e of b.exercises) if (e.track === "Reps + Weight" && e.dr > 0) return { name: e.name, dr: e.dr }; } return null; })()`);
  chk(!!ex, "aucun exercice Reps + Weight avec reps par defaut");
  if (ex) {
    const K = (n) => "A-MONDAY-1-" + n, V = (logs) => JSON.parse(JSON.stringify(w.carthagoSessionVolume(logs)));
    // poids seuls : reps par defaut utilisees
    let r = V({ [K(ex.name)]: { w1: "80", w2: "80", w3: "80" } });
    chk(r.v === 3 * ex.dr * 80 && r.sets === 3, "poids seuls : attendu " + 3 * ex.dr * 80 + " kg / 3 series, obtenu " + r.v + " / " + r.sets);
    // reps saisies : prioritaires
    r = V({ [K(ex.name)]: { w1: "100", r1: "5", w2: "100", r2: "3" } });
    chk(r.v === 800 && r.sets === 2, "reps saisies : attendu 800 kg, obtenu " + r.v);
    // melange : une serie avec reps saisies, une sans
    r = V({ [K(ex.name)]: { w1: "50", r1: "10", w2: "50" } });
    chk(r.v === 500 + ex.dr * 50, "melange saisi/defaut : " + r.v);
    // reps sans poids : pas de volume ; rien : zero
    r = V({ [K(ex.name)]: { r1: "10" } }); chk(r.v === 0 && r.sets === 1, "reps sans poids");
    chk(V({}).v === 0 && V(null).v === 0, "logs vides");
    // exercice inconnu ou ancienne cle numerique : pas de reps par defaut inventees
    r = V({ [K("EXERCICE INCONNU")]: { w1: "60" }, "A-MONDAY-1-3": { w1: "60" } }); chk(r.v === 0, "reps par defaut inventees pour un exercice inconnu : " + r.v);
  }
  // le recap utilise bien cette fonction
  chk(/volOf = \(logs\) => carthagoSessionVolume\(logs\)/.test(readApp(APP)), "le recap n'utilise pas carthagoSessionVolume");
  console.log(fails.length ? "FAIL volumetest:\n  " + fails.join("\n  ") : "OK volumetest : volume avec reps par defaut, reps saisies prioritaires, cas limites");
  process.exit(fails.length ? 1 : 0);
})();
