const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/assets/index.js');
let code = fs.readFileSync(targetPath, 'utf8');

// We need to fix the require('react') inside window.renderHitosSidebar and window.HitosEditor
code = code.replace(/const React = window\.React \|\| require\('react'\);/g, 'const React = window.React || (typeof Re !== "undefined" ? Re : { useState: function(init) { let val = init; return [val, function(newVal) { val = newVal; }]; }});');
code = code.replace(/const React = require\('react'\);/g, 'const React = window.React || (typeof Re !== "undefined" ? Re : { useState: function(init) { let val = init; return [val, function(newVal) { val = newVal; }]; }});');

// Wait! If Re is NOT defined globally, inside window.renderHitosSidebar it will be undefined because window.renderHitosSidebar is a global function!
// A global function does NOT have access to 'Re' from the IIFE scope!
// So typeof Re will be 'undefined' in the global scope!
// We MUST pass Re from inside the IIFE!
// Let's modify the call to window.renderHitosSidebar:
code = code.replace(/window\.renderHitosSidebar\(e, I, D, r, ne, J, a, c, ze, Pe, u, d\)/g, 'window.renderHitosSidebar(e, I, D, r, ne, J, a, c, ze, Pe, u, d, typeof Re !== "undefined" ? Re : null)');

// And update the function signature:
code = code.replace(/window\.renderHitosSidebar = function\(e, I, D, r, ne, J, a, c, ze, Pe, u, d\) {/, 'window.renderHitosSidebar = function(e, I, D, r, ne, J, a, c, ze, Pe, u, d, Re) {');

// And pass Re to HitosEditor:
code = code.replace(/e\.jsx\(window\.HitosEditor, \{ e, I, D, r, ne, J, a, c, ze, Pe, u, d, hitos, total \}\);/, 'e.jsx(window.HitosEditor, { e, I, D, r, ne, J, a, c, ze, Pe, u, d, hitos, total, Re });');

// And update HitosEditor to use props.Re:
code = code.replace(/window\.HitosEditor = function\(props\) \{[\s\S]*?const \[isEditing, setIsEditing\] = React\.useState\(false\);/, `window.HitosEditor = function(props) {
    const { e, I, D, r, ne, a, u, d, Re } = props;
    const React = window.React || Re || { useState: function(val) { return [val, () => {}]; } };
    const [isEditing, setIsEditing] = React.useState(false);`);

fs.writeFileSync(targetPath, code);
console.log("Fixed require('react') issue!");
