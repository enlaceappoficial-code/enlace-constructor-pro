const fs = require('fs');
const data = fs.readFileSync('src/assets/index.js', 'utf8');
const idx = data.indexOf('<table style="width:100%;border-collapse:collapse;font-size:11px">');
if (idx > -1) console.log(data.substring(idx - 1500, idx + 1500));
