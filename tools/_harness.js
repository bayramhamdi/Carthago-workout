// CARTHAGO : harnais jsdom partagé par rendertest.js et weektest.js
const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");

function mount(file, fixedNow) {
  const html = fs.readFileSync(file, "utf8");
  const errors = [];
  const vc = new VirtualConsole();
  vc.on("jsdomError", (e) => errors.push("jsdomError: " + (e.detail && e.detail.message || e.message)));
  vc.on("error", (...a) => errors.push("console.error: " + a.join(" ")));
  const dom = new JSDOM(html, {
    url: "http://localhost/",
    runScripts: "dangerously",
    pretendToBeVisual: true,
    virtualConsole: vc,
    beforeParse(w) {
      if (fixedNow) {
        const RealDate = w.Date;
        const offset = fixedNow.getTime() - RealDate.now();
        class MockDate extends RealDate {
          constructor(...a) { if (a.length === 0) super(RealDate.now() + offset); else super(...a); }
          static now() { return RealDate.now() + offset; }
        }
        w.Date = MockDate;
      }
      w.matchMedia = w.matchMedia || (() => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }));
      w.scrollTo = () => {};
    },
  });
  return { dom, errors };
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
module.exports = { mount, wait, APP: path.join(__dirname, "..", "app", "index.html") };
