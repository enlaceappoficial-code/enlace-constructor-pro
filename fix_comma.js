const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const targetStr = `        ],
      }),
        results.length > 0 &&`;

const replacement = `        ],
      }),
      results.length > 0 &&`;

// Actually let's just add the comma.
if (c.indexOf(targetStr) !== -1) {
    c = c.replace(targetStr, `        ],
      }),
      results.length > 0 &&`); 
} else {
    // maybe spaces are different
}

const lines = c.split('\n');
for (let i=0; i<lines.length; i++) {
    if (lines[i].includes('results.length > 0 &&')) {
        if (lines[i-1].includes('})')) {
            if (!lines[i-1].includes('}),')) {
                lines[i-1] = lines[i-1].replace('})', '}),');
            }
        }
    }
}
fs.writeFileSync('src/assets/index.js', lines.join('\n'), 'utf8');
console.log("Comma added hopefully");
