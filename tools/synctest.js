// CARTHAGO : verifie que les cles attendues sont dans le payload Firestore ET relues au chargement.
const fs = require("fs");
const { APP } = require("./_harness");
const src = fs.readFileSync(APP, "utf8");
const save = (src.match(/carthagoFirebase\.save\(\{([^}]*)\}\)/) || [])[1] || "";
const KEYS = ["week","completedEx","logData","condition","cycleWeek","injuries","customParts","workoutHistory","sessionTimer","autoMode","tier","testDraft","testHistory","queueMode","cyclePos","qAnchorDate","qAnchorPos","cpMode","xSets","skipDays","swapMap"];
// customParts: sauvegarde mais jamais relu en v9.0 (etat de session, comportement historique, a trancher par Bayram)
const LOAD_EXEMPT = ["customParts"];
const fails = [];
for (const k of KEYS) {
  const w = "(^|[^A-Za-z0-9_])" + k + "($|[^A-Za-z0-9_])";
  if (!new RegExp(w).test(save)) fails.push("absent du save: " + k);
  if (!LOAD_EXEMPT.includes(k) && !new RegExp("data[.]" + k + "($|[^A-Za-z0-9_])").test(src)) fails.push("non relu au load: " + k);
}
console.log(fails.length ? "FAIL synctest:\n  " + fails.join("\n  ") : "OK synctest : " + KEYS.length + " cles sync (save + load)");
process.exit(fails.length ? 1 : 0);
