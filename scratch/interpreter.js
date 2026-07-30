const fs = require('fs');

const DICCIONARIO = JSON.parse(fs.readFileSync('docs/asistente-lenguaje/DICCIONARIO_TERMINOS.json', 'utf8'));
const CASOS = JSON.parse(fs.readFileSync('docs/asistente-lenguaje/CASOS_PRUEBA.json', 'utf8'));

const normalize = (str) => {
    return str.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/[^\w\s\d,]/g, '') // remove punctuation except comma and digits
      .replace(/\s+/g, ' ')
      .trim();
};

const regexPatterns = {
    dimension: /\b(\d+(?:[,.]\d+)?)\s*(m2|mts2|metros cuadrados|mt2|metros 2|ml|metros lineales|metros de largo|mt|mts|un|unidades|unidad|piezas|m)\b/g
};

function analyzeText(text) {
    if (!text || text.trim().length === 0) return { error: "empty" };
    if (text.length > 500) return { error: "too_long" };
    
    const norm = normalize(text);
    
    // Check multiple tasks (very basic: ' y ')
    let isMultiple = false;
    
    let result = {
        tipoTrabajo: null,
        elemento: null,
        material: null,
        condiciones: [],
        dimension: null,
        unidad: null,
        urgencia: null,
        requiereVisita: null
    };
    
    // Escaneo de diccionarios
    const findMatch = (categoryDict) => {
        let matches = [];
        for (const [key, synonyms] of Object.entries(categoryDict)) {
            for (const syn of synonyms) {
                const normSyn = normalize(syn);
                if (norm.includes(normSyn) || new RegExp(`\\b${normSyn}\\b`).test(norm)) {
                    matches.push(key);
                }
            }
        }
        return [...new Set(matches)]; // unique
    };

    let tipos = findMatch(DICCIONARIO.tipoTrabajo);
    if (tipos.length > 0) result.tipoTrabajo = tipos[0];
    
    let elementos = findMatch(DICCIONARIO.elemento);
    if (elementos.length > 0) result.elemento = elementos[0];
    if (elementos.length > 1) isMultiple = true;

    let materiales = findMatch(DICCIONARIO.material);
    if (materiales.length > 0) result.material = materiales[0];

    let condiciones = findMatch(DICCIONARIO.condiciones);
    result.condiciones = condiciones;

    let urgencias = findMatch({urgencia: DICCIONARIO.modificadores.urgencia});
    if (urgencias.length > 0) result.urgencia = true;

    let visitas = findMatch({visita: DICCIONARIO.modificadores.visita});
    if (visitas.length > 0) result.requiereVisita = true;

    // Extraer dimension
    let dimMatch;
    // reset regex
    regexPatterns.dimension.lastIndex = 0;
    const matches = [...norm.matchAll(regexPatterns.dimension)];
    if (matches.length > 0) {
        let val = matches[0][1].replace(',', '.');
        result.dimension = parseFloat(val);
        
        // Match unit
        let uText = matches[0][2];
        let foundU = null;
        for (const [uKey, uSyns] of Object.entries(DICCIONARIO.unidades)) {
            if (uSyns.map(normalize).includes(normalize(uText))) {
                foundU = uKey; break;
            }
        }
        if (!foundU && (uText === 'm' || uText === 'mt' || uText === 'mts')) {
            // resolve ambiguous m/mt
            if (result.elemento === 'canaletas_bajantes') foundU = 'ml';
            else foundU = 'm2'; // default or context
        }
        result.unidad = foundU;
    }
    
    // Scoring de flujos
    const flujos = [
        { id: "flujo-1-filtracion-techumbre", elem: "techumbre", conds: ["filtracion", "roto"] },
        { id: "flujo-2-remodelacion-bano", elem: "bano", tipo: ["remodelacion"] },
        { id: "flujo-3-pintura-interior", elem: "muros_interiores", conds: ["hongos", "descascarado", "levantado"], tipo: ["mantencion", "reparacion"] },
        { id: "flujo-4-cambio-piso", elem: "pisos", tipo: ["remodelacion", "reparacion"], conds: ["levantado"] },
        { id: "flujo-5-mantencion-canaletas", elem: "canaletas_bajantes", conds: ["canaletas_obstruidas"] }
    ];
    
    let scores = flujos.map(f => {
        let score = 0;
        if (result.elemento === f.elem) score += 5;
        if (f.tipo && f.tipo.includes(result.tipoTrabajo)) score += 2;
        if (f.conds) {
            for (let c of result.condiciones) {
                if (f.conds.includes(c)) score += 3;
            }
        }
        return { id: f.id, score };
    }).sort((a,b) => b.score - a.score);
    
    let topFlujo = scores[0].score >= 5 ? scores[0].id : null;
    let confianza = "baja";
    if (scores[0].score >= 8) confianza = "alta";
    else if (scores[0].score >= 5) confianza = "media";
    if (scores[1] && scores[0].score > 0 && scores[0].score === scores[1].score) confianza = "baja";
    if (isMultiple) confianza = "baja";
    
    result.flujoSugerido = topFlujo;
    result.confianza = confianza;
    result.isMultiple = isMultiple;
    return result;
}

let ok = 0;
const report = CASOS.map(c => {
    const res = analyzeText(c.input);
    const exp = c.expected;
    
    // Check if expected matches
    let flowMatch = (res.flujoSugerido === exp.flujoSugerido);
    if (!exp.flujoSugerido) flowMatch = true; // some don't specify
    
    if (flowMatch) ok++;
    
    return {
        id: c.id,
        flujoExp: exp.flujoSugerido,
        flujoObt: res.flujoSugerido,
        confianza: res.confianza,
        res: flowMatch ? 'PASS' : 'FAIL',
        parsed: res,
        text: c.input
    }
});

console.table(report.map(r => ({id: r.id, exp: r.flujoExp, obt: r.flujoObt, conf: r.confianza, res: r.res, elem: r.parsed.elemento, dim: r.parsed.dimension, unit: r.parsed.unidad})));
console.log("Total OK: " + ok + "/" + CASOS.length);
