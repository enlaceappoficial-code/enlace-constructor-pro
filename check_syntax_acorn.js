const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const acorn = require('acorn');
const jsx = require('acorn-jsx');
const Parser = acorn.Parser.extend(jsx());

try {
    Parser.parse(c, {ecmaVersion: 2020});
    console.log("No syntax errors found by acorn.");
} catch (e) {
    console.error("Syntax Error at line " + e.loc.line + " col " + e.loc.column);
    const lines = c.split('\n');
    console.log(lines[e.loc.line - 2]);
    console.log(lines[e.loc.line - 1]);
    console.log(lines[e.loc.line]);
}
