// CARTHAGO : garde de sync Firestore.
// 1. Cloud ancien (sans xSets/skipDays/swapMap) : les valeurs locales partent a la connexion sans nouvelle modif.
// 2. Cloud lent : AUCUN save avant la fin du load, un seul save ensuite, valeurs locales presentes.
// 3. Domaine neuf (localStorage vide) + cloud lent avec donnees : jamais de save vide, le cloud est restaure puis conserve.
// 4. Load en echec (undefined) : aucun save, le cloud n'est jamais ecrase.
const fs = require("fs");
const { JSDOM, VirtualConsole } = require("jsdom");
const { APP, wait } = require("./_harness");
const LOCAL = { xSets: { "Bench Press": 2 }, skipDays: { "2026-10-07": true }, swapMap: { a: "b" } };
async function run({ local, cloud, delay, waitMs = 4500 }) {
  const saved = [];
  const dom = new JSDOM(fs.readFileSync(APP, "utf8"), {
    url: "http://localhost/", runScripts: "dangerously", pretendToBeVisual: true, virtualConsole: new VirtualConsole(),
    beforeParse(w) {
      if (local) Object.keys(LOCAL).forEach(k => w.localStorage.setItem("carthago_" + k, JSON.stringify(LOCAL[k])));
      w.carthagoFirebase = { ready: true, user: null, signIn() {}, signOut() {},
        load: () => new Promise(r => setTimeout(() => r(cloud), delay)),
        save: (d) => { saved.push(d); return Promise.resolve(true); } };
      w.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
    },
  });
  await wait(1200);
  dom.window.carthagoOnAuthChange({ email: "med.bayram.hamdi@gmail.com", uid: "u1" });
  await wait(waitMs);
  dom.window.close();
  return saved;
}
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const hasLocal = (d) => d && Object.keys(LOCAL).every(k => eq(d[k], LOCAL[k]));
(async () => {
  const fails = [];
  const chk = (c, m) => { if (!c) fails.push(m); };
  let s = await run({ local: true, cloud: { tier: 4, week: "A" }, delay: 50 });
  chk(s.length >= 1 && hasLocal(s[s.length - 1]), "1: valeurs locales non envoyees (cloud ancien)");
  s = await run({ local: true, cloud: { tier: 4, week: "A" }, delay: 2500, waitMs: 6000 });
  chk(s.length === 1 && hasLocal(s[0]), "2: cloud lent, " + s.length + " save(s) ou valeurs locales absentes");
  const CLOUD = { tier: 6, xSets: { Squat: 3 }, skipDays: { "2026-10-01": true }, swapMap: { z: "y" }, workoutHistory: { "2026-10-05": { completed: true } } };
  s = await run({ local: false, cloud: CLOUD, delay: 2500, waitMs: 6000 });
  const last = s[s.length - 1];
  chk(s.length >= 1 && s.every(d => eq(d.xSets, CLOUD.xSets) && eq(d.workoutHistory, CLOUD.workoutHistory)), "3: save vide ou cloud ecrase sur domaine neuf");
  chk(last && last.tier === 6, "3: cloud non restaure");
  s = await run({ local: true, cloud: undefined, delay: 50 });
  chk(s.length === 0, "4: " + s.length + " save(s) apres echec du load");
  console.log(fails.length ? "FAIL pushtest:\n  " + fails.join("\n  ") : "OK pushtest : 4 scenarios (push local, cloud lent, domaine neuf, load en echec)");
  process.exit(fails.length ? 1 : 0);
})();
