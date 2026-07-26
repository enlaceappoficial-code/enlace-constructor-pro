"use strict";

let chromium;
try {
  ({ chromium } = require("playwright-core"));
} catch {
  ({ chromium } = require("playwright"));
}
const { spawn } = require("child_process");
const path = require("path");

(async () => {
  const result = { checks: {}, errors: [] };
  const root = path.join(__dirname, "..");
  const server = spawn(process.execPath, ["scripts/serve_src_static.js"], {
    cwd: root,
    env: { ...process.env, PORT: "8765" },
    windowsHide: true,
    stdio: "ignore",
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  const failedResources = [];
  page.on("response", (response) => {
    if (response.status() >= 400) failedResources.push(`${response.status()} ${response.url()}`);
  });
  page.on("console", (message) => {
    if (
      message.type() === "error"
      && !message.text().includes("favicon.ico")
      && !message.text().includes("Failed to load resource")
    ) {
      result.errors.push(`console: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => result.errors.push(`pageerror: ${error.message}`));

  try {
    const response = await page.goto("http://127.0.0.1:8765/", {
      waitUntil: "networkidle",
      timeout: 30000,
    });
    await page.waitForTimeout(2500);
    result.checks.http200 = response && response.status() === 200;
    result.checks.rootRendered = (await page.locator("#root").count()) === 1
      && (await page.locator("#root").innerText()).trim().length > 100;
    const storedCounts = await page.evaluate(() => ({
      apus: JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_apus") || "[]").length,
      catalog: JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_catalog") || "[]").length,
      materials: JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_materiales") || "[]").length,
    }));
    result.storedCounts = storedCounts;
    result.checks.fullLibraryLoaded = storedCounts.apus >= 235
      && storedCounts.catalog >= 235
      && storedCounts.materials >= 321;

    const startButton = page.getByText("🚀 Comenzar ahora", { exact: true });
    if (await startButton.count()) {
      await startButton.click();
      await page.waitForTimeout(300);
    }
    const skipTour = page.getByText("Saltar y configurar después", { exact: true });
    if (await skipTour.count()) {
      await skipTour.click();
      await page.waitForTimeout(300);
    }
    const apuNav = page.getByText("APU", { exact: true }).first();
    if (await apuNav.count() === 0) {
      result.bodyPreview = (await page.locator("body").innerText()).slice(0, 1000);
      result.failedResources = failedResources;
      throw new Error(`APU no renderizado: ${JSON.stringify(result)}`);
    }
    await apuNav.click({ force: true });
    await page.waitForTimeout(500);
    const apuBody = await page.locator("body").innerText();
    result.checks.apuModuleNavigates = /Análisis de Precios Unitarios|Biblioteca APU|APU/.test(apuBody)
      && apuBody.includes(String(storedCounts.apus));

    const persistenceBefore = await page.evaluate(() => {
      const cfgKey = "enlace_constructor_pro_v1_cfg";
      const budgetKey = "enlace_constructor_pro_v1_budgets";
      const cfg = JSON.parse(localStorage.getItem(cfgKey) || "{}");
      const budgets = JSON.parse(localStorage.getItem(budgetKey) || "[]");
      cfg.__smokeJornal = 54321;
      budgets.push({ id: 987654321, descripcion: "__SMOKE_ECP__", items: [] });
      localStorage.setItem(cfgKey, JSON.stringify(cfg));
      localStorage.setItem(budgetKey, JSON.stringify(budgets));
      return budgets.length;
    });
    await page.reload({ waitUntil: "networkidle" });
    const persistenceAfter = await page.evaluate(() => {
      const cfg = JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_cfg") || "{}");
      const budgets = JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_budgets") || "[]");
      return {
        jornal: cfg.__smokeJornal,
        budget: budgets.some((item) => item.id === 987654321 && item.descripcion === "__SMOKE_ECP__"),
        count: budgets.length,
      };
    });
    result.checks.localPersistence = persistenceAfter.jornal === 54321
      && persistenceAfter.budget
      && persistenceAfter.count === persistenceBefore;
    result.persistence = persistenceAfter;
    result.title = await page.title();
    result.bodyPreview = (await page.locator("body").innerText()).slice(0, 1500);
    result.localStorageKeys = await page.evaluate(() => Object.keys(localStorage).sort());
    result.failedResources = failedResources;
    result.checks.noRuntimeErrors = result.errors.length === 0;
  } finally {
    await browser.close();
    server.kill();
  }

  console.log(JSON.stringify(result, null, 2));
  if (!Object.values(result.checks).every(Boolean)) process.exitCode = 1;
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
