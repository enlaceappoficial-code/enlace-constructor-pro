const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');
const regex = /([a-z]+)==="clients"/g;
let match;
while ((match = regex.exec(c)) !== null) {
    console.log(`Found: ${match[0]} at index ${match.index}`);
    console.log(c.substring(match.index - 50, match.index + 100));
}
