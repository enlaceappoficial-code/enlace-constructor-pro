const fs = require('fs');
let data = fs.readFileSync('src/assets/index.js', 'utf8');

const targetStr = `              if (ie === "mo") {
                var Br = hr ? Sr / hr : 0;
                (o.text(s(Br), 170, G + 5.3, { align: "right" }),
                  o.setFont("helvetica", "bold"),
                  o.setTextColor(...F),
                  o.text(s(Sr), 194, G + 5.3, { align: "right" }));
              } else
                (ie === "separado"
                  ? (o.text(s(Sr), 160, G + 5.3, { align: "right" }),
                    o.text(s(Ar), 178, G + 5.3, { align: "right" }),
                    o.setFont("helvetica", "bold"),
                    o.setTextColor(...F),
                    o.text(s(Pr), 194, G + 5.3, { align: "right" }))
                  : (o.text(s(jr), 170, G + 5.3, { align: "right" }),
                    o.setFont("helvetica", "bold"),
                    o.setTextColor(...F),
                    o.text(s(Pr), 194, G + 5.3, { align: "right" })),
                  (G += Fr),
                  G > 262 && (o.addPage(), (G = 18)));`;

const replacement = `              if (ie === "mo") {
                var Br = hr ? Sr / hr : 0;
                (o.text(s(Br), 170, G + 5.3, { align: "right" }),
                  o.setFont("helvetica", "bold"),
                  o.setTextColor(...F),
                  o.text(s(Sr), 194, G + 5.3, { align: "right" }));
              } else {
                (ie === "separado"
                  ? (o.text(s(Sr), 160, G + 5.3, { align: "right" }),
                    o.text(s(Ar), 178, G + 5.3, { align: "right" }),
                    o.setFont("helvetica", "bold"),
                    o.setTextColor(...F),
                    o.text(s(Pr), 194, G + 5.3, { align: "right" }))
                  : (o.text(s(jr), 170, G + 5.3, { align: "right" }),
                    o.setFont("helvetica", "bold"),
                    o.setTextColor(...F),
                    o.text(s(Pr), 194, G + 5.3, { align: "right" })));
              }
              (G += Fr),
              G > 262 && (o.addPage(), (G = 18));`;

if (data.includes(targetStr)) {
  data = data.replace(targetStr, replacement);
  fs.writeFileSync('src/assets/index.js', data);
  console.log("Successfully fixed the PDF loop bug!");
} else {
  console.log("Target string not found, wait let me find the exact string using regex.");
  
  // Try regex in case there's whitespace differences
  const regex = /if\s*\(ie\s*===\s*"mo"\)\s*\{\s*var\s+Br\s*=\s*hr\s*\?\s*Sr\s*\/\s*hr\s*:\s*0;\s*\([^;]+\);\s*\}\s*else\s*\(ie\s*===\s*"separado"\s*\?\s*\([^;]+\)\s*:\s*\([^;]+\),\s*\(G\s*\+=\s*Fr\),\s*G\s*>\s*262\s*&&\s*\(o\.addPage\(\),\s*\(G\s*=\s*18\)\)\);/s;
  
  const match = regex.exec(data);
  if (match) {
    console.log("Found with regex!");
    const matchedText = match[0];
    
    // We can extract parts or just do a string replace on the last part
    const newText = matchedText.replace(
      /,\s*\(G\s*\+=\s*Fr\),\s*G\s*>\s*262\s*&&\s*\(o\.addPage\(\),\s*\(G\s*=\s*18\)\)\)/s,
      ');\n              (G += Fr),\n              G > 262 && (o.addPage(), (G = 18))'
    );
    data = data.replace(matchedText, newText);
    fs.writeFileSync('src/assets/index.js', data);
    console.log("Regex replacement successful!");
  } else {
    console.log("Not found with regex either.");
  }
}
