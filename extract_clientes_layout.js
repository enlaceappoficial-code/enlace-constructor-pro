const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const sIdx = c.indexOf('function hg(');
if (sIdx > -1) {
    const fnStr = c.substring(sIdx, sIdx + 15000);
    const returnIdx = fnStr.indexOf('return e.jsxs("div",{children:[e.jsxs("div",{style:{display:"grid"');
    if(returnIdx > -1) {
        console.log(fnStr.substring(returnIdx, returnIdx + 4000));
    } else {
        // Find alternative return
        const matches = fnStr.match(/return e\.jsxs\("div",\{children:\[e\.jsxs\("div",\{style:/g);
        if(matches) {
            const split = fnStr.split(matches[matches.length-1]);
            console.log(matches[matches.length-1] + split[1].substring(0, 4000));
        } else {
            console.log("Could not find the return block.");
        }
    }
}
