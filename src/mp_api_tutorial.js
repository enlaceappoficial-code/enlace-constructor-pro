(function () {
  if (window.__ecpMpApiTutorialSetup) return;
  window.__ecpMpApiTutorialSetup = true;

  function norm(s) {
    return String(s == null ? "" : s).replace(/\s+/g, " ").trim();
  }

  function setTextExact(oldText, newText) {
    var nodes = document.querySelectorAll("div,span,label");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (!el) continue;
      var t = norm(el.textContent || "");
      if (t === oldText) {
        el.textContent = newText;
        return true;
      }
    }
    return false;
  }

  function updatePlaceholder() {
    var inputs = document.querySelectorAll("input");
    for (var i = 0; i < inputs.length; i++) {
      var inp = inputs[i];
      var ph = norm(inp.getAttribute("placeholder") || "");
      if (!ph) continue;
      if (ph.indexOf("Pega aquí tu ticket") !== -1 && ph.indexOf("ticket") !== -1) {
        inp.setAttribute("placeholder", "Pega aquí tu ticket cuando llegue al correo registrado en ChileCompra (Clave Única)");
        return true;
      }
    }
    return false;
  }

  function updateIntroText() {
    var divs = document.querySelectorAll("div");
    for (var i = 0; i < divs.length; i++) {
      var d = divs[i];
      if (!d) continue;
      var t = norm(d.textContent || "");
      if (t.indexOf("ticket de acceso de Mercado Público") !== -1 && t.indexOf("importación automática") !== -1) {
        d.innerHTML =
          'Cuando recibas el <strong style="color:rgba(255,255,255,.92)">ticket de acceso de Mercado Público</strong> (ChileCompra), pégalo aquí. Esto habilita la búsqueda de licitaciones en tiempo real y la importación automática de datos desde la API oficial.';
        return true;
      }
    }
    return false;
  }

  function updateTutorialBox() {
    var changed = false;
    changed = setTextExact("📋 Cómo obtener tu ticket en 5 minutos", "📋 Cómo obtener tu ticket (ChileCompra)") || changed;

    changed = setTextExact("Inicia sesión en Mercado Público", "Entra al portal oficial de la API") || changed;
    changed =
      setTextExact("Entra a mercadopublico.cl con el RUT y clave de tu empresa. Debes estar registrado como proveedor.", "Abre: https://www.chilecompra.cl/api/") || changed;

    changed = setTextExact("Ve al portal de la API", "Obtén tu ticket con Clave Única") || changed;
    changed =
      setTextExact(
        "En tu navegador abre: api.mercadopublico.cl y busca la opción de contacto o solicitud de acceso.",
        "Selecciona “Pide tu ticket”, inicia sesión con Clave Única y acepta los términos de uso."
      ) || changed;

    changed = setTextExact("Completa el formulario", "Revisa tu correo") || changed;
    changed =
      setTextExact(
        "Ingresa tu nombre, RUT, email y en el campo 'Motivo' selecciona la opción de solicitar acceso. En el mensaje escribe: 'Solicito ticket API para integrar búsqueda de licitaciones en sistema de gestión de obras propio'.",
        "El ticket se envía al correo electrónico registrado en ChileCompra (Clave Única)."
      ) || changed;

    changed = setTextExact("Espera el email", "Copia tu ticket") || changed;
    changed =
      setTextExact(
        "En 1-3 días hábiles recibirás un email con tu ticket. El formato es una clave larga tipo: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        "Copia el ticket recibido en tu correo."
      ) || changed;

    changed = setTextExact("Pégalo aquí y guarda", "Pégalo aquí y guarda") || changed;
    changed =
      setTextExact(
        "Copia el ticket del email, pégalo en el campo de arriba y haz clic en Guardar. ¡Listo!",
        "Pega el ticket en el campo de arriba y haz clic en Guardar."
      ) || changed;

    changed =
      setTextExact(
        "💡 ¿Por qué necesitas tu propio ticket? La API de Mercado Público es gratuita pero se otorga por empresa. Tener el tuyo propio garantiza que las búsquedas sean exclusivas para tu negocio, sin límites compartidos con otros usuarios.",
        "💡 Dato clave: ChileCompra indicó que Mercado Público no crea credenciales (usuario/contraseña) para la API. El acceso se realiza solicitando un ticket en https://www.chilecompra.cl/api/ con Clave Única."
      ) || changed;

    return changed;
  }

  var tries = 0;
  var int = setInterval(function () {
    tries++;
    updatePlaceholder();
    updateTutorialBox();
    updateIntroText();
    if (tries > 240) clearInterval(int);
  }, 400);
})();
