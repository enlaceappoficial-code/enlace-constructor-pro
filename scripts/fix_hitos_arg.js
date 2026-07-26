const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/assets/index.js');
let code = fs.readFileSync(targetPath, 'utf8');

let search = `(typeof window.renderHitosModal === 'function' ? window.renderHitosModal(e, s, n, ne, h) : e.jsxs("div", {`;
let replace = `(typeof window.renderHitosModal === 'function' ? window.renderHitosModal(e, s, n, ne, j) : e.jsxs("div", {`;

if (code.includes(search)) {
    code = code.replace(search, replace);
    console.log("Successfully fixed renderHitosModal arg in preview.");
} else {
    console.log("Failed to find renderHitosModal call in preview.");
}

fs.writeFileSync(targetPath, code);
