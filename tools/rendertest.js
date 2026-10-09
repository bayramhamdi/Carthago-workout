// CARTHAGO : gate 2. Monte app/index.html dans jsdom, echoue si ecran blanc ou erreur.
// Usage : node tools/rendertest.js [app/index.html]
const { mount, wait, APP } = require("./_harness");
(async () => {
  const file = process.argv[2] || APP;
  const { dom, errors } = mount(file);
  await wait(1500);
  const root = dom.window.document.getElementById("root");
  const len = root ? root.innerHTML.length : 0;
  const text = root ? root.textContent.trim().length : 0;
  let ok = true;
  if (!root || len < 500 || text < 20) { console.error("FAIL : #root vide ou quasi vide (" + len + " car html, " + text + " car texte)"); ok = false; }
  if (errors.length) { console.error("FAIL : erreurs :\n  " + errors.join("\n  ")); ok = false; }
  if (ok) console.log("OK rendertest : #root rendu (" + len + " car html, " + text + " car texte), 0 erreur");
  dom.window.close();
  process.exit(ok ? 0 : 1);
})();
