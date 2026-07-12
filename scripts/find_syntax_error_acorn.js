const fs = require("fs");
const acorn = require("acorn");

const filePath = process.argv[2];
if (!filePath) process.exit(1);

const code = fs.readFileSync(filePath, "utf8");
try {
  acorn.parse(code, { ecmaVersion: "latest", sourceType: "script" });
  console.log("OK");
} catch (e) {
  const out = {
    message: e && e.message,
    pos: e && e.pos,
    loc: e && e.loc,
    raisedAt: e && e.raisedAt,
  };
  console.log(JSON.stringify(out, null, 2));
  process.exit(2);
}

