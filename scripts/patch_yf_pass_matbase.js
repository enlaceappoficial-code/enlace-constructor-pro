const fs = require("fs");

const filePath = process.argv[2];
if (!filePath) process.exit(1);

let s = fs.readFileSync(filePath, "utf8");
const before = s;

const changes = [
  {
    from: 'onClick:()=>l(k,g,B),children:["Ô£ô Usar este precio (",ne(k),"/",i.unidad,")"]',
    to: 'onClick:()=>l(k,g,B,v),children:["Ô£ô Usar este precio (",ne(k),"/",i.unidad,")"]',
  },
  {
    from: 'onClick:()=>l(t.precio||k,g,B),children:["Precio est├índar (",ne(t.precio||k),")"]',
    to: 'onClick:()=>l(t.precio||k,g,B,v),children:["Precio est├índar (",ne(t.precio||k),")"]',
  },
];

let ok = false;
for (const c of changes) {
  if (s.includes(c.from)) {
    s = s.split(c.from).join(c.to);
    ok = true;
  }
}

if (!ok) process.exit(2);
if (s === before) process.exit(3);

fs.writeFileSync(filePath, s, "utf8");

