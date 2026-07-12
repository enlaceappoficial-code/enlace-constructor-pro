const fs = require("fs");
const path = require("path");

const inPath = process.argv[2] ? path.resolve(process.argv[2]) : null;
const outPath = process.argv[3] ? path.resolve(process.argv[3]) : null;
if (!inPath || !outPath) process.exit(1);

const json = fs.readFileSync(inPath, "utf8").trim();
if (!json.startsWith("{") || !json.endsWith("}")) process.exit(2);

const js = `window.__ECP_CLAUDE_PACK=${json};`;
fs.writeFileSync(outPath, js, "utf8");
console.log(`OK: ${outPath}`);

