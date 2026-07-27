# Reglas comerciales de prueba — catálogo demo

Este documento identifica las **4 partidas del catálogo canónico** (`qi`, `src/assets/index.js`) que fueron modificadas en la fase anterior (`feat: agregar minimos comerciales y costos complementarios`, commit `5467408`) para servir de datos de ejemplo del sistema de "Mínimos comerciales y costos complementarios". Ninguna otra partida del catálogo fue tocada.

La configuración global usada por estas reglas vive en `cfg.minimosComerciales` (plantilla por defecto en `Ct`, línea ~9858 de `src/assets/index.js`):

| Parámetro | Valor por defecto | Uso |
|---|---|---|
| `activo` | `false` | Interruptor maestro. Con `false`, `generarCargosSugeridos()` no sugiere nada (aunque las partidas tengan `requiere*: true`). |
| `movilizacionBase` | `$15.000` | Valor sugerido para el cargo "Movilización". |
| `visitaTecnicaBase` | `$25.000` | Valor sugerido para el cargo "Visita técnica". |
| `jornadaMinima` | `$45.000` | Valor sugerido para "Trabajo en altura" y "Retiro de residuos". |
| `alturaBaseIncluida` | `2.4` m | Solo texto informativo en el motivo del cargo "Trabajo en altura". |

## Partidas modificadas

### 1. Catálogo id `1` — "Pintura muros interiores (2 manos)"
- **Categoría:** Pintura · **Unidad:** m² · **Precio:** $5.500
- **Regla agregada:** `requiereMovilizacion: true`
- **Valor:** No fija monto propio; dispara la sugerencia de cargo "Movilización" por `$15.000` (o el valor vigente en `cfg.minimosComerciales.movilizacionBase`).
- **Justificación:** Partida elegida como ejemplo de "regla simple de un solo flag", sin mínimos de cantidad ni de precio, para probar que el sistema puede sugerir un cargo complementario sin afectar el cálculo de la línea misma.
- **¿Mantener o retirar antes de producción?** **RETIRAR.** Es una partida real y de uso frecuente (pintura de interiores); no todo trabajo de pintura amerita cobrar movilización aparte. Si se deja en producción, generará una sugerencia de cobro extra en la mayoría de los presupuestos que incluyan pintura, lo cual no es la intención de negocio real — fue marcada solo para tener un caso de prueba con `requiereMovilizacion` en una partida de alto uso.

### 2. Catálogo id `310` — "Visita Técnica / Diagnóstico"
- **Categoría:** Servicios Generales · **Unidad:** gl · **Precio:** $82.000
- **Regla agregada:** `requiereMovilizacion: true`
- **Valor:** Dispara sugerencia de "Movilización" por `$15.000`.
- **Justificación:** Caso de prueba adicional para confirmar que **dos partidas distintas** que requieren el mismo tipo de cargo ("movilización") no lo duplican en el mismo presupuesto (la clave de deduplicación es `_cargoComplementario === "movilizacion"`, no el texto ni la partida de origen).
- **¿Mantener o retirar antes de producción?** **MANTENER — es de negocio real.** Una visita técnica de diagnóstico normalmente sí implica traslado de personal; tiene sentido dejar esta regla en producción. Se recomienda solo validar que `movilizacionBase` refleje el costo real de traslado del contratista antes de activar `cfg.minimosComerciales.activo`.

### 3. Catálogo id `311` — "Reparación filtración techumbre (parche/tapagoteras)"
- **Categoría:** Mantención Techumbres · **Unidad:** gl · **Precio:** $45.000
- **Reglas agregadas:** `precioMinimoPartida: 60000`, `requiereVisitaTecnica: true`, `requiereTrabajoAltura: true`, `requiereRetiroResiduos: true`
- **Valor:** Si `cantidad × precio < $60.000`, el sistema fuerza el total de la línea a `$60.000` (ver `calcularLineaPresupuesto`). Además dispara **tres** sugerencias de cargo: Visita técnica ($25.000), Trabajo en altura ($45.000) y Retiro de residuos ($45.000).
- **Justificación:** Partida elegida como el caso "más cargado" de prueba — combina mínimo de precio por línea **y** múltiples cargos complementarios simultáneos, para validar que la interfaz muestra correctamente varias sugerencias a la vez y que el precio mínimo no se confunde con los cargos complementarios (son mecanismos independientes).
- **¿Mantener o retirar antes de producción?** **MANTENER el concepto, AJUSTAR los montos.** Una reparación de filtración puntual sí suele tener piso de cobro y sí puede requerir visita previa, altura y retiro de escombros — es un caso realista. Antes de producción, un profesional debe revisar si $60.000 es efectivamente el mínimo rentable de la empresa (hoy es un valor de ejemplo, no un cálculo de costos real).

### 4. Catálogo id `312` — "Limpieza y destape de canaletas y bajantes"
- **Categoría:** Mantención Techumbres · **Unidad:** ml · **Precio:** $2.500
- **Reglas agregadas:** `cantidadMinimaFacturable: 10`, `requiereTrabajoAltura: true`
- **Valor:** Si el usuario ingresa una cantidad menor a 10 ml, el sistema factura igualmente 10 ml (`$25.000` mínimo), preservando la cantidad realmente ingresada para mostrarla como nota de transparencia. También dispara la sugerencia de "Trabajo en altura" ($45.000).
- **Justificación:** Partida elegida como caso de prueba de **mínimo de cantidad** (a diferencia del id 311, que prueba mínimo de *precio*), para validar ambos mecanismos por separado y en conjunto con `requiereTrabajoAltura` compartido con el id 311 (prueba de deduplicación de "trabajoAltura" entre dos partidas distintas en el mismo presupuesto).
- **¿Mantener o retirar antes de producción?** **MANTENER el concepto, AJUSTAR los montos.** Es realista cobrar un mínimo de 10 ml en trabajos de limpieza de canaletas (un desplazamiento a terreno no se justifica por 1 ml). El valor de 10 ml y el precio de $2.500/ml deben ser confirmados por el usuario como los reales de su operación antes de ir a producción.

## Resumen ejecutivo

| id | Partida | Regla | Estado recomendado |
|---|---|---|---|
| 1 | Pintura muros interiores (2 manos) | `requiereMovilizacion` | **Retirar** — partida de alto uso, no debería cobrar movilización por defecto |
| 310 | Visita Técnica / Diagnóstico | `requiereMovilizacion` | Mantener — de negocio real, revisar monto |
| 311 | Reparación filtración techumbre | `precioMinimoPartida` + 3 cargos | Mantener concepto — revisar montos |
| 312 | Limpieza y destape de canaletas | `cantidadMinimaFacturable` + 1 cargo | Mantener concepto — revisar montos |

**No se ha retirado ninguna de estas reglas todavía**, por instrucción explícita: sirven como datos vivos para la revisión visual manual descrita en las instrucciones de prueba (ver sección "Revisión visual" del reporte de entrega). Además, `cfg.minimosComerciales.activo` está en `false` por defecto — ninguna de estas reglas afecta presupuestos existentes ni nuevos hasta que un usuario active el interruptor manualmente en Configuración → Costos.
