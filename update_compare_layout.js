const fs = require('fs');
let c = fs.readFileSync('src/assets/modulo_proveedores.js', 'utf8');

const target1 = `            // VIEW: COMPARE
            view === "compare" && e.jsxs("div", {
                style: { flex: 1, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, display: "flex", flexDirection: "column", overflow: "hidden" },
                children: [`;

const replace1 = `            // VIEW: COMPARE
            view === "compare" && e.jsxs("div", {
                style: { display: "flex", flex: 1, gap: 20, minHeight: 0 },
                children: [
                    e.jsxs("div", {
                        style: { flex: attachmentUrl ? 1 : 2, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, display: "flex", flexDirection: "column", overflow: "hidden", transition: "all 0.3s ease" },
                        children: [`;

c = c.replace(target1, replace1);

const target2 = `                            e.jsx("button", {
                                style: { padding: "6px 12px", background: "transparent", border: "1px solid var(--border)", color: "var(--text)", borderRadius: 6, cursor: "pointer", fontSize: 13 },
                                onClick: () => { setSelectedRequest(null); setView("history"); },
                                children: "Volver al Historial"
                            })`;

const replace2 = `                            e.jsxs("div", {
                                style: { display: "flex", gap: 12, alignItems: "center" },
                                children: [
                                    e.jsxs("label", {
                                        style: { padding: "6px 12px", background: "var(--accent)", color: "white", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 },
                                        children: [
                                            "📎 Adjuntar Documento",
                                            e.jsx("input", {
                                                type: "file",
                                                accept: "image/*,.pdf",
                                                style: { display: "none" },
                                                onChange: (ev) => {
                                                    if (ev.target.files && ev.target.files[0]) {
                                                        const fileUrl = URL.createObjectURL(ev.target.files[0]);
                                                        setAttachmentUrl(fileUrl);
                                                    }
                                                }
                                            })
                                        ]
                                    }),
                                    e.jsx("button", {
                                        style: { padding: "6px 12px", background: "transparent", border: "1px solid var(--border)", color: "var(--text)", borderRadius: 6, cursor: "pointer", fontSize: 13 },
                                        onClick: () => { setSelectedRequest(null); setView("history"); },
                                        children: "Volver al Historial"
                                    })
                                ]
                            })`;

c = c.replace(target2, replace2);

// Now wrap the end of the compare view
const endOfCompare = `                                    })
                                ]
                            })
                        })
                    })
                ]
            })`;

// Replace the LAST occurence of this (it's the end of the view === compare div)
const replaceEndOfCompare = `                                    })
                                ]
                            })
                        })
                    ]}),
                    attachmentUrl && e.jsxs("div", {
                        style: { flex: 1, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, display: "flex", flexDirection: "column", overflow: "hidden" },
                        children: [
                            e.jsxs("div", {
                                style: { padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(0,0,0,0.1)" },
                                children: [
                                    e.jsx("span", { style: { fontWeight: 600, color: "var(--text)", fontSize: 15 }, children: "📄 Documento Adjunto" }),
                                    e.jsx("button", { 
                                        onClick: () => setAttachmentUrl(null), 
                                        style: { background: "transparent", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 18, padding: "0 8px" }, 
                                        children: "✖" 
                                    })
                                ]
                            }),
                            e.jsx("iframe", { src: attachmentUrl, style: { flex: 1, border: "none", width: "100%", background: "#fff" } })
                        ]
                    })
                ]
            })`;

const lastIndex = c.lastIndexOf(endOfCompare);
if(lastIndex > -1) {
    c = c.substring(0, lastIndex) + replaceEndOfCompare + c.substring(lastIndex + endOfCompare.length);
}

fs.writeFileSync('src/assets/modulo_proveedores.js', c);
console.log('Modified compare view successfully!');
