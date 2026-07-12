const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const targetStr = 'a={sb:"var(--surface)",bg:"var(--bg)",card:"var(--card)",border:"var(--border)",hover:"var(--hover)",accent:"#f5a020",blue:"#2563eb",text:"var(--text)",muted:"var(--muted)",mutedL:"var(--mutedL)"}';
const replaceStr = 'a={surface:"var(--surface)",sb:"var(--surface)",bg:"var(--bg)",card:"var(--card)",border:"var(--border)",hover:"var(--hover)",accent:"#f5a020",blue:"#2563eb",text:"var(--text)",muted:"var(--muted)",mutedL:"var(--mutedL)"}';

if (c.includes(targetStr)) {
    c = c.replace(targetStr, replaceStr);
    fs.writeFileSync('src/assets/index.js', c);
    console.log("Added surface to global theme object.");
} else {
    console.log("Could not find global theme object.");
}
