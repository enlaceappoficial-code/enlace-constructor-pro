const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/assets/index.js');
let code = fs.readFileSync(targetPath, 'utf8');

// The issue was we had:
// (typeof window.renderHitosSidebar === 'function' ? window.renderHitosSidebar(e, I, D, r, ne, J, a, c, ze, Pe, u, d) : e.jsxs("div", { ... }),),
// which is invalid syntax because of `}),),`.
// Wait, the original code had: `e.jsxs("div", { ... }),`
// My ternary wrapped it: `(typeof ... ? ... : e.jsxs("div", { ... }),),`

// Let's fix this specific block in index.js by finding it and stripping the extra comma and parent.

code = code.replace(`(typeof window.renderHitosSidebar === 'function' ? window.renderHitosSidebar(e, I, D, r, ne, J, a, c, ze, Pe, u, d) :                       e.jsxs("div", {
                        style: {
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "8px 12px",
                          background: a.sb,
                          borderRadius: 7,
                          marginBottom: 14,
                        },
                        children: [
                          e.jsxs("span", {
                            style: { fontSize: 13, color: a.muted },
                            children: [
                              "Anticipo (",
                              Math.round(r.anticipo * 100),
                              "%)",
                            ],
                          }),
                          e.jsx("span", {
                            style: {
                              fontSize: 14,
                              fontWeight: 600,
                              color: "#86efac",
                            },
                            children: ne(J),
                          }),
                        ],
                      }),),`, `(typeof window.renderHitosSidebar === 'function' ? window.renderHitosSidebar(e, I, D, r, ne, J, a, c, ze, Pe, u, d) :                       e.jsxs("div", {
                        style: {
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "8px 12px",
                          background: a.sb,
                          borderRadius: 7,
                          marginBottom: 14,
                        },
                        children: [
                          e.jsxs("span", {
                            style: { fontSize: 13, color: a.muted },
                            children: [
                              "Anticipo (",
                              Math.round(r.anticipo * 100),
                              "%)",
                            ],
                          }),
                          e.jsx("span", {
                            style: {
                              fontSize: 14,
                              fontWeight: 600,
                              color: "#86efac",
                            },
                            children: ne(J),
                          }),
                        ],
                      })),`);

// Same for the PDF one which was:
// (typeof window.renderHitosPdf === 'function' ? window.renderHitosPdf(o, J, M, s, h, r, t, b) : (          o.setFillColor(240, 248, 241), ... M + 14))
// Wait, the PDF block didn't have a syntax error because it didn't end with a comma. It ended with `M + 14`.

fs.writeFileSync(targetPath, code);
console.log("Syntax fixed!");
