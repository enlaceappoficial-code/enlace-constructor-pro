const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const targetFunc = `  var openDetail = function(item) {
    setDetailView(item);
    setDetailLoading(true);`;

const replaceFunc = `  var openDetail = function(item) {
    setDetailView(item);
    setDetailLoading(true);
    setDetailTab("resumen");
    setCheckedSteps({});`;

if (c.includes(targetFunc)) {
    c = c.replace(targetFunc, replaceFunc);
    fs.writeFileSync('src/assets/index.js', c, 'utf8');
    console.log('Injected openDetail tab reset.');
}
