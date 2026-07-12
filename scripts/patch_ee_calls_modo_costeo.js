const fs = require("fs");

const filePath = process.argv[2];
if (!filePath) process.exit(1);

let s = fs.readFileSync(filePath, "utf8");
const before = s;

const changes = [
  {
    from: "Ee(t.items,r,t.descuento)",
    to: "Ee(t.items,r,t.descuento,t.modoCosteo)",
  },
  {
    from: "Ee(t.items,r||{},t.descuento)",
    to: "Ee(t.items,r||{},t.descuento,t.modoCosteo)",
  },
  {
    from: "Ee(t.items,i||{},t.descuento)",
    to: "Ee(t.items,i||{},t.descuento,t.modoCosteo)",
  },
];

let did = false;
for (const c of changes) {
  if (s.includes(c.from)) {
    s = s.split(c.from).join(c.to);
    did = true;
  }
}

if (!did) process.exit(2);
if (s === before) process.exit(3);

fs.writeFileSync(filePath, s, "utf8");

