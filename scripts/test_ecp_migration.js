"use strict";

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
let chromium;
try {
  ({ chromium } = require("playwright-core"));
} catch {
  ({ chromium } = require("playwright"));
}

(async () => {
  const root = path.join(__dirname, "..");
  const backup = JSON.parse(fs.readFileSync(
    path.join(root, "backup_localstorage", "ECP_Backup_2026-05-04_Manual (1).json"),
    "utf8",
  ));
  const server = spawn(process.execPath, ["scripts/serve_src_static.js"], {
    cwd: root,
    env: { ...process.env, PORT: "8766" },
    windowsHide: true,
    stdio: "ignore",
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  });
  const context = await browser.newContext();
  await context.addInitScript((data) => {
    const prefix = "enlace_constructor_pro_v1_";
    for (const key of ["cfg", "budgets", "clients", "catalog", "materiales", "apus", "licitaciones"]) {
      localStorage.setItem(prefix + key, JSON.stringify(data[key]));
    }
    localStorage.setItem(prefix + "welcomeSeen", "1");
  }, backup);
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  try {
    await page.goto("http://127.0.0.1:8766/", { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(1500);
    const skipTour = page.getByText("Saltar y configurar después", { exact: true });
    if (await skipTour.count()) await skipTour.click();
    await page.getByText("APU", { exact: true }).first().click({ force: true });
    await page.waitForTimeout(500);
    const apuText = await page.locator("body").innerText();
    const after = await page.evaluate(() => ({
      budgets: JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_budgets") || "[]").length,
      clients: JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_clients") || "[]").length,
      catalog: JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_catalog") || "[]").length,
      materials: JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_materiales") || "[]").length,
      apus: JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_apus") || "[]").length,
    }));
    const result = {
      before: {
        budgets: backup.budgets.length,
        clients: backup.clients.length,
        catalog: backup.catalog.length,
        materials: backup.materiales.length,
        apus: backup.apus.length,
      },
      after,
      checks: {
        budgetsPreserved: after.budgets === backup.budgets.length,
        clientsPreserved: after.clients === backup.clients.length,
        fullLibraryAvailable: after.apus >= 235
          && apuText.includes("Demolición controlada cierre pandereta H=2,0 m"),
        noRuntimeErrors: errors.length === 0,
      },
      errors,
    };
    console.log(JSON.stringify(result, null, 2));
    if (!Object.values(result.checks).every(Boolean)) process.exitCode = 1;
  } finally {
    await browser.close();
    server.kill();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
