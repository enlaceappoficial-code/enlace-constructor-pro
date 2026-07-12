const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

c = c.replace(`        results.length > 0 &&
                  e.jsx("div", {
                    style: {
                      display: "grid",`, `        true ?
                  e.jsx("div", {
                    style: {
                      display: "grid",`);

c = c.replace(`            }),
          e.jsxs("div", {
              style: {
                display: "flex",`, `            })
          : e.jsxs("div", {
              style: {
                display: "flex",`);

fs.writeFileSync('src/assets/index.js', c, 'utf8');

const acorn = require('acorn');
const jsx = require('acorn-jsx');
const Parser = acorn.Parser.extend(jsx());

try {
    Parser.parse(c, {ecmaVersion: 2020});
    console.log("SUCCESS!");
} catch (e) {
    console.log("FAILED at line " + e.loc.line);
}
