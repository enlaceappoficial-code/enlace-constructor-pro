const fs = require('fs');
const code = fs.readFileSync('src/assets/index.js', 'utf8');

// find how budgets are saved
const saveMatches = code.match(/localStorage\.setItem\([^,]+,\s*[^\)]+\)/g);
if (saveMatches) {
    const budgetSaves = saveMatches.filter(m => m.includes('presupuestos'));
    console.log("Budget saves in localStorage:", budgetSaves);
} else {
    console.log("No localStorage.setItem found");
}

// find where presupuestosLocal is updated
const setPresupuestosMatch = code.match(/setPresupuestos\([^\)]+\)/g);
console.log("setPresupuestos calls:", setPresupuestosMatch);

// What if the parent component sets it?
// Search for string 'enlace_constructor_pro_v1_presupuestos'
const idx = code.indexOf('enlace_constructor_pro_v1_presupuestos');
console.log("Found key at index:", idx);
console.log(code.substring(idx - 100, idx + 100));

// Let's search for JSON.stringify to see what gets stringified
const stringifies = code.match(/JSON\.stringify\([^\)]+\)/g);
if (stringifies) {
    console.log("Stringifies that might relate to budgets:", stringifies.filter(s => s.includes('presupuestos') || s.includes('budget')));
}
