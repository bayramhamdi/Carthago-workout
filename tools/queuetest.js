// CARTHAGO : file de 14 seances (17.10.2026).
// 1. Couverture : chaque exercice du programme (et du modele recovery) est dans une seance de la file.
// 2. 1h max : trainTime de chaque seance <= 60 min.
// 3. FULL : au moins 2 seances entre deux FULL, sur deux tours enchaines (rotation cond / cond2).
// 4. Migration : ancienne position 6/12 (Pull B) => 8/14 Pull B, sans perdre la seance.
// 5. LIGHT ne saute plus rien (Pull B light : tous les exercices + note main lift).
// 6. Mobility de la file = vraie seance Mobility (pas le modele recovery) + zone 2.
// 7. Armor : seance 6/14 rendue avec ses exercices.
// 8. Fin de tour : Mark Complete sur 14/14 => retour 1/14 et tour suivant (rotation des FULL).
const fs = require("fs"), path = require("path"), vm = require("vm");
const { JSDOM, VirtualConsole } = require("jsdom");
const { readApp, wait } = require("./_harness");
const fails = []; const chk = (c, m) => { if (!c) fails.push(m); };
const html = fs.readFileSync(path.join(__dirname, "..", "app", "index.html"), "utf8");
const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "app", "program.js"), "utf8") + ";this.P={tier6OverridesA,tier6OverridesB,recoveryWorkouts};", ctx);
const P = ctx.P;
const qsrc = html.slice(html.indexOf("const SESSION_QUEUE = ["), html.indexOf("];", html.indexOf("const SESSION_QUEUE = [")) + 1).replace("const SESSION_QUEUE =", "");
const Q = vm.runInNewContext("(" + qsrc + ")");
chk(Q.length === 14, "file de " + Q.length + " seances");
// 1
const lib = new Set();
[P.tier6OverridesA, P.tier6OverridesB].forEach(O => Object.values(O).forEach(d => d.blocks.forEach(b => b.exercises.forEach(e => lib.add(e.name)))));
Object.values(P.recoveryWorkouts).forEach(d => (d.blocks || []).forEach(b => b.exercises.forEach(e => lib.add(e.name))));
const inQ = new Set();
Q.forEach(s => { const d = (s.w === "A" ? P.tier6OverridesA : P.tier6OverridesB)[s.d]; chk(!!d, "contenu absent " + s.w + " " + s.d); if (d) d.blocks.forEach(b => b.exercises.forEach(e => inQ.add(e.name))); });
const miss = [...lib].filter(n => !inQ.has(n));
chk(miss.length === 0, "exercices hors file : " + miss.join(", "));
// 2
Q.forEach(s => { const d = (s.w === "A" ? P.tier6OverridesA : P.tier6OverridesB)[s.d]; const m = d && parseInt(String(d.trainTime).replace(/\D/g, ""), 10); chk(m && m <= 60, s.label + " " + s.w + " : " + (d && d.trainTime)); });
// 3
const seq = Q.map(s => s.cond).concat(Q.map(s => s.cond2)); const fullAt = []; seq.forEach((c, i) => { if (c === "full") fullAt.push(i); });
let minGap = 99; fullAt.forEach((p, i) => { const nx = i + 1 < fullAt.length ? fullAt[i + 1] : fullAt[0] + seq.length; minGap = Math.min(minGap, nx - p); });
chk(minGap >= 3, "deux FULL trop proches (ecart " + minGap + ")");
const fullLabels = new Set(Q.filter(s => s.cond === "full" || s.cond2 === "full").map(s => s.label));
["Pull", "Push", "Legs", "Arms"].forEach(l => chk(fullLabels.has(l), l + " jamais FULL"));
chk(!Q.some(s => s.label === "Mobility" && s.cond !== "recovery"), "Mobility pas en recovery");

const MON = new Date(2026, 9, 19, 9, 0, 0); // lundi 19.10.2026
async function run(local, after) {
  const errors = [];
  const vc = new VirtualConsole(); vc.on("jsdomError", e => errors.push(e.message));
  const dom = new JSDOM(readApp(), { url: "http://localhost/", runScripts: "dangerously", pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(w) {
      const R = w.Date, off = MON.getTime() - R.now();
      class D extends R { constructor(...a) { if (a.length === 0) super(R.now() + off); else super(...a); } static now() { return R.now() + off; } }
      w.Date = D;
      Object.keys(local).forEach(k => w.localStorage.setItem("carthago_" + k, JSON.stringify(local[k])));
      w.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
      w.scrollTo = () => {};
    } });
  await wait(1500);
  const o = { w: dom.window, text: () => dom.window.document.getElementById("root").textContent, ls: k => JSON.parse(dom.window.localStorage.getItem("carthago_" + k) || "null"), errors };
  if (after) await after(o);
  const res = { text: o.text(), cp: o.ls("cyclePos"), errors };
  dom.window.close();
  return res;
}
const base = { tier: 5, cpMode: "v2", queueMode: true, workoutHistory: {}, view: "workout" };
(async () => {
  // 4 + 5
  let r = await run({ ...base, cyclePos: { 4: 0, 5: 6, 6: 0 } });
  chk(r.cp && r.cp.q === 14 && r.cp[5] === 7, "4: migration " + JSON.stringify(r.cp));
  chk(/Session 8\/14/.test(r.text), "4: hero pas sur Session 8/14");
  const pullB = P.tier6OverridesB.MONDAY.blocks.flatMap(b => b.exercises.map(e => e.name));
  const absent = pullB.filter(n => !r.text.includes(n));
  chk(absent.length === 0, "5: Pull B light saute : " + absent.join(", "));
  chk(/same weight, fewer sets/.test(r.text), "5: note LIGHT main lift absente");
  chk(!r.errors.length, "5: erreurs " + r.errors.join(" | "));
  // 6
  r = await run({ ...base, cyclePos: { 4: 0, 5: 6, 6: 0, q: 14 } });
  chk(/Session 7\/14/.test(r.text), "6: hero pas sur 7/14");
  ["Shin Box Fold", "Seated Hip Stretch", "QL Hip Drop from Bench", "Low Back Swivels", "Incline Walk"].forEach(n => chk(r.text.includes(n), "6: Mobility A sans " + n));
  // 7
  r = await run({ ...base, cyclePos: { 4: 0, 5: 5, 6: 0, q: 14 } });
  chk(/Session 6\/14/.test(r.text), "7: hero pas sur 6/14");
  ["Neck Bridge", "Suitcase Carry", "Pallof Press", "Seated Hip Flexion"].forEach(n => chk(r.text.includes(n), "7: Armor A sans " + n));
  chk(!r.errors.length, "7: erreurs " + r.errors.join(" | "));
  // 8
  r = await run({ ...base, cyclePos: { 4: 0, 5: 13, 6: 0, q: 14 } }, async (o) => {
    const b = [...o.w.document.querySelectorAll("button")].find(x => /MARK SESSION COMPLETE/i.test(x.textContent));
    chk(!!b, "8: bouton Mark Complete absent"); if (!b) return;
    b.dispatchEvent(new o.w.MouseEvent("click", { bubbles: true })); await wait(400);
  });
  chk(r.cp && r.cp[5] === 0 && r.cp.c5 === 1, "8: fin de tour " + JSON.stringify(r.cp));
  if (fails.length) { console.log("ECHEC queuetest :\n  " + fails.join("\n  ")); process.exit(1); }
  console.log("OK queuetest : 14 seances, " + lib.size + " exercices couverts, <= 60 min, FULL espaces (ecart min " + minGap + "), migration 12->14, LIGHT sans saut, Mobility reelle, Armor, fin de tour");
})();
