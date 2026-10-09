// CARTHAGO : genere les icones de app/ (Tanit plein, ember sur ink). Usage : node tools/icons/build.js
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const { variants, favicon, faviconInner, INK } = require("./tanit");
const OUT = path.join(__dirname, "..", "..", "app");
const png = (svg, px) => sharp(Buffer.from(svg)).resize(px, px).png().toBuffer();
(async () => {
  const any = variants[1]({ dy: -4 });
  const maskable = variants[1]({ scale: 0.82, dy: -4 });   // figure dans la zone de securite (cercle 80 %)
  fs.writeFileSync(path.join(OUT, "icon-192.png"), await png(any, 192));
  fs.writeFileSync(path.join(OUT, "icon-512.png"), await png(any, 512));
  fs.writeFileSync(path.join(OUT, "icon-maskable-192.png"), await png(maskable, 192));
  fs.writeFileSync(path.join(OUT, "icon-maskable-512.png"), await png(maskable, 512));
  fs.writeFileSync(path.join(OUT, "apple-touch-icon.png"), await png(variants[1]({ dy: -4 }), 180));   // fond plein, iOS arrondit
  // favicon.svg : version simplifiee, coins arrondis
  fs.writeFileSync(path.join(OUT, "favicon.svg"),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="96" fill="${INK}"/>${faviconInner()}</svg>\n`);
  // favicon.ico : PNG embarques 16, 32, 48
  const sizes = [16, 32, 48], pngs = [];
  for (const s of sizes) pngs.push(await png(favicon({}), s));
  const head = Buffer.alloc(6); head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(sizes.length, 4);
  let offset = 6 + 16 * sizes.length; const entries = [];
  sizes.forEach((s, i) => { const e = Buffer.alloc(16); e[0] = s; e[1] = s; e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6); e.writeUInt32LE(pngs[i].length, 8); e.writeUInt32LE(offset, 12); offset += pngs[i].length; entries.push(e); });
  fs.writeFileSync(path.join(OUT, "favicon.ico"), Buffer.concat([head, ...entries, ...pngs]));
  console.log("icones ecrites dans", OUT);
})();
