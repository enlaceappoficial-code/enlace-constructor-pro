const fs = require('fs');
const path = 'src/assets/index.js';
let content = fs.readFileSync(path, 'utf8');

const target = `                                               return (
                                                 "MAT " +
                                                 ne(mt) +
                                                 " + MO " +
                                                 ne(nm) +
                                                 " = " +
                                                 ne(tt)
                                               );`;

const replacement = `                                               return e.jsxs("div", {
                                                 style: { display: "flex", flexDirection: "column", alignItems: "flex-end", fontSize: 10, lineHeight: 1.2 },
                                                  children: [
                                                    e.jsxs("span", { style: { color: "#f5a020" }, children: ["MAT ", ne(mt)] }),
                                                    e.jsxs("span", { style: { color: "#34d399" }, children: ["+ MO ", ne(nm)] }),
                                                    e.jsxs("span", { style: { color: a.accent, fontSize: 12, borderTop: "1px solid " + a.border, paddingTop: 2, marginTop: 1 }, children: ["= ", ne(tt)] })
                                                  ]
                                               });`;

const targetNormalized = target.replace(/\r\n/g, '\n');
const contentNormalized = content.replace(/\r\n/g, '\n');

if (contentNormalized.includes(targetNormalized)) {
    const newContentNormalized = contentNormalized.replace(targetNormalized, replacement);
    const newContent = content.includes('\r\n') ? newContentNormalized.replace(/\n/g, '\r\n') : newContentNormalized;
    fs.writeFileSync(path, newContent, 'utf8');
    console.log('Replaced successfully');
} else {
    console.log('Target not found');
}
