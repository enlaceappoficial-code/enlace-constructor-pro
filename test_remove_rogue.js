const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

c = c.replace(`                    ),
                  }),
              ],
            })
          : e.jsxs("div", {
              style: {
                display: "flex",
                gap: 16,`, `                    ),
                  }),
          e.jsxs("div", {
              style: {
                display: "flex",
                gap: 16,`);

c = c.replace(`                    ),
                  }),
              ],
            })
          e.jsxs("div", {
              style: {
                display: "flex",
                gap: 16,`, `                    ),
                  }),
          e.jsxs("div", {
              style: {
                display: "flex",
                gap: 16,`);

fs.writeFileSync('src/assets/index.js.test4', c, 'utf8');

const acorn = require('acorn');
const jsx = require('acorn-jsx');
const Parser = acorn.Parser.extend(jsx());

try {
    Parser.parse(c, {ecmaVersion: 2020});
    console.log("SUCCESS!");
} catch (e) {
    console.log("FAILED at line " + e.loc.line + " col " + e.loc.column);
    const lines = c.split('\n');
    console.log(lines[e.loc.line - 2]);
    console.log(lines[e.loc.line - 1]);
    console.log(lines[e.loc.line]);
}
