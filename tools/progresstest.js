// CARTHAGO : sessions par exercice, suggestion de charge, chip NEXT, carte PROGRESS du Calendar.
const { JSDOM, VirtualConsole } = require("jsdom");
const { APP, wait, readApp } = require("./_harness");
(async () => {
  const fails = []; const chk = (c, m) => { if (!c) fails.push(m); };
  // exercice cle reel du programme : premier ex.key avec poids dans workoutsA
  const probe = new JSDOM(readApp(APP), { url: "http://localhost/", runScripts: "dangerously", virtualConsole: new VirtualConsole(), beforeParse(w) { w.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }); } });
  await wait(600);
  const found = probe.window.eval(`(() => { for (const d of Object.keys(workoutsA)) { const wo = workoutsA[d]; if (!wo.blocks) continue; for (let bi = 0; bi < wo.blocks.length; bi++) for (const ex of wo.blocks[bi].exercises) if (ex.key && ex.track && ex.track.includes("Weight") && ex.dr && !/carry/i.test(ex.name)) return { d, bi, name: ex.name, dr: ex.dr }; } return null; })()`);
  const w0 = probe.window;
  chk(!!found, "aucun exercice cle pondere trouve dans le programme");
  // 1. fonctions pures
  const S = (wh) => JSON.parse(JSON.stringify(w0.carthagoExerciseSessions(wh)));
  const H = (date, key, o) => ({ [date]: { completed: true, exerciseData: { [key]: o } } });
  const key = (n) => "A-MONDAY-1-" + n;
  let wh = { ...H("2026-10-01", key("BACK SQUAT"), { w1: "80", r1: "4", w2: "80", r2: "4" }), ...H("2026-10-05", key("BACK SQUAT"), { w1: "82.5", r1: "4", w2: "82.5", r2: "3" }) };
  let ss = S(wh);
  chk(ss["BACK SQUAT"] && ss["BACK SQUAT"].length === 2 && ss["BACK SQUAT"][1].max === 82.5, "sessions: extraction incorrecte");
  chk(Object.keys(S({ "2026-10-01": { completed: false, exerciseData: { [key("X")]: { w1: "5" } } } })).length === 0, "sessions: seance non terminee comptee");
  chk(Object.keys(S(H("2026-10-01", "A-MONDAY-1-3", { w1: "50" }))).length === 0, "sessions: ancienne cle numerique non ignoree");
  const sg = (sessions, t) => JSON.parse(JSON.stringify(w0.carthagoSuggestNext(sessions, t)));
  chk(sg(ss["BACK SQUAT"], 4).reason === "hold" && sg(ss["BACK SQUAT"], 4).weight === 82.5, "suggestion: reps manquantes -> garder la charge");
  chk(sg([ss["BACK SQUAT"][0]], 4).reason === "up" && sg([ss["BACK SQUAT"][0]], 4).weight === 82.5, "suggestion: reps atteintes -> +2.5");
  chk(sg([{ date: "d", max: 100, sets: [{ w: 100, r: 5 }] }], 5).weight === 105, "suggestion: +5 des 100 kg");
  chk(sg([], 4) === null && sg(ss["BACK SQUAT"], 0) === null, "suggestion: sans donnees ou sans cible doit etre null");
  probe.window.close();
  // 2. UI avec historique reel : chip NEXT + carte PROGRESS
  if (found) {
    const exKey = `A-${found.d}-${found.bi}-${found.name}`;
    const hist = {}; [["2026-09-14", 70], ["2026-09-21", 72.5], ["2026-09-28", 75], ["2026-10-05", 77.5]].forEach(([d, wgt]) => { hist[d] = { week: "A", day: found.d, completed: true, exerciseData: { [exKey]: { w1: String(wgt), r1: String(found.dr), w2: String(wgt), r2: String(found.dr) } } }; });
    const dom = new JSDOM(readApp(APP), { url: "http://localhost/", runScripts: "dangerously", pretendToBeVisual: true, virtualConsole: new VirtualConsole(),
      beforeParse(w) { w.carthagoFirebase = { ready: true, user: null, load: () => Promise.resolve(null), save: () => Promise.resolve(true), signIn() {}, signOut() {} };
        w.localStorage.setItem("carthago_workoutHistory", JSON.stringify(hist));
        w.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }); } });
    await wait(1500);
    const w = dom.window;
    w.carthagoOnAuthChange({ email: "med.bayram.hamdi@gmail.com", uid: "u1" }); await wait(400);
    const tab = Array.from(w.document.querySelectorAll("button")).find(b => b.textContent.trim().toLowerCase() === "calendar");
    if (tab) { tab.click(); await wait(400); }
    const txt = w.document.getElementById("root").textContent;
    chk(txt.includes("PROGRESS") && txt.includes(found.name) && txt.includes("4 sessions") && txt.includes("+7.5 kg since 2026-09-14"), "carte PROGRESS incorrecte : " + txt.slice(txt.indexOf("PROGRESS"), txt.indexOf("PROGRESS") + 120));
    chk(w.document.querySelectorAll("svg polyline").length >= 1 && w.document.querySelectorAll("svg circle").length >= 4, "courbe absente");
    w.close();
  }
  console.log(fails.length ? "FAIL progresstest:\n  " + fails.join("\n  ") : "OK progresstest : sessions, suggestion de charge, carte PROGRESS (4 sessions, +7.5 kg)");
  process.exit(fails.length ? 1 : 0);
})();
