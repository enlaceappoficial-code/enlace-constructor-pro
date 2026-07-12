const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

if (c.includes('e.jsx(Yg,{cfg:l,setCfg:o,C:a,S:c})')) {
    c = c.replace(',e.jsx(Yg,{cfg:l,setCfg:o,C:a,S:c})', '');
    fs.writeFileSync('src/assets/index.js', c);
    console.log("Removed Yg component call.");
} else {
    console.log("Could not find Yg component call.");
}
