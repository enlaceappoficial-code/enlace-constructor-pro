const fs = require('fs');
const c = fs.readFileSync('src/assets/index.js', 'utf8');

// Find occurrences of components that might be the single budget view
// Such as functions receiving {budget, ...}
const matches = [...c.matchAll(/function ([a-zA-Z0-9_]+)\(\{[^}]*budget:/g)];
matches.forEach(m => {
    const fnName = m[1];
    const sIdx = m.index;
    const endIdx = sIdx + 1500; // Look at the first 1500 chars
    const body = c.substring(sIdx, endIdx);
    
    // Check if body has "Agregar Partida" or similar UI text that indicates it's the budget editor
    if (body.includes("Partida") || body.includes("Ítem") || body.includes("Totales") || body.includes("e.jsx")) {
        console.log("Found potential editor:", fnName);
        console.log(body.substring(0, 300) + "...\n");
    }
});
