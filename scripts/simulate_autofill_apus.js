const fs = require("fs");

const filePath = process.argv[2];
if (!filePath) {
  process.exit(1);
}

function N(e) {
  return String(e == null ? "" : e)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function y(arr) {
  return (arr || []).reduce(function (t, r) {
    var n = parseInt(r && r.id);
    return isFinite(n) ? Math.max(t, n) : t;
  }, 0);
}

function stats(C, U, M) {
  Array.isArray(C) || (C = []);
  Array.isArray(U) || (U = []);
  Array.isArray(M) || (M = []);
  const catIds = new Set(C.map((c) => parseInt(c && c.id)).filter((n) => Number.isFinite(n)));
  const apByCat = new Map();
  let orphan = 0;
  let apuNoMat = 0;
  const matIds = new Set(M.map((m) => parseInt(m && m.id)).filter((n) => Number.isFinite(n)));
  const missingMat = new Set();
  for (const a of U) {
    const cid = parseInt(a && a.catalogId);
    if (!Number.isFinite(cid) || !catIds.has(cid)) orphan++;
    else apByCat.set(cid, (apByCat.get(cid) || 0) + 1);
    const mats = Array.isArray(a && a.materiales) ? a.materiales : [];
    if (mats.length === 0) apuNoMat++;
    for (const it of mats) {
      const mid = parseInt(it && it.materialId);
      if (Number.isFinite(mid) && !matIds.has(mid)) missingMat.add(mid);
    }
  }
  let missingApu = 0;
  let missingUnidad = 0;
  for (const c of C) {
    const id = parseInt(c && c.id);
    const u = String((c && c.unidad) || "").trim().toLowerCase();
    if (!u || u === "unidad") missingUnidad++;
    if (!Number.isFinite(id) || !apByCat.has(id)) missingApu++;
  }
  return {
    catalog: C.length,
    apus: U.length,
    materiales: M.length,
    partidasSinApu: missingApu,
    partidasSinUnidad: missingUnidad,
    apusHuerfanas: orphan,
    apusSinMateriales: apuNoMat,
    materialesFaltantes: missingMat.size,
  };
}

function iByNombre(M, nombre) {
  return (M || []).find(function (r) {
    return N(r && r.nombre) === N(nombre);
  });
}

function oByDesc(C, desc) {
  return (C || []).find(function (r) {
    return N(r && r.desc) === N(desc);
  });
}

function mAdd(M, nombre, cat, unidad, precio) {
  var c = iByNombre(M, nombre);
  if (c) return c.id;
  var s = Math.max(305, y(M)) + 1;
  M.push({ id: s, cat: cat, nombre: nombre, unidad: unidad, precio: precio });
  return s;
}

function lAdd(C, desc, cat, unidad, precio) {
  var c = oByDesc(C, desc);
  if (c) return c.id;
  var s = Math.max(227, y(C)) + 1;
  C.push({ id: s, cat: cat, desc: desc, unidad: unidad, precio: precio });
  return s;
}

function scoreBase(catDesc, apuName) {
  var c = N(catDesc);
  var n = N(apuName);
  if (!c || !n) return 0;
  if (c === n) return 100;
  if (c.indexOf(n) !== -1 || n.indexOf(c) !== -1) return 85;
  var ct = c.split(/\s+/);
  var nt = n.split(/\s+/);
  var set = {};
  for (var i2 = 0; i2 < ct.length; i2++) set[ct[i2]] = 1;
  var inter = 0;
  var union = ct.length;
  for (var j2 = 0; j2 < nt.length; j2++) (set[nt[j2]] ? inter++ : union++);
  return union ? Math.round((inter / union) * 60) : 0;
}

function bestCatalogForApu(C, apu) {
  var best = null;
  var bestSc = 0;
  for (var i3 = 0; i3 < C.length; i3++) {
    var cat = C[i3];
    if (!cat) continue;
    var sc = scoreBase(cat.desc, apu && apu.nombre);
    if (sc) {
      N(apu && apu.categoria) && N(cat && cat.cat) && N(apu.categoria) === N(cat.cat) && (sc += 20);
      N(apu && apu.unidad) && N(cat && cat.unidad) && N(apu.unidad) === N(cat.unidad) && (sc += 10);
    }
    if (sc > bestSc) (bestSc = sc), (best = cat);
  }
  return { cat: best, sc: bestSc };
}

const raw = fs.readFileSync(filePath, "utf8");
const j = JSON.parse(raw);

let M = Array.isArray(j.materiales) ? j.materiales.slice() : [];
let C = Array.isArray(j.catalog) ? j.catalog.slice() : [];
let U = Array.isArray(j.apus) ? j.apus.slice() : [];

const before = stats(C, U, M);

let createdCatalog = 0;
let createdApus = 0;
let fixedApuMaterials = 0;
let fixedOrphans = 0;

var catOk = {};
for (var a = 0; a < C.length; a++) catOk[parseInt(C[a] && C[a].id)] = !0;

for (var e = 0; e < U.length; e++) {
  var apu = U[e];
  var cid = parseInt(apu && apu.catalogId);
  if (!catOk[cid]) {
    var pick = bestCatalogForApu(C, apu);
    if (pick.cat && pick.sc >= 75) {
      apu.catalogId = pick.cat.id;
      fixedOrphans++;
    } else {
      var nm = String((apu && apu.nombre) || "").trim();
      nm || (nm = "APU " + String((apu && apu.id) || ""));
      var ncat = String((apu && apu.categoria) || "General").trim() || "General";
      var nuni = String((apu && apu.unidad) || "unidad").trim() || "unidad";
      var newCid = lAdd(C, nm, ncat, nuni, 0);
      if (!catOk[parseInt(newCid)]) createdCatalog++;
      apu.catalogId = newCid;
      catOk[parseInt(newCid)] = !0;
      fixedOrphans++;
    }
  }
}

var apByCat = {};
for (var f = 0; f < U.length; f++) {
  var ap = U[f];
  var cc = parseInt(ap && ap.catalogId);
  isFinite(cc) && (apByCat[cc] = apByCat[cc] || []).push(ap);
}

var idPend = mAdd(M, "Pendiente (completar materiales)", "Genérico", "unidad", 0);
for (var f2 = 0; f2 < U.length; f2++) {
  var ap2 = U[f2] || {};
  Array.isArray(ap2.materiales) || (ap2.materiales = []);
  if (ap2.materiales.length === 0) {
    ap2.materiales = [{ materialId: idPend, cantidad: 1 }];
    fixedApuMaterials++;
  }
}

var nextApuId = Math.max(142, y(U)) + 1;
for (var h = 0; h < C.length; h++) {
  var cat3 = C[h];
  if (!cat3) continue;
  var cid2 = parseInt(cat3 && cat3.id);
  if (!isFinite(cid2)) continue;
  if (apByCat[cid2] && apByCat[cid2].length) continue;
  var un = String(cat3.unidad || "").trim() || "unidad";
  var nm2 = String(cat3.desc || "").trim();
  nm2 || (nm2 = "Partida " + String(cat3.id));
  var catName = String(cat3.cat || "General").trim() || "General";
  var apuNew = {
    id: nextApuId++,
    tipo: "Terminaciones",
    estructura: catName,
    nombre: nm2 + " [auto]",
    categoria: catName,
    unidad: un,
    catalogId: cat3.id,
    esSubcontrato: !1,
    precioSubcontrato: 0,
    pctMO: 70,
    pctGG: 12,
    pctUtilidad: 15,
    pctSource: "cfg",
    rendimiento: 1,
    dotacion: 1,
    materiales: [{ materialId: idPend, cantidad: 1 }],
  };
  U.push(apuNew);
  createdApus++;
  (apByCat[cid2] = apByCat[cid2] || []).push(apuNew);
}

for (var g = 0; g < C.length; g++) {
  var cat2 = C[g];
  if (!cat2) continue;
  var cu = String(cat2.unidad || "").trim();
  if (!cu || N(cu) === "unidad") {
    var aps = apByCat[parseInt(cat2.id)] || [];
    if (aps.length && aps[0] && aps[0].unidad) cat2.unidad = aps[0].unidad;
  }
}

const after = stats(C, U, M);

console.log(
  JSON.stringify(
    {
      before,
      after,
      delta: {
        createdCatalog,
        createdApus,
        fixedApuMaterials,
        fixedOrphans,
      },
    },
    null,
    2
  )
);

