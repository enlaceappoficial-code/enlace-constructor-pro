(function () {
  if (window.__ecpApuDetailSetup) return;
  window.__ecpApuDetailSetup = true;
  var ENABLE_MODAL = false;

  function norm(s) {
    try {
      return String(s == null ? "" : s)
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    } catch (e) {
      return String(s == null ? "" : s).trim().toLowerCase();
    }
  }

  function money(n) {
    n = Number(n);
    if (!isFinite(n)) n = 0;
    try {
      return "$" + Math.round(n).toLocaleString("es-CL");
    } catch (e) {
      return "$" + String(Math.round(n));
    }
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function readJson(key, fallback) {
    try {
      var v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function calcAPU(apu, materiales) {
    apu = apu || {};
    materiales = Array.isArray(materiales) ? materiales : [];
    if (apu.esSubcontrato) {
      var base = Number(apu.precioSubcontrato) || 0;
      var adm = (base * (Number(apu.pctGG) || 0)) / 100;
      return {
        matTotal: 0,
        moTotal: 0,
        ggTotal: adm,
        utilTotal: 0,
        precioFinal: base + adm,
        base: base,
      };
    }
    var matTotal = 0;
    var lines = Array.isArray(apu.materiales) ? apu.materiales : [];
    for (var i = 0; i < lines.length; i++) {
      var ln = lines[i] || {};
      var mid = parseInt(ln.materialId);
      var m = null;
      for (var j = 0; j < materiales.length; j++) {
        if (parseInt(materiales[j] && materiales[j].id) === mid) {
          m = materiales[j];
          break;
        }
      }
      matTotal += (m ? Number(m.precio) || 0 : 0) * (Number(ln.cantidad) || 0);
    }
    var precioMOBase = Number(apu.precioMO) || 0;
    var moTotal = precioMOBase > 0 ? precioMOBase : (matTotal * (Number(apu.pctMO) || 0)) / 100;
    var ggTotal = ((matTotal + moTotal) * (Number(apu.pctGG) || 0)) / 100;
    var sub = matTotal + moTotal + ggTotal;
    var utilTotal = (sub * (Number(apu.pctUtilidad) || 0)) / 100;
    var precioFinal = Math.round(sub + utilTotal);
    return { matTotal: matTotal, moTotal: moTotal, ggTotal: ggTotal, utilTotal: utilTotal, precioFinal: precioFinal, base: matTotal };
  }

  function ensureModal() {
    var existing = document.getElementById("__ecp_apu_detail_modal");
    if (existing) existing.remove();

    var overlay = document.createElement("div");
    overlay.id = "__ecp_apu_detail_modal";
    overlay.style.cssText =
      "position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:999999;display:flex;align-items:center;justify-content:center;padding:18px;";
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) overlay.remove();
    });

    var card = document.createElement("div");
    card.style.cssText =
      "width:100%;max-width:1100px;max-height:90vh;overflow:auto;border-radius:16px;background:#0b1220;border:1px solid #243a58;color:#dde4f0;box-shadow:0 18px 60px rgba(0,0,0,.65);";

    overlay.appendChild(card);
    document.body.appendChild(overlay);
    return card;
  }

  function renderApuDetail(apu) {
    var materiales = readJson("enlace_constructor_pro_v1_materiales", []);
    var catalog = readJson("enlace_constructor_pro_v1_catalog", []);
    var cat = null;
    if (apu && apu.catalogId) {
      var cid = parseInt(apu.catalogId);
      for (var i = 0; i < catalog.length; i++) {
        if (parseInt(catalog[i] && catalog[i].id) === cid) {
          cat = catalog[i];
          break;
        }
      }
    }

    var r = calcAPU(apu, materiales);

    var lines = Array.isArray(apu && apu.materiales) ? apu.materiales : [];
    var matById = {};
    for (var m = 0; m < materiales.length; m++) matById[parseInt(materiales[m] && materiales[m].id)] = materiales[m] || {};

    var total = 0;
    var rows = "";
    for (var k = 0; k < lines.length; k++) {
      var ln = lines[k] || {};
      var mat = matById[parseInt(ln.materialId)] || {};
      var q = Number(ln.cantidad) || 0;
      var pr = Number(mat.precio) || 0;
      var st = q * pr;
      total += st;
      rows +=
        "<tr>" +
        '<td style="padding:7px 8px;border-bottom:1px solid #243a58;color:rgba(255,255,255,.55);font-size:12px;width:24px;">' +
        (k + 1) +
        "</td>" +
        '<td style="padding:7px 8px;border-bottom:1px solid #243a58;color:#dde4f0;font-size:12px;">' +
        escapeHtml(mat.nombre || "Material " + String(ln.materialId || "")) +
        "</td>" +
        '<td style="padding:7px 8px;border-bottom:1px solid #243a58;color:#dde4f0;font-size:12px;text-align:right;width:78px;">' +
        q +
        "</td>" +
        '<td style="padding:7px 8px;border-bottom:1px solid #243a58;color:rgba(255,255,255,.55);font-size:12px;width:78px;">' +
        escapeHtml(mat.unidad || "unidad") +
        "</td>" +
        '<td style="padding:7px 8px;border-bottom:1px solid #243a58;color:#dde4f0;font-size:12px;text-align:right;width:92px;">' +
        money(pr) +
        "</td>" +
        '<td style="padding:7px 8px;border-bottom:1px solid #243a58;color:#f5a020;font-size:12px;text-align:right;font-weight:900;width:102px;">' +
        money(st) +
        "</td>" +
        "</tr>";
    }
    if (!rows) rows = '<tr><td colspan="6" style="padding:10px 8px;color:rgba(255,255,255,.6);font-size:12px;">Sin materiales</td></tr>';

    var catName = String((apu && (apu.categoria || apu.tipo)) || (cat && cat.cat) || "APU");
    var header =
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12;padding:16px 18px;background:#1a3a5c;border-bottom:1px solid #243a58;position:sticky;top:0;z-index:2;">' +
      '<div style="min-width:0">' +
      '<div style="font-size:16px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' +
      escapeHtml(catName) +
      "</div>" +
      '<div style="font-size:13px;color:rgba(255,255,255,.85);margin-top:2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' +
      escapeHtml((apu && apu.nombre) || "APU") +
      "</div>" +
      "</div>" +
      '<button id="__ecp_apu_detail_close" style="width:34px;height:34px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.18);color:#fff;border-radius:10px;cursor:pointer;font-weight:900;font-size:18px;line-height:1;">×</button>' +
      "</div>";

    var meta =
      '<div style="padding:14px 18px;border-bottom:1px solid #243a58;display:flex;gap:12;flex-wrap:wrap;">' +
      '<div style="background:#0f172a;border:1px solid #243a58;border-radius:12px;padding:12px 14px;min-width:190px">' +
      '<div style="font-size:11px;opacity:.75;letter-spacing:.06em;text-transform:uppercase;font-weight:900;">UNIDAD</div>' +
      '<div style="font-size:18px;font-weight:900;margin-top:4;">' +
      escapeHtml((apu && apu.unidad) || "unidad") +
      "</div>" +
      "</div>" +
      '<div style="background:#0f172a;border:1px solid #243a58;border-radius:12px;padding:12px 14px;min-width:190px">' +
      '<div style="font-size:11px;opacity:.75;letter-spacing:.06em;text-transform:uppercase;font-weight:900;">PRECIO NETO</div>' +
      '<div style="font-size:18px;font-weight:900;color:#f5a020;margin-top:4;">' +
      money(r.precioFinal) +
      "</div>" +
      "</div>" +
      '<div style="background:#0f172a;border:1px solid #243a58;border-radius:12px;padding:12px 14px;min-width:190px">' +
      '<div style="font-size:11px;opacity:.75;letter-spacing:.06em;text-transform:uppercase;font-weight:900;">CON IVA</div>' +
      '<div style="font-size:18px;font-weight:900;color:#34d399;margin-top:4;">' +
      money(Math.round((Number(r.precioFinal) || 0) * 1.19)) +
      "</div>" +
      "</div>" +
      "</div>";

    var table =
      '<div style="padding:14px 18px 18px 18px;">' +
      '<div style="font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:rgba(255,255,255,.65);font-weight:900;margin-bottom:10px;">INSUMOS</div>' +
      '<div style="border:1px solid #243a58;border-radius:12px;overflow:hidden;background:#0f172a;">' +
      '<div style="padding:12px 14px;background:#152236;border-bottom:1px solid #243a58;font-weight:900;font-size:18px;">' +
      escapeHtml((apu && apu.nombre) || "APU") +
      "</div>" +
      '<div style="padding:8px 14px;border-bottom:1px solid #243a58;color:rgba(255,255,255,.65);font-size:12px;">' +
      escapeHtml(String((apu && (apu.categoria || apu.tipo || "—")) || "—") + " · " + String((apu && apu.unidad) || "unidad")) +
      "</div>" +
      '<table style="width:100%;border-collapse:collapse;">' +
      "<thead>" +
      "<tr>" +
      '<th style="padding:7px 8px;text-align:left;border-bottom:1px solid #243a58;color:rgba(255,255,255,.65);font-size:11px;">#</th>' +
      '<th style="padding:7px 8px;text-align:left;border-bottom:1px solid #243a58;color:rgba(255,255,255,.65);font-size:11px;">Material</th>' +
      '<th style="padding:7px 8px;text-align:right;border-bottom:1px solid #243a58;color:rgba(255,255,255,.65);font-size:11px;">Cant.</th>' +
      '<th style="padding:7px 8px;text-align:left;border-bottom:1px solid #243a58;color:rgba(255,255,255,.65);font-size:11px;">Unidad</th>' +
      '<th style="padding:7px 8px;text-align:right;border-bottom:1px solid #243a58;color:rgba(255,255,255,.65);font-size:11px;">P.Unit.</th>' +
      '<th style="padding:7px 8px;text-align:right;border-bottom:1px solid #243a58;color:rgba(255,255,255,.65);font-size:11px;">Subtotal</th>' +
      "</tr>" +
      "</thead>" +
      "<tbody>" +
      rows +
      "</tbody>" +
      "</table>" +
      '<div style="padding:9px 12px;border-top:1px solid #243a58;background:#152236;display:flex;justify-content:space-between;align-items:center;font-size:12px;">' +
      '<div style="color:rgba(255,255,255,.65);">Total materiales</div>' +
      '<div style="color:#34d399;font-weight:900;">' +
      money(total) +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>";

    var card = ensureModal();
    card.innerHTML = header + meta + table;

    var closeBtn = document.getElementById("__ecp_apu_detail_close");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        var el = document.getElementById("__ecp_apu_detail_modal");
        if (el) el.remove();
      });
    }
  }

  function cleanApuNameFromCell(td) {
    var raw = String((td && td.textContent) || "");
    raw = raw.replace(/\s+/g, " ").trim();
    if (!raw) return "";
    raw = raw.replace(/^⚠️\s*Sin partida\s*/i, "").trim();
    raw = raw.replace(/\bSUB\b/g, "").trim();
    return raw;
  }

  function pickApuFromRow(tr) {
    var tds = tr.querySelectorAll("td");
    if (!tds || tds.length < 4) return null;
    var name = cleanApuNameFromCell(tds[0]);
    var unidad = String(tds[2] && tds[2].textContent ? tds[2].textContent : "").trim();
    if (!name || !unidad) return null;

    var apus = readJson("enlace_constructor_pro_v1_apus", []);
    if (!Array.isArray(apus)) return null;

    var nn = norm(name);
    var un = norm(unidad);
    var best = null;
    for (var i = 0; i < apus.length; i++) {
      var a = apus[i] || {};
      if (norm(a.nombre) !== nn) continue;
      if (norm(a.unidad) !== un) continue;
      best = a;
      break;
    }
    if (best) return best;

    for (var j = 0; j < apus.length; j++) {
      var b = apus[j] || {};
      if (norm(b.nombre) === nn) return b;
    }
    return null;
  }

  document.addEventListener(
    "click",
    function (ev) {
      try {
        if (!ENABLE_MODAL) return;
        var t = ev.target;
        if (!t || (t.closest && t.closest("button"))) return;
        var tr = t.closest ? t.closest("tr") : null;
        if (!tr) return;

        var tds = tr.querySelectorAll("td");
        if (!tds || tds.length < 4) return;

        var btns = tr.querySelectorAll("button");
        if (!btns || btns.length === 0) return;
        var looksLikeApuRow = false;
        for (var i = 0; i < btns.length; i++) {
          var tx = String(btns[i] && btns[i].textContent ? btns[i].textContent : "");
          if (tx.indexOf("⧉") !== -1 || tx.indexOf("🔒") !== -1 || tx.indexOf("🔓") !== -1) {
            looksLikeApuRow = true;
            break;
          }
        }
        if (!looksLikeApuRow) return;

        var apu = pickApuFromRow(tr);
        if (!apu) return;

        ev.preventDefault();
        if (typeof ev.stopImmediatePropagation === "function") ev.stopImmediatePropagation();
        ev.stopPropagation();
        renderApuDetail(apu);
      } catch (e) {}
    },
    true
  );

  (function () {
    var tries = 0;
    var int = setInterval(function () {
      tries++;
      if (tries > 240) clearInterval(int);
      try {
        var spans = document.querySelectorAll("button span");
        for (var i = 0; i < spans.length; i++) {
          var s = spans[i];
          if (!s) continue;
          var txt = String(s.textContent || "");
          if (txt.indexOf("APU") !== -1 && txt.indexOf("Actualización") !== -1) {
            s.textContent = "APU";
          }
        }
      } catch (e) {}
    }, 500);
  })();
})();
