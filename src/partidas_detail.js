(function () {
  if (window.__ecpPartidasDetailSetup) return;
  window.__ecpPartidasDetailSetup = true;

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

  function ensureModal() {
    var existing = document.getElementById("__ecp_partida_detail_modal");
    if (existing) existing.remove();

    var overlay = document.createElement("div");
    overlay.id = "__ecp_partida_detail_modal";
    overlay.style.cssText =
      "position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:999999;display:flex;align-items:center;justify-content:center;padding:18px;";
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) overlay.remove();
    });

    var card = document.createElement("div");
    card.style.cssText =
      "width:100%;max-width:1100px;max-height:90vh;overflow:auto;border-radius:14px;background:#0b1220;border:1px solid #243a58;color:#dde4f0;box-shadow:0 18px 60px rgba(0,0,0,.65);";

    overlay.appendChild(card);
    document.body.appendChild(overlay);
    return card;
  }

  function renderPartidaDetail(cat) {
    var apus = readJson("enlace_constructor_pro_v1_apus", []);
    var mats = readJson("enlace_constructor_pro_v1_materiales", []);
    var matById = {};
    for (var i = 0; i < mats.length; i++) matById[parseInt(mats[i] && mats[i].id)] = mats[i] || {};

    var linked = apus.filter(function (a) {
      return parseInt(a && a.catalogId) === parseInt(cat && cat.id);
    });

    var card = ensureModal();

    var header =
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:12;padding:14px 16px;background:#1a3a5c;border-bottom:1px solid #243a58;position:sticky;top:0;z-index:2;">' +
      '<div style="min-width:0">' +
      '<div style="font-size:14px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' +
      escapeHtml(cat.cat || "Partida") +
      "</div>" +
      '<div style="font-size:13px;color:rgba(255,255,255,.85);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' +
      escapeHtml(cat.desc || "") +
      "</div>" +
      "</div>" +
      '<button id="__ecp_partida_detail_close" style="background:transparent;border:1px solid rgba(255,255,255,.25);color:#fff;border-radius:10px;padding:6px 10px;cursor:pointer;font-weight:800;">✕</button>' +
      "</div>";

    var meta =
      '<div style="padding:14px 16px;border-bottom:1px solid #243a58;display:flex;gap:16;flex-wrap:wrap;">' +
      '<div style="background:#0f172a;border:1px solid #243a58;border-radius:10px;padding:10px 12px;min-width:220px">' +
      '<div style="font-size:11px;opacity:.75;letter-spacing:.06em;text-transform:uppercase;">Unidad</div>' +
      '<div style="font-size:16px;font-weight:900;">' +
      escapeHtml(cat.unidad || "unidad") +
      "</div>" +
      "</div>" +
      '<div style="background:#0f172a;border:1px solid #243a58;border-radius:10px;padding:10px 12px;min-width:220px">' +
      '<div style="font-size:11px;opacity:.75;letter-spacing:.06em;text-transform:uppercase;">Precio neto</div>' +
      '<div style="font-size:16px;font-weight:900;color:#f5a020;">' +
      money(cat.precio) +
      "</div>" +
      "</div>" +
      '<div style="background:#0f172a;border:1px solid #243a58;border-radius:10px;padding:10px 12px;min-width:220px">' +
      '<div style="font-size:11px;opacity:.75;letter-spacing:.06em;text-transform:uppercase;">Con IVA</div>' +
      '<div style="font-size:16px;font-weight:900;color:#34d399;">' +
      money(Math.round((Number(cat.precio) || 0) * 1.19)) +
      "</div>" +
      "</div>" +
      "</div>";

    var apuTitle =
      '<div style="padding:14px 16px 0 16px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:rgba(255,255,255,.65);font-weight:900;">APUs vinculadas</div>';

    var apuCards = "";
    if (!linked.length) {
      apuCards =
        '<div style="padding:10px 16px 18px 16px;color:rgba(255,255,255,.7);font-size:13px;">Sin APUs vinculadas a esta Partida.</div>';
    } else {
      var gridStart =
        '<div style="padding:12px 16px 18px 16px;display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:12;">';
      var gridEnd = "</div>";
      var out = "";
      for (var a = 0; a < linked.length; a++) {
        var ap = linked[a] || {};
        var lines = Array.isArray(ap.materiales) ? ap.materiales : [];
        var total = 0;
        var rows = "";
        for (var r = 0; r < lines.length; r++) {
          var ln = lines[r] || {};
          var m = matById[parseInt(ln.materialId)] || {};
          var q = Number(ln.cantidad) || 0;
          var pr = Number(m.precio) || 0;
          var st = q * pr;
          total += st;
          rows +=
            "<tr>" +
            '<td style="padding:7px 8px;border-bottom:1px solid #243a58;color:rgba(255,255,255,.55);font-size:12px;width:24px;">' +
            (r + 1) +
            "</td>" +
            '<td style="padding:7px 8px;border-bottom:1px solid #243a58;color:#dde4f0;font-size:12px;">' +
            escapeHtml(m.nombre || "Material " + String(ln.materialId || "")) +
            "</td>" +
            '<td style="padding:7px 8px;border-bottom:1px solid #243a58;color:#dde4f0;font-size:12px;text-align:right;width:78px;">' +
            q +
            "</td>" +
            '<td style="padding:7px 8px;border-bottom:1px solid #243a58;color:rgba(255,255,255,.55);font-size:12px;width:78px;">' +
            escapeHtml(m.unidad || "unidad") +
            "</td>" +
            '<td style="padding:7px 8px;border-bottom:1px solid #243a58;color:#dde4f0;font-size:12px;text-align:right;width:92px;">' +
            money(pr) +
            "</td>" +
            '<td style="padding:7px 8px;border-bottom:1px solid #243a58;color:#f5a020;font-size:12px;text-align:right;font-weight:900;width:102px;">' +
            money(st) +
            "</td>" +
            "</tr>";
        }
        if (!rows) {
          rows =
            '<tr><td colspan="6" style="padding:10px 8px;color:rgba(255,255,255,.6);font-size:12px;">Sin materiales</td></tr>';
        }
        out +=
          '<div style="border:1px solid #243a58;border-radius:12px;overflow:hidden;background:#0f172a;">' +
          '<div style="padding:10px 12px;background:#152236;border-bottom:1px solid #243a58;font-weight:900;">' +
          escapeHtml(ap.nombre || "APU") +
          "</div>" +
          '<div style="padding:8px 12px;border-bottom:1px solid #243a58;color:rgba(255,255,255,.65);font-size:12px;">' +
          escapeHtml((ap.categoria || ap.tipo || "—") + " · " + (ap.unidad || "unidad")) +
          "</div>" +
          '<div style="padding:10px 12px;">' +
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
          "</div>" +
          '<div style="padding:9px 12px;border-top:1px solid #243a58;background:#152236;display:flex;justify-content:space-between;align-items:center;font-size:12px;">' +
          '<div style="color:rgba(255,255,255,.65);">Total materiales</div>' +
          '<div style="color:#34d399;font-weight:900;">' +
          money(total) +
          "</div>" +
          "</div>" +
          "</div>";
      }
      apuCards = gridStart + out + gridEnd;
    }

    card.innerHTML = header + meta + apuTitle + apuCards;
    var closeBtn = document.getElementById("__ecp_partida_detail_close");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        var el = document.getElementById("__ecp_partida_detail_modal");
        if (el) el.remove();
      });
    }
  }

  function findCatalogItemFromRow(tr) {
    var tds = tr.querySelectorAll("td");
    if (!tds || tds.length < 3) return null;
    var catText = norm(tds[0].textContent || "");
    var descText = norm(tds[1].textContent || "");
    if (!descText) return null;

    var catalog = readJson("enlace_constructor_pro_v1_catalog", []);
    if (!Array.isArray(catalog)) return null;
    if (!catText) return null;
    var catExists = false;
    for (var k = 0; k < catalog.length; k++) {
      if (norm(catalog[k] && catalog[k].cat) === catText) {
        catExists = true;
        break;
      }
    }
    if (!catExists) return null;

    var best = null;
    for (var i = 0; i < catalog.length; i++) {
      var c = catalog[i] || {};
      if (norm(c.desc) !== descText) continue;
      if (!best) best = c;
      if (catText && norm(c.cat) === catText) return c;
    }
    return best;
  }

  document.addEventListener(
    "click",
    function (ev) {
      try {
        var t = ev.target;
        if (!t || t.closest("button")) return;
        var tr = t.closest("tr");
        if (!tr) return;

        var btns = tr.querySelectorAll("button");
        if (!btns || btns.length < 2) return;
        var hasEdit = false;
        var hasDel = false;
        for (var i = 0; i < btns.length; i++) {
          var tx = String(btns[i] && btns[i].textContent ? btns[i].textContent : "");
          if (tx.indexOf("✏") !== -1 || tx.indexOf("✎") !== -1) hasEdit = true;
          if (tx.indexOf("✕") !== -1 || tx.indexOf("🗑") !== -1) hasDel = true;
        }
        if (!hasEdit || !hasDel) return;

        var cat = findCatalogItemFromRow(tr);
        if (!cat) return;

        ev.preventDefault();
        ev.stopPropagation();
        renderPartidaDetail(cat);
      } catch (e) {}
    },
    true
  );

  (function () {
    var tries = 0;
    var int = setInterval(function () {
      tries++;
      if (tries > 120) clearInterval(int);
      try {
        var els = document.querySelectorAll("div");
        for (var i = 0; i < els.length; i++) {
          var el = els[i];
          if (!el) continue;
          if (el.closest && el.closest("#__ecp_partida_detail_modal")) continue;
          if (String(el.textContent || "").trim() === "APUs vinculadas") {
            var box = el.parentElement;
            if (box && box.style) box.style.display = "none";
          }
        }
      } catch (e) {}
    }, 500);
  })();
})();
