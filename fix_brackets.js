const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const targetStr = `              e.jsx("button", {
                style: u(d({}, sty.btn("p")), { padding: "12px 32px", fontSize: 14, width: "100%" }),
                onClick: handleSearch,
                children: loading ? "\\u23F3 Buscando en Mercado P\\u00FAblico..." : "\\uD83D\\uDD0E Buscar Oportunidades",
              }),
            ],
          }),`;

const replacement = `              e.jsx("button", {
                style: u(d({}, sty.btn("p")), { padding: "12px 32px", fontSize: 14, width: "100%" }),
                onClick: handleSearch,
                children: loading ? "\\u23F3 Buscando en Mercado P\\u00FAblico..." : "\\uD83D\\uDD0E Buscar Oportunidades",
              }),
            ],
          }),
        ],
      }),`;

if (c.indexOf(targetStr) !== -1) {
    c = c.replace(targetStr, replacement);
    fs.writeFileSync('src/assets/index.js', c, 'utf8');
    console.log("Fixed missing closing brackets.");
} else {
    console.log("Could not find the target string.");
}
