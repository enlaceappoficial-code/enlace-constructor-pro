const fs = require('fs');
const c = fs.readFileSync('src/assets/index.js', 'utf8');
const match = c.match(/var \w+=\[\{id:"MAT-[^]+?\];/);
if (match) {
    console.log(match[0].substring(0, 1500));
} else {
    console.log("No materials array found.");
}
