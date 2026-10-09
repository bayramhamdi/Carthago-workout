// CARTHAGO : logique du service worker (jsdom-free : sw.js evalue dans un contexte mocke).
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const src = fs.readFileSync(path.join(__dirname, "..", "app", "sw.js"), "utf8");
const fails = []; const chk = (c, m) => { if (!c) fails.push(m); };
function makeEnv({ online = true, existing = [] } = {}) {
  const stores = {}; existing.forEach(n => { stores[n] = new Map(); });
  const handlers = {}; let netCalls = [];
  const mkRes = (body, o = {}) => ({ ok: o.ok !== false, type: o.type || "basic", body, clone() { return this; } });
  const caches = {
    keys: async () => Object.keys(stores),
    delete: async (k) => { delete stores[k]; return true; },
    open: async (n) => { stores[n] = stores[n] || new Map(); const m = stores[n]; return { put: async (r, res) => { m.set(r.url, res); }, match: async (r) => m.get(r.url), addAll: async (urls) => urls.forEach(u => m.set("https://app.test" + u, mkRes("pre:" + u))) }; },
    match: async (r) => { const url = typeof r === "string" ? "https://app.test" + r : r.url; for (const m of Object.values(stores)) if (m.has(url)) return m.get(url); },
  };
  const ctx = { self: { addEventListener: (t, f) => { handlers[t] = f; }, location: { origin: "https://app.test" }, skipWaiting() {}, clients: { claim() {} } }, caches, URL, Response: { error: () => mkRes("ERR", { ok: false, type: "error" }) },
    fetch: async (r) => { netCalls.push(r.url); if (!online) throw new Error("offline"); return mkRes("net:" + r.url); } };
  vm.createContext(ctx); vm.runInContext(src, ctx);
  const fire = async (url, extra = {}) => { let p; const e = { request: { url, method: "GET", mode: "cors", ...extra }, respondWith: (x) => { p = x; }, waitUntil: (x) => { p = x; } }; handlers.fetch(e); return p ? await p : undefined; };
  return { stores, handlers, fire, netCalls: () => netCalls, setOnline: (v) => { online = v; } };
}
(async () => {
  let t = makeEnv();
  chk(!(await t.fire("https://firestore.googleapis.com/v1/x")) && !(await t.fire("https://www.youtube.com/embed/x")) && !(await t.fire("https://www.gstatic.com/other/x.js")), "hote non liste intercepte");
  chk(await t.fire("https://app.test/x", { method: "POST" }) === undefined, "POST intercepte");
  // module Firebase : reseau puis cache, puis servi hors ligne
  const FB = "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
  const r1 = await t.fire(FB); chk(r1 && r1.body === "net:" + FB, "module firebase non servi par le reseau au 1er appel");
  await new Promise(r => setTimeout(r, 20)); chk(t.stores["carthago-ext"].has(FB), "module firebase non mis en cache");
  t.setOnline(false); const r2 = await t.fire(FB); chk(r2 && r2.body === "net:" + FB, "module firebase non servi hors ligne");
  // polices (opaque accepte)
  t = makeEnv(); const F = "https://fonts.googleapis.com/css2?family=Sora"; t.setOnline(true);
  await t.fire(F); await new Promise(r => setTimeout(r, 20)); chk(t.stores["carthago-ext"].has(F), "css polices non cache");
  // app : reseau d'abord, repli cache, navigation vers '/'
  t = makeEnv(); const I = "https://app.test/index.html";
  await t.handlers.install({ waitUntil: (p) => p }); await new Promise(r => setTimeout(r, 20));
  await t.fire(I); await new Promise(r => setTimeout(r, 20));
  t.setOnline(false); const off = await t.fire(I); chk(off && off.body === "net:" + I, "page non servie hors ligne");
  const nav = await t.fire("https://app.test/unknown", { mode: "navigate" }); chk(nav && nav.body === "pre:/", "navigation hors ligne : doit servir la page precachee");
  const img = await t.fire("https://app.test/missing.png"); chk(img && img.type === "error", "ressource manquante : doit echouer, pas servir la page d'accueil");
  // activate : garde CACHE et carthago-ext, supprime le reste
  t = makeEnv({ existing: ["carthago-v8", "bts-v9", "carthago-ext", "carthago-v9.0-aaaaaaa"] });
  await t.handlers.activate({ waitUntil: (p) => p }); await new Promise(r => setTimeout(r, 20));
  const left = Object.keys(t.stores);
  chk(left.includes("carthago-ext") && !left.includes("bts-v9") && !left.includes("carthago-v8"), "activate: purge incorrecte " + left.join(","));
  console.log(fails.length ? "FAIL swtest:\n  " + fails.join("\n  ") : "OK swtest : reseau d'abord, modules Firebase et polices hors ligne, purge des anciens caches");
  process.exit(fails.length ? 1 : 0);
})();
