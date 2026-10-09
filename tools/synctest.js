// CARTHAGO : verifie que les cles attendues sont dans le payload Firestore ET relues au chargement.
const fs = require("fs");
const { APP, readApp } = require("./_harness");
const src = readApp(APP);
const save = (src.match(/const payload = [{]([^}]*)[}]/) || [])[1] || "";
const KEYS = ["week","completedEx","logData","condition","cycleWeek","injuries","customParts","workoutHistory","sessionTimer","autoMode","tier","testDraft","testHistory","queueMode","cyclePos","qAnchorDate","qAnchorPos","cpMode","xSets","skipDays","swapMap"];
const fails = [];
for (const k of KEYS) {
  const w = "(^|[^A-Za-z0-9_])" + k + "($|[^A-Za-z0-9_])";
  if (!new RegExp(w).test(save)) fails.push("absent du save: " + k);
  if (!new RegExp("data[.]" + k + "($|[^A-Za-z0-9_])").test(src)) fails.push("non relu au load: " + k);
}
console.log(fails.length ? "FAIL synctest:\n  " + fails.join("\n  ") : "OK synctest : " + KEYS.length + " cles sync (save + load)");
process.exit(fails.length ? 1 : 0);
