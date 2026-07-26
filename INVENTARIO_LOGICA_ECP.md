# Inventario de lógica — Enlace Constructor Pro

Fecha: 2026-07-26  
Entrada canónica: `src/index.html`  
JavaScript canónico: `src/assets/index.js`

Los números de línea son aproximados y corresponden al archivo vigente inspeccionado. Los identificadores abreviados son consecuencia de la transformación histórica; se agrega el significado funcional inferido y contrastado con los HTML JSX anteriores.

## Mapa de datos base

| Elemento | Archivo y líneas | Identificador | Dependencias | Explicación |
|---|---|---|---|---|
| Configuración por defecto | `src/assets/index.js:9854-9963` | `Ct` | Moneda, jornales, porcentajes, licencia | Valores iniciales de empresa, IVA, descuento, anticipo, MO, GG, utilidad y plan. |
| Clientes de ejemplo | `src/assets/index.js:9964-9986` | `Fn` | Estado raíz `Jg` | Datos demostrativos que se usan si no existe persistencia. |
| Partidas/catálogo | `src/assets/index.js:9987-11501` | `qi` (`DCAT`) | APU por `catalogId`, presupuestos | Catálogo canónico de partidas con descripción, categoría, unidad y precio. |
| Presupuestos de ejemplo | `src/assets/index.js:11502-11632` | `Rn` | Clientes, partidas | Presupuestos iniciales de demostración. |
| Materiales | `src/assets/index.js:11633-13694` | `Qi` (`DMAT`) | APU por `materialId` | Base canónica de materiales, unidad, categoría, precio y conversión comercial opcional. |
| APU | `src/assets/index.js:13695-17660` | `Ai` (`DAPU`) | `qi`, `Qi`, `Ct` | Recetas APU, rendimientos, dotación, porcentajes y materiales por unidad. |
| Paquete de migración | `src/claude_pack.js:1`; `src/index.html:106-540` | `window.__ECP_CLAUDE_PACK`, `seed()` | `localStorage`, `DMAT/DCAT/DAPU` | Completa o migra datos locales antes de cargar la SPA. |

## Inventario solicitado

### 1. Datos de partidas

- **Archivo:** `src/assets/index.js`
- **Líneas:** `9987-11501`
- **Nombre:** `qi`
- **Dependencias:** `Ai.catalogId`, `vg`, `lg`, `jg`, estado raíz `Jg`
- **Función:** dataset canónico de partidas de obra.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `44121-45437`
- **Nombre:** `vg` — pantalla Partidas de Obra
- **Dependencias:** React, `localStorage` para revisar APU vinculados, `setCatalog`, `ne`
- **Función:** búsqueda, filtros, altas, edición, eliminación, precios y relación visual con APU.

### 2. Materiales

- **Archivo:** `src/assets/index.js`
- **Líneas:** `11633-13694`
- **Nombre:** `Qi`
- **Dependencias:** APU `Ai`, paquete `claude_pack`
- **Función:** catálogo canónico de materiales.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `26867-28211`
- **Nombre:** `Vf` — Base de Materiales
- **Dependencias:** React, `window.XLSX`, `zt`, `setMateriales`, historial de precios
- **Función:** CRUD, filtros, importación/exportación Excel, actualización de precios y metadatos.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `30134-31998`
- **Nombre:** `Yf` — Ajustar materiales de la partida
- **Dependencias:** `li`, `calculaMO`, materiales, APU, configuración
- **Función:** activa/desactiva insumos, cambia cantidades, agrega insumos del catálogo y recalcula precio unitario.

### 3. APU

- **Archivo:** `src/assets/index.js`
- **Líneas:** `13695-17660`
- **Nombre:** `Ai`
- **Dependencias:** `Qi` mediante `materialId`; `qi` mediante `catalogId`
- **Función:** biblioteca canónica APU.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `23602-26812`
- **Nombre:** `Hf` — APU / Análisis de Precios Unitarios
- **Dependencias:** `li`, `calculaMO`, `Qi`, `qi`, `Ct`, `_t`
- **Función:** creación, edición, clonación, bloqueo, vinculación con partidas, rendimientos, dotación y composición de insumos.

- **Archivo:** `scripts/audit_apu_technical.js`
- **Líneas:** `1-fin`
- **Nombre:** `extractArray`, `calculateLabor` y auditorías relacionadas
- **Dependencias:** Node `fs`, `path`, `vm`
- **Función:** auditoría estática de integridad y cobertura de catálogo/materiales/APU.

### 4. Creación de presupuestos

- **Archivo:** `src/assets/index.js`
- **Líneas:** `37605-38970`
- **Nombre:** `lg` — formulario de presupuesto
- **Dependencias:** clientes, `qi`, `Ai`, `Qi`, `Ee`, `li`, `Yf`, `Zf`, `Sg`
- **Función:** crea/edita presupuesto, agrega partidas manuales o del catálogo, invoca APU, configura cantidades, descuentos, estado y guarda mediante `onSave`.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `37805-37821`
- **Nombre:** `Z` dentro de `lg`
- **Dependencias:** callback `onSave`
- **Función:** valida cliente, descripción e ítems; entrega el presupuesto normalizado para guardado.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `74803-74812`, `74855-74870`
- **Nombre:** estado `B/w` dentro de `Jg`; efecto `_t("budgets", ...)`
- **Dependencias:** `pt`, `_t`, `localStorage`
- **Función:** carga y persiste presupuestos.

### 5. Cálculo de materiales

- **Archivo:** `src/assets/index.js`
- **Líneas:** `17753-17756`
- **Nombre:** bloque de materiales dentro de `li`
- **Dependencias:** `apu.materiales`, catálogo `Qi`
- **Función:** suma `precio material × cantidad por unidad`.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `33951-34018`
- **Nombre:** `f` dentro de `ig`
- **Dependencias:** presupuesto, catálogo, APU y materiales
- **Función:** cubicación de materiales de un presupuesto respetando insumos personalizados.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `45438-45615` aprox.
- **Nombre:** `bg`
- **Dependencias:** presupuesto, `qi`, `Ai`, `Qi`, `cubicaciones_guardadas`
- **Función:** consolida materiales para lista de compras y solicitudes/cotizaciones.

### 6. Cálculo de mano de obra

- **Archivo:** `src/assets/index.js`
- **Líneas:** `17726-17745`
- **Nombre:** `calculaMO`
- **Dependencias:** `cfg.moItems`, `apu.rendimiento`, `apu.dotacion`, cuadrilla opcional
- **Función:** costo de cuadrilla diario dividido por rendimiento.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `17757-17766`
- **Nombre:** `li`
- **Dependencias:** `calculaMO`
- **Función:** prioridad de MO: precio manual, jornales/rendimiento o porcentaje sobre materiales.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `57026-57349`
- **Nombre:** `Ng` — Mano de Obra Real
- **Dependencias:** `cfg.moItems`, facturación promedio
- **Función:** configuración de jornales y porcentaje MO real.

### 7. Gastos generales

- **Archivo:** `src/assets/index.js`
- **Líneas:** `17746-17766`
- **Nombre:** `li`
- **Dependencias:** costo de materiales + MO, `pctGG`
- **Función:** aplica GG al costo directo; en subcontratos los aplica al precio base.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `37625-37643`
- **Nombre:** `j` y estado `B/w` dentro de `lg`
- **Dependencias:** `cfg.ggItems`, `ggFacturacionPromedio`
- **Función:** deriva el porcentaje GG inicial usado por el presupuesto.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `57626-57947`
- **Nombre:** `Wg` — Gastos Generales Reales
- **Dependencias:** `cfg.ggItems`, periodicidad, facturación
- **Función:** configuración y cálculo del porcentaje GG.

### 8. Utilidad

- **Archivo:** `src/assets/index.js`
- **Líneas:** `17761-17766`
- **Nombre:** `li`
- **Dependencias:** costo directo + GG, `pctUtilidad`
- **Función:** aplica utilidad después de GG y obtiene el precio final.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `37634-37643`
- **Nombre:** `F` y estado `v/x` dentro de `lg`
- **Dependencias:** `cfg.utilItems`
- **Función:** deriva el porcentaje inicial de utilidad del presupuesto.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `57350-57625`
- **Nombre:** `Og` — Utilidad y Margen
- **Dependencias:** `cfg.utilItems`
- **Función:** configura componentes y porcentaje de utilidad.

### 9. IVA

- **Archivo:** `src/assets/index.js`
- **Líneas:** `17687-17724`
- **Nombre:** `Ee`
- **Dependencias:** `cfg.moneda.impuesto`, `cfg.iva`, bandera `sinIva`
- **Función:** calcula subtotal, impuesto, bruto, descuento, total y anticipo. Si `sinIva` es verdadero, la tasa es cero.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `17800-17900` aprox.
- **Nombre:** `es`
- **Dependencias:** configuración de país
- **Función:** tabla de moneda e impuesto por país.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `57969-59684`, especialmente `59158-59379`
- **Nombre:** `Gg` — Configuración
- **Dependencias:** `es`, `setCfg`
- **Función:** selección de país, moneda, nombre y porcentaje de impuesto.

### 10. Descuentos

- **Archivo:** `src/assets/index.js`
- **Líneas:** `17712-17720`
- **Nombre:** `Ee`
- **Dependencias:** bandera del presupuesto y `cfg.descuento`
- **Función:** resta el porcentaje configurado después de impuesto.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `37665`, `37686`, `38820-38872`
- **Nombre:** estado `I.descuento` dentro de `lg`
- **Dependencias:** `Ee`
- **Función:** activa/desactiva y presenta el descuento.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `59176-59189`
- **Nombre:** configuración dentro de `Gg`
- **Dependencias:** `cfg.descuento`
- **Función:** porcentaje global de descuento.

### 11. Clientes

- **Archivo:** `src/assets/index.js`
- **Líneas:** `42570-44120`
- **Nombre:** `hg` — Clientes
- **Dependencias:** `Ee`, `zt`, `window.XLSX`, presupuestos, `setClients`
- **Función:** CRUD, validación RUT, duplicados, métricas de deuda, filtros, Excel y contacto.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `74640`, `74868-74870`
- **Nombre:** estado `p/C` dentro de `Jg`
- **Dependencias:** `pt("clients")`, `_t("clients")`
- **Función:** carga y persistencia de clientes.

### 12. Proveedores

- **Archivo:** `src/assets/index.js`
- **Líneas:** `79907-82948`
- **Nombre:** `ModuloProveedores`
- **Dependencias:** presupuestos, `bg`, APU, materiales, `window.XLSX`, `localStorage`
- **Función:** CRUD de proveedores, solicitudes de cotización, comparación y adopción de precios, historial y adquisiciones.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `79998-80025`
- **Nombre:** `saveProv`, `deleteProv`
- **Dependencias:** clave `enlace_constructor_pro_v1_proveedores`
- **Función:** guarda y elimina proveedores.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `78370-79905`
- **Nombre:** `GeneradorOCModulo`
- **Dependencias:** proveedores, materiales, `jsPDF`, `XLSX`
- **Función:** genera solicitudes de cotización y órdenes de compra.

- **Fuentes intermedias legibles:** `src/assets/modulo_proveedores.js`, `src/assets/generador_oc_modulo.js`
- **Observación:** no se cargan directamente; su lógica fue copiada/integrada al archivo canónico.

### 13. Plantillas

- **Archivo:** `src/assets/index.js`
- **Líneas:** `30997-31998`
- **Nombre:** `Xf`
- **Dependencias:** catálogo
- **Función:** plantillas estándar de tipos de obra.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `31999-32129`
- **Nombre:** `Kf`
- **Dependencias:** presupuesto, callback `onSave`
- **Función:** captura nombre y partidas de una plantilla de usuario.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `32130-32690`
- **Nombre:** `Zf`
- **Dependencias:** `Xf`, `plantillasUser`
- **Función:** selector de plantillas estándar y de usuario.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `74818-74849`
- **Nombre:** estado `P/A`, funciones `S` y `O` dentro de `Jg`
- **Dependencias:** `localStorage["plantillas_user"]`
- **Función:** persistencia de plantillas creadas por el usuario.

### 14. Cubicación

- **Archivo:** `src/assets/index.js`
- **Líneas:** `33931-34826`
- **Nombre:** `ig` — cubicación desde presupuesto
- **Dependencias:** presupuestos, `qi`, `Ai`, `Qi`, `localStorage`
- **Función:** calcula cantidades consolidadas, extras, ajustes y guarda cubicaciones.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `34827-37143`
- **Nombre:** `rg` — cubicación libre/cortes
- **Dependencias:** clientes, catálogo, `cub_libre`, `cortes_guardados`, `cubicaciones_guardadas`
- **Función:** calcula m², m³, ml, unidades y optimización/registro de cortes.

### 15. PDF

- **Archivo:** `src/assets/index.js`
- **Líneas:** `18359-18380`
- **Nombre:** `zt`
- **Dependencias:** DOM
- **Función:** carga dinámica de bibliotecas cuando no están disponibles.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `18381-19091`
- **Nombre:** `zr`
- **Dependencias:** `window.jspdf`, `Ee`, `ne`, configuración y cliente
- **Función:** genera las plantillas principales de presupuesto PDF.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `21328-22494`
- **Nombre:** `Uf`
- **Dependencias:** `Ee`, `zr`, `window.XLSX`, presupuesto/cliente/configuración
- **Función:** vista previa del presupuesto y acciones PDF/Excel.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `23078-23255`
- **Nombre:** `_f`
- **Dependencias:** `zr`
- **Función:** selector visual de plantilla PDF.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `45615-46911` aprox.
- **Nombre:** componente de lista de compras (`Dp`) y generación asociada
- **Dependencias:** `bg`, `window.jspdf`
- **Función:** PDF de lista de materiales.

### 16. Excel

- **Archivo:** `src/index.html:101`
- **Nombre:** carga de `xlsx.full.min.js`
- **Dependencias:** SheetJS/XLSX global
- **Función:** disponibilidad principal de `window.XLSX`.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `21705-22011`
- **Nombre:** exportación dentro de `Uf`
- **Dependencias:** `window.XLSX`, `Ee`
- **Función:** presupuesto a `.xlsx`.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `27684-27786`
- **Nombre:** exportación/importación dentro de `Vf`
- **Dependencias:** `window.XLSX`
- **Función:** base de materiales.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `40488-40764`
- **Nombre:** exportación dentro de `mg`
- **Dependencias:** `window.XLSX`
- **Función:** documentos de presupuesto.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `42717-42850`
- **Nombre:** `w`/`v` dentro de `hg`
- **Dependencias:** `zt`, `window.XLSX`, `FileReader`
- **Función:** exportar e importar clientes.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `80028-80142`
- **Nombre:** `exportarPlantilla`, `importarCotizacion`
- **Dependencias:** `window.XLSX`
- **Función:** intercambio de cotizaciones con proveedores.

### 17. Persistencia local

- **Archivo:** `src/assets/index.js`
- **Líneas:** `66102-66115`
- **Nombre:** `Bn`, `pt`, `_t`
- **Dependencias:** `localStorage`, JSON
- **Función:** acceso genérico con prefijo `enlace_constructor_pro_v1_`.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `74491-74900` aprox.
- **Nombre:** `Jg` — componente raíz
- **Dependencias:** `pt`, `_t`, React
- **Función:** inicializa y sincroniza configuración, clientes, catálogo, materiales, APU, presupuestos, licitaciones y preferencias.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `59685-59855`
- **Nombre:** `Hp`, `$p`, `Vp`, `_g`
- **Dependencias:** `localStorage`, Blob, FileReader
- **Función:** respaldos locales, exportación, importación y restauración.

- **Archivo:** `src/index.html`
- **Líneas:** `109-540`
- **Nombre:** `seed`
- **Dependencias:** `claude_pack.js`, `localStorage`
- **Función:** migraciones y reparación de datos previas al arranque.

Claves principales observadas:

```text
enlace_constructor_pro_v1_cfg
enlace_constructor_pro_v1_budgets
enlace_constructor_pro_v1_clients
enlace_constructor_pro_v1_catalog
enlace_constructor_pro_v1_materiales
enlace_constructor_pro_v1_apus
enlace_constructor_pro_v1_licitaciones
enlace_constructor_pro_v1_proveedores
enlace_constructor_pro_v1_adquisiciones
plantillas_user
cubicaciones_guardadas
cub_libre
cortes_guardados
```

### 18. Licencias o planes

- **Archivo:** `src/assets/index.js`
- **Líneas:** `56372-56514`
- **Nombre:** `Fe` y matrices de acceso relacionadas
- **Dependencias:** nombres de módulos y documentos
- **Función:** catálogo de planes y requisitos mínimos por función.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `56515-56640`
- **Nombre:** `Gt`
- **Dependencias:** código de activación, RUT, fecha, `localStorage` para prueba
- **Función:** valida código local, vencimiento, plan y prueba de 10 días.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `56641-56766`
- **Nombre:** `Lg`
- **Dependencias:** `Gt`
- **Función:** bloqueo/activación al vencer la prueba.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `56767-57025`
- **Nombre:** `Dg`
- **Dependencias:** `Gt`, `Fe`, configuración
- **Función:** panel de licencia, código, plan y días restantes.

- **Archivo:** `src/assets/index.js`
- **Líneas:** `49169-50831`
- **Nombres:** `He`, `Op`, `Pg`, `Tg`
- **Dependencias:** planes, módulos, catálogo
- **Función:** controles y presentación de acceso por licencia en distintas pantallas.

## Correspondencia con el fuente JSX histórico

Los nombres funcionales legibles se encuentran en `src/app.backup.html` y `src/_legacy/app_legacy_2026-07-23.html`. Ejemplos:

| Función histórica legible | Identificador vigente aproximado |
|---|---|
| `calcAPU` | `li` |
| `BudgetForm` | `lg` |
| `APUPage` / `APUWrapper` | `Hf` |
| `MaterialesPage` | `Vf` |
| `ClientsPage` | `hg` |
| `CatalogPage` | `vg` |
| `computarMateriales` | `bg` |
| `CubicacionDesdePresupuesto` | `ig` |
| `CubicacionPage` | `rg` |
| `GuardarPlantillaModal` | `Kf` |
| `PlantillaModal` | `Zf` |
| `parseLicencia` | `Gt` |
| `App` | `Jg` |

La correspondencia es funcional, no un source map exacto.
