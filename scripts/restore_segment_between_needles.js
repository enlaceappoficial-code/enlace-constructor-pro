const fs = require("fs");

const srcPath = process.argv[2];
const dstPath = process.argv[3];
const startNeedle = process.argv[4];
const endNeedle = process.argv[5];

if (!srcPath || !dstPath || !startNeedle || !endNeedle) {
  throw new Error(
    "Uso: node scripts/restore_segment_between_needles.js <srcPath> <dstPath> <startNeedle> <endNeedle>"
  );
}

const src = fs.readFileSync(srcPath, "utf8");
const dst0 = fs.readFileSync(dstPath, "utf8");

const a1 = dst0.indexOf(startNeedle);
const b1 = dst0.indexOf(endNeedle, a1 + startNeedle.length);
if (a1 < 0 || b1 < 0) throw new Error("No se encontró segmento en dst.");

const a2 = src.indexOf(startNeedle);
const b2 = src.indexOf(endNeedle, a2 + startNeedle.length);
if (a2 < 0 || b2 < 0) throw new Error("No se encontró segmento en src.");

const seg = src.slice(a2, b2);
const dst = dst0.slice(0, a1) + seg + dst0.slice(b1);

fs.writeFileSync(dstPath, dst, "utf8");
console.log("OK segment restored");

