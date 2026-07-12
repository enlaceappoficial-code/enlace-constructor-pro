const fs = require("fs");

const backupPath = process.argv[2];
const targetPath = process.argv[3] || "src/assets/index.js";

if (!backupPath) {
  throw new Error("Uso: node scripts/restore_index_from_backup.js <backupPath> [targetPath]");
}

const s = fs.readFileSync(backupPath, "utf8");
fs.writeFileSync(targetPath, s, "utf8");
console.log(`OK restored ${targetPath} from ${backupPath}`);

