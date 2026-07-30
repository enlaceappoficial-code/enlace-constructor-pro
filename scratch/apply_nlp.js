const fs = require('fs');

const path = 'src/assets/index.js';
let content = fs.readFileSync(path, 'utf8');

const diccionarioJSON = fs.readFileSync('docs/asistente-lenguaje/DICCIONARIO_TERMINOS.json', 'utf8');

const newAsistente = `const DICCIONARIO = ${diccionarioJSON};
const normalize = (str) => str.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/[^\\w\\s\\d,]/g, '').replace(/\\s+/g, ' ').trim();

function analyzeText(text) {
    if (!text || text.trim().length === 0) return { error: "empty" };
    if (text.length > 500) return { error: "too_long" };
    
    const norm = normalize(text);
    let isMultiple = false;
    
    let result = { tipoTrabajo: null, elemento: null, material: null, condiciones: [], dimension: null, unidad: null, urgencia: null, requiereVisita: null };
    
    const findMatch = (categoryDict) => {
        let matches = [];
        for (const [key, synonyms] of Object.entries(categoryDict)) {
            for (const syn of synonyms) {
                const normSyn = normalize(syn);
                if (norm.includes(normSyn) || new RegExp(\`\\\\b\${normSyn}\\\\b\`).test(norm)) matches.push(key);
            }
        }
        return [...new Set(matches)];
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

    if (findMatch({urgencia: DICCIONARIO.modificadores.urgencia}).length > 0) result.urgencia = true;
    if (findMatch({visita: DICCIONARIO.modificadores.visita}).length > 0) result.requiereVisita = true;

    const regexDim = /\\b(\\d+(?:[,.]\\d+)?)\\s*(m2|mts2|metros cuadrados|mt2|metros 2|ml|metros lineales|metros de largo|mt|mts|un|unidades|unidad|piezas|m|metros)\\b/g;
    const matches = [...norm.matchAll(regexDim)];
    if (matches.length > 0) {
        result.dimension = parseFloat(matches[0][1].replace(',', '.'));
        let uText = matches[0][2];
        let foundU = null;
        for (const [uKey, uSyns] of Object.entries(DICCIONARIO.unidades)) {
            if (uSyns.map(normalize).includes(normalize(uText))) { foundU = uKey; break; }
        }
        if (!foundU && (uText === 'm' || uText === 'mt' || uText === 'mts' || uText === 'metros')) {
            foundU = result.elemento === 'canaletas_bajantes' ? 'ml' : 'm2';
        }
        result.unidad = foundU;
    }
    
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
            for (let c of result.condiciones) { if (f.conds.includes(c)) score += 3; }
        }
        return { id: f.id, score, name: f.elem };
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
    result.opciones = scores.filter(s => s.score > 0).slice(0,3);
    return result;
}

function AsistenteInteligenteModal({ catalog, onClose, onGenerarPropuesta, paso, setPaso, respuestas, setRespuestas }) {
  const [nlpText, setNlpText] = V("");
  const [nlpResult, setNlpResult] = V(null);
  
  const pasosConfig = [
    { key: "tipoTrabajo", label: "Tipo de Trabajo", options: ["Reparación", "Mantención", "Remodelación", "Obra Nueva"] },
    { key: "recintoElemento", label: "Recinto / Elemento Afectado", options: ["Techo / Cubierta", "Baño", "Muros interiores", "Pisos", "Canaletas y Bajantes"] },
    { key: "dimension", label: "Dimensión (ingresa un número)", type: "number" },
    { key: "condicionExistente", label: "Condición Existente", options: ["Ninguna", "Filtración activa", "Humedad visible en muros", "Pintura descascarada", "Piso actual es alfombra", "Obstrucción por hojas", "Daño severo", "Red sanitaria existente en mal estado"] },
    { key: "materiales", label: "Materiales / Sistema Constructivo", options: ["Zinc / Teja", "Cerámica", "Esmalte al agua", "Piso Flotante", "PVC", "Otro"] },
    { key: "urgencia", label: "Urgencia", options: ["Inmediata", "Estándar"] },
    { key: "visitaTecnica", label: "Visita Técnica", options: ["Requerida", "Opcional", "No requerida"] }
  ];

  const handleNext = () => { if (paso < pasosConfig.length - 1) setPaso(paso + 1); else generarPropuesta(); };

  const mapToRespuestas = (res) => {
      let r = { ...respuestas };
      if (res.tipoTrabajo === "reparacion") r.tipoTrabajo = "Reparación";
      else if (res.tipoTrabajo === "mantencion") r.tipoTrabajo = "Mantención";
      else if (res.tipoTrabajo === "remodelacion") r.tipoTrabajo = "Remodelación";
      else if (res.tipoTrabajo === "construccion") r.tipoTrabajo = "Obra Nueva";

      if (res.elemento === "techumbre") r.recintoElemento = "Techo / Cubierta";
      else if (res.elemento === "bano") r.recintoElemento = "Baño";
      else if (res.elemento === "muros_interiores") r.recintoElemento = "Muros interiores";
      else if (res.elemento === "pisos") r.recintoElemento = "Pisos";
      else if (res.elemento === "canaletas_bajantes") r.recintoElemento = "Canaletas y Bajantes";

      if (res.dimension) r.dimension = res.dimension;

      if (res.condiciones.includes("filtracion")) r.condicionExistente = "Filtración activa";
      else if (res.condiciones.includes("hongos")) r.condicionExistente = "Humedad visible en muros";
      else if (res.condiciones.includes("descascarado")) r.condicionExistente = "Pintura descascarada";
      else if (res.condiciones.includes("levantado") && res.elemento === "pisos") r.condicionExistente = "Daño severo";
      else if (res.condiciones.includes("canaletas_obstruidas")) r.condicionExistente = "Obstrucción por hojas";

      if (res.material === "zinc" || res.material === "teja") r.materiales = "Zinc / Teja";
      else if (res.material === "ceramica") r.materiales = "Cerámica";
      else if (res.material === "flotante") r.materiales = "Piso Flotante";
      else if (res.material === "pvc") r.materiales = "PVC";

      if (res.urgencia) r.urgencia = "Inmediata";
      if (res.requiereVisita) r.visitaTecnica = "Requerida";
      
      return r;
  };

  const handleAnalizar = () => {
      let res = analyzeText(nlpText);
      if (res.error) return;
      setNlpResult(res);
      setPaso(-2);
  };

  const handleApplyNlp = (flujoForce = null) => {
      let r = mapToRespuestas(nlpResult);
      if (flujoForce) {
          if (flujoForce.includes("techumbre")) r.recintoElemento = "Techo / Cubierta";
          if (flujoForce.includes("bano")) r.recintoElemento = "Baño";
          if (flujoForce.includes("pintura")) r.recintoElemento = "Muros interiores";
          if (flujoForce.includes("piso")) r.recintoElemento = "Pisos";
          if (flujoForce.includes("canaleta")) r.recintoElemento = "Canaletas y Bajantes";
      }
      setRespuestas(r);
      let firstMissing = 0;
      for (let i=0; i<pasosConfig.length; i++) {
          if (!r[pasosConfig[i].key]) { firstMissing = i; break; }
      }
      setPaso(firstMissing);
  };

  const generarPropuesta = () => {
    let match = FLUJOS_ASISTENTE.find(f => f.preguntas.recintoElemento === respuestas.recintoElemento && f.preguntas.tipoTrabajo === respuestas.tipoTrabajo) 
             || FLUJOS_ASISTENTE.find(f => f.preguntas.recintoElemento === respuestas.recintoElemento) 
             || FLUJOS_ASISTENTE[0];
    
    let adicionales = [...match.salidaPropuesta.partidasAdicionales];
    if (respuestas.condicionExistente === "Humedad visible en muros" && match.flujoId !== "flujo-2-remodelacion-bano") {
      adicionales.push({ catalogId: 40516, obligatoria: true, motivo: "Tratamiento antihongos sugerido." });
    }
    if (respuestas.condicionExistente === "Obstrucción por hojas" && match.flujoId !== "flujo-5-mantencion-canaletas") {
      adicionales.push({ catalogId: 110, obligatoria: true, motivo: "Incluir limpieza de canaletas." });
    }
    if (respuestas.condicionExistente === "Red sanitaria existente en mal estado") {
      adicionales.push({ catalogId: 40228, obligatoria: true, motivo: "Instalación sanitaria completa sugerida." });
    }

    const dim = parseFloat(respuestas.dimension) || 1;
    const unidadPrincipal = respuestas.recintoElemento === "Pisos" || respuestas.recintoElemento === "Muros interiores" || respuestas.recintoElemento === "Techo / Cubierta" || respuestas.recintoElemento === "Baño" ? "m²" : respuestas.recintoElemento === "Canaletas y Bajantes" ? "ml" : "un";

    const capitulos = [
      {
        nombre: "Propuesta: " + match.nombre,
        soluciones: match.salidaPropuesta.soluciones.map(s => ({ solucionId: s, cantidadSugerida: 1 })),
        partidasDirectas: adicionales.map(a => Object.assign({}, a, { cantidadSugerida: 1 }))
      }
    ];

    let propuesta = {
      esModerna: true,
      id: "asistente-dinamico",
      nombre: "Asistente: " + match.nombre,
      descripcion: "Diagnóstico: " + respuestas.condicionExistente + ". Urgencia: " + respuestas.urgencia + ".",
      _asistenteFlujoId: match.flujoId,
      _asistenteCantidadOrigen: dim,
      _asistenteUnidadPrincipal: unidadPrincipal,
      capitulos: capitulos,
      preguntas: [...match.salidaPropuesta.advertencias, "Cantidades de partidas en gl o un (como bolsas o puntos) mantuvieron su base. Revisar manualmente según rendimiento."].map((a, idx) => ({ id: "adv" + idx, label: "⚠️ " + a }))
    };
    onGenerarPropuesta(propuesta);
  };

  if (paso === -1) {
      return e.jsx("div", {
        style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center" },
        children: e.jsxs("div", {
          style: { background: "var(--bg)", width: 500, borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", gap: 16 },
          children: [
            e.jsx("div", { style: { fontSize: 20, fontWeight: 700 }, children: "✨ Asistente Inteligente" }),
            e.jsx("div", { style: { fontSize: 16, fontWeight: 600 }, children: "Describe el trabajo que necesitas realizar" }),
            e.jsx("textarea", {
                rows: 4,
                value: nlpText,
                onChange: ev => setNlpText(ev.target.value),
                placeholder: "Ej: Tengo una filtración en el techo de zinc de unos 30 m2...",
                style: { padding: 10, borderRadius: 6, border: "1px solid var(--border)", background: "var(--sb)", color: "var(--text)", resize: "none" }
            }),
            e.jsx("button", { onClick: handleAnalizar, disabled: !nlpText.trim(), style: { padding: "10px 16px", borderRadius: 6, border: "none", background: "var(--accent)", color: "#fff", cursor: "pointer", fontWeight: "bold" }, children: "Analizar solicitud" }),
            e.jsx("button", { onClick: () => setPaso(0), style: { padding: "10px 16px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", color: "var(--text)", cursor: "pointer" }, children: "Prefiero responder paso a paso" }),
            e.jsx("button", { onClick: onClose, style: { padding: "10px 16px", borderRadius: 6, border: "none", background: "transparent", color: "var(--text)", cursor: "pointer", textDecoration: "underline" }, children: "Cancelar" })
          ]
        })
      });
  }

  if (paso === -2 && nlpResult) {
      return e.jsx("div", {
        style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center" },
        children: e.jsxs("div", {
          style: { background: "var(--bg)", width: 500, borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", gap: 16 },
          children: [
            e.jsx("div", { style: { fontSize: 20, fontWeight: 700 }, children: "🔍 Revisión de Interpretación" }),
            e.jsxs("div", { style: { padding: 12, background: "var(--sb)", borderRadius: 8 }, children: [
                e.jsxs("div", { children: [e.jsx("b", {children: "Confianza: "}), nlpResult.confianza.toUpperCase()] }),
                e.jsxs("div", { children: [e.jsx("b", {children: "Flujo Sugerido: "}), nlpResult.flujoSugerido || "No detectado claro"] }),
                e.jsxs("div", { children: [e.jsx("b", {children: "Datos detectados: "}), [nlpResult.elemento, nlpResult.tipoTrabajo, nlpResult.dimension ? nlpResult.dimension+nlpResult.unidad : null].filter(Boolean).join(", ")] })
            ]}),
            
            nlpResult.isMultiple ? e.jsxs("div", {
                style: { background: "rgba(255,100,100,0.1)", border: "1px solid red", padding: 10, borderRadius: 8 },
                children: [
                    e.jsx("div", { style: { fontWeight: "bold", color: "red", marginBottom: 8 }, children: "⚠️ Múltiples solicitudes detectadas. Por favor elige una para comenzar:" }),
                    nlpResult.opciones.map(opt => e.jsx("button", {
                        key: opt.id,
                        onClick: () => handleApplyNlp(opt.id),
                        style: { display: "block", width: "100%", padding: 8, marginBottom: 4, borderRadius: 6, background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", cursor: "pointer" },
                        children: "Flujo: " + opt.name
                    }))
                ]
            }) : null,

            (!nlpResult.isMultiple && nlpResult.confianza === "baja" && nlpResult.opciones.length > 0) ? e.jsxs("div", {
                style: { background: "rgba(255,200,0,0.1)", border: "1px solid orange", padding: 10, borderRadius: 8 },
                children: [
                    e.jsx("div", { style: { fontWeight: "bold", color: "orange", marginBottom: 8 }, children: "⚠️ Confianza baja. Elige el flujo correcto:" }),
                    nlpResult.opciones.map(opt => e.jsx("button", {
                        key: opt.id,
                        onClick: () => handleApplyNlp(opt.id),
                        style: { display: "block", width: "100%", padding: 8, marginBottom: 4, borderRadius: 6, background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", cursor: "pointer" },
                        children: "Flujo: " + opt.name
                    }))
                ]
            }) : null,

            (!nlpResult.isMultiple && (nlpResult.confianza === "alta" || nlpResult.confianza === "media")) ? e.jsx("button", { onClick: () => handleApplyNlp(), style: { padding: "10px 16px", borderRadius: 6, border: "none", background: "var(--accent)", color: "#fff", cursor: "pointer", fontWeight: "bold" }, children: "Continuar con esta interpretación" }) : null,

            e.jsx("button", { onClick: () => handleApplyNlp(), style: { padding: "10px 16px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", color: "var(--text)", cursor: "pointer" }, children: "Corregir datos manualmente" }),
            e.jsx("button", { onClick: () => setPaso(-1), style: { padding: "10px 16px", borderRadius: 6, border: "none", background: "transparent", color: "var(--text)", cursor: "pointer", textDecoration: "underline" }, children: "Atrás" })
          ]
        })
      });
  }

  const currPaso = pasosConfig[paso];

  return e.jsx("div", {
    style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center" },
    children: e.jsxs("div", {
      style: { background: "var(--bg)", width: 500, borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", gap: 16 },
      children: [
        e.jsx("div", { style: { fontSize: 20, fontWeight: 700 }, children: "✨ Asistente Inteligente" }),
        e.jsxs("div", { style: { display: "flex", gap: 4 }, children: pasosConfig.map((p, i) => e.jsx("div", { key: i, style: { flex: 1, height: 6, borderRadius: 3, background: i <= paso ? "var(--accent)" : "var(--border)" } })) }),
        e.jsx("div", { style: { fontSize: 16, fontWeight: 600, marginTop: 10 }, children: currPaso.label }),
        currPaso.type === "number" ? e.jsx("input", {
          type: "number",
          value: respuestas[currPaso.key],
          onChange: ev => setRespuestas({ ...respuestas, [currPaso.key]: ev.target.value }),
          style: { padding: 10, borderRadius: 6, border: "1px solid var(--border)", background: "var(--sb)", color: "var(--text)" }
        }) : e.jsx("div", {
          style: { display: "flex", flexDirection: "column", gap: 8 },
          children: currPaso.options.map(opt => e.jsx("button", {
            key: opt,
            onClick: () => setRespuestas({ ...respuestas, [currPaso.key]: opt }),
            style: { padding: 10, borderRadius: 6, border: respuestas[currPaso.key] === opt ? "2px solid var(--accent)" : "1px solid var(--border)", background: "var(--sb)", color: "var(--text)", textAlign: "left", cursor: "pointer" },
            children: opt
          }))
        }),
        e.jsxs("div", {
          style: { display: "flex", justifyContent: "space-between", marginTop: 20 },
          children: [
            e.jsx("button", { onClick: paso === 0 ? () => setPaso(-1) : () => setPaso(paso - 1), style: { padding: "8px 16px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", color: "var(--text)", cursor: "pointer" }, children: "Atrás" }),
            e.jsx("button", { onClick: handleNext, disabled: !respuestas[currPaso.key], style: { padding: "8px 16px", borderRadius: 6, border: "none", background: respuestas[currPaso.key] ? "var(--accent)" : "var(--border)", color: "#fff", cursor: "pointer" }, children: paso === pasosConfig.length - 1 ? "Revisar propuesta" : "Continuar" })
          ]
        })
      ]
    })
  });
}`;

const regexAsistente = /function AsistenteInteligenteModal\(\{.*?\}\) \{[\s\S]*?return e\.jsx\("div", \{[\s\S]*?\}\);\s*\}/;
content = content.replace(regexAsistente, newAsistente);
content = content.replace(/const \[asisPaso, setAsisPaso\] = V\(0\);/, 'const [asisPaso, setAsisPaso] = V(-1);');
fs.writeFileSync(path, content, 'utf8');
