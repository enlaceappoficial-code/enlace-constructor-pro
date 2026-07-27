# Reporte de taxonomía propuesta — ECP (Fase 1A)

Generado automáticamente a partir de la biblioteca canónica actual (`src/assets/index.js`, rama `feature/taxonomia-ecp`). **La fuente canónica no fue modificada**: este reporte y los archivos que lo acompañan (`PARTIDAS_TAXONOMIA_PROPUESTA.csv`, `CATEGORIAS_ACTUALES_ECP.csv`, `DICCIONARIO_TAXONOMICO_ECP.json`) son una **propuesta** para revisión humana antes de cualquier implementación.

## 1. Resumen cuantitativo

- **Categorías actuales (`cat`) distintas en el catálogo:** 51
- **Rubros propuestos utilizados:** 30 de 30 posibles (el vocabulario controlado completo se usó en su totalidad)
- **Partidas clasificadas:** 311 de 311
- **Partidas que requieren revisión humana:** 20 (6.4%)
  - Confianza **baja**: 4
  - Confianza **media**: 16
  - Confianza **alta** (no requiere revisión): 291

## 2. Categorías duplicadas o equivalentes

Se detectaron categorías actuales que representan el mismo rubro real bajo nombres distintos:

| Categorías actuales | Rubro propuesto unificado |
|---|---|
| `Impermeable` / `Impermeabilización` | Impermeabilización |
| `Servicios` / `Servicios Generales` | Servicios profesionales (parcial — ambas son catch-all, ver sección 5) |
| `Equipamiento` / `Equipamiento Comercial` | Equipamiento y mobiliario |
| `Seguridad` / `Corrientes Débiles` | Corrientes débiles y seguridad electrónica (contenido muy similar: CCTV, alarmas, control de acceso) |

## 3. Errores ortográficos detectados

- **`Ojalaería`** — grafía incorrecta. El término correcto del oficio es **"Hojalatería"** (trabajo en chapa/lámina metálica: canales, bajantes, cubiertas de zinc). Falta la "h" inicial y la "t".
- **`Mov. de Tierras`** — es la única categoría abreviada; el resto de las 51 categorías usa el nombre completo (debería ser "Movimiento de Tierras" para consistencia, no es un error ortográfico estricto pero sí de formato).

## 4. Categorías que mezclan rubro (qué se hace) con tipo de intervención (cuándo/por qué se hace)

Varias categorías actuales codifican en el mismo nombre tanto el sistema constructivo como la etapa del proyecto, lo que impide filtrar por una sola dimensión:

- **Familia Metalcon**: `Metalcon NC` (obra nueva), `Metalcon Rem.` (remodelación), `Metalcon Mant.` (mantención), `Metalcon Estructural` (uso estructural/carga) — 4 categorías para un mismo sistema constructivo, separadas por intervención en vez de por rubro.
- **Familia Madera**: `Madera NC` (obra nueva) vs. `Madera Mant.` (mantención) — mismo patrón.
- **Familia "Mantención \*"**: `Mantención Pintura`, `Mantención Sanitaria`, `Mantención Eléctrica`, `Mantención Techumbres`, `Mantención Preventiva` — el prefijo "Mantención" es en realidad un valor de `tipoIntervencionPropuesto`, no un rubro; cada una debería vivir dentro del rubro técnico correspondiente (Pinturas y recubrimientos, Instalaciones sanitarias, Instalaciones eléctricas, Techumbres y aguas lluvias) con `tipoIntervencionPropuesto = "Mantención preventiva"` o `"Mantención correctiva"`.
- **`Demolición` y `Regularización`**: coinciden por diseño con un valor del vocabulario de `tipoIntervencionPropuesto`; en este caso el rubro propuesto (Demoliciones y desmontajes / Servicios profesionales) es igualmente válido y se mantuvo, pero se documenta la coincidencia para que quede explícita.

## 5. Categorías que mezclan material/sistema constructivo con función

La misma familia Metalcon/Madera mezcla además **sistema constructivo** con **rubro funcional**: por ejemplo `Metalcon NC` agrupa tabiques, techumbres y cielos —tres rubros funcionales distintos (Construcción liviana, Techumbres y aguas lluvias, Cielos y terminaciones)— solo porque comparten el mismo material de estructura. Este trabajo de clasificación separó esas partidas por función real (ver columna `rubroPropuesto`) y dejó el material en `sistemaConstructivoPropuesto`.

También `Hormigón Armado` vs. `Hormigón y Albañilería` se superponen parcialmente (radieres y fundaciones aparecen repartidos entre ambas).

## 6. Categorías transitorias / catch-all identificadas

Estas categorías no representan un rubro técnico coherente; agrupan partidas heterogéneas y **cada partida fue reclasificada individualmente** en vez de heredar un rubro común:

- `Varios` (2 partidas)
- `Reparaciones Generales` (2 partidas)
- `Servicios Generales` (4 partidas)
- `Servicios` (1 partida)
- `Fachadas y Vidrios` (2 partidas — una es fachada real, la otra es una ventana que corresponde a carpintería)

## 7. Partidas ambiguas (requieren revisión humana)

| id | categoriaActual | descripcion | rubroPropuesto | confianza | motivo |
|---|---|---|---|---|---|
| 97 | Gas | Sello verde y prueba hermeticidad | Instalaciones de gas | baja | Rubro corregido respecto de la categoría actual original (ver DICCIONARIO_TAXONOMICO_ECP.json > overridesAplicados). |
| 98 | Gas | Gestión convenio Gasco | Servicios profesionales | baja | Rubro corregido respecto de la categoría actual original (ver DICCIONARIO_TAXONOMICO_ECP.json > overridesAplicados). |
| 115 | Varios | Reinstalación citófono | Corrientes débiles y seguridad electrónica | media | Categoría actual "Varios" es transitoria/catch-all; reclasificado a nivel de partida. Rubro corregido respecto de la categoría actual original (ver DICCIONARIO_TAXONOMICO_ECP.json > overridesAplicados). |
| 116 | Varios | Celosías y cambio de ventanas | Puertas, ventanas y carpinterías | baja | Categoría actual "Varios" es transitoria/catch-all; reclasificado a nivel de partida. Rubro corregido respecto de la categoría actual original (ver DICCIONARIO_TAXONOMICO_ECP.json > overridesAplicados). |
| 160 | Sanitario | Cámara de inspección hormigón ø60cm | Alcantarillado y drenaje | media | Rubro corregido respecto de la categoría actual original (ver DICCIONARIO_TAXONOMICO_ECP.json > overridesAplicados). |
| 161 | Sanitario | Colector PVC ø110mm instalado | Alcantarillado y drenaje | media | Rubro corregido respecto de la categoría actual original (ver DICCIONARIO_TAXONOMICO_ECP.json > overridesAplicados). |
| 162 | Sanitario | Colector PVC ø160mm instalado | Alcantarillado y drenaje | media | Rubro corregido respecto de la categoría actual original (ver DICCIONARIO_TAXONOMICO_ECP.json > overridesAplicados). |
| 163 | Sanitario | Red alcantarillado vivienda completa | Alcantarillado y drenaje | media | Rubro corregido respecto de la categoría actual original (ver DICCIONARIO_TAXONOMICO_ECP.json > overridesAplicados). |
| 164 | Sanitario | Trampa de grasa 30L (inst.) | Alcantarillado y drenaje | media | Rubro corregido respecto de la categoría actual original (ver DICCIONARIO_TAXONOMICO_ECP.json > overridesAplicados). |
| 315 | Mantención Sanitaria | Destape de WC o cámara de inspección domiciliaria | Alcantarillado y drenaje | media | Rubro corregido respecto de la categoría actual original (ver DICCIONARIO_TAXONOMICO_ECP.json > overridesAplicados). |
| 319 | Reparaciones Generales | Cambio de chapa/cerradura puerta | Puertas, ventanas y carpinterías | media | Categoría actual "Reparaciones Generales" es transitoria/catch-all; reclasificado a nivel de partida. Rubro corregido respecto de la categoría actual original (ver DICCIONARIO_TAXONOMICO_ECP.json > overridesAplicados). |
| 320 | Reparaciones Generales | Reparación parche yeso/empaste muro dañado | Cielos y terminaciones | media | Categoría actual "Reparaciones Generales" es transitoria/catch-all; reclasificado a nivel de partida. Rubro corregido respecto de la categoría actual original (ver DICCIONARIO_TAXONOMICO_ECP.json > overridesAplicados). |
| 328 | Fachadas y Vidrios | Ventana PVC termopanel instalada | Puertas, ventanas y carpinterías | media | Categoría actual "Fachadas y Vidrios" es transitoria/catch-all; reclasificado a nivel de partida. Rubro corregido respecto de la categoría actual original (ver DICCIONARIO_TAXONOMICO_ECP.json > overridesAplicados). |
| 363 | Servicios Generales | Traslado y acarreo de mobiliario (mudanza interna) | Obras preliminares | media | Categoría actual "Servicios Generales" es transitoria/catch-all; reclasificado a nivel de partida. Rubro corregido respecto de la categoría actual original (ver DICCIONARIO_TAXONOMICO_ECP.json > overridesAplicados). |
| 364 | Servicios Generales | Jornada adicional de especialista a trato | Servicios profesionales | media | Categoría actual "Servicios Generales" es transitoria/catch-all; reclasificado a nivel de partida. Rubro corregido respecto de la categoría actual original (ver DICCIONARIO_TAXONOMICO_ECP.json > overridesAplicados). |
| 371 | Instalaciones Sanitarias | Ampliación de red de desagüe PVC interior | Alcantarillado y drenaje | media | Rubro corregido respecto de la categoría actual original (ver DICCIONARIO_TAXONOMICO_ECP.json > overridesAplicados). |
| 406 | Techumbres | Impermeabilización acrílica de techumbre | Techumbres y aguas lluvias | media | Rubro corregido respecto de la categoría actual original (ver DICCIONARIO_TAXONOMICO_ECP.json > overridesAplicados). |
| 420 | Tabiquería | Tabique cortafuego con placa yeso RF 15mm | Construcción liviana | baja | Rubro corregido respecto de la categoría actual original (ver DICCIONARIO_TAXONOMICO_ECP.json > overridesAplicados). |
| 423 | Instalaciones Sanitarias | Red de desagüe PVC 4" (colector principal) | Alcantarillado y drenaje | media | Rubro corregido respecto de la categoría actual original (ver DICCIONARIO_TAXONOMICO_ECP.json > overridesAplicados). |
| 432 | Servicios | Transporte en camión tolva 8 m³ (flete general) | Demoliciones y desmontajes | media | Categoría actual "Servicios" es transitoria/catch-all; reclasificado a nivel de partida. Rubro corregido respecto de la categoría actual original (ver DICCIONARIO_TAXONOMICO_ECP.json > overridesAplicados). |


## 8. Distribución de partidas por rubro propuesto

| rubroPropuesto | cantidadPartidas | porcentaje |
|---|---|---|
| Estructuras metálicas | 30 | 9.6% |
| Obras exteriores y urbanización | 27 | 8.7% |
| Hormigón y fundaciones | 21 | 6.8% |
| Construcción liviana | 20 | 6.4% |
| Instalaciones eléctricas | 17 | 5.5% |
| Instalaciones sanitarias | 17 | 5.5% |
| Albañilería | 15 | 4.8% |
| Pisos y revestimientos | 14 | 4.5% |
| Techumbres y aguas lluvias | 13 | 4.2% |
| Puertas, ventanas y carpinterías | 13 | 4.2% |
| Pinturas y recubrimientos | 11 | 3.5% |
| Demoliciones y desmontajes | 11 | 3.5% |
| Corrientes débiles y seguridad electrónica | 9 | 2.9% |
| Movimiento de tierras | 9 | 2.9% |
| Obras preliminares | 9 | 2.9% |
| Piscinas | 9 | 2.9% |
| Impermeabilización | 8 | 2.6% |
| Instalaciones de gas | 8 | 2.6% |
| Climatización y ventilación | 8 | 2.6% |
| Alcantarillado y drenaje | 8 | 2.6% |
| Cielos y terminaciones | 7 | 2.3% |
| Equipamiento y mobiliario | 6 | 1.9% |
| Servicios profesionales | 5 | 1.6% |
| Aislación y eficiencia energética | 4 | 1.3% |
| Protección contra incendios | 3 | 1.0% |
| Mantención general | 3 | 1.0% |
| Paisajismo y riego | 2 | 0.6% |
| Accesibilidad universal | 2 | 0.6% |
| Fachadas y cerramientos | 1 | 0.3% |
| Limpieza, pruebas y entrega | 1 | 0.3% |


## 9. Partidas con confianza baja (prioridad de revisión)

| id | categoriaActual | descripcion | rubroPropuesto | observacion |
|---|---|---|---|---|
| 97 | Gas | Sello verde y prueba hermeticidad | Instalaciones de gas | Rubro corregido respecto de la categoría actual original (ver DICCIONARIO_TAXONOMICO_ECP.json > overridesAplicados). |
| 98 | Gas | Gestión convenio Gasco | Servicios profesionales | Rubro corregido respecto de la categoría actual original (ver DICCIONARIO_TAXONOMICO_ECP.json > overridesAplicados). |
| 116 | Varios | Celosías y cambio de ventanas | Puertas, ventanas y carpinterías | Categoría actual "Varios" es transitoria/catch-all; reclasificado a nivel de partida. Rubro corregido respecto de la categoría actual original (ver DICCIONARIO_TAXONOMICO_ECP.json > overridesAplicados). |
| 420 | Tabiquería | Tabique cortafuego con placa yeso RF 15mm | Construcción liviana | Rubro corregido respecto de la categoría actual original (ver DICCIONARIO_TAXONOMICO_ECP.json > overridesAplicados). |


## 10. Metodología

La clasificación se generó con un script determinístico (`scripts/classify_taxonomy.js`) que:

1. Parte de un mapa categoría-actual → rubro-base, **sin asumir que ese mapeo es siempre correcto**.
2. Aplica un conjunto de reglas por ítem (por palabra clave en la descripción) que **corrige** el rubro base cuando la categoría original es transitoria, mezcla dos rubros, o el nombre de la partida indica claramente un rubro distinto (ej.: "Cámara de inspección" dentro de la categoría "Sanitario" se reclasifica a *Alcantarillado y drenaje* en vez de *Instalaciones sanitarias*).
3. Usa el campo `estructura` del APU vinculado (Hormigón / Metalcon / Madera / Estructuras Metálicas) y palabras clave de material (PVC, PPR, cobre, ACMA, aluminio, cerámico, etc.) para proponer `sistemaConstructivoPropuesto`, dando prioridad a las palabras clave de la descripción por sobre el campo genérico del APU (que en esta fuente usa "Hormigón" como etiqueta estructural amplia incluso para muros de albañilería reforzada).
4. Usa `esSubcontrato` del APU y palabras clave (fabricación, retiro, sin instalación, jornada, etc.) para proponer `alcancePropuesto`.
5. Asigna `confianza` según si hubo una regla explícita por ítem (que ya declara su propia confianza), si la categoría original es transitoria (confianza baja por defecto), o si el ítem no tiene APU vinculado (baja un nivel).

## 11. Recomendaciones antes de implementar

1. **Revisar primero las 4 partidas de confianza baja** (sección 9) — son los casos donde el propio criterio de clasificación reconoce ambigüedad real (p. ej. "Sello verde y prueba hermeticidad" podría vivir en *Instalaciones de gas* o en *Limpieza, pruebas y entrega*; "Tabique cortafuego" podría vivir en *Construcción liviana* o en *Protección contra incendios*).
2. **Resolver las categorías catch-all antes de cualquier migración de datos** (`Varios`, `Servicios`, `Servicios Generales`, `Reparaciones Generales`, `Fachadas y Vidrios`) — son pocas partidas pero cada una necesita una decisión explícita, no una regla automática.
3. **Decidir si `subrubroPropuesto` se deja como campo libre o se convierte en un segundo vocabulario controlado** antes de implementar: hoy es una etiqueta descriptiva de apoyo (no validada contra una lista cerrada) y en 86 partidas (28%) no se encontró un subrubro más específico y se heredó el nombre de la categoría actual.
4. **No fusionar categorías automáticamente**: aunque `Impermeable`/`Impermeabilización` y `Seguridad`/`Corrientes Débiles` apuntan al mismo rubro propuesto, la fusión de categorías en la fuente canónica es una operación separada que debe hacerse partida por partida, con el mismo cuidado que cualquier cambio a `src/assets/index.js` (ver `docs/FUENTE_CANONICA_ECP.md`).
5. **Tratar `especialidadPropuesta` como una primera aproximación**, no como un campo validado: se derivó 1:1 desde el rubro propuesto y no distingue casos donde una misma partida podría requerir dos especialidades (ej. un muro cortina es a la vez fachada y carpintería de aluminio/vidrio).
6. **Esta propuesta no incluyó los 327 materiales ni los 311 APU** más allá de usarlos como señal de clasificación (campo `estructura`, `esSubcontrato`); una Fase 1B debería evaluar si materiales y APU necesitan su propia taxonomía o heredan la de su partida vinculada.
7. **No implementar los campos nuevos en `src/assets/index.js` todavía** — esta fase es solo de preparación y revisión, según lo solicitado explícitamente.

---

*Archivos generados en esta fase: `CATEGORIAS_ACTUALES_ECP.csv`, `PARTIDAS_TAXONOMIA_PROPUESTA.csv`, `DICCIONARIO_TAXONOMICO_ECP.json`, este reporte. Script generador: `scripts/classify_taxonomy.js` + `scripts/generate_taxonomy_artifacts.js` (reproducibles, no destructivos, no tocan la fuente canónica).*
