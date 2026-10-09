// CARTHAGO : fusion de sync a 3 voies (carthagoMergeDocs / carthagoPrepareSave).
const fs = require("fs");
const { JSDOM, VirtualConsole } = require("jsdom");
const { APP, wait, readApp } = require("./_harness");
(async () => {
  const dom = new JSDOM(readApp(APP), { url: "http://localhost/", runScripts: "dangerously", pretendToBeVisual: true, virtualConsole: new VirtualConsole(),
    beforeParse(w) { w.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }); } });
  await wait(800);
  const w = dom.window, M = (b, r, l, t) => JSON.parse(JSON.stringify(w.carthagoMergeDocs(b, r, l, t || "2026-10-10")));
  const fails = []; const chk = (c, m) => { if (!c) fails.push(m); };
  const H = (c) => ({ week: "A", day: "MONDAY", completed: c });
  // 1. appareil perime : ne change que xSets, le cloud a avance (histoire, cyclePos, tier)
  let base = { tier: 4, cyclePos: { 4: 3 }, workoutHistory: { "2026-10-05": H(true) }, xSets: {} };
  let remote = { ...base, tier: 5, cyclePos: { 4: 4 }, workoutHistory: { "2026-10-05": H(true), "2026-10-06": H(true) }, updatedAt: "T2" };
  let local = { ...base, xSets: { Squat: 2 } };
  let m = M(base, remote, local);
  chk(m.tier === 5 && m.cyclePos[4] === 4, "1: scalaires du cloud ecrases par un appareil perime");
  chk(m.workoutHistory["2026-10-06"] && m.workoutHistory["2026-10-05"], "1: historique du cloud perdu");
  chk(m.xSets.Squat === 2, "1: modif locale perdue");
  // 2. dates differentes ajoutees des deux cotes : union
  remote = { ...base, workoutHistory: { "2026-10-05": H(true), "2026-10-06": H(true) } };
  local = { ...base, workoutHistory: { "2026-10-05": H(true), "2026-10-07": H(true) } };
  m = M(base, remote, local);
  chk(Object.keys(m.workoutHistory).length === 3, "2: union des dates echouee");
  // 3. meme date, un seul cote termine : termine gagne
  base = { workoutHistory: { "2026-10-08": H(false) } };
  remote = { workoutHistory: { "2026-10-08": H(true) } }; local = { workoutHistory: { "2026-10-08": { ...H(false), exerciseData: { x: 1 } } } };
  m = M(base, remote, local);
  chk(m.workoutHistory["2026-10-08"].completed === true, "3: seance terminee ecrasee par une non terminee");
  // 4. garde de completion
  base = { workoutHistory: {}, completedEx: { "A-MONDAY-x": true, "B-FRIDAY-y": true } };
  remote = { workoutHistory: { "2026-10-10": H(true) }, completedEx: { "B-FRIDAY-y": true }, logData: {} };
  local = { workoutHistory: {}, completedEx: { "A-MONDAY-x": true, "B-FRIDAY-y": true, "A-MONDAY-z": true } };
  m = M(base, remote, local, "2026-10-10");
  chk(!Object.keys(m.completedEx).some(k => k.indexOf("A-MONDAY-") === 0) && m.completedEx["B-FRIDAY-y"], "4: coches du jour ressuscitees ou autres jours perdus");
  // 5. suppression locale (decoche) propagee si le cloud n'a pas touche la cle
  base = { completedEx: { a: true, b: true } }; remote = { completedEx: { a: true, b: true, c: true } }; local = { completedEx: { a: true } };
  m = M(base, remote, local);
  chk(m.completedEx.a && !m.completedEx.b && m.completedEx.c, "5: suppression locale non propagee / ajout cloud perdu");
  // 6. scalaire modifie des deux cotes : local gagne
  base = { tier: 4 }; remote = { tier: 5 }; local = { tier: 6 };
  chk(M(base, remote, local).tier === 6, "6: conflit scalaire : le local doit gagner");
  // 7. testHistory : union par date
  base = { testHistory: [{ date: "2026-05-02" }] };
  remote = { testHistory: [{ date: "2026-05-02" }, { date: "2026-08-02" }] }; local = { testHistory: [{ date: "2026-05-02" }, { date: "2026-08-03" }] };
  m = M(base, remote, local);
  chk(m.testHistory.length === 3, "7: union testHistory");
  // 8. prepareSave : cloud inchange = ecriture directe ; cloud change = fusion ; pas de doc = ecriture directe
  const P = (r, b, l) => w.carthagoPrepareSave(r, b, l);
  chk(P({ updatedAt: "T1", tier: 4 }, { updatedAt: "T1" }, { tier: 6 }).merged === false, "8: fusion inutile quand le cloud n'a pas bouge");
  chk(P({ updatedAt: "T2", tier: 5 }, { updatedAt: "T1", tier: 4 }, { tier: 4, xSets: { a: 1 } }).merged === true, "8: fusion attendue");
  chk(P(null, null, { tier: 6 }).merged === false, "8: premier document");
  console.log(fails.length ? "FAIL mergetest:\n  " + fails.join("\n  ") : "OK mergetest : fusion 3 voies (8 groupes de cas)");
  process.exit(fails.length ? 1 : 0);
})();
