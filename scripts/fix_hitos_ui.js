const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/assets/index.js');
let code = fs.readFileSync(targetPath, 'utf8');

// I will replace the HitosEditor style to fix the overflow issue.

// Find the block:
// style: { flex: 1, padding: "6px", fontSize: "12px", borderRadius: "4px", border: "1px solid " + a.border, background: a.bg, color: a.text }
const oldDescInputStyle = `style: { flex: 1, padding: "6px", fontSize: "12px", borderRadius: "4px", border: "1px solid " + a.border, background: a.bg, color: a.text }`;
const newDescInputStyle = `style: { flex: 1, minWidth: "40px", padding: "4px 6px", fontSize: "12px", borderRadius: "4px", border: "1px solid " + a.border, background: a.bg, color: a.text }`;

code = code.replace(oldDescInputStyle, newDescInputStyle);

// Find the select block:
// style: { padding: "6px", fontSize: "12px", borderRadius: "4px", border: "1px solid " + a.border, background: a.bg, color: a.text },
const oldSelectStyle = `style: { padding: "6px", fontSize: "12px", borderRadius: "4px", border: "1px solid " + a.border, background: a.bg, color: a.text },`;
const newSelectStyle = `style: { padding: "4px", fontSize: "12px", borderRadius: "4px", border: "1px solid " + a.border, background: a.bg, color: a.text },`;

code = code.replace(oldSelectStyle, newSelectStyle);

// Find the value input block:
// style: { width: "70px", padding: "6px", fontSize: "12px", borderRadius: "4px", border: "1px solid " + a.border, background: a.bg, color: a.text }
const oldValStyle = `style: { width: "70px", padding: "6px", fontSize: "12px", borderRadius: "4px", border: "1px solid " + a.border, background: a.bg, color: a.text }`;
const newValStyle = `style: { width: "50px", padding: "4px", fontSize: "12px", borderRadius: "4px", border: "1px solid " + a.border, background: a.bg, color: a.text }`;

code = code.replace(oldValStyle, newValStyle);

// Find the button block:
// style: { background: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", padding: "6px 10px", fontWeight: "bold" },
const oldBtnStyle = `style: { background: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", padding: "6px 10px", fontWeight: "bold" },`;
const newBtnStyle = `style: { background: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", padding: "4px 8px", fontWeight: "bold", flexShrink: 0 },`;

code = code.replace(oldBtnStyle, newBtnStyle);

// Let's also wrap the row style to be safe, just in case they want flex-wrap.
// style: { display: "flex", gap: "6px", marginBottom: "8px", alignItems: "center" },
const oldRowStyle = `style: { display: "flex", gap: "6px", marginBottom: "8px", alignItems: "center" },`;
const newRowStyle = `style: { display: "flex", gap: "4px", marginBottom: "8px", alignItems: "center", flexWrap: "nowrap" },`;

code = code.replace(oldRowStyle, newRowStyle);

fs.writeFileSync(targetPath, code);
console.log("Applied CSS fix for UI overflow!");
