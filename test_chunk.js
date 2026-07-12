const fs = require('fs');
const acorn = require('acorn');
const jsx = require('acorn-jsx');
const Parser = acorn.Parser.extend(jsx());

let c = fs.readFileSync('src/assets/index.js.test3', 'utf8');

const start = c.indexOf('        results.length > 0 ?');
const end = c.indexOf('          : e.jsxs("div", {');
const chunk = c.substring(start, end);

try {
    Parser.parse(chunk, {ecmaVersion: 2020});
} catch(e) {
    console.log("Chunk error:", e.message);
}
console.log("Chunk length:", chunk.length);
fs.writeFileSync('src/assets/chunk.js', chunk, 'utf8');
