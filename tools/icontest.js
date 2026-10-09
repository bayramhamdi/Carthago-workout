// CARTHAGO : toutes les icones referencees (manifest, index.html, sw.js) existent dans app/ avec la bonne taille.
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const APP = path.join(__dirname, "..", "app");
(async () => {
  const fails = [];
  const man = JSON.parse(fs.readFileSync(path.join(APP, "manifest.json"), "utf8"));
  for (const i of man.icons) {
    const f = path.join(APP, i.src.replace(/^[/]/, ""));
    if (!fs.existsSync(f)) { fails.push("manquant: " + i.src); continue; }
    const md = await sharp(f).metadata(); const [w, h] = i.sizes.split("x").map(Number);
    if (md.width !== w || md.height !== h) fails.push(i.src + " : " + md.width + "x" + md.height + " au lieu de " + i.sizes);
  }
  const html = fs.readFileSync(path.join(APP, "index.html"), "utf8");
  const sw = fs.readFileSync(path.join(APP, "sw.js"), "utf8");
  const refs = [...html.matchAll(/<link rel="(?:icon|apple-touch-icon)"[^>]*href="([^"]+)"/g)].map(m => m[1]);
  refs.push(...[...sw.matchAll(/'(\/[^']+[.](?:png|svg|ico))'/g)].map(m => m[1]));
  for (const r of new Set(refs)) if (!fs.existsSync(path.join(APP, r.replace(/^[/]/, "")))) fails.push("reference cassee: " + r);
  const ico = fs.readFileSync(path.join(APP, "favicon.ico"));
  if (ico.readUInt16LE(2) !== 1 || ico.readUInt16LE(4) !== 3) fails.push("favicon.ico invalide");
  if (!man.icons.some(i => i.purpose === "maskable")) fails.push("aucune icone maskable");
  console.log(fails.length ? "FAIL icontest:\n  " + fails.join("\n  ") : "OK icontest : " + man.icons.length + " icones manifest + " + new Set(refs).size + " references, ico 3 tailles");
  process.exit(fails.length ? 1 : 0);
})();
