// CARTHAGO : test du shim de migration localStorage (ancien prefixe vers carthago_).
const fs = require("fs");
const { JSDOM, VirtualConsole } = require("jsdom");
const { APP, wait, readApp } = require("./_harness");
(async () => {
  const dom = new JSDOM(readApp(APP), {
    url: "http://localhost/", runScripts: "dangerously", pretendToBeVisual: true, virtualConsole: new VirtualConsole(),
    beforeParse(w) {
      w.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
      const L = w.localStorage;
      L.setItem("bts_probe", JSON.stringify("B")); L.setItem("bts_xSets", JSON.stringify({ a: 2 }));
      L.setItem("bts_tier", "4"); L.setItem("carthago_tier", "6");
      L.setItem("bts_tBox", "1"); L.setItem("bts_supersetOn", "1"); L.setItem("carthago_tBox", "1");
    },
  });
  await wait(1200);
  const L = dom.window.localStorage; const fails = [];
  const chk = (c, m) => { if (!c) fails.push(m); };
  chk(L.getItem("carthago_probe") === '"B"', "probe non copiee");
  chk(L.getItem("carthago_xSets") === '{"a":2}', "xSets non copie");
  chk(L.getItem("carthago_tier") === "6", "carthago_tier existant ecrase");
  chk(L.getItem("bts_probe") === '"B"', "ancienne cle supprimee");
  chk(L.getItem("carthago_tBox") === null && L.getItem("bts_tBox") === null && L.getItem("bts_supersetOn") === null, "cles mortes non supprimees");
  chk(L.getItem("carthago_supersetOn") === null, "cle morte copiee");
  console.log(fails.length ? "FAIL migrationtest : " + fails.join("; ") : "OK migrationtest : shim correct");
  process.exit(fails.length ? 1 : 0);
})();
