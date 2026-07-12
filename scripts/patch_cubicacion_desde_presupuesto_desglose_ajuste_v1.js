const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

// 1) Estado para ajustes (x0) y para futuros toggles (I0)
{
  const from = ",[w,v]=V(null);var x=";
  const to = ",[w,v]=V(null),[x0,f0]=V({}),[I0,D0]=V(null);var x=";
  if (!s.includes(from)) throw new Error("No se encontró el punto de inserción de states en ig().");
  s = s.replace(from, to);
}

// 2) Guardar desglose por partida (aparece)
{
  const from = "partidas:[]});var le=";
  const to = "partidas:[],aparece:[]});var le=";
  if (!s.includes(from)) throw new Error("No se encontró el init de material en ig().");
  s = s.replace(from, to);
}

{
  const from = "S[Y].cantidad+=le,S[Y].partidas.includes(Z.desc)||S[Y].partidas.push(Z.desc)";
  const to =
    "S[Y].cantidad+=le,S[Y].partidas.includes(Z.desc)||S[Y].partidas.push(Z.desc),S[Y].aparece.push({desc:Z.desc,cant:le,unidadAPU:U.unidad})";
  if (!s.includes(from)) throw new Error("No se encontró el acumulador de partidas en ig().");
  s = s.replace(from, to);
}

// 3) Aplicar ajustes a la lista final (D())
{
  const from = "{cantidad:parseFloat(U._cantAjustada)||U.cantidad}";
  const to =
    '{cantidad:x0[U.id]!=null&&x0[U.id]!==""&&!isNaN(parseFloat(x0[U.id]))?parseFloat(x0[U.id]):parseFloat(U._cantAjustada)||U.cantidad}';
  if (!s.includes(from)) throw new Error("No se encontró el mapeo de cantidad en D().");
  s = s.replace(from, to);
}

// 4) Mostrar cantidad ajustada en la lista (en vez de S.cantidad)
{
  const from = "[+S.cantidad.toFixed(3),\" \",e.jsx(\"span\"";
  const to =
    '[(+(x0[S.id]!=null&&x0[S.id]!==""&&!isNaN(parseFloat(x0[S.id]))?parseFloat(x0[S.id]):S.cantidad)).toFixed(3)," ",e.jsx("span"';
  if (!s.includes(from)) throw new Error("No se encontró el render de cantidad en lista de materiales (Desde Presupuesto).");
  s = s.replace(from, to);
}

// 5) Mostrar desglose por partida (limitado) en la línea secundaria
{
  const to =
    'children:(S.aparece||[]).slice(0,3).map(ee=>ee.desc+" ("+(+(ee.cant||0).toFixed(2))+" "+S.unidad+")").join(", ") + ((S.aparece&&S.aparece.length>3)?(" +"+(S.aparece.length-3)+" más"):"")';
  const fromA = 'children:S.partidas.join(", ")';
  const fromB = 'children:S.partidas.join(\", \")';
  if (s.includes(fromA)) s = s.replace(fromA, to);
  else if (s.includes(fromB)) s = s.replace(fromB, to);
  else console.warn("WARN: no se encontró el subtitle de partidas para reemplazar (se omite paso 5).");
}

// 6) Botón para ajustar cantidad (prompt)
{
  const marker = 'title:U?"Restaurar material":"Excluir de esta cubic';
  const at = s.indexOf(marker);
  if (at === -1) {
    console.warn("WARN: no se encontró el botón excluir/restaurar para inyectar ajuste (se omite paso 6).");
  } else {
    const insert =
      'e.jsx("button",{title:"Ajustar cantidad",style:{background:"none",border:"none",cursor:"pointer",fontSize:15,color:a.accent,padding:"2px 4px",flexShrink:0},onClick:()=>{var ee=window.prompt("Cantidad a comprar (se redondea hacia arriba)",String(Math.ceil((x0[S.id]!=null&&x0[S.id]!==""&&!isNaN(parseFloat(x0[S.id]))?parseFloat(x0[S.id]):S.cantidad))));if(ee===null)return;f0(le=>{var Z=String(ee).trim();if(Z===""){var X=u(d({},le));return delete X[S.id],X}return u(d({},le),{[S.id]:Z})})},children:"✎"}),';
    s = s.slice(0, at) + insert + s.slice(at);
  }
}

if (s === before) throw new Error("No se aplicaron cambios.");
fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_cubicacion_desde_presupuesto_desglose_ajuste_v1");
