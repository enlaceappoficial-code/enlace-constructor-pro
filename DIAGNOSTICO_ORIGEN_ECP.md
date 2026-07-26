# Diagnóstico de origen y naturaleza del código — Enlace Constructor Pro

Fecha de inspección: 2026-07-26  
Proyecto inspeccionado: `Enlace Constructor Pro`  
Alcance: análisis estático de estructura, entradas web, JavaScript, antecedentes HTML/JSX, scripts, configuración Tauri y cadena de construcción. No se modificó la aplicación activa.

## Conclusión ejecutiva

`src/assets/index.js` es una **mezcla de código generado/transpilado y modificaciones directas posteriores**.

La explicación más consistente con toda la evidencia es:

1. El prototipo se desarrolló originalmente como uno o más HTML autosuficientes con React, JSX legible y Babel en el navegador.
2. Ese código fue transformado alguna vez a JavaScript ejecutable: JSX convertido a llamadas `jsx/jsxs`, React y ReactDOM incrustados, helpers de empaquetado y nombres abreviados.
3. Después de esa transformación, el archivo resultante fue editado repetidamente de forma directa mediante parches, inyecciones y secciones escritas manualmente.
4. En el proyecto vigente no existe un proceso frontend que vuelva a generar `src/assets/index.js`. Tauri copia directamente `src/` como frontend.
5. Por ello, aunque su origen es el de un bundle, hoy `src/assets/index.js` es también el **artefacto fuente canónico y operativo** del producto.

No corresponde clasificarlo como:

- código fuente original puro, porque contiene runtimes, helpers y JSX transformado;
- archivo generado puro, porque hay lógica manual añadida directamente y no existe generador vigente;
- bundle minificado puro, porque está formateado en unas 82.700 líneas y contiene extensas secciones legibles, comentarios y nombres semánticos;
- archivo recuperable de forma exacta desde los HTML antiguos, porque éstos no contienen todas las modificaciones posteriores.

## Arquitectura real vigente

### Cadena de entrada

```text
Tauri 1.6
  └─ devPath/distDir = ../src
      └─ src/index.html
          ├─ src/xlsx.full.min.js
          ├─ src/claude_pack.js
          ├─ migraciones inline de localStorage
          └─ src/assets/index.js
              └─ React SPA + datos + lógica + componentes + parches integrados
```

- `src/index.html` es la entrada efectiva.
- `src/app.html` sólo redirige a `src/index.html`.
- `src/assets/index.js` monta la SPA.
- `src/claude_pack.js` aporta un paquete de datos `DMAT`, `DCAT` y `DAPU` que el JavaScript inline de `src/index.html` utiliza para migrar o completar datos guardados.
- La persistencia funcional principal está en `localStorage`; el Rust actual no implementa una capa propia de datos.

### Tauri y compilación

Evidencia en `src-tauri/tauri.conf.json`:

- `devPath: "../src"`.
- `distDir: "../src"`.
- `beforeDevCommand` y `beforeBuildCommand` están vacíos.
- `withGlobalTauri: true`.

Evidencia en `package.json`:

- `npm run dev` ejecuta `tauri dev`.
- `npm run build` ejecuta `tauri build`, precedido por `verify:canonical`.
- No hay Vite, Webpack, Rollup, Parcel, esbuild, Babel CLI ni TypeScript como compilador frontend.
- `acorn` y `acorn-jsx` se usan como herramientas de análisis/verificación, no como compiladores de la aplicación.

Evidencia en Rust:

- `src-tauri/src/main.rs` sólo construye y ejecuta la ventana Tauri.
- `src-tauri/build.rs` sólo llama `tauri_build::build()`.
- No existen comandos Rust de negocio ni una base de datos implementada en Rust.

Conclusión: el build de escritorio **empaqueta los archivos estáticos ya existentes**; no produce `src/assets/index.js`.

## Evidencia de la naturaleza de `src/assets/index.js`

### Señales de código generado o transpilado

- El archivo comienza con helpers abreviados como `ix`, `ax` y operaciones sobre `Object.defineProperty`.
- Incluye el runtime de React y ReactDOM, con referencias como `Symbol.for("react.element")` y `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED`.
- El JSX está transformado a llamadas del estilo `e.jsx(...)` y `e.jsxs(...)`.
- Muchos componentes y funciones originales tienen nombres reducidos: `Hf`, `Vf`, `lg`, `hg`, `vg`, `bg`, `Gt`, `Jg`.
- Los nombres de los conjuntos principales también fueron reducidos:

| Nombre semántico | Nombre dentro del archivo vigente | Línea aproximada |
|---|---:|---:|
| Configuración por defecto | `Ct` | 9.854 |
| Clientes de ejemplo | `Fn` | 9.964 |
| Catálogo/partidas | `qi` | 9.987 |
| Presupuestos de ejemplo | `Rn` | 11.502 |
| Materiales | `Qi` | 11.633 |
| APU | `Ai` | 13.695 |

- `scripts/audit_apu_technical.js` declara expresamente la correspondencia `DCAT -> qi`, `DMAT -> Qi` y `DAPU -> Ai`.

### Señales de que no es un bundle minificado puro

- El archivo tiene saltos de línea, sangría y bloques extensos legibles.
- Conserva comentarios y nombres semánticos añadidos posteriormente, por ejemplo `calculaMO`, `firmaActualizacion`, `normalizaRut`, `mergeUpdatePack`, `ModuloProveedores`, `GeneradorOCModulo` y `patchUserApu`.
- Contiene funciones escritas con estilos diferentes: código compacto transpilado, código moderno con `const/let`, comentarios en inglés y español, y parches IIFE al final.
- No se encontró una directiva `sourceMappingURL` ni un mapa fuente asociado.

### Señales de modificaciones directas posteriores

- Existen numerosos scripts raíz y en `scripts/` que leen y reemplazan fragmentos de `src/assets/index.js`: `patch_*`, `fix_*`, `inject_*`, `sync_*`, `replace_*`.
- `scripts/recover_tauri_brotli_asset.js` documenta un mecanismo para recuperar un activo comprimido de Tauri.
- Hay módulos sueltos como `src/assets/generador_oc_modulo.js` y `src/assets/modulo_proveedores.js` cuyo contenido aparece copiado dentro del archivo canónico, sin que el HTML los cargue como módulos independientes.
- Al final del archivo existen parches autoejecutables, por ejemplo `patchUserApu`, que modifican datos de `localStorage` al iniciar.
- El formato y la codificación cambian entre secciones; hay texto correcto y texto con mojibake, otra señal de concatenaciones e inyecciones de distintas etapas.

### Imports, entradas y referencias HTML

- No hay `import`/`export` ES module en la entrada vigente.
- `src/index.html` carga `src/assets/index.js` mediante un `<script>` creado dinámicamente.
- `src/assets/index.js` depende de variables globales (`window.XLSX`, `window.jspdf`, `window.__TAURI__`) y contiene/carga otras bibliotecas según necesidad.
- No se encontró un archivo `.map` enlazado.
- No se encontraron archivos `.jsx`, `.ts` o `.tsx` activos. El JSX original está incrustado en HTML históricos.

## HTML original y antecedentes del prototipo

### `src/app.backup.html`

Es el antecedente más claro del código fuente original:

- carga React 18, ReactDOM 18 y Babel Standalone desde CDN;
- contiene varios `<script type="text/babel">`;
- conserva JSX y nombres legibles como `BudgetForm`, `MaterialesPage`, `ClientsPage`, `CubicacionPage`, `CatalogPanel`, `APUAjusteModal`, `parseLicencia` y `TuPlanPage`;
- termina montando `<App/>` con `ReactDOM.createRoot(...)`.

No debe considerarse la versión productiva actual: le faltan cambios incorporados después al archivo canónico.

### `src/_legacy/app_legacy_2026-07-23.html`

Es una versión histórica posterior del mismo enfoque monolítico:

- sigue usando JSX dentro del HTML;
- carga React, ReactDOM y Babel desde `/vendor`;
- conserva nombres semánticos;
- está archivada expresamente en `_legacy`.

### Otros HTML

- `src/Enlace_Constructor_Pro.html`: cargador estático alternativo de `assets/index.js`; no es la entrada configurada en la guarda canónica.
- `src/audit_apu.html`: herramienta de auditoría, no aplicación principal.
- `src/app.html`: redirección controlada a `index.html`.

## Fuentes alternativas, copias y módulos no utilizados directamente

### Variantes del archivo principal

| Archivo | Tamaño aproximado | Observación |
|---|---:|---|
| `src/assets/index.js` | 3,43 MB | Canónico vigente |
| `src/assets/index_ESTABLE_JULIO.js.bak` | 3,30 MB | Copia histórica, no cargada |
| `src/assets/index_backup_12_jul_2026.js` | 2,91 MB | Copia histórica |
| `src/assets/index_backup_jul12.js` | 2,88 MB | Copia histórica |
| `src/assets/index_backup.js` | 1,12 MB | Copia histórica |
| `src/assets/index.js.test` | 0,74 MB | Variante de prueba |
| `src/assets/chunk.js` | 0,59 MB | Fragmento no referenciado por la entrada vigente |

Las variantes sirven como evidencia histórica, pero no son fuentes seguras para reconstruir la versión actual.

### Módulos sueltos no cargados por `src/index.html`

- `src/assets/generador_oc_modulo.js`
- `src/assets/modulo_proveedores.js`
- `src/assets/proveedores_module.js`
- `src/assets/proveedores_module_redesign.js`
- `src/apu_detail.js`
- `src/materiales_tabs.js`
- `src/partidas_detail.js`
- `src/mp_api_tutorial.js`

Algunos son fuentes intermedias legibles que luego fueron inyectadas o copiadas al archivo canónico. Otros son variantes abandonadas. No existe un importador o manifiesto vigente que los ejecute como módulos independientes.

### Datos y scripts auxiliares

- `apus.json`, `materiales.json` y `catalog.json` son exportaciones o insumos de trabajo, no archivos que la aplicación vigente consulte en tiempo de ejecución.
- Los numerosos scripts raíz constituyen un historial de parches, no una cadena reproducible de compilación.
- `_backups/`, `backup_localstorage/`, `exports/` y `_parches_aplicados/` contienen antecedentes o datos operativos y no fueron incluidos en el paquete de diagnóstico.

## Guarda canónica

`scripts/verify_canonical.js` valida:

- sintaxis de `src/assets/index.js`;
- carga del archivo desde `src/index.html`;
- redirección de `src/app.html`;
- hashes SHA-256 aceptados;
- características mínimas;
- auditoría técnica de las bibliotecas.

Resultado previo a generar estos informes:

```text
CANONICAL_OK
Catálogo: 311
Materiales: 327
APU: 311
Observaciones técnicas: 0
Partidas sin APU: 0
```

Esta guarda protege contra regresiones de archivos, pero no reemplaza un sistema fuente reproducible.

## Hallazgos relevantes para una auditoría externa

1. **Fuente no reproducible**: no existe una receta que genere el archivo canónico desde fuentes modulares.
2. **Mezcla de responsabilidades**: runtime, datos, lógica, UI, exportadores, persistencia y licencias viven en un solo archivo.
3. **Sin source maps**: no puede reconstruirse una correspondencia automática fiable con el JSX original.
4. **Persistencia local**: la información de negocio se guarda principalmente en `localStorage`; no hay transacciones, esquema versionado ni aislamiento por usuario.
5. **Migraciones en el arranque**: `src/index.html`, `src/claude_pack.js` y parches al final de `index.js` pueden alterar datos guardados al iniciar.
6. **Permisos Tauri amplios**: `api-all`, acceso de archivos con alcance `**`, HTTP amplio y `csp: null` aumentan la superficie de revisión de seguridad.
7. **Licenciamiento local**: la verificación del plan está implementada en el cliente; no constituye una frontera de seguridad robusta.
8. **Dependencias globales**: varias funciones esperan `window.XLSX`, `window.jspdf` u otras bibliotecas cargadas globalmente.
9. **Codificación inconsistente**: existen cadenas con mojibake (`Ã`, `Â`, etc.), lo que puede afectar interfaz, búsquedas y documentos.
10. **Duplicación histórica**: hay varias implementaciones de proveedores y múltiples respaldos del archivo principal.
11. **Pruebas limitadas**: existe auditoría técnica de datos y guarda de sintaxis/hash, pero no un script de pruebas funcionales completo en `package.json`.

## Dictamen

Para la auditoría externa debe presentarse `src/assets/index.js` como:

> **Artefacto JavaScript transpilado/empaquetado de origen, posteriormente convertido en fuente canónica mediante modificaciones directas.**

Los HTML con JSX son antecedentes valiosos para comprender nombres e intención, pero no sustituyen el código vigente. Cualquier modularización futura debe partir del archivo canónico actual, acompañarse de pruebas de equivalencia y preservar la guarda canónica hasta disponer de una nueva cadena reproducible.
