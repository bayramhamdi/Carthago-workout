// CARTHAGO : gate 3. Mock de Date sur 7 jours (lundi a dimanche), verifie le label du jour dans le hero.
// Usage : node tools/weektest.js [app/index.html]
const { mount, wait, APP } = require("./_harness");
const LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const WEEK_START = [2026, 9, 5]; // lundi 5 octobre 2026 (mois 0-indexe)
(async () => {
  const file = process.argv[2] || APP;
  let fails = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(WEEK_START[0], WEEK_START[1], WEEK_START[2] + i, 10, 0, 0);
    const { dom, errors } = mount(file, d);
    await wait(1200);
    const txt = dom.window.document.getElementById("root").textContent;
    const expect = LABELS[i] + " · TODAY";
    const problems = [];
    if (!txt.includes(expect)) problems.push('label hero "' + expect + '" absent');
    if (i === 6 && !txt.includes("Rest Day")) problems.push('dimanche : "Rest Day" absent');
    if (errors.length) problems.push("erreurs: " + errors.join(" | "));
    const m = txt.match(/(MON|TUE|WED|THU|FRI|SAT|SUN) · TODAY/);
    console.log((problems.length ? "FAIL " : "OK   ") + d.toDateString() + " getDay=" + d.getDay() + " -> hero " + (m ? m[0] : "?") + (problems.length ? "  [" + problems.join("; ") + "]" : ""));
    if (problems.length) fails++;
    dom.window.close();
  }
  console.log(fails ? "weektest : " + fails + " echec(s)" : "OK weektest : 7/7 jours");
  process.exit(fails ? 1 : 0);
})();
