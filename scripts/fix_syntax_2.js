const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/assets/index.js');
let code = fs.readFileSync(targetPath, 'utf8');

const search = `                          e.jsx("span", {
                            style: {
                              fontSize: 14,
                              fontWeight: 600,
                              color: "#86efac",
                            },
                            children: ne(J),
                          }),
                        ],
                      }),`;

const repl = `                          e.jsx("span", {
                            style: {
                              fontSize: 14,
                              fontWeight: 600,
                              color: "#86efac",
                            },
                            children: ne(J),
                          }),
                        ],
                      })),`;

if (code.includes(search)) {
    code = code.replace(search, repl);
    console.log("Fixed missing parenthesis!");
} else {
    console.log("Could not find search string");
}

fs.writeFileSync(targetPath, code);
