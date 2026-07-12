const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

// Find the main app component Wg (or whatever it's called)
// Usually it returns a flex div with a sidebar and a main content area.
const mainAppMatch = c.match(/function ([A-Za-z0-9_]+)\([^)]*\){[^}]*const \[[a-zA-Z0-9_]+,[a-zA-Z0-9_]+\]=V\("presupuestos"\)/);
if (mainAppMatch) {
    console.log("Main app function name:", mainAppMatch[1]);
} else {
    // just find where currentTab is set to "presupuestos" initially
    const tabMatch = c.match(/V\("presupuestos"\)/);
    if (tabMatch) {
        console.log("Found V('presupuestos') at index", tabMatch.index);
        console.log(c.substring(tabMatch.index - 50, tabMatch.index + 200));
    }
}
