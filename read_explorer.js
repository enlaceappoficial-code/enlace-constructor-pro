const fs = require('fs');
let content = fs.readFileSync('src/assets/index.js', 'utf8');

const regex = /e\.jsx\("input",\{style:u\(d\(\{\},c\.inp\),\{margin:"0 0 12px 0",width:"100%",boxSizing:"border-box"\}\),placeholder:"Ej: pavimentación, pintura\.\.\.",value:S,onChange:N=>O\(N\.target\.value\)\}\)(.{0,2000})/s;
const match = content.match(regex);
if(match) console.log(match[0]);
