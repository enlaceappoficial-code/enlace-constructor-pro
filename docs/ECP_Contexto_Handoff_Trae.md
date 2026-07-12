# Enlace Constructor Pro (ECP) — Contexto y Handoff para nueva versión de Trae

Este documento resume qué es ECP, cómo está armado el proyecto, qué datos usa, qué cambios se han hecho recientemente (especialmente Partidas/APUs) y cómo continuar el trabajo sin perder contexto.

## 1) Qué es ECP (visión general)

ECP (Enlace Constructor Pro) es una aplicación tipo SPA (frontend estático) que opera principalmente con:

- Persistencia en `localStorage` (la “base de datos” del usuario en el navegador / webview de Tauri).
- UI/negocio empaquetados en un bundle minificado: `src/assets/index.js`.
- Archivos HTML en `src/` que sirven como “contenedor” y arranque del frontend.

La app tiene módulos como Presupuestos, Clientes, Documentos de Obra, Partidas de Obra (Catálogo) y APUs (Análisis de Precios Unitarios).

## 2) Stack del proyecto

- App Tauri (CLI 1.6).
- Frontend servido desde `src/`:
  - `src/index.html` es el punto de entrada del frontend.
  - `src/assets/index.js` contiene la SPA minificada.
- Extensiones “runtime” (sin recompilar bundle):
  - `src/partidas_detail.js` (detalle de Partida vía modal)
  - `src/materiales_tabs.js` (mejora visual de tabs en Base de Materiales)
  - `src/apu_detail.js` existe pero su modal está desactivado (`ENABLE_MODAL=false`).
- Scripts Node en `scripts/` para parchear el bundle minificado y para migraciones/seed.
- Para pruebas rápidas en navegador se usa un servidor estático Node:
  - `scripts/serve_src_static.js` (sin cache) normalmente en `http://localhost:8080/` o `PORT=8082`.

## 3) Datos principales (localStorage)

Prefijo principal:

- `enlace_constructor_pro_v1`

Claves relevantes (las más usadas en este trabajo):

- `enlace_constructor_pro_v1_catalog` (Catálogo / Partidas de Obra)
- `enlace_constructor_pro_v1_apus` (APUs)
- `enlace_constructor_pro_v1_materiales` (Base de Materiales)

Relación clave:

- `apus[].catalogId -> catalog[].id`
  - Una Partida (Catálogo) puede tener 0..N APUs asociadas (por `catalogId`).
  - Una APU apunta a su Partida por `catalogId`.

## 4) Archivos importantes y responsabilidades

### Frontend

- `src/index.html`
  - Contiene seed/migraciones que aseguran que existan entradas mínimas en `localStorage`.
  - Se integró una aplicación automática de “claude_pack” (ver sección 5).
  - También carga scripts adicionales:
    - `./partidas_detail.js`
    - `./apu_detail.js`
    - `./materiales_tabs.js`

- `src/assets/index.js`
  - Bundle minificado con la app completa.
  - Por convención, los cambios grandes se hacen con scripts en `scripts/` que “buscan y reemplazan” cadenas exactas o con regex para minimizar riesgo.

### Auditoría/diagnóstico

- `src/audit_apu.html`
  - Página auxiliar para auditar consistencia Catálogo↔APUs:
    - Partidas sin APU
    - APUs huérfanas (sin Partida válida)
    - APUs sin materiales
  - Permite exportar CSV.

### Dataset Claude pack

- `src/claude_pack.json` / `src/claude_pack.js`
  - Dataset generado desde un HTML entregado por el usuario (salida de Claude).
  - `src/claude_pack.js` expone `window.__ECP_CLAUDE_PACK`.

- `scripts/generate_claude_pack_json.js`
  - Extrae DMAT/DCAT/DAPU desde un HTML y produce JSON.
  - Se robusteció para incorporar “APUs faltantes” fuera de `DAPU` y tolerar objetos incompletos.

- `scripts/generate_claude_pack_js.js`
  - Convierte el JSON a JS embebible (`window.__ECP_CLAUDE_PACK = ...`).

## 5) Qué se logró con Catálogo↔APUs (estado de integridad)

Objetivo perseguido:

- Que todas las Partidas relevantes tengan APUs asociadas (cobertura).
- Que todas las APUs tengan materiales (completitud).
- Eliminar huérfanas y casos sin materiales.

Estrategia aplicada:

- Seed/migración en `src/index.html` para:
  - Auto-aplicar `claude_pack.js` una sola vez (flag en localStorage).
  - Re-vincular APUs huérfanas:
    - Si existe la Partida, corregir `catalogId`.
    - Si no existe la Partida, crearla (fallback).
  - Garantizar que ninguna APU quede sin materiales:
    - Fallback a material tipo “Servicio:” si falta composición.

Validación:

- Auditoría en `src/audit_apu.html` para confirmar contadores en el mismo origen/puerto (evitar confusión por `localStorage` distinto entre puertos).

## 6) UX de Partidas vs APUs (lo más importante de este handoff)

El usuario pidió explícitamente que el flujo de Partidas sea como el de APUs:

- En APUs: click en un registro → se abre detalle con materiales.
- En Partidas: click en una fila de Partida → debe abrir “pantalla/detalle” con sus APUs y materiales.
- Si la Partida tiene 2 APUs, deben verse 2 fichas (2 columnas).

Estado actual (importante):

- El detalle tipo “APU” se implementó para Partidas como un modal (no dentro del panel derecho).
- El intento de replicar ese mismo modal en APU se dejó desactivado por no poder interceptar el click de forma confiable en el bundle minificado (ver 6.5).

Cambios históricos realizados en `src/assets/index.js` vía scripts (quedaron en el proyecto):

### 6.1 Columna “APUs” en listado de Partidas

- Script: `scripts/patch_catalog_partidas_show_apus_column_v1.js`
- Agrega columna “APUs” mostrando resumen (hasta 2 nombres y “(+N)”).
- Calcula `__apuShort` y `__apuTitle` a partir de `enlace_constructor_pro_v1_apus`.

### 6.2 Click en fila de Partida abre el editor/detalle

- Script: `scripts/patch_catalog_partidas_row_click_open_v1.js`
- Implementa `onClick` en `<tr>` con la misma lógica del botón editar:
  - selecciona la Partida
  - abre la vista de edición
- Usa `stopPropagation()` en botones para evitar doble disparo al clicar ✎/🗑.

### 6.3 Mostrar APUs vinculadas dentro del editor de Partida

- Script: `scripts/patch_catalog_partidas_editor_show_apus_v2.js`
- Inserta un bloque “APUs vinculadas” al abrir una Partida:
  - Busca APUs por `catalogId === partida.id`.
  - Carga `materiales` desde `enlace_constructor_pro_v1_materiales`.
  - Renderiza 1 o 2 columnas según cantidad de APUs.
  - Muestra lista de materiales con cantidad y subtotal y total por ficha.

Nota:

- La UI del detalle de Partida no replica completamente el dashboard visual de APUs (barras/composición), pero sí cumple el núcleo: ver APUs + materiales y 1–2 fichas.

### 6.4 Implementación actual del detalle de Partida (modal) — recomendado

- Archivo: `src/partidas_detail.js`
- Hook: escucha clicks sobre filas del listado de Partidas (evita botones ✏/✕) y abre un modal con:
  - Header de Partida (cat/desc)
  - KPIs: Unidad / Precio neto / Con IVA
  - “APUs vinculadas” renderizadas como fichas (1..N, responsive) con tabla de materiales y total.
- El bloque “APUs vinculadas” que quedaba incrustado en el panel derecho se oculta defensivamente desde `partidas_detail.js` (si aparece por parches previos del bundle).

### 6.5 APU modal (NO activo)

- Archivo: `src/apu_detail.js`
- Se agregó para intentar unificar el flujo con Partidas (modal), pero se dejó desactivado:
  - `ENABLE_MODAL=false`
  - Motivo: el módulo APU del bundle maneja el click internamente (`setSelApu(...)`) y no se logró interceptar de forma confiable sin parchear el bundle.

### 6.6 Tabs Base de Materiales (mejora visual)

- Archivo: `src/materiales_tabs.js`
- Mejora visual de los 2 tabs “Base de Materiales” y “Actualización de Precios” (estilo pill + active state) sin tocar el bundle.

## 7) Convención de trabajo sobre bundle minificado (muy importante)

`src/assets/index.js` está minificado. Para minimizar riesgos:

- Parchear mediante scripts Node en `scripts/` usando `replaceOnce`/`replaceAll` o regex bien acotadas.
- Validar sintaxis post-parche:
  - `node scripts/find_syntax_error_acorn.js src/assets/index.js` debe devolver `OK`.
- Antes de cambios grandes, crear backup (ver sección 8).

## 8) Backups y reversión

Existe una carpeta `_backups/` con snapshots históricos (incluyendo `src/assets/index.js`).

Regla práctica:

- Antes de cambios grandes, generar una copia/backup del proyecto para poder volver atrás.

Herramientas útiles:

- `scripts/make_backup_index.js` (si se usa) o duplicar manualmente `src/assets/index.js`.
- Scripts de “restore” existentes en `scripts/`:
  - `scripts/restore_index_from_backup.js`
  - `scripts/repair_index_bundle.js`

## 9) Cómo ejecutar y probar

### Prueba rápida en navegador (recomendado para UI)

- Levantar servidor estático:
  - Default: `node scripts/serve_src_static.js` → `http://localhost:8080/`
  - Alternativa en Windows PowerShell: `$env:PORT=8082; node scripts/serve_src_static.js` → `http://localhost:8082/`
- Importante:
  - El `localStorage` depende del origen (puerto). Si comparas 8080 vs 8082 vs Tauri, los datos pueden diferir.
  - En `http://localhost:5173/` (si aplica) preferir hard reload.

### Tauri

- `npm run dev` ejecuta `tauri dev`.
- `npm run build` ejecuta `tauri build`.

## 10) Problemas típicos ya vistos (para evitar repetirlos)

- Diferencias de conteo/estado por usar distinto origen/puerto (localStorage separado).
- Parches al minificado con errores de sintaxis (paréntesis/comas/llaves):
  - Solución: validar con `find_syntax_error_acorn.js` y corregir con scripts de fix.
- Extracción incompleta desde HTML de Claude:
  - Había APUs “faltantes” fuera de `DAPU`; se corrigió el extractor.

## 11) Estado actual y pendientes (resumen honesto)

- Integridad Catálogo↔APUs/materiales: se trabajó para llegar a 0 huérfanas y 0 sin materiales mediante seed + pack.
- UX Partidas:
  - Click en fila abre modal detalle (`src/partidas_detail.js`).
  - Se muestra “APUs vinculadas” con fichas y materiales (1..N, responsive).
- UX APU:
  - Se dejó el flujo original (detalle nativo del módulo).
  - Se renombró visualmente el ítem del menú a “APU” (antes “APU & Actualización”).
- Base de Materiales:
  - Tabs “Base de Materiales” / “Actualización de Precios” con mejor visual (pill tabs).
- Licencias/Plan Starter:
  - Sin licencia válida, la app queda en plan efectivo “starter” sin expiración por días (pero con límites, ej. 30 presupuestos).
  - Con código ENLACE u otro válido, el plan puede subir y sí puede expirar según el payload del código.

## 12) Versión y builds (Windows / Tauri)

Versión actual del proyecto para publicar instalador:

- `1.0.1` (actualizado en `package.json`, `src-tauri/tauri.conf.json`, `src-tauri/Cargo.toml`).

Build Windows:

- `npm install`
- `npm run build` (Tauri)
- Output típico:
  - `src-tauri/target/release/bundle/msi/*.msi` (y/o `bundle/nsis/*.exe` si aplica).

## 13) Guía para continuar (para la nueva versión de Trae)

Si se retoma el objetivo de igualar la pantalla APU:

- Reutilizar la lógica y estilos del módulo APU para:
  - composición del precio (materiales / MO / GG / utilidad)
  - resumen por APU
- En Partidas:
  - mantener la estructura de “2 fichas” cuando haya 2 APUs vinculadas.
  - evitar navegación extra: click en fila = ver APUs.

Checklist mínimo antes de entregar cambios:

- `node scripts/find_syntax_error_acorn.js src/assets/index.js` → OK
- Probar en un único origen (mismo puerto) y validar:
  - Partida con 1 APU: 1 ficha, materiales visibles.
  - Partida con 2 APUs: 2 fichas, materiales visibles.

## 14) Próximo proyecto: ECP Mobile (PWA) + Supabase

Se creó un documento separado con el punto de partida y decisiones pendientes para iniciar la versión móvil (PWA) sincronizada con escritorio:

- `docs/ECP_Mobile_PWA_Supabase_Inicio.md`
