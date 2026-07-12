const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");
let s = s0;
let changed = 0;

function replaceOnce(find, replace) {
  const idx = s.indexOf(find);
  if (idx === -1) return false;
  s = s.slice(0, idx) + replace + s.slice(idx + find.length);
  changed++;
  return true;
}

const FIND =
  'function Gt(t,i){if(!t)return{valid:!1,expired:!0,version:"starter",dias:-1};';

const REPLACE =
  'function Gt(t,i){if(!t){try{const r="enlace_constructor_pro_v1_trial_start_v1";let f=localStorage.getItem(r);f||(f=String(Date.now()),localStorage.setItem(r,f));const n=parseInt(f,10);if(!isNaN(n)){const l=n+864e5*10,o=l-Date.now(),s=o>0,m=Math.max(0,Math.ceil(o/864e5)),p=new Date(l).toISOString().split(\"T\")[0];return{valid:!0,expired:!s,version:\"starter\",dias:m,fechaStr:p,trial:!0}}}catch(r){}return{valid:!1,expired:!0,version:\"starter\",dias:-1}};';

replaceOnce(FIND, REPLACE);

if (changed === 0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: Gt trial (${changed} cambios).`);
