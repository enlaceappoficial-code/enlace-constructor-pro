const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

c = c.replace(`            })
          : e.jsxs("div", {
              style: {
                display: "flex",
                gap: 16,`, `            }),
          e.jsxs("div", {
              style: {
                display: "flex",
                gap: 16,`);

fs.writeFileSync('src/assets/index.js', c, 'utf8');
console.log("Fixed ternary colon to comma.");
