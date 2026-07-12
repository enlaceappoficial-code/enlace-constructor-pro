const fs = require("fs");

const filePath = process.argv[2];
if (!filePath) process.exit(1);

let s = fs.readFileSync(filePath, "utf8");
const before = s;

const from =
  '[[\"Subtotal\",ne(W)],[\"IVA (\"+Math.round(r.iva*100)+\"%)\",ne(L)]].map';

const to =
  '((I.modoCosteo||\"completo\")===\"separado\"?[[\"Materiales\",ne(Math.round(te))],[\"No Materiales\",ne(Math.round(fe))],[\"Subtotal\",ne(W)],[\"IVA (\"+Math.round(r.iva*100)+\"%)\",ne(L)]]:[[\"Subtotal\",ne(W)],[\"IVA (\"+Math.round(r.iva*100)+\"%)\",ne(L)]]).map';

if (!s.includes(from)) process.exit(2);
s = s.split(from).join(to);

if (s === before) process.exit(3);
fs.writeFileSync(filePath, s, "utf8");
