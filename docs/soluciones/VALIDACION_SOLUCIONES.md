# Validación de `SOLUCIONES_PROPUESTAS.json`

Fecha: 2026-07-28 · Rama: `feature/partidas-compuestas` · Base: `main` en `ea05f69` (`v1.2.1-estabilidad`)

Esta validación se ejecutó con un script temporal (fuera del repositorio, en el scratchpad de la sesión — no se agregó ningún script nuevo a `scripts/` porque el pedido fue únicamente por los 3 documentos de `docs/soluciones/`). El script:

1. Extrajo el catálogo real (`qi`, 311 partidas) directamente de `src/assets/index.js` mediante lectura de texto — sin evaluar ni ejecutar la app, sin modificar el archivo.
2. Cargó `SOLUCIONES_PROPUESTAS.json` y verificó cada partida de cada solución contra ese catálogo real.

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

## 4. No se modificó código productivo

**Resultado: OK.**

```
$ git status --short
?? .claude/
?? docs/soluciones/

$ git diff --stat src/assets/index.js src-tauri/
(sin salida — sin cambios)
```

`src/assets/index.js` y todo `src-tauri/` no muestran ninguna diferencia respecto de `main` (`ea05f69`). Los únicos archivos nuevos son los tres de `docs/soluciones/` pedidos en esta fase.

## 5. Resumen final del script

```json
{
  "allOk": true,
  "idsUnicosSoluciones": true,
  "totalPartidas": 33,
  "fallas": []
}
```

## 6. Verificaciones no aplicables en esta fase

Las siguientes verificaciones del stack habitual de ECP **no aplican** a este cambio porque no se tocó `src/assets/index.js` ni `src/index.html`, y por lo tanto no corresponde regenerar ni volver a aceptar la línea base canónica:

- `npm run verify:canonical` — no aplica (sin cambios en el bundle ni el entrypoint).
- `node scripts/audit_apu_technical.js` — no aplica (no se tocó ningún APU).
- `node check_syntax_acorn.js` — no aplica (no se tocó JavaScript de producción).
- `cargo check` — no aplica (no se tocó `src-tauri/`).

Se confirma explícitamente, en cambio, que el árbol de git no muestra cambios en ninguno de esos archivos (ver §4).
