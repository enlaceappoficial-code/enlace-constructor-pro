# Revisión visual — Unificación de mínimos comerciales (branch `feature/minimos-comerciales`)

Instrucciones para revisar manualmente, en `localhost:8080`, que el cálculo de presupuestos con mínimos comerciales y cargos complementarios es **idéntico** en editor, resumen, PDF, Excel, WhatsApp y contrato, y que no se duplican cargos complementarios cuando ya existe una partida equivalente en el presupuesto.

Arrancar el servidor estático:

```bash
node scripts/serve_src_static.js
```

Abrir `http://localhost:8080`. Si el catálogo local está desactualizado (partidas sin los campos de reglas comerciales), limpiar `localStorage` una vez desde la consola del navegador y recargar:

```js
localStorage.clear(); location.reload();
```

## 1. Configuración → Costos

Ir a **Configuración → Costos** y bajar hasta la tarjeta **"🧮 Mínimos comerciales y costos complementarios"**. Verificar que el interruptor esté en **"Activado"** y que los 4 valores base sean: Movilización $15.000, Visita técnica $25.000, Jornada mínima $45.000, Altura base incluida 2,4 m. Si estuviera desactivado, nada de lo siguiente se sugiere — hay que activarlo primero.

## 2. Partidas de Obra → reglas comerciales

Ir a **Partidas de Obra**, buscar "Visita Técnica / Diagnóstico" (id 310) y pulsar el ícono ✏️. Expandir **"Reglas comerciales (opcional)"** y confirmar que "Requiere movilización" está marcado — esta partida ahora además declara internamente `satisfaceCargoComercial: ["visita_tecnica"]` (no visible en el formulario, es el campo que evita la sugerencia duplicada del paso 6). Repetir la revisión para "Pintura muros interiores" (id 1, requiere movilización), "Reparación filtración techumbre" (id 311, precio mínimo $60.000 + visita técnica + altura + retiro de residuos) y "Limpieza y destape de canaletas" (id 312, cantidad mínima 10 ml + trabajo en altura). Ver [REGLAS_COMERCIALES_PRUEBA.md](REGLAS_COMERCIALES_PRUEBA.md) para el detalle completo.

## 3. Nuevo Presupuesto → agregar Visita Técnica

Crear un presupuesto nuevo, elegir un cliente y buscar "Visita Técnica" en el catálogo. Al agregarla debe aparecer el modal **"Costos complementarios sugeridos"** con "Movilización — $15.000". Aceptar. Deben quedar 2 líneas: Visita Técnica $82.000 y Movilización $15.000.

## 4. Agregar Pintura Interior

Buscar "Pintura muros interiores" y agregarla (usar la calculadora de dimensiones, p. ej. 5×4 = 20 m²). **No debe aparecer** el modal de costos sugeridos — la partida también requiere movilización, pero ya fue aceptada en el paso 3 (identificador estable `_tipoCargoComercial`, no coincidencia de texto). Total esperado de la línea: 20 × $5.500 = **$110.000**.

## 5. Agregar Canaleta con cantidad 1

Buscar "canaletas" (Limpieza y destape de canaletas y bajantes) y agregarla con cantidad **1 ml**. Debe aparecer el modal sugiriendo "Trabajo en altura — $45.000"; aceptar. En la tabla de ítems, el campo **Cant.** (editable) debe seguir mostrando **1** — la cantidad tal como la ingresó el usuario nunca se sobrescribe — y la columna **Total** debe ser **$25.000** (10 × $2.500, el mínimo comercial aplicado). En el panel **Resumen** debe verse la nota: *"⚠ Cantidad solicitada: 1 ml · Mínimo comercial facturable: 10 ml."*

## 6. Agregar Reparación de Filtración — verificación de deduplicación

Buscar "filtración" (Reparación filtración techumbre) y agregarla con cantidad 1. Esta partida requiere visita técnica, trabajo en altura y retiro de residuos, pero el modal de sugerencias debe mostrar **solo "Retiro de residuos — $45.000"**:

- **NO** debe sugerir "Trabajo en altura" (ya fue aceptado en el paso 5).
- **NO** debe sugerir "Visita técnica" (la partida "Visita Técnica / Diagnóstico" agregada en el paso 3 ya la satisface — esta es la corrección central de esta fase; antes aparecían simultáneamente "Visita Técnica / Diagnóstico $82.000" y "Visita técnica $25.000" como cargos duplicados).

Aceptar "Retiro de residuos" y usar el precio estándar ($45.000). La fila debe mostrar **Total $60.000** (el precio mínimo del servicio, no $45.000), con la nota: *"Valor calculado: $45.000 · Precio mínimo del servicio aplicado: $60.000."*

## 7. Aceptar, editar y omitir cargos

Probar el botón **"Omitir"** en cualquier sugerencia — el cargo no debe agregarse, y debe volver a sugerirse si se agrega otra partida que lo requiera. Editar la descripción de un cargo ya aceptado (p. ej. cambiar "Movilización" por "Traslado de personal") y confirmar que, al agregar otra partida que también requiera movilización, **no** se vuelve a sugerir (el identificador interno `_tipoCargoComercial` no se pierde al renombrar). Eliminar un cargo complementario (botón ×) y confirmar que, al agregar otra partida que lo requiera, **sí** vuelve a sugerirse.

## 7bis. Advertencia en presupuestos antiguos con duplicados

Si abres (Editar) un presupuesto guardado con la versión anterior — con "Visita Técnica / Diagnóstico" y el cargo "Visita técnica" al mismo tiempo — debe aparecer un aviso: *"⚠️ Este presupuesto tiene cargos complementarios duplicados con partidas equivalentes: Visita técnica. Revísalos antes de enviarlo (no se eliminaron automáticamente)."* Los cargos duplicados **no se eliminan solos** — hay que quitarlos manualmente si corresponde.

## 8. Guardar y reabrir

Completar **Descripción de la obra** (campo obligatorio) y pulsar **Guardar**. Con los 7 ítems de prueba (Visita Técnica, Movilización, Pintura 20 m², Canaleta, Trabajo en altura, Reparación filtración, Retiro de residuos — sin el cargo duplicado de Visita técnica): **Subtotal $382.000 · IVA (19%) $72.580 · Total $454.580 · Anticipo (60%) $272.748**. Reabrir el presupuesto (Editar) y confirmar que los mismos valores persisten exactamente, y que el campo Cant. de la canaleta sigue mostrando 1.

## 9. Vista Previa

Pulsar **"Ver"** sobre el presupuesto. En la tabla debe verse: la fila de canaletas con **Cant. 1** (no 10) y debajo la nota *"Cantidad solicitada: 1 ml · Mínimo comercial facturable: 10 ml."*; la fila de reparación de filtración con **Total $60.000** y la nota *"Valor calculado: $45.000 · Precio mínimo del servicio aplicado: $60.000."*. No debe existir una fila "Visita técnica" adicional. El subtotal al pie debe ser $382.000.

## 10. PDF

Pulsar **"⬇ PDF Simple"**. La fila de canaletas debe mostrar cantidad **1**, no 10; el total de esa línea sigue siendo $25.000. La explicación del mínimo se imprime como una segunda línea de texto en cursiva bajo la descripción de la partida (no solo un asterisco) — debe leerse el texto completo "Cantidad solicitada: 1 ml · Mínimo comercial facturable: 10 ml." tanto para la canaleta como "Valor calculado: $45.000 · Precio mínimo del servicio aplicado: $60.000." para la reparación de filtración.

## 11. Excel

Pulsar **"📊 Excel"**. Para la fila de canaletas: cantidad **1**, total **$25.000**, con una fila adicional inmediatamente debajo mostrando `» Cantidad solicitada: 1 ml · Mínimo comercial facturable: 10 ml.`; para reparación de filtración, cantidad 1, total **$60.000** con su propia fila de nota. La suma de la columna Total (sin contar las filas de nota) debe dar $382.000.

## 12. WhatsApp

Pulsar **"📲 WhatsApp"**. El mensaje no debe incluir una línea "Visita técnica" además de "Visita Técnica / Diagnóstico". Cada partida con mínimo aplicado debe mostrar su monto forzado seguido de la explicación entre paréntesis, p. ej. `▫️ Limpieza y destape de canaletas y bajantes — $25.000 _(Cantidad solicitada: 1 ml · Mínimo comercial facturable: 10 ml.)_`. El total final debe coincidir con $454.580 y el anticipo con $272.748.

## 13. Contrato

Pulsar **"📄 Contrato"**. La tabla de partidas debe mostrar cantidad 1 para canaletas (total $25.000) y cantidad 1 para reparación de filtración (total $60.000), con la nota de cada mínimo impresa como una línea pequeña bajo la descripción de la partida dentro de la misma celda de la tabla — no solo en el resumen al pie. El monto total del contrato debe ser $454.580.

*(Nota de entorno: en este navegador de prueba sandboxed, `window.open()` para abrir la pestaña del Contrato o del PDF puede resultar bloqueado por la política de pop-ups — no afecta el cálculo, que se genera correctamente antes de intentar abrir la pestaña. En un navegador de escritorio normal o en la app Tauri esto no ocurre.)*

---

## Resultado esperado en todos los pasos 8-13

| Concepto | Valor |
|---|---|
| Subtotal | $382.000 |
| IVA (19%) | $72.580 |
| Total | $454.580 |
| Anticipo (60%) | $272.748 |

Si alguno de estos 6 lugares (editor/resumen, guardado, vista previa, PDF, Excel, WhatsApp, contrato) muestra un valor distinto, hay una regresión — todos calculan a través de la misma función `calcularLineaPresupuesto()` (`src/assets/index.js`, junto a `Ee`), así que una discrepancia indicaría que alguna llamada quedó sin actualizar.
