const fs = require("fs");

const inPath = process.argv[2];
const outPath = process.argv[3];
if (!inPath || !outPath) {
  console.error("Uso: node scripts/migrate_legacy_budgets.js <input.json> <output.json>");
  process.exit(1);
}

function normalizeItem(it) {
  if (!it || typeof it !== "object") return { desc: "", cant: 1, unidad: "unidad", precio: 0, _cid: "" };
  const desc = it.desc ?? it.descripcion ?? it.detalle ?? "";
  const cant = it.cant ?? it.cantidad ?? 1;
  const unidad = it.unidad ?? it.um ?? "unidad";
  const precio = it.precio ?? it.pu ?? it.valor ?? 0;
  const _cid = it._cid ?? it.cid ?? "";
  return { ...it, desc, cant, unidad, precio, _cid };
}

function normalizeBudget(b) {
  if (!b || typeof b !== "object") return b;
  const itemsSrc =
    Array.isArray(b.items) ? b.items :
    Array.isArray(b.detalle) ? b.detalle :
    Array.isArray(b.partidas) ? b.partidas :
    [];
  const items = itemsSrc.map(normalizeItem);
  return { ...b, items };
}

function normalizeBudgetsContainer(data) {
  if (Array.isArray(data)) return data.map(normalizeBudget);
  if (!data || typeof data !== "object") return data;

  const out = { ...data };
  if (Array.isArray(out.budgets)) out.budgets = out.budgets.map(normalizeBudget);
  if (Array.isArray(out.presupuestos)) out.presupuestos = out.presupuestos.map(normalizeBudget);
  return out;
}

const raw = fs.readFileSync(inPath, "utf8");
const data = JSON.parse(raw);
const migrated = normalizeBudgetsContainer(data);
fs.writeFileSync(outPath, JSON.stringify(migrated, null, 2), "utf8");
