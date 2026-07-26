const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/assets/index.js');
let code = fs.readFileSync(targetPath, 'utf8');

// 1. Fix initialization of I in TuPlan
let initSearch = `_pendingClientName: m._pendingClientName || "",
              _isTenderDraft: !!m._isTenderDraft,
              sinIva: !!m.sinIva,
            }
          : {`;

let initReplace = `_pendingClientName: m._pendingClientName || "",
              _isTenderDraft: !!m._isTenderDraft,
              sinIva: !!m.sinIva,
              hitosPago: m.hitosPago || null,
            }
          : {`;

if (code.includes(initSearch)) {
    code = code.replace(initSearch, initReplace);
    console.log("Successfully patched TuPlan init state for hitosPago (existing budget).");
} else {
    console.log("Failed to find TuPlan init state (existing budget).");
}

let initNewSearch = `_pendingClientName: "",
              _isTenderDraft: false,
              sinIva: false,
            },
      ),`;

let initNewReplace = `_pendingClientName: "",
              _isTenderDraft: false,
              sinIva: false,
              hitosPago: null,
            },
      ),`;

if (code.includes(initNewSearch)) {
    code = code.replace(initNewSearch, initNewReplace);
    console.log("Successfully patched TuPlan init state for hitosPago (new budget).");
} else {
    console.log("Failed to find TuPlan init state (new budget).");
}

// 2. Fix the Preview Modal
let previewSearch = `                        e.jsxs("div", {
                          style: {
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "8px 14px",
                            background: "#f0f7ec",
                            borderRadius: 7,
                            marginTop: 7,
                            border: "1px solid #c8e6c9",
                          },
                          children: [
                            e.jsxs("span", {
                              style: { fontSize: 14, color: "#2e7d32" },
                              children: [
                                "Anticipo (",
                                Math.round(n.anticipo * 100),
                                "%)",
                              ],
                            }),
                            e.jsx("span", {
                              style: {
                                fontSize: 14,
                                fontWeight: 700,
                                color: "#2e7d32",
                              },
                              children: ne(j),
                            }),
                          ],
                        }),`;

let previewReplace = `                        (typeof window.renderHitosModal === 'function' ? window.renderHitosModal(e, s, n, ne, h) : e.jsxs("div", {
                          style: {
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "8px 14px",
                            background: "#f0f7ec",
                            borderRadius: 7,
                            marginTop: 7,
                            border: "1px solid #c8e6c9",
                          },
                          children: [
                            e.jsxs("span", {
                              style: { fontSize: 14, color: "#2e7d32" },
                              children: [
                                "Anticipo (",
                                Math.round(n.anticipo * 100),
                                "%)",
                              ],
                            }),
                            e.jsx("span", {
                              style: {
                                fontSize: 14,
                                fontWeight: 700,
                                color: "#2e7d32",
                              },
                              children: ne(j),
                            }),
                          ],
                        })),`;

if (code.includes(previewSearch)) {
    code = code.replace(previewSearch, previewReplace);
    console.log("Successfully patched Preview Modal for hitosPago.");
} else {
    console.log("Failed to find Preview Modal block.");
}

fs.writeFileSync(targetPath, code);
