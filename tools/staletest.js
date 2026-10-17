// CARTHAGO : cloud en retard au chargement (bug du 13.10.2026).
// Seance 6/12 terminee sur le telephone, envoi cloud jamais parti. Le lendemain le cloud (ancien : seance non faite,
// chrono en marche) ne doit plus ecraser le telephone.
// File de 14 depuis le 17.10.2026 : l'ancienne position 6/12 (index 6, Pull B) devient 8/14 (index 7).
// 1. Telephone en avance + base connue : seance terminee, file a 8/14, chrono arrete, et c'est ce qui part au cloud.
// 2. Appareil neuf (pas de base) : le cloud gagne, comme avant.
// 3. Base d'un autre compte : le cloud gagne.
// 4. Garde du chrono : chrono oublie (> 6 h) ou seance deja terminee => arrete.
// 5. Bouton "Set today's session" : choisir 8/14 Pull met le hero sur Session 8/14.
const { JSDOM, VirtualConsole } = require("jsdom");
const { readApp, wait } = require("./_harness");
const NOW = new Date(2026, 9, 14, 12, 0, 0); // mercredi 14.10.2026
const Y = "2026-10-13", H = 3600000;
const T_START = new Date(2026, 9, 13, 17, 30).getTime();
const STALE = { tier: 5, cpMode: "v2", cyclePos: { 4: 0, 5: 5, 6: 0 }, workoutHistory: { "2026-10-12": { completed: true, day: "FRIDAY", week: "A" } },
  sessionTimer: { running: true, startedAt: T_START, dayKey: Y }, updatedAt: "2026-10-13T15:31:00.000Z" };
const LOCAL = { tier: 5, cpMode: "v2", cyclePos: { 4: 0, 5: 6, 6: 0 }, lastDone: { 5: Y },
  workoutHistory: { "2026-10-12": { completed: true, day: "FRIDAY", week: "A" }, [Y]: { completed: true, day: "SATURDAY", week: "A", completedAt: T_START + H } },
  sessionTimer: { running: false, startedAt: null, dayKey: null } };
async function run({ local, base, cloud, uid = "u1", after }) {
  const saved = [];
  const dom = new JSDOM(readApp(), { url: "http://localhost/", runScripts: "dangerously", pretendToBeVisual: true, virtualConsole: new VirtualConsole(),
    beforeParse(w) {
      const R = w.Date, off = NOW.getTime() - R.now();
      class D extends R { constructor(...a) { if (a.length === 0) super(R.now() + off); else super(...a); } static now() { return R.now() + off; } }
      w.Date = D;
      Object.keys(local || {}).forEach(k => w.localStorage.setItem("carthago_" + k, JSON.stringify(local[k])));
      if (base) w.localStorage.setItem("carthago_syncBase", JSON.stringify(base));
      w.carthagoFirebase = { ready: true, user: null, signIn() {}, signOut() {}, load: () => Promise.resolve(cloud), save: (d) => { saved.push(d); return Promise.resolve(true); } };
      w.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
      w.scrollTo = () => {};
    } });
  await wait(1200);
  dom.window.carthagoOnAuthChange({ email: "med.bayram.hamdi@gmail.com", uid });
  await wait(2600);
  const lsLive = (k) => JSON.parse(dom.window.localStorage.getItem("carthago_" + k) || "null");
  const live = { saved, ls: lsLive, text: () => dom.window.document.getElementById("root").textContent, w: dom.window };
  if (after) await after(live);
  const snap = {}; ["workoutHistory", "cyclePos", "sessionTimer"].forEach(k => { snap[k] = lsLive(k); });
  const txt = live.text();
  dom.window.close();
  return { saved, ls: (k) => snap[k], text: () => txt };
}
(async () => {
  const fails = []; const chk = (c, m) => { if (!c) fails.push(m); };
  // 1
  let r = await run({ local: LOCAL, base: { uid: "u1", doc: STALE }, cloud: STALE });
  chk(r.ls("workoutHistory") && r.ls("workoutHistory")[Y] && r.ls("workoutHistory")[Y].completed, "1: seance d'hier perdue");
  chk(r.ls("cyclePos") && r.ls("cyclePos")[5] === 7, "1: file revenue a " + JSON.stringify(r.ls("cyclePos")));
  chk(r.ls("sessionTimer") && r.ls("sessionTimer").running === false, "1: chrono relance par le cloud");
  const last = r.saved[r.saved.length - 1];
  chk(last && last.workoutHistory[Y] && last.workoutHistory[Y].completed && last.cyclePos[5] === 7, "1: la correction n'est pas envoyee au cloud");
  chk(/Session 8\/14/.test(r.text()), "1: hero n'affiche pas Session 8/14");
  // 2
  r = await run({ local: {}, base: null, cloud: { ...STALE, sessionTimer: { running: false, startedAt: null, dayKey: null } } });
  chk(r.ls("cyclePos") && r.ls("cyclePos")[5] === 6, "2: appareil neuf, le cloud n'a pas gagne");
  // 3
  r = await run({ local: LOCAL, base: { uid: "other", doc: STALE }, cloud: STALE });
  chk(r.ls("cyclePos") && r.ls("cyclePos")[5] === 6, "3: base d'un autre compte utilisee");
  // 4
  r = await run({ local: {}, base: null, cloud: STALE });
  chk(r.ls("sessionTimer") && r.ls("sessionTimer").running === false, "4a: chrono de 18 h encore en marche");
  r = await run({ local: {}, base: null, cloud: { ...STALE, sessionTimer: { running: true, startedAt: NOW.getTime() - H, dayKey: "2026-10-14" }, workoutHistory: { "2026-10-14": { completed: true, completedAt: NOW.getTime() - 60000 } } } });
  chk(r.ls("sessionTimer") && r.ls("sessionTimer").running === false, "4b: chrono en marche sur une seance terminee");
  r = await run({ local: {}, base: null, cloud: { ...STALE, sessionTimer: { running: true, startedAt: NOW.getTime() - 20 * 60000, dayKey: "2026-10-14" } } });
  chk(r.ls("sessionTimer") && r.ls("sessionTimer").running === true, "4c: chrono legitime (20 min) arrete a tort");
  // 5
  await run({ local: {}, base: null, cloud: { ...STALE, sessionTimer: { running: false } }, after: async (o) => {
    const btn = () => [...o.w.document.querySelectorAll("button")];
    const open = btn().find(b => /Set today's session/.test(b.textContent));
    chk(!!open, "5: bouton Set today's session absent");
    if (!open) return;
    open.dispatchEvent(new o.w.MouseEvent("click", { bubbles: true })); await wait(200);
    const pick = btn().find(b => /^8\/14Pull/.test(b.textContent.replace(/\s+/g, "")));
    chk(!!pick, "5: choix 8/14 Pull absent");
    if (!pick) return;
    pick.dispatchEvent(new o.w.MouseEvent("click", { bubbles: true })); await wait(300);
    chk(/Session 8\/14/.test(o.text()), "5: hero pas sur Session 8/14 apres le choix");
    chk(o.ls("cyclePos")[5] === 7, "5: choix non enregistre");
  } });
  if (fails.length) { console.log("ECHEC staletest :\n  " + fails.join("\n  ")); process.exit(1); }
  console.log("OK staletest : cloud en retard ne gagne plus, appareil neuf / autre compte inchanges, garde du chrono (3 cas), Set today's session");
})();
