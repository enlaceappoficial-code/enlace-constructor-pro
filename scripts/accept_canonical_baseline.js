"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const baselinePath = path.join(root, "config", "canonical-baseline.json");
const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"));

const audit = spawnSync(process.execPath, [path.join(root, "scripts", "audit_apu_technical.js")], {
  cwd: root,
  encoding: "utf8",
});
if (audit.status !== 0) throw new Error(audit.stderr || audit.stdout || "Falló auditoría");
const report = JSON.parse(fs.readFileSync(path.join(root, "target", "auditoria_apu_tecnica.json"), "utf8"));
if (report.totals.issues !== 0 || report.totals.unlinkedCatalog !== 0) {
  throw new Error("No se puede aceptar una versión con observaciones técnicas");
}

function sha256(relativePath) {
  return crypto.createHash("sha256")
    .update(fs.readFileSync(path.join(root, relativePath)))
    .digest("hex")
    .toUpperCase();
}

baseline.acceptedAt = new Date().toISOString();
baseline.sha256.entrypoint = sha256(baseline.entrypoint);
baseline.sha256.bundle = sha256(baseline.bundle);
baseline.minimumCounts = {
  catalog: report.totals.catalog,
  materials: report.totals.materials,
  apus: report.totals.apus,
};
fs.writeFileSync(baselinePath, `${JSON.stringify(baseline, null, 2)}\n`, "utf8");
console.log("Nueva línea base canónica aceptada explícitamente.");
