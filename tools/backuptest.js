// CARTHAGO : test export / import du backup (helpers carthagoBuildBackup / carthagoApplyBackup).
const fs = require("fs");
const { JSDOM, VirtualConsole } = require("jsdom");
const { APP, wait, readApp } = require("./_harness");
(async () => {
  const dom = new JSDOM(readApp(APP), {
    url: "http://localhost/", runScripts: "dangerously", pretendToBeVisual: true, virtualConsole: new VirtualConsole(),
    beforeParse(w) { w.carthagoFirebase = { ready: true, user: null, load: () => Promise.resolve(null), save: () => Promise.resolve(true), signIn() {}, signOut() {} }; w.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }); },
  });
  await wait(1500);
  const w = dom.window, L = w.localStorage, fails = []; let L0;
  const chk = (c, m) => { if (!c) fails.push(m); };
  chk(typeof w.carthagoBuildBackup === "function", "helpers absents");
  // 0. UI : connecte en proprietaire, onglet Calendar, carte BACKUP visible
  chk(typeof w.carthagoOnAuthChange === "function", "auth hook absent");
  if (typeof w.carthagoOnAuthChange === "function") {
    w.carthagoOnAuthChange({ email: "med.bayram.hamdi@gmail.com" });
    await wait(300);
    const tab = Array.from(w.document.querySelectorAll("button")).find(b => b.textContent.trim().toLowerCase() === "calendar");
    chk(!!tab, "onglet calendar absent");
    if (tab) { tab.click(); await wait(300); }
    const txt = w.document.getElementById("root").textContent;
    chk(txt.includes("Export backup") && txt.includes("Import backup"), "carte BACKUP absente du Calendar");
    chk(!!w.document.querySelector('input[type="file"]'), "input fichier absent");
    chk(txt.includes("REMINDER") && txt.includes("Reminder OFF"), "carte REMINDER absente du Calendar");
    chk(txt.includes("No backup yet"), "statut de sauvegarde absent (jamais exporte)");
    chk(!!w.document.querySelector('span[title="Backup due"]'), "pastille de rappel absente");
  }
  // 0b. rappel : une sauvegarde recente retire la pastille
  L0 = w.localStorage; L0.setItem("carthago_lastExport", JSON.stringify(new Date().toISOString()));
  // 1. Export: toutes les cles carthago_, rien d'autre
  L.setItem("carthago_xSets", JSON.stringify({ a: 2 })); L.setItem("carthago_probe", JSON.stringify({ n: [1, 2] })); L.setItem("autre", "x");
  const b = w.carthagoBuildBackup();
  chk(b.format === 2 && b.keys.xSets && b.keys.xSets.a === 2 && b.keys.probe.n.length === 2, "export incomplet");
  chk(!("autre" in b.keys), "export contient une cle etrangere");
  chk(Object.keys(b.keys).length === Object.keys(L).filter(k => k.indexOf("carthago_") === 0).length, "export: nombre de cles different");
  // 2. Aller-retour : on vide, on importe, on retrouve tout sous carthago_
  const json = JSON.parse(JSON.stringify(b)); L.clear();
  chk(w.carthagoApplyBackup(json) === Object.keys(b.keys).length, "import: nombre de cles");
  chk(L.getItem("carthago_xSets") === '{"a":2}' && L.getItem("carthago_probe") === '{"n":[1,2]}', "import: valeurs differentes");
  chk(Object.keys(L).every(k => k.indexOf("carthago_") === 0), "import: cle hors prefixe carthago_");
  // 3. Anciens formats : export v1 (champs a plat) et cles prefixees bts_
  L.clear();
  w.carthagoApplyBackup({ version: "1.0", exportedAt: "x", week: "B", logData: { k: 1 }, customParts: { x: true }, junk: 1 });
  chk(L.getItem("carthago_week") === '"B"' && L.getItem("carthago_logData") === '{"k":1}', "import v1: cles manquantes");
  chk(L.getItem("carthago_junk") === null && L.getItem("carthago_customParts") === null, "import v1: cle non LS importee");
  L.clear();
  w.carthagoApplyBackup({ format: 2, keys: { "bts_tier": 6, "carthago_swapMap": { s: 1 }, "tBox": 1, "bad key": 1 } });
  chk(L.getItem("carthago_tier") === "6" && L.getItem("carthago_swapMap") === '{"s":1}', "import: prefixes bts_/carthago_ non normalises");
  chk(L.getItem("carthago_tBox") === null && Object.keys(L).length === 2, "import: cle morte ou invalide ecrite");
  // 4. Fichiers invalides
  chk(w.carthagoCountBackup(null) === 0 && w.carthagoCountBackup({ a: 1 }) === 0 && w.carthagoCountBackup("x") === 0, "fichier invalide accepte");
  console.log(fails.length ? "FAIL backuptest:\n  " + fails.join("\n  ") : "OK backuptest : export, aller-retour, formats anciens, rejets");
  process.exit(fails.length ? 1 : 0);
})();
