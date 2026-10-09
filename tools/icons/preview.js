const sharp = require("sharp");
const path = require("path");
const { variants, favicon } = require("./tanit");
(async () => {
  const S = 300, tiles = [];
  for (const k of [1, 2, 3]) tiles.push(await sharp(Buffer.from(variants[k]({}))).resize(S, S).png().toBuffer());
  const fav = Buffer.from(favicon({}));
  const f = async (px, scale) => sharp(await sharp(fav).resize(px, px).png().toBuffer()).resize(px * scale, px * scale, { kernel: "nearest" }).png().toBuffer();
  const f32 = await f(32, 4), f16 = await f(16, 4), f192 = await sharp(fav).resize(S, S).png().toBuffer();
  const W = S * 3 + 40 * 4, H = S + 40 + 128 + 40 + 40;
  const comp = tiles.map((b, i) => ({ input: b, left: 40 + i * (S + 40), top: 40 }));
  comp.push({ input: f32, left: 40, top: S + 80 }, { input: f16, left: 40 + 128 + 40, top: S + 80 });
  const out = path.join(process.argv[2]);
  await sharp({ create: { width: W, height: H, channels: 3, background: "#1c1814" } }).composite(comp).png().toFile(out);
  console.log(out);
})();
