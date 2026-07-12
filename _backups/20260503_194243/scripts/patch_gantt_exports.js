const fs = require("fs");

const filePath = process.argv[2];
if (!filePath) process.exit(1);

let s = fs.readFileSync(filePath, "utf8");
let changed = 0;

function replaceAllExact(from, to) {
  const before = s;
  s = s.split(from).join(to);
  if (s !== before) changed++;
}

replaceAllExact('he.push(ui?"":"")', 'he.push(ui?"■":"")');
replaceAllExact('Mi&&(li.v=" ",li.s=', 'Mi&&(li.v="■",li.s=');
replaceAllExact(
  'ce.href=oe,ce.download=(M||"Carta_Gantt").replace(/[\\\\/:*?\\"<>|]/g,"-").slice(0,80)+".xml",ce.click(),',
  'ce.href=oe,ce.download=(M||"Carta_Gantt").replace(/[\\\\/:*?\\"<>|]/g,"-").slice(0,80)+".xml",ce.style.display="none",document.body.appendChild(ce),ce.click(),ce.remove(),'
);

if (changed === 0) process.exit(2);

fs.writeFileSync(filePath, s, "utf8");
