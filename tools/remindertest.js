// CARTHAGO : rappel d'entrainement (notification locale) : une fois par jour, jours de seance/combat non termines.
const { JSDOM, VirtualConsole } = require("jsdom");
const { APP, wait, readApp } = require("./_harness");
async function run({ date, cfg, permission = "granted", history, unsupported }) {
  const shown = [];
  const dom = new JSDOM(readApp(APP), { url: "http://localhost/", runScripts: "dangerously", pretendToBeVisual: true, virtualConsole: new VirtualConsole(),
    beforeParse(w) {
      const R = w.Date, off = date.getTime() - R.now();
      class M extends R { constructor(...a) { if (a.length === 0) super(R.now() + off); else super(...a); } static now() { return R.now() + off; } }
      w.Date = M;
      if (!unsupported) w.Notification = class { static get permission() { return permission; } static requestPermission() { return Promise.resolve(permission); } };
      Object.defineProperty(w.navigator, "serviceWorker", { value: { ready: Promise.resolve({ showNotification: (t, o) => { shown.push({ t, o }); return Promise.resolve(); } }) } });
      w.localStorage.setItem("carthago_tier", "6");
      if (cfg) w.localStorage.setItem("carthago_reminder", JSON.stringify(cfg));
      if (history) w.localStorage.setItem("carthago_workoutHistory", JSON.stringify(history));
      w.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
    } });
  await wait(1500);
  const saved = JSON.parse(dom.window.localStorage.getItem("carthago_reminder") || "null");
  dom.window.close();
  return { shown, saved };
}
(async () => {
  const fails = []; const chk = (c, m) => { if (!c) fails.push(m); };
  const ON = { on: true, time: "18:00", fired: "" };
  const days = []; let firstHit = null;
  for (let i = 0; i < 7; i++) { const d = new Date(2026, 9, 5 + i, 19, 0); const r = await run({ date: d, cfg: ON }); days.push(r.shown.length); if (r.shown.length && !firstHit) firstHit = { d, r }; }
  chk(days.every(n => n <= 1), "plus d'une notification un meme jour : " + days.join(","));
  chk(days[5] === 0 && days[6] === 0, "notification un jour de repos (sam/dim) : " + days.join(","));
  chk(days.filter(n => n === 1).length >= 3, "trop peu de jours avec rappel : " + days.join(","));
  chk(firstHit && /^(Today: |Fight night: )/.test(firstHit.r.shown[0].o.body), "corps de notification inattendu");
  chk(firstHit && firstHit.r.saved && firstHit.r.saved.fired === "2026-10-0" + (firstHit.d.getDate()).toString().slice(-1), "fired non memorise : " + JSON.stringify(firstHit && firstHit.r.saved));
  if (firstHit) {
    const d = firstHit.d, k = "2026-10-0" + d.getDate();
    chk((await run({ date: d, cfg: { ...ON, fired: k } })).shown.length === 0, "rappel repete le meme jour");
    chk((await run({ date: d, cfg: { ...ON, time: "23:00" } })).shown.length === 0, "rappel avant l'heure");
    chk((await run({ date: d, cfg: { ...ON, on: false } })).shown.length === 0, "rappel alors que desactive");
    chk((await run({ date: d, cfg: ON, permission: "denied" })).shown.length === 0, "rappel sans permission");
    chk((await run({ date: d, cfg: ON, history: { [k]: { completed: true, week: "A", day: "MONDAY" } } })).shown.length === 0, "rappel alors que la seance du jour est terminee");
    chk((await run({ date: d, cfg: ON, unsupported: true })).shown.length === 0, "rappel sans API Notification");
  }
  console.log(fails.length ? "FAIL remindertest:\n  " + fails.join("\n  ") : "OK remindertest : 1 rappel max/jour, jours de seance seulement, permission/heure/etat respectes (" + days.join(",") + ")");
  process.exit(fails.length ? 1 : 0);
})();
