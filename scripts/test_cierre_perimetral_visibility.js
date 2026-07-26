"use strict";

let chromium;
try {
  ({ chromium } = require("playwright-core"));
} catch {
  ({ chromium } = require("playwright"));
}
const { spawn } = require("child_process");
const path = require("path");

const expected = [
  "Demolición controlada cierre pandereta H=2,0 m",
  "Retiro poste hormigón prefabricado de cierre",
  "Demolición selectiva dado de fundación existente",
  "Traslado interno de escombros en pendiente hasta 25 m",
  "Retiro escombros camión tolva con carguío y botadero",
  "Reutilización dado existente con platina y anclaje químico",
  "Fundación nueva para poste metálico de cierre",
  "Poste perfil acero 40x40x4 mm fabricado e instalado",
  "Paño malla ACMA 1G 3,00x1,85 m marco ángulo 25x25x3 mm",
  "Paño corto escalonado malla ACMA 1G 1,50x1,85 m marco 3 mm",
  "Limpieza y perfilado final de franja de cierre",
];

(async () => {
  const root = path.join(__dirname, "..");
  const server = spawn(process.execPath, ["scripts/serve_src_static.js"], {
    cwd: root,
    env: { ...process.env, PORT: "8767" },
    windowsHide: true,
    stdio: "ignore",
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));

  try {
    await page.goto("http://127.0.0.1:8767/?cierre-acma=1", { waitUntil: "networkidle" });
    const start = page.getByText("🚀 Comenzar ahora", { exact: true });
    if (await start.count()) {
      await start.click();
      await page.waitForTimeout(200);
    }
    const skip = page.getByText("Saltar y configurar después", { exact: true });
    if (await skip.count()) {
      await skip.click();
      await page.waitForTimeout(200);
    }
    await page.getByText("Partidas de Obra", { exact: true }).first().click({ force: true });
    await page.waitForTimeout(500);

    const search = page.locator('input[placeholder*="Buscar"]').filter({
      hasNot: page.locator('[placeholder*="presupuesto"]'),
    }).last();
    if (await search.count() === 0) throw new Error("No se encontró el buscador de partidas");

    const visible = {};
    for (const name of expected) {
      await search.fill(name);
      await page.waitForTimeout(100);
      visible[name] = (await page.locator("body").innerText()).includes(name);
    }

    const counts = await page.evaluate(() => ({
      catalog: JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_catalog") || "[]").length,
      materials: JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_materiales") || "[]").length,
      apus: JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_apus") || "[]").length,
    }));
    const result = {
      counts,
      visible,
      allVisible: Object.values(visible).every(Boolean),
      countsOk: counts.catalog >= 235 && counts.materials >= 321 && counts.apus >= 235,
      errors,
    };
    console.log(JSON.stringify(result, null, 2));
    if (!result.allVisible || !result.countsOk || errors.length) process.exitCode = 1;
  } finally {
    await browser.close();
    server.kill();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
