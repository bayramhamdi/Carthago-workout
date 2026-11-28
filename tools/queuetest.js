// CARTHAGO : file de 14 seances (17.10.2026).
// 1. Couverture : chaque exercice du programme (et du modele recovery) est dans une seance de la file.
// 2. 1h max : le temps AFFICHE (estimation de l'app, en FULL) de chaque seance <= 60 min (cas 14 ; trainTime n'est pas affiche).
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
// 3
// Mobility est FULL par defaut (seance complete) mais ne compte pas dans l'espacement : la regle vise les seances de force.
const seq = Q.map(s => s.label === "Mobility" ? "mob" : s.cond).concat(Q.map(s => s.label === "Mobility" ? "mob" : s.cond2)); const fullAt = []; seq.forEach((c, i) => { if (c === "full") fullAt.push(i); });
let minGap = 99; fullAt.forEach((p, i) => { const nx = i + 1 < fullAt.length ? fullAt[i + 1] : fullAt[0] + seq.length; minGap = Math.min(minGap, nx - p); });
chk(minGap >= 3, "deux FULL trop proches (ecart " + minGap + ")");
const fullLabels = new Set(Q.filter(s => s.cond === "full" || s.cond2 === "full").map(s => s.label));
["Pull", "Push", "Legs", "Arms"].forEach(l => chk(fullLabels.has(l), l + " jamais FULL"));
chk(!Q.some(s => s.label === "Mobility" && (s.cond !== "full" || s.cond2 !== "full")), "Mobility pas FULL par defaut");

let MON = new Date(2026, 9, 19, 9, 0, 0); // lundi 19.10.2026 (samedi pour le cas 11)
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
  let strip = null;
  let r = await run({ ...base, cyclePos: { 4: 0, 5: 6, 6: 0 } }, async (o) => {
    const cells = [...o.w.document.querySelectorAll("button")].filter(b => b.children.length === 3 && /^[MTWFS]$/.test(b.children[0].textContent));
    strip = cells.slice(0, 7).map(b => b.children[1].style.background + "|" + b.children[2].textContent);
  });
  // 9. Couleurs de la bande = intensite reelle (lun Pull B light, mar Push B full, mer Work Cap light)
  chk(strip && strip.length === 7, "9: bande des jours introuvable");
  if (strip) { chk(/^rgba\(255, 255, 255|var\(--light\)\|Pull/.test(strip[0]) || strip[0].startsWith("rgba"), "9: lundi " + strip[0]); chk(strip[1] === "var(--full)|Push", "9: mardi " + strip[1]); chk(strip[2] === "var(--light)|Work Cap", "9: mercredi " + strip[2]); chk(strip[3] === "var(--light)|Legs", "9: jeudi " + strip[3]); chk(strip[4] === "var(--full)|Arms", "9: vendredi " + strip[4]); chk(strip[6] === "var(--smoke)|Rest", "9: dimanche " + strip[6]); }
  chk(!/Schedule/.test(r.text), "10: onglet Schedule encore la");
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
  // 11. Jour de repos (samedi) : "Set today's session" -> on s'entraine aujourd'hui, puis Mark Complete avance la file
  MON = new Date(2026, 10, 7, 10, 0, 0);
  let td = null;
  r = await run({ ...base, cyclePos: { 4: 0, 5: 7, 6: 0, q: 14 } }, async (o) => {
    const btns = () => [...o.w.document.querySelectorAll("button")];
    const open = btns().find(b => /Set today's session/.test(b.textContent));
    chk(!!open, "11: bouton Set today's session absent le samedi"); if (!open) return;
    open.dispatchEvent(new o.w.MouseEvent("click", { bubbles: true })); await wait(200);
    chk(/Rest day\. Pick a session/.test(o.text()), "11: texte jour de repos absent");
    const pick = btns().find(b => /^9\/14Push/.test(b.textContent.replace(/\s+/g, "")));
    chk(!!pick, "11: choix 9/14 absent"); if (!pick) return;
    pick.dispatchEvent(new o.w.MouseEvent("click", { bubbles: true })); await wait(400);
    chk(/Session 9\/14/.test(o.text()), "11: hero pas sur Session 9/14 apres le choix");
    chk(o.text().includes("Med Ball Slam") && o.text().includes("Sled Push"), "11: seance Push B pas affichee");
    td = o.ls("trainDays");
    const mc = btns().find(x => /MARK SESSION COMPLETE/i.test(x.textContent));
    chk(!!mc, "11: Mark Complete absent"); if (!mc) return;
    mc.dispatchEvent(new o.w.MouseEvent("click", { bubbles: true })); await wait(400);
  });
  chk(td && td["2026-11-07"] === true, "11: trainDays " + JSON.stringify(td));
  chk(r.cp && r.cp[5] === 9, "11: file pas avancee apres Mark Complete " + JSON.stringify(r.cp));
  chk(!r.errors.length, "11: erreurs " + r.errors.join(" | "));
  // 12. RECOVERY a la main = modele de la zone travaillee par la seance (plus par jour de semaine)
  MON = new Date(2026, 10, 23, 9, 0, 0);
  for (const [i, title, not] of [[1, "CHEST + SHOULDER THERAPY", "Med Ball Slam"], [3, "LEG + KNEE THERAPY", "ROTATOR CUFF"], [5, "FULL BODY FLOW", "Suitcase Carry"]]) {
    let txt = "";
    await run({ ...base, cyclePos: { 4: 0, 5: i, 6: 0, q: 14 } }, async (o) => {
      const b = [...o.w.document.querySelectorAll("button")].find(x => x.textContent.trim() === "RECOVERY");
      chk(!!b, "12: bouton RECOVERY absent"); if (!b) return;
      b.dispatchEvent(new o.w.MouseEvent("click", { bubbles: true })); await wait(300); txt = o.text();
    });
    chk(txt.includes(title), "12: seance " + (i + 1) + "/14 en RECOVERY sans " + title);
    chk(!txt.includes(not), "12: seance " + (i + 1) + "/14 en RECOVERY montre encore " + not);
  }
  // 13. Carries (Dist + Weight) : une ligne DIST et une ligne KG (avant : REPS + DIST, pas de poids)
  let labels = null;
  await run({ ...base, cyclePos: { 4: 0, 5: 5, 6: 0, q: 14 } }, async (o) => {
    const name = [...o.w.document.querySelectorAll("*")].find(el => el.children.length === 0 && el.textContent.trim() === "FARMER'S CARRY");
    let card = name; while (card && !/\+ SET/.test(card.textContent)) card = card.parentElement;
    labels = card ? [...card.querySelectorAll("span")].map(x => x.textContent.trim()).filter(t => /^(REPS|DIST|KG|SEC)$/.test(t)) : null;
  });
  chk(labels && labels.join(",") === "DIST,KG", "13: lignes du Farmer's Carry = " + JSON.stringify(labels));
  // 14. Les 14 seances en FULL : temps affiche <= 60 min, aucun "1 sets", lettres de blocs sans trou, aucune erreur
  MON = new Date(2026, 10, 23, 9, 0, 0);
  for (let i = 0; i < 14; i++) {
    let txt = "", names = [];
    const rr = await run({ ...base, cyclePos: { 4: 0, 5: i, 6: 0, q: 14 } }, async (o) => {
      const b = [...o.w.document.querySelectorAll("button")].find(x => x.textContent.trim() === "FULL");
      if (b) { b.dispatchEvent(new o.w.MouseEvent("click", { bubbles: true })); await wait(250); }
      txt = o.text();
    });
    const m = txt.match(/~(\d+) min/);
    chk(m && +m[1] <= 60, "14: seance " + (i + 1) + "/14 FULL affiche " + (m ? m[0] : "aucun temps"));
    chk(!/(^|[^0-9])1 sets/.test(txt), "14: seance " + (i + 1) + "/14 affiche '1 sets'");
    chk(!rr.errors.length, "14: seance " + (i + 1) + "/14 erreurs " + rr.errors.join(" | "));
    const sq = Q[i]; const L = (sq.w === "A" ? P.tier6OverridesA : P.tier6OverridesB)[sq.d].blocks.map(b => b.name.split(".")[0].replace(/\d/, ""));
    const uniq = [...new Set(L)]; chk(uniq.join("") === "ABCDEFGH".slice(0, uniq.length), "14: lettres de blocs " + sq.label + " " + sq.w + " = " + uniq.join(""));
  }
  // 15. Modele recovery : rotationMap ne touche pas ses exercices (Pallof Press etait saute, "1 skipped")
  let recTxt = "";
  await run({ ...base, cyclePos: { 4: 0, 5: 5, 6: 0, q: 14 } }, async (o) => {
    const b = [...o.w.document.querySelectorAll("button")].find(x => x.textContent.trim() === "RECOVERY");
    b.dispatchEvent(new o.w.MouseEvent("click", { bubbles: true })); await wait(300); recTxt = o.text();
  });
  chk(recTxt.includes("Pallof Press") && !/skipped|flagged/.test(recTxt), "15: Full Body Flow saute encore un exercice");
  // 16. Armor (jamais FULL) : pas de "PR attempts only on FULL days" ; Plate Pinch (Seconds + Weight) = SEC + KG
  let armorB = "", pinch = null;
  await run({ ...base, cyclePos: { 4: 0, 5: 12, 6: 0, q: 14 } }, async (o) => { armorB = o.text(); });
  await run({ ...base, cyclePos: { 4: 0, 5: 7, 6: 0, q: 14 } }, async (o) => {
    const name = [...o.w.document.querySelectorAll("*")].find(el => el.children.length === 0 && el.textContent.trim() === "Plate Pinch Hold");
    let card = name; while (card && !/\+ SET/.test(card.textContent)) card = card.parentElement;
    pinch = card ? [...card.querySelectorAll("span")].map(x => x.textContent.trim()).filter(t => /^(REPS|DIST|KG|SEC|MIN)$/.test(t)) : null;
  });
  chk(/same weight, fewer sets/.test(armorB) && !/PR attempts only on FULL/.test(armorB), "16: Armor parle de jours FULL");
  chk(pinch && pinch.join(",") === "SEC,KG", "16: lignes Plate Pinch = " + JSON.stringify(pinch));
  // 17. LIGHT : jamais moins de 2 series sur un bloc prevu a 3+ (Arms A light : Biceps 2 sets, Warm-up 1 set)
  const setsOf = (o, bn) => { const sp = [...o.w.document.querySelectorAll("span")].find(x => x.textContent.trim() === bn); return sp && sp.parentElement.children[1] ? sp.parentElement.children[1].textContent.trim() : null; };
  let bi = null, wu = null, grip = null, swapTxt = "";
  await run({ ...base, cyclePos: { 4: 0, 5: 4, 6: 0, q: 14 } }, async (o) => { bi = setsOf(o, "C. BICEPS"); wu = setsOf(o, "A. WARM-UP"); });
  chk(bi === "2 sets (reduced)", "17: Arms A light, Biceps = " + bi); chk(wu === "1 set (reduced)", "17: Arms A light, Warm-up = " + wu);
  // 18. Forearms + grip : fin de Pull (plus dans Armor, la seance juste apres Arms)
  await run({ ...base, cyclePos: { 4: 0, 5: 0, 6: 0, q: 14 } }, async (o) => { grip = setsOf(o, "F. FOREARMS + GRIP"); });
  chk(grip === "2 sets", "18: Pull A sans bloc Forearms + Grip (" + grip + ")"); chk(!/FOREARMS/.test(armorB), "18: Armor B a encore un bloc forearms");
  // 19. Plus de badge DELOAD (semaine du 30.11.2026) ; SWAP propose les anciennes variantes (TRX Row pour Dynamic Sled Row)
  MON = new Date(2026, 10, 30, 9, 0, 0);
  const wk = await run({ ...base, cyclePos: { 4: 0, 5: 2, 6: 0, q: 14 } }, async (o) => {
    const name = [...o.w.document.querySelectorAll("*")].find(el => el.children.length === 0 && el.textContent.trim() === "Dynamic Sled Row");
    let card = name; while (card && ![...card.querySelectorAll("button")].some(x => /SWAP/.test(x.textContent))) card = card.parentElement;
    const sb = card && [...card.querySelectorAll("button")].find(x => /SWAP/.test(x.textContent));
    if (sb) { sb.dispatchEvent(new o.w.MouseEvent("click", { bubbles: true })); await wait(250); swapTxt = o.text(); }
  });
  chk(!/DELOAD|deload/.test(wk.text), "19: badge DELOAD encore affiche"); chk(swapTxt.includes("TRX Row"), "19: SWAP ne propose pas TRX Row");
  // 20. Temps au rythme reel : 3 seances a 1.25x l'estimation => temps affiche x1.25 + "your pace" ; estMin enregistre au Mark Complete
  MON = new Date(2026, 10, 23, 9, 0, 0);
  const hist = {}; ["2026-11-18", "2026-11-19", "2026-11-20"].forEach(k => { hist[k] = { completed: true, durationMin: 50, estMin: 40, day: "MONDAY", week: "A" }; });
  let plain = "", paced = "", saved = null;
  await run({ ...base, cyclePos: { 4: 0, 5: 0, 6: 0, q: 14 } }, async (o) => { plain = (o.text().match(/~(\d+) min/) || [])[1]; });
  await run({ ...base, workoutHistory: hist, cyclePos: { 4: 0, 5: 0, 6: 0, q: 14 } }, async (o) => {
    paced = (o.text().match(/~(\d+) min \u00B7 your pace/) || [])[1];
    const mc = [...o.w.document.querySelectorAll("button")].find(x => /MARK SESSION COMPLETE/i.test(x.textContent));
    if (mc) { mc.dispatchEvent(new o.w.MouseEvent("click", { bubbles: true })); await wait(400); saved = (o.ls("workoutHistory") || {})["2026-11-23"]; }
  });
  chk(plain && paced && +paced === Math.round(+plain * 1.25), "20: rythme reel, " + plain + " => " + paced);
  chk(saved && saved.estMin === +plain, "20: estMin non enregistre " + JSON.stringify(saved && saved.estMin));
  // 21. Aucune seance n'est identique dans deux modes (bug : Mobility pareille en FULL / LIGHT / RECOVERY)
  MON = new Date(2026, 10, 23, 9, 0, 0);
  for (let i = 0; i < 14; i++) {
    const sig = {};
    for (const mode of ["FULL", "LIGHT", "RECOVERY"]) {
      await run({ ...base, cyclePos: { 4: 0, 5: i, 6: 0, q: 14 } }, async (o) => {
        const b = [...o.w.document.querySelectorAll("button")].find(x => x.textContent.trim() === mode);
        if (b) { b.dispatchEvent(new o.w.MouseEvent("click", { bubbles: true })); await wait(250); }
        sig[mode] = [...o.w.document.querySelectorAll("span")].filter(sp => /^[A-H]\d?\. /.test(sp.textContent.trim()) && sp.parentElement.children.length >= 2).map(sp => sp.textContent.trim() + "=" + sp.parentElement.children[1].textContent.trim()).join("|");
      });
    }
    chk(sig.FULL && sig.FULL !== sig.LIGHT, "21: seance " + (i + 1) + "/14 identique en FULL et LIGHT");
    chk(sig.RECOVERY && sig.RECOVERY !== sig.FULL && sig.RECOVERY !== sig.LIGHT, "21: seance " + (i + 1) + "/14 RECOVERY identique a un autre mode");
  }
  let mobDef = "";
  await run({ ...base, cyclePos: { 4: 0, 5: 6, 6: 0, q: 14 } }, async (o) => { mobDef = o.text(); });
  chk(mobDef.includes("Shin Box Fold") && !/FULL BODY FLOW/.test(mobDef), "21: Mobility par defaut n'est pas la seance complete");
  if (fails.length) { console.log("ECHEC queuetest :\n  " + fails.join("\n  ")); process.exit(1); }
  console.log("OK queuetest : 14 seances, " + lib.size + " exercices couverts, <= 60 min, FULL espaces (ecart min " + minGap + "), migration 12->14, LIGHT sans saut, Mobility reelle, Armor, fin de tour");
})();
