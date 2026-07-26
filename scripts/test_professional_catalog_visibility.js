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
  "Cierre provisorio de obra en placa OSB",
  "Demolición tabique liviano con retiro a botadero",
  "Fundación aislada de hormigón armado",
  "Muro cortina aluminio y vidrio termopanel",
  "Pavimento podotáctil de alerta o avance",
  "Extintor PQS 6 kg instalado y señalizado",
  "Punto de red Cat 6 certificado",
  "Punto cámara CCTV IP canalizado",
  "Mueble base de cocina melamina con cubierta",
  "Sistema solar fotovoltaico on-grid 1 kWp",
  "Mantención preventiva tablero eléctrico",
];

(async () => {
  const root = path.join(__dirname, "..");
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
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));

  try {
    await page.goto("http://127.0.0.1:8766/", { waitUntil: "networkidle" });
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

    const search = page.locator('input[placeholder*="Buscar"]').filter({ hasNot: page.locator('[placeholder*="presupuesto"]') }).last();
    if (await search.count() === 0) {
      const diagnostics = await page.locator("input").evaluateAll((items) => items.map((item) => item.placeholder));
      throw new Error(`No se encontró buscador. Inputs=${JSON.stringify(diagnostics)} Body=${(await page.locator("body").innerText()).slice(0, 1200)}`);
    }
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
      errors,
    };
    console.log(JSON.stringify(result, null, 2));
    if (!result.allVisible || errors.length) process.exitCode = 1;
  } finally {
    await browser.close();
    server.kill();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
