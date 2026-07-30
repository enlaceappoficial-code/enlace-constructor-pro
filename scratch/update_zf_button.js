const fs = require('fs');
const path = 'src/assets/index.js';
let content = fs.readFileSync(path, 'utf8');

const t1 = `    if (paso === "revision" && l && l.esModerna) {
      return e.jsx("div", {`;

const r1 = `    if (paso === "revision" && l && l.esModerna) {
      var itemsParaCargar = 0;
      (l.capitulos || []).forEach(cap => {
        (cap.partidasDirectas || []).forEach(pd => {
          if (pd.obligatoria || marcadas.has(pd.catalogId)) itemsParaCargar++;
        });
        (cap.soluciones || []).forEach(solRef => {
          var sol = SOLUCIONES_COMPUESTAS_ACTIVAS.find(s => s.id === solRef.solucionId);
          if (sol) {
            sol.partidas.forEach(sp => {
              if (sp.obligatoria || marcadas.has(sp.catalogId)) itemsParaCargar++;
            });
          }
        });
      });

      return e.jsx("div", {`;

content = content.replace(t1, r1);

const t2 = `            e.jsxs("div", {
              style: { display: "flex", gap: 8, marginTop: 10 },
              children: [
                e.jsx("button", {
                  style: u(d({}, c.btn("p")), { flex: 1, padding: "10px", fontWeight: 700 }),
                  onClick: aplicarPlantillaModerna,
                  children: "✅ Confirmar y Cargar"
                }),`;

const r2 = `            itemsParaCargar === 0 && e.jsx("div", {
              style: { color: "#ef4444", fontSize: 13, textAlign: "center", marginTop: 10, fontWeight: 600 },
              children: "⚠️ Selecciona al menos una partida para continuar."
            }),
            e.jsxs("div", {
              style: { display: "flex", gap: 8, marginTop: 10 },
              children: [
                e.jsx("button", {
                  style: u(d({}, c.btn("p")), { flex: 1, padding: "10px", fontWeight: 700, opacity: itemsParaCargar === 0 ? 0.5 : 1 }),
                  onClick: itemsParaCargar === 0 ? null : aplicarPlantillaModerna,
                  disabled: itemsParaCargar === 0,
                  children: "✅ Confirmar y Cargar"
                }),`;

content = content.replace(t2, r2);
fs.writeFileSync(path, content, 'utf8');
console.log('Zf updated successfully.');
