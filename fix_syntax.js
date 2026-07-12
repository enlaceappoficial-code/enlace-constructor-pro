const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

if (c.includes('ev.target.value = "";\n    }}')) {
    c = c.replace('ev.target.value = "";\n    }}', 'ev.target.value = "";\n    }');
    fs.writeFileSync('src/assets/index.js', c);
    console.log("Fixed double brace syntax error.");
} else {
    console.log("Could not find the double brace error.");
}
