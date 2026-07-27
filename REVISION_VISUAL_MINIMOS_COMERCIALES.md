# Revisión visual — Unificación de mínimos comerciales (branch `feature/minimos-comerciales`)

Instrucciones para revisar manualmente, en `localhost:8080`, que el cálculo de presupuestos con mínimos comerciales y cargos complementarios es **idéntico** en editor, resumen, PDF, Excel, WhatsApp y contrato.

Arrancar el servidor estático:

```bash
node scripts/serve_src_static.js
```

Abrir `http://localhost:8080`. Si el catálogo local está desactualizado (partidas sin los campos de reglas comerciales), limpiar `localStorage` una vez desde la consola del navegador y recargar:

```js
localStorage.clear(); location.reload();
```

## 1. Configuración → Costos

Ir a **Configuración → Costos** y bajar hasta la tarjeta **"🧮 Mínimos comerciales y costos complementarios"**. Verificar que el interruptor esté en **"Activado"** (en los datos de demostración ya viene activo) y que los 4 valores base sean: Movilización $15.000, Visita técnica $25.000, Jornada mínima $45.000, Altura base incluida 2,4 m. Si estuviera desactivado, nada de lo siguiente se sugiere — hay que activarlo primero.

## 2. Partidas de Obra → reglas comerciales

Ir a **Partidas de Obra**, buscar "Pintura muros interiores" (id 1) y pulsar el ícono ✏️. Expandir **"Reglas comerciales (opcional)"** y confirmar que "Requiere movilización" está marcado. Repetir para "Visita Técnica / Diagnóstico" (id 310, requiere movilización), "Reparación filtración techumbre" (id 311, precio mínimo $60.000 + visita técnica + altura + retiro de residuos) y "Limpieza y destape de canaletas" (id 312, cantidad mínima 10 ml + trabajo en altura). Ver [REGLAS_COMERCIALES_PRUEBA.md](REGLAS_COMERCIALES_PRUEBA.md) para el detalle completo de estas 4 partidas de prueba.

## 3. Nuevo Presupuesto → agregar Visita Técnica

Crear un presupuesto nuevo, elegir un cliente y buscar "Visita Técnica" en el catálogo. Al agregarla debe aparecer el modal **"Costos complementarios sugeridos"** con "Movilización — $15.000". Aceptar. Deben quedar 2 líneas: Visita Técnica $82.000 y Movilización $15.000.

## 4. Agregar Pintura Interior

Buscar "Pintura muros interiores" y agregarla (usar la calculadora de dimensiones, p. ej. 5×4 = 20 m²). **No debe aparecer** el modal de costos sugeridos — la partida también requiere movilización, pero ya fue aceptada en el paso 3 (esto valida la deduplicación por identificador estable `_cargoComplementario`, no por texto). Total esperado de la línea: 20 × $5.500 = **$110.000**.

## 5. Agregar Canaleta con cantidad 1

Buscar "canaletas" (Limpieza y destape de canaletas y bajantes) y agregarla con cantidad **1 ml**. Debe aparecer el modal sugiriendo "Trabajo en altura — $45.000"; aceptar. En la fila de la tabla de ítems, la columna **Cant.** debe mostrar **10** (la cantidad mínima facturable, no el 1 ingresado) y el **Total** debe ser **$25.000** (10 × $2.500). En el panel **Resumen**, debe verse la nota amarilla: *"⚠ Cantidad ingresada: 1 ml · Mínimo facturable: 10 ml"*.

## 6. Agregar Reparación de Filtración

Buscar "filtración" (Reparación filtración techumbre) y agregarla con cantidad 1. Debe aparecer el modal sugiriendo **"Visita técnica — $25.000"** y **"Retiro de residuos — $45.000"** — pero **NO** "Trabajo en altura" (ya fue aceptado en el paso 5, confirma deduplicación entre partidas distintas). Aceptar ambos. Usar el precio estándar ($45.000). La fila debe mostrar **Total $60.000** (el precio mínimo de partida, no $45.000), con la nota: *"Valor calculado: $45.000 · Precio mínimo aplicado: $60.000"*.

## 7. Aceptar, editar y omitir cargos

Repetir el paso 5 o 6 con otra partida que dispare una sugerencia nueva y probar el botón **"Omitir"** — el cargo no debe agregarse, y debe volver a sugerirse si se agrega otra partida que lo requiera. Editar la descripción de un cargo ya aceptado (p. ej. cambiar "Movilización" por "Traslado de personal") y confirmar que, al agregar otra partida que también requiera movilización, **no** se vuelve a sugerir (el identificador interno `_cargoComplementario` no se pierde al renombrar).

## 8. Guardar y reabrir

Completar **Descripción de la obra** (campo obligatorio) y pulsar **Guardar**. Verificar en el listado "Mis Presupuestos" que Subtotal / IVA / Total coinciden con lo visto en el Resumen del editor. Con los 4 ítems de prueba (Visita Técnica, Movilización, Pintura 20 m², Canaleta, Trabajo en altura, Reparación, Visita técnica, Retiro de residuos): **Subtotal $407.000 · IVA (19%) $77.330 · Total $484.330**. Reabrir el presupuesto (Editar) y confirmar que los mismos valores persisten exactamente.

## 9. Vista Previa

Pulsar **"Ver"** sobre el presupuesto. En la tabla debe verse: la fila de canaletas con **Cant. 10** y debajo la nota *"Cantidad ingresada: 1 ml · Mínimo facturable: 10 ml"*; la fila de reparación de filtración con **Total $60.000** y la nota *"Valor calculado: $45.000 · Precio mínimo aplicado: $60.000"*. El subtotal al pie debe seguir siendo $407.000.

## 10. PDF

Pulsar **"⬇ PDF Simple"**. El PDF debe descargarse sin errores en consola. La fila de canaletas debe mostrar cantidad **10**, no 1; la fila de reparación de filtración debe mostrar total **$60.000**. Las descripciones de ambas partidas llevan un asterisco (`*`) al final como marca de que se aplicó un mínimo.

## 11. Excel

Pulsar **"📊 Excel"**. El archivo exportado debe traer, para la fila de canaletas, cantidad **10** y total **$25.000**, con una fila adicional debajo mostrando la nota `» Cantidad ingresada: 1 ml · Mínimo facturable: 10 ml`; para reparación de filtración, total **$60.000** con su propia fila de nota. La suma de la columna Total (sin contar las filas de nota) debe dar $407.000.

## 12. WhatsApp

Pulsar **"📲 WhatsApp"**. El mensaje generado debe listar cada partida con su monto **ya forzado al mínimo** (p. ej. "▫️ Reparación filtración techumbre (parche/tapagoteras) — $60.000 _(Valor calculado: $45.000 · Precio mínimo aplicado: $60.000)_") y el total final debe coincidir con $484.330. *(Nota: en este entorno de prueba sandboxed, el navegador puede bloquear la apertura de la pestaña de WhatsApp — el mensaje se genera igualmente y puede copiarse con el botón de portapapeles).*

## 13. Contrato

Pulsar **"📄 Contrato"**. El documento debe abrir en una pestaña nueva con la tabla de partidas mostrando cantidad 10 para canaletas y total $60.000 para la reparación de filtración, además de una nota amarilla bajo la tabla listando ambas observaciones de mínimos aplicados. El monto total del contrato debe ser $484.330. *(Nota: igual que el PDF y WhatsApp, algunos navegadores con bloqueo estricto de pop-ups pueden impedir la apertura de la pestaña — no es un problema del cálculo, ya que el HTML se genera correctamente antes de intentar abrirla).*

---

## Resultado esperado en todos los pasos 8-13

| Concepto | Valor |
|---|---|
| Subtotal | $407.000 |
| IVA (19%) | $77.330 |
| Total | $484.330 |

Si alguno de estos 6 lugares (editor/resumen, guardado, vista previa, PDF, Excel, WhatsApp, contrato) muestra un valor distinto, hay una regresión — todos calculan a través de la misma función `calcularLineaPresupuesto()` (`src/assets/index.js`, junto a `Ee`), así que una discrepancia indicaría que alguna llamada quedó sin actualizar.
