// CARTHAGO : le load Firestore doit restaurer customParts (bug v9.0). Verifie via le payload re-sauvegarde.
const fs = require("fs");
const { JSDOM, VirtualConsole } = require("jsdom");
const { APP, wait } = require("./_harness");
(async () => {
  const saved = [];
  const dom = new JSDOM(fs.readFileSync(APP, "utf8"), {
    url: "http://localhost/", runScripts: "dangerously", pretendToBeVisual: true, virtualConsole: new VirtualConsole(),
    beforeParse(w) {
      w.carthagoFirebase = { ready: true, user: null, load: () => Promise.resolve({ customParts: { shoulders: true } }), save: (d) => { saved.push(d); return Promise.resolve(true); }, signIn() {}, signOut() {} };
      w.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
    },
  });
  await wait(1200);
  dom.window.carthagoOnAuthChange({ email: "med.bayram.hamdi@gmail.com", uid: "u1" });
  await wait(2600);
  const last = saved[saved.length - 1];
  const ok = last && last.customParts && last.customParts.shoulders === true;
  console.log(ok ? "OK loadtest : customParts restaure depuis Firestore" : "FAIL loadtest : customParts non restaure (" + JSON.stringify(last && last.customParts) + ")");
  process.exit(ok ? 0 : 1);
})();
