const fs = require('fs');
let content = fs.readFileSync('src/assets/index.js', 'utf8');
const oldIeMapRegex = /ie\.map\(N=>\{var de=si\[N\.estado\].{0,1500}/s;
const match = content.match(oldIeMapRegex);
if(match) console.log(match[0]);
