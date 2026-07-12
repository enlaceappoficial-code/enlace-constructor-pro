(function () {
  if (window.__ecpMaterialesTabsSetup) return;
  window.__ecpMaterialesTabsSetup = true;

  function ensureStyle() {
    var id = "__ecp_materiales_tabs_style";
    if (document.getElementById(id)) return;
    var st = document.createElement("style");
    st.id = id;
    st.textContent =
      ".ecp-mat-tab{display:flex;align-items:center;gap:8px;padding:8px 14px;border-radius:12px;border:1px solid var(--border);background:var(--dark-surface2);color:var(--mutedL);font-weight:800;font-size:13px;cursor:pointer;transition:background .12s,border-color .12s,color .12s,transform .06s;}" +
      ".ecp-mat-tab:hover{background:var(--hover);}" +
      ".ecp-mat-tab:active{transform:translateY(1px);}" +
      ".ecp-mat-tab.ecp-active{background:linear-gradient(135deg,var(--sb),#0f2a52);border-color:rgba(245,160,32,.45);color:#fff;}" +
      ".ecp-mat-tab.ecp-active .ecp-mat-dot{background:#f5a020;}" +
      ".ecp-mat-dot{width:8px;height:8px;border-radius:999px;background:rgba(255,255,255,.25);flex-shrink:0;}";
    document.head.appendChild(st);
  }

  function getActiveId() {
    var txt = document.body ? document.body.textContent || "" : "";
    if (txt.indexOf("📡 Actualización de Precios") !== -1) return "actualizacion";
    if (txt.indexOf("Indicadores económicos actuales") !== -1) return "actualizacion";
    if (txt.indexOf("Panel de actualización") !== -1) return "actualizacion";
    if (txt.indexOf("Resumen de materiales") !== -1) return "materiales";
    return null;
  }

  function setupOnce() {
    ensureStyle();

    var buttons = Array.prototype.slice.call(document.querySelectorAll("button"));
    var baseBtn = null;
    var updBtn = null;
    for (var i = 0; i < buttons.length; i++) {
      var b = buttons[i];
      var t = String(b && b.textContent ? b.textContent : "").replace(/\s+/g, " ").trim();
      if (!t) continue;
      if (t.indexOf("Base de Materiales") !== -1) baseBtn = b;
      if (t.indexOf("Actualización de Precios") !== -1) updBtn = b;
    }

    if (!baseBtn || !updBtn) return false;

    [baseBtn, updBtn].forEach(function (b) {
      if (b.dataset && b.dataset.ecpMatTab === "1") return;
      if (b.dataset) b.dataset.ecpMatTab = "1";
      b.classList.add("ecp-mat-tab");
      if (!b.querySelector(".ecp-mat-dot")) {
        var dot = document.createElement("span");
        dot.className = "ecp-mat-dot";
        b.insertBefore(dot, b.firstChild);
      }
    });

    var active = getActiveId();
    baseBtn.classList.toggle("ecp-active", active === "materiales");
    updBtn.classList.toggle("ecp-active", active === "actualizacion");
    return true;
  }

  var tries = 0;
  var int = setInterval(function () {
    tries++;
    setupOnce();
    if (tries > 240) clearInterval(int);
  }, 400);
})();

