# Validación de `SOLUCIONES_PROPUESTAS.json`

Fecha: 2026-07-28 · Rama: `feature/partidas-compuestas` · Base: `main` en `ea05f69` (`v1.2.1-estabilidad`)

Esta validación se ejecutó con scripts temporales (fuera del repositorio, en el scratchpad de la sesión — no se agregó ningún script nuevo a `scripts/` porque el pedido fue únicamente por los 3 documentos de `docs/soluciones/`). Los scripts:

1. Extrajeron el catálogo real (`qi`, 311 partidas) directamente de `src/assets/index.js` mediante lectura de texto — sin evaluar ni ejecutar la app, sin modificar el archivo.
2. Cargaron `SOLUCIONES_PROPUESTAS.json` (v0.2.0-propuesta) y verificaron cada partida y cada solución contra ese catálogo real.

Las secciones 1-3 corresponden a la validación original (v0.1.0). Las secciones 4-7 son nuevas de esta iteración (v0.2.0): exclusiones, grupos de selección, estado borrador y referencias ambiguas.

## 1. Todos los `catalogId` existen

**Resultado: OK.** Las 33 referencias `catalogId` usadas en las 6 soluciones (algunas repetidas entre soluciones distintas, nunca dentro de la misma) fueron cruzadas una por una contra el catálogo real extraído de `index.js`. Las 33 existen.

IDs verificados por solución:

| Solución | `catalogId` referenciados |
|---|---|
| `sol-001-filtracion-techumbre` | 311, 312, 224, 406, 33, 43 |
| `sol-002-cambio-canaleta-bajante` | 107, 106, 312, 405 |
| `sol-003-pintura-interior-habitacion` | 1, 3, 4, 320, 433 |
| `sol-004-cambio-piso-ceramico` | 64, 408, 134, 66 |
| `sol-005-reparacion-porton` | 313, 319 |
| `sol-006-remodelacion-basica-bano` | 64, 63, 221, 368, 369, 222, 220, 370, 92, 37, 101, 134 |

## 2. No hay duplicados dentro de una misma solución

**Resultado: OK.** Se verificó que ninguna solución repite el mismo `catalogId` dos veces entre sus propias `partidas[]`. (El mismo `catalogId` sí se reutiliza legítimamente entre soluciones distintas — p. ej. 64 en `sol-004` y `sol-006`, 134 en `sol-004` y `sol-006`, 312 en `sol-001` y `sol-002` — eso es reutilización del catálogo, no la duplicación que la regla prohíbe.)

## 3. Unidades compatibles

**Resultado: OK, tras una corrección al script de validación.** Cada `formulaCantidad` declara explícitamente si la cantidad es `fija:`, `por m²:`, `por ml:` o `por m³:`. Se comparó esa declaración contra el campo `unidad` real de cada partida en el catálogo.

Nota sobre el proceso: la primera pasada del script marcó un falso positivo en el `catalogId` 311 (unidad real `gl`), porque el texto de `formulaCantidad` incluye la aclaración *"no fraccionable por m²"* dentro de una descripción `fija:`, y el patrón de detección inicial priorizaba la palabra "m²" en cualquier posición del texto. Se corrigió el script para que primero determine si el texto empieza con `fija:` (y en ese caso solo busque `gl`/`unidad`) antes de buscar patrones `por m²/ml/m³`. Tras la corrección, las 33 partidas verifican unidad compatible sin excepciones.

## 4. Exclusiones bidireccionales

**Resultado: OK.** Para cada partida con `excluyeCatalogIds`, el script verificó que la partida referenciada exista dentro de la misma solución y que **también** declare la exclusión de vuelta (si A excluye a B, B debe excluir a A). Las 5 exclusiones formalizadas en v0.2.0 son las 10 direcciones esperadas (cada par cuenta dos veces, una por sentido):

| Solución | Par excluyente | Bidireccional |
|---|---|---|
| `sol-001-filtracion-techumbre` | 33 ↔ 43 | ✅ |
| `sol-002-cambio-canaleta-bajante` | 107 ↔ 106 | ✅ |
| `sol-004-cambio-piso-ceramico` | 64 ↔ 66 | ✅ |
| `sol-006-remodelacion-basica-bano` | 368 ↔ 222 | ✅ |
| `sol-006-remodelacion-basica-bano` | 369 ↔ 220 | ✅ |

Ninguna exclusión unidireccional (declarada solo en un sentido) fue encontrada.

## 5. Grupos de selección

**Resultado: OK.** Para cada `grupoSeleccion` presente, el script verificó cuatro condiciones sobre sus miembros dentro de la misma solución:

1. Todos los miembros del grupo comparten el mismo `seleccionMinima` y el mismo `seleccionMaxima`.
2. `seleccionMaxima` no excede la cantidad de miembros del grupo.
3. `seleccionMinima ≤ seleccionMaxima` en cada miembro.
4. Cada miembro excluye (`excluyeCatalogIds`) a todos los demás miembros del mismo grupo — un grupo de selección sin exclusión cruzada completa sería contradictorio.

| Grupo | Solución | Miembros | Min/Max | Resultado |
|---|---|---|---|---|
| `grp-sistema-techumbre` | `sol-001` | 33, 43 | 0 / 1 | ✅ |
| `grp-alcance-canaleta` | `sol-002` | 107, 106 | 1 / 1 | ✅ |
| `grp-alcance-piso` | `sol-004` | 64, 66 | 1 / 1 | ✅ |
| `grp-estandar-wc` | `sol-006` | 368, 222 | 1 / 1 | ✅ |
| `grp-estandar-ducha` | `sol-006` | 369, 220 | 1 / 1 | ✅ |

Las 5 grupos verifican las 4 condiciones sin excepciones.

## 6. Soluciones en estado borrador

**Resultado: OK.** El script verificó que toda solución con `estado: "borrador"` cumpla tres condiciones: (a) tenga al menos una partida `obligatoria: true` con `catalogId` real y existente — es decir, que el borrador no esté completamente vacío de contenido utilizable; (b) declare `requierePartidasNuevas: true`; (c) tenga al menos una `advertencia` que documente explícitamente el vacío de catálogo (marcada con el prefijo `GAP DE CATÁLOGO:`).

| Solución | Tiene obligatoria real | `requierePartidasNuevas` | Advertencia de gap | Resultado |
|---|---|---|---|---|
| `sol-005-reparacion-porton` | ✅ (313) | ✅ | ✅ | ✅ |

El script también verificó el caso inverso: ninguna solución con `requierePartidasNuevas: true` debería quedar fuera del estado `"borrador"` (inconsistencia de datos). No se encontró ninguna.

## 7. Referencias ambiguas

**Resultado: 1 referencia ambigua detectada y correctamente advertida.** El script escanea el `motivo` de cada partida y las `advertencias` de la solución en busca de lenguaje que indique que el `catalogId` usado no calza textualmente con el caso de uso (patrones: *"extrapolación"*, *"no es una coincidencia textual exacta"*, *"está descrito [...] para"*).

| Solución | `catalogId` | Detectado en `motivo` | Detectado en `advertencias` | Tiene advertencia asociada |
|---|---|---|---|---|
| `sol-005-reparacion-porton` | 319 | ✅ | ✅ | ✅ |

El `catalogId` 319 ("Cambio de chapa/cerradura puerta") está descrito en el catálogo para "puerta", no para "portón"; se usa en `sol-005` como extrapolación funcional razonable, y tanto su `motivo` como una `advertencia` dedicada lo señalan explícitamente. El script confirma que esta ambigüedad **no quedó silenciada**: toda partida detectada como ambigua tiene al menos una advertencia que la menciona por su `catalogId`.

No se detectaron referencias ambiguas sin advertencia asociada en ninguna de las 6 soluciones.

## 8. No se modificó código productivo

**Resultado: OK.**

```
$ git status --short
 M docs/soluciones/MODELO_PARTIDAS_COMPUESTAS.md
 M docs/soluciones/SOLUCIONES_PROPUESTAS.json
?? .claude/

$ git diff --stat src/assets/index.js src-tauri/
(sin salida — sin cambios)
```

`src/assets/index.js` y todo `src-tauri/` no muestran ninguna diferencia respecto de `main` (`ea05f69`). Los únicos archivos modificados en esta iteración son dos de los tres de `docs/soluciones/` (este archivo, `VALIDACION_SOLUCIONES.md`, es el tercero).

## 9. Resumen final de los scripts

```json
// validate_soluciones.js (v0.1.0 — ids, duplicados, unidades)
{ "allOk": true, "idsUnicosSoluciones": true, "totalPartidas": 33, "fallas": [] }

// validate_soluciones_v2.js (v0.2.0 — exclusiones, grupos, borrador, ambiguas)
{ "allOk": true, "exclusionesNoBidireccionales": 0, "gruposInconsistentes": 0, "borradoresInconsistentes": 0, "ambiguasSinAdvertencia": 0 }
```

## 10. Verificaciones no aplicables en esta fase

Las siguientes verificaciones del stack habitual de ECP **no aplican** a este cambio porque no se tocó `src/assets/index.js` ni `src/index.html`, y por lo tanto no corresponde regenerar ni volver a aceptar la línea base canónica:

- `npm run verify:canonical` — no aplica (sin cambios en el bundle ni el entrypoint).
- `node scripts/audit_apu_technical.js` — no aplica (no se tocó ningún APU).
- `node check_syntax_acorn.js` — no aplica (no se tocó JavaScript de producción).
- `cargo check` — no aplica (no se tocó `src-tauri/`).

Se confirma explícitamente, en cambio, que el árbol de git no muestra cambios en ninguno de esos archivos (ver §8).
