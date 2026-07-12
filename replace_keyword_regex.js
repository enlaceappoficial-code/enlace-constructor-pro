const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

// Find the input element right above this placeholder
const m = c.match(/(e\\.jsx\\(\"input\",\\s*\\{[^}]*?(?:value:\\s*\\w+\\.palabras|onChange:[^}]*?palabras)[^}]*?\\}?\\),?\\s*\\{?[^}]*?)([\"']Ej: pintura.*?[\"'])/);

if (m) {
  console.log("Found match:");
  console.log(m[0]);
} else {
  // Let's just grab the whole surrounding block using indexOf
  const idx = c.indexOf("Ej: pintura");
  console.log(c.substring(idx - 400, idx + 400));
}
