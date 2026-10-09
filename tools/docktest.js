// CARTHAGO : dock chrono + jauge qui suit au scroll, et chrono de seance qui tourne chaque seconde.
const { JSDOM, VirtualConsole } = require("jsdom");
const { APP, wait, readApp } = require("./_harness");
(async () => {
  const fails = []; const chk = (c, m) => { if (!c) fails.push(m); };
  const base = new Date(2026, 9, 5, 10, 0, 0); // lundi
  const dom = new JSDOM(readApp(APP), { url: "http://localhost/", runScripts: "dangerously", pretendToBeVisual: true, virtualConsole: new VirtualConsole(),
    beforeParse(w) {
      const R = w.Date, off = base.getTime() - R.now();
      class M extends R { constructor(...a) { if (a.length === 0) super(R.now() + off); else super(...a); } static now() { return R.now() + off; } }
      w.Date = M;
      w.localStorage.setItem("carthago_tier", "6");
      w.localStorage.setItem("carthago_sessionTimer", JSON.stringify({ running: true, startedAt: base.getTime() - 65000, dayKey: "2026-10-05" }));
      w.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
    } });
  const w = dom.window, d = w.document;
  await wait(1500);
  chk(!d.querySelector("[data-dock]"), "dock visible en haut de page");
  const setY = (y) => { Object.defineProperty(w, "scrollY", { value: y, configurable: true }); w.dispatchEvent(new w.Event("scroll")); };
  setY(500); await wait(300);
  let dock = d.querySelector("[data-dock]");
  chk(!!dock, "dock absent apres scroll");
  if (dock) {
    const t1 = dock.textContent; const m = /([0-9]+)[/]([0-9]+)/.exec(dock.querySelector("div").lastChild.textContent);
    chk(/[0-9]{2}:[0-9]{2}/.test(t1), "chrono absent du dock : " + t1);
    chk(!!m && Number(m[2]) > 0, "jauge absente du dock : " + t1);
    await wait(2300);
    const t2 = d.querySelector("[data-dock]").textContent;
    chk(t1.slice(0, 5) !== t2.slice(0, 5), "le chrono du dock ne tourne pas : " + t1 + " -> " + t2);
    // cocher un exercice : le compteur monte
    const box = Array.from(d.querySelectorAll("button")).find(b => b.style.width === "22px" && b.style.height === "22px");
    chk(!!box, "case a cocher introuvable");
    if (box && m) { box.click(); await wait(400); const m2 = /([0-9]+)[/]([0-9]+)/.exec(d.querySelector("[data-dock] div").lastChild.textContent); chk(m2 && Number(m2[1]) === Number(m[1]) + 1, "le dock ne suit pas la progression : " + (m && m[0]) + " -> " + (m2 && m2[0])); }
  }
  // le chrono du widget principal tourne aussi
  setY(0); await wait(300);
  chk(!d.querySelector("[data-dock]"), "dock encore visible en haut de page");
  console.log(fails.length ? "FAIL docktest:\n  " + fails.join("\n  ") : "OK docktest : dock au scroll, chrono live, jauge suit les exercices coches");
  w.close(); process.exit(fails.length ? 1 : 0);
})();
