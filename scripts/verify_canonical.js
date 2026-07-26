"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const baselinePath = path.join(root, "config", "canonical-baseline.json");
const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"));
const entryPath = path.join(root, baseline.entrypoint);
const bundlePath = path.join(root, baseline.bundle);
const appPath = path.join(root, "src", "app.html");

function sha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex").toUpperCase();
}

function fail(message) {
  console.error(`CANONICAL_GUARD_ERROR: ${message}`);
  process.exitCode = 1;
}

const entry = fs.readFileSync(entryPath, "utf8");
const bundle = fs.readFileSync(bundlePath, "utf8");
const legacyRedirect = fs.readFileSync(appPath, "utf8");

try {
  new vm.Script(bundle, { filename: baseline.bundle });
} catch (error) {
  fail(`El bundle canónico tiene sintaxis inválida: ${error.message}`);
}

if (!entry.includes("./assets/index.js")) fail("index.html no carga assets/index.js");
if (!legacyRedirect.includes('window.location.replace("./index.html")')) {
  fail("app.html dejó de ser una redirección y volvió a convertirse en una segunda aplicación");
}
for (const feature of baseline.requiredFeatures) {
  if (!bundle.includes(feature)) fail(`Falta función obligatoria: ${feature}`);
}

const currentEntryHash = sha256(entryPath);
const currentBundleHash = sha256(bundlePath);
if (currentEntryHash !== baseline.sha256.entrypoint) {
  fail(`index.html cambió sin aceptar una nueva línea base (${currentEntryHash})`);
}
if (currentBundleHash !== baseline.sha256.bundle) {
  fail(`assets/index.js cambió sin aceptar una nueva línea base (${currentBundleHash})`);
}

const audit = spawnSync(process.execPath, [path.join(root, "scripts", "audit_apu_technical.js")], {
  cwd: root,
  encoding: "utf8",
});
if (audit.status !== 0) {
  fail(`La auditoría técnica falló: ${audit.stderr || audit.stdout}`);
} else {
  const report = JSON.parse(fs.readFileSync(path.join(root, "target", "auditoria_apu_tecnica.json"), "utf8"));
  for (const [key, minimum] of Object.entries(baseline.minimumCounts)) {
    if (Number(report.totals[key]) < Number(minimum)) {
      fail(`${key} retrocedió de ${minimum} a ${report.totals[key]}`);
    }
  }
  if (report.totals.issues !== 0 || report.totals.unlinkedCatalog !== 0) {
    fail(`La biblioteca presenta ${report.totals.issues} observaciones y ${report.totals.unlinkedCatalog} partidas sin APU`);
  }
}

if (!process.exitCode) {
  console.log(JSON.stringify({
    status: "CANONICAL_OK",
    entrypoint: baseline.entrypoint,
    bundle: baseline.bundle,
    sha256: { entrypoint: currentEntryHash, bundle: currentBundleHash },
    minimumCounts: baseline.minimumCounts,
  }, null, 2));
}
