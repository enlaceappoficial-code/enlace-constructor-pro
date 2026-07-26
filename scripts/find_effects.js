const fs = require('fs');
const code = fs.readFileSync('src/assets/index.js', 'utf8');

const matches = code.match(/localStorage\.setItem\(['"]enlace_constructor_pro_v1_['"]\s*\+\s*[a-zA-Z]+/g);
console.log(matches);

// Find what listens to B
const useEffectMatches = code.match(/ct\(\(\)\s*=>\s*\{[^}]+\}\s*,\s*\[[^\]]*B[^\]]*\]\)/g);
if (useEffectMatches) console.log(useEffectMatches);
