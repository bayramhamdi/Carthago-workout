// CARTHAGO : garde de sync Firestore.
// 1. Cloud ancien (sans xSets/skipDays/swapMap) : les valeurs locales partent a la connexion sans nouvelle modif.
// 2. Cloud lent : AUCUN save avant la fin du load, un seul save ensuite, valeurs locales presentes.
// 3. Domaine neuf (localStorage vide) + cloud lent avec donnees : jamais de save vide, le cloud est restaure puis conserve.
// 4. Load en echec (undefined) : aucun save, le cloud n'est jamais ecrase.
const fs = require("fs");
const { JSDOM, VirtualConsole } = require("jsdom");
const { APP, wait } = require("./_harness");
const LOCAL = { xSets: { "Bench Press": 2 }, skipDays: { "2026-10-07": true }, swapMap: { a: "b" } };
async function run({ local, cloud, delay, waitMs = 4500, saveImpl, afterLogin }) {
  const saved = [], calls = [];
  const dom = new JSDOM(fs.readFileSync(APP, "utf8"), {
    url: "http://localhost/", runScripts: "dangerously", pretendToBeVisual: true, virtualConsole: new VirtualConsole(),
    beforeParse(w) {
      if (local) Object.keys(LOCAL).forEach(k => w.localStorage.setItem("carthago_" + k, JSON.stringify(LOCAL[k])));
      w.carthagoFirebase = { ready: true, user: null, signIn() {}, signOut() {},
        load: () => new Promise(r => setTimeout(() => r(cloud), delay)),
        save: (d, base) => { saved.push(d); calls.push({ d, base }); return saveImpl ? saveImpl(saved.length) : Promise.resolve(true); } };
      w.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
    },
  });
  await wait(1200);
  dom.window.carthagoOnAuthChange({ email: "med.bayram.hamdi@gmail.com", uid: "u1" });
  if (afterLogin) await afterLogin(dom.window, wait);
  await wait(waitMs);
  dom.window.close();
  saved.calls = calls;
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
  // 5. la base transmise au save = document charge (updatedAt du cloud)
  s = await run({ local: true, cloud: { tier: 4, updatedAt: "T1" }, delay: 50 });
  chk(s.calls.length >= 1 && s.calls[0].base && s.calls[0].base.updatedAt === "T1", "5: base de fusion non transmise au save");
  // 6. resultat fusionne applique a l'etat : le save suivant contient les donnees fusionnees
  s = await run({ local: true, cloud: { tier: 4, updatedAt: "T1" }, delay: 50, waitMs: 6000,
    saveImpl: (n) => Promise.resolve(n === 1 ? { ok: true, merged: true, updatedAt: "T2", doc: { tier: 5, xSets: { Merge: 9 } } } : { ok: true, updatedAt: "T3" }) });
  const lastM = s[s.length - 1];
  chk(s.length >= 2 && lastM.tier === 5 && lastM.xSets && lastM.xSets.Merge === 9, "6: donnees fusionnees non appliquees (" + s.length + " saves)");
  chk(s.length >= 2 && s.calls[1].base && s.calls[1].base.updatedAt === "T2", "6: base non mise a jour apres save");
  // 7. echec reseau puis retour en ligne : nouvelle tentative automatique
  s = await run({ local: true, cloud: { tier: 4 }, delay: 50, waitMs: 3000,
    saveImpl: (n) => Promise.resolve(n === 1 ? { ok: false } : { ok: true, updatedAt: "T9" }),
    afterLogin: async (w, wt) => { await wt(2500); w.dispatchEvent(new w.Event("online")); } });
  chk(s.length === 2 && s[1].tier === 4, "7: pas de nouvelle tentative apres 'online' (" + s.length + " saves)");
  console.log(fails.length ? "FAIL pushtest:\n  " + fails.join("\n  ") : "OK pushtest : 7 scenarios (push local, cloud lent, domaine neuf, load en echec, base, fusion appliquee, retry online)");
  process.exit(fails.length ? 1 : 0);
})();
