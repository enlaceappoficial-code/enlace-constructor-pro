const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const targetStr = `              e.jsx("button", {
                style: u(d({}, sty.btn("p")), { padding: "12px 32px", fontSize: 14, width: "100%" }),
                onClick: handleSearch,
                children: loading ? "\\u23F3 Buscando en Mercado P\\u00FAblico..." : "\\uD83D\\uDD0E Buscar Oportunidades",
              }),
            ],
        }),
        ],
      }),
      results.length > 0 &&`;

const targetStr2 = `              e.jsx("button", {
                style: u(d({}, sty.btn("p")), { padding: "12px 32px", fontSize: 14, width: "100%" }),
                onClick: handleSearch,
                children: loading ? "\\u23F3 Buscando en Mercado P\\u00FAblico..." : "\\uD83D\\uDD0E Buscar Oportunidades",
              }),
            ],
          }),
        ],
      }),
      results.length > 0 &&`;

const replacement = `              e.jsx("button", {
                style: u(d({}, sty.btn("p")), { padding: "12px 32px", fontSize: 14, width: "100%" }),
                onClick: handleSearch,
                children: loading ? "\\u23F3 Buscando en Mercado P\\u00FAblico..." : "\\uD83D\\uDD0E Buscar Oportunidades",
              }),
            ],
          }),
        results.length > 0 &&`;

if (c.indexOf(targetStr) !== -1) {
    c = c.replace(targetStr, replacement);
    fs.writeFileSync('src/assets/index.js', c, 'utf8');
    console.log("Fixed extra brackets.");
} else if (c.indexOf(targetStr2) !== -1) {
    c = c.replace(targetStr2, replacement);
    fs.writeFileSync('src/assets/index.js', c, 'utf8');
    console.log("Fixed extra brackets (2).");
} else {
    console.log("Could not find the target string.");
}
