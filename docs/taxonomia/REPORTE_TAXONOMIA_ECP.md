# Reporte de taxonomía propuesta — ECP (Fase 1A)

Generado automáticamente a partir de la biblioteca canónica actual (`src/assets/index.js`, rama `feature/taxonomia-ecp`). **La fuente canónica no fue modificada**: este reporte y los archivos que lo acompañan (`PARTIDAS_TAXONOMIA_PROPUESTA.csv`, `CATEGORIAS_ACTUALES_ECP.csv`, `DICCIONARIO_TAXONOMICO_ECP.json`) son una **propuesta** para revisión humana antes de cualquier implementación.

## 0. Correcciones aplicadas en esta revisión

Esta es la segunda versión de la propuesta. La primera contenía errores sistemáticos entre partidas de confianza alta (el rubro se determinaba a veces por el material/sistema constructivo en vez de por la función de la partida). Se corrigió:

1. **Rubro por función, no por material**: radier, losas, pilares, vigas y fundaciones de hormigón dejaron de heredar el rubro Albañilería de su categoría original y pasaron a *Hormigón y fundaciones*; las techumbres de Metalcon o madera pasaron de *Construcción liviana* a *Techumbres y aguas lluvias*, independientemente de su sistema constructivo.
2. **Subrubro nunca igual a una categoría antigua**: el subrubro ya no hereda nombres como `Metalcon Mant.`, `Madera Mant.`, `Metalcon NC`, `Impermeable` o `Varios`; cuando no hay una palabra clave más específica, se usa el propio rubro propuesto.
3. **Prioridad semántica del tipo de intervención**: se reordenó para que "mantención"/"repaso" → Mantención; "reparación"/"parche"/"sellado de fisura" → Reparación; "cambio"/"reemplazo" → Reposición — en ese orden, antes que cualquier valor por defecto. Ninguna partida con esas palabras puede quedar como Obra nueva (ver `VALIDACION_SEMANTICA_TAXONOMIA.md`, reglas R2 y R3).
4. **Subcontrato solo con evidencia explícita**: el alcance "Subcontrato" exige que la descripción, el APU vinculado o su base técnica lo indiquen; sin esa evidencia se usa "Servicio completo" u otro alcance (ver `VALIDACION_SEMANTICA_TAXONOMIA.md`, regla R5).
5. **`sistemaConstructivoPropuesto`** separa ahora "No aplica" (sin sistema constructivo aplicable) de "Mixto" (partida que combina varios sistemas); se eliminó el valor combinado "No aplica / mixto".
6. **20 decisiones humanas explícitas** se aplicaron como corrección final sobre las partidas que en la revisión anterior quedaron con confianza baja o media (ver columna `observacion` de cada una); solo 2 partidas (id 363 y 432) permanecen deliberadamente marcadas para revisión humana, por instrucción explícita de no asignarlas automáticamente a un rubro.

El detalle regla por regla, con las excepciones encontradas (si las hay), está en **`docs/taxonomia/VALIDACION_SEMANTICA_TAXONOMIA.md`**.

## 1. Resumen cuantitativo

- **Categorías actuales (`cat`) distintas en el catálogo:** 51
- **Rubros propuestos utilizados:** 30 de 30 posibles (los 30 rubros del vocabulario controlado permanecen definidos aunque alguno tenga cero partidas asignadas; no es obligatorio usarlos todos)
- **Partidas clasificadas:** 311 de 311
- **Partidas que requieren revisión humana:** 2 (0.6%)
  - Confianza **baja**: 2
  - Confianza **media**: 0
  - Confianza **alta** (no requiere revisión): 309

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

**Partidas heredadas de categorías mixtas (`partidaHeredadaMixta`):** id 116 — su rubro final se fijó por decisión humana explícita (ver `observacion` y `DICCIONARIO_TAXONOMICO_ECP.json > partidasHeredadasMixtas`), no por una regla automática.

## 7. Partidas ambiguas (requieren revisión humana)

| id | categoriaActual | descripcion | rubroPropuesto | confianza | motivo |
|---|---|---|---|---|---|
| 363 | Servicios Generales | Traslado y acarreo de mobiliario (mudanza interna) | Servicios profesionales | baja | Marcado explícitamente para revisión humana; por instrucción no se asigna automáticamente a "Obras preliminares". Rubro de resguardo hasta decisión final. |
| 432 | Servicios | Transporte en camión tolva 8 m³ (flete general) | Servicios profesionales | baja | Marcado explícitamente para revisión humana como transporte y logística; por instrucción no se clasifica automáticamente en "Demoliciones y desmontajes". Rubro de resguardo hasta decisión final. |


## 8. Distribución de partidas por rubro propuesto

| rubroPropuesto | cantidadPartidas | porcentaje |
|---|---|---|
| Estructuras metálicas | 30 | 9.6% |
| Hormigón y fundaciones | 28 | 9.0% |
| Obras exteriores y urbanización | 27 | 8.7% |
| Techumbres y aguas lluvias | 18 | 5.8% |
| Instalaciones eléctricas | 17 | 5.5% |
| Instalaciones sanitarias | 17 | 5.5% |
| Pisos y revestimientos | 14 | 4.5% |
| Construcción liviana | 13 | 4.2% |
| Puertas, ventanas y carpinterías | 13 | 4.2% |
| Pinturas y recubrimientos | 11 | 3.5% |
| Demoliciones y desmontajes | 10 | 3.2% |
| Impermeabilización | 9 | 2.9% |
| Corrientes débiles y seguridad electrónica | 9 | 2.9% |
| Movimiento de tierras | 9 | 2.9% |
| Piscinas | 9 | 2.9% |
| Albañilería | 8 | 2.6% |
| Instalaciones de gas | 8 | 2.6% |
| Climatización y ventilación | 8 | 2.6% |
| Alcantarillado y drenaje | 8 | 2.6% |
| Obras preliminares | 8 | 2.6% |
| Cielos y terminaciones | 7 | 2.3% |
| Servicios profesionales | 7 | 2.3% |
| Equipamiento y mobiliario | 6 | 1.9% |
| Protección contra incendios | 4 | 1.3% |
| Aislación y eficiencia energética | 4 | 1.3% |
| Mantención general | 3 | 1.0% |
| Paisajismo y riego | 2 | 0.6% |
| Accesibilidad universal | 2 | 0.6% |
| Fachadas y cerramientos | 1 | 0.3% |
| Limpieza, pruebas y entrega | 1 | 0.3% |


**Rubros del vocabulario controlado sin partidas asignadas actualmente (0):** ninguno — los 30 rubros tienen al menos una partida. Permanecen definidos en el vocabulario controlado (regla 6): no es obligatorio que todo rubro tenga partidas para seguir existiendo como categoría válida.

## 9. Partidas con confianza baja (prioridad de revisión)

| id | categoriaActual | descripcion | rubroPropuesto | observacion |
|---|---|---|---|---|
| 363 | Servicios Generales | Traslado y acarreo de mobiliario (mudanza interna) | Servicios profesionales | Marcado explícitamente para revisión humana; por instrucción no se asigna automáticamente a "Obras preliminares". Rubro de resguardo hasta decisión final. |
| 432 | Servicios | Transporte en camión tolva 8 m³ (flete general) | Servicios profesionales | Marcado explícitamente para revisión humana como transporte y logística; por instrucción no se clasifica automáticamente en "Demoliciones y desmontajes". Rubro de resguardo hasta decisión final. |


## 10. Metodología

La clasificación se generó con un script determinístico (`scripts/classify_taxonomy.js`) que:

1. Parte de un mapa categoría-actual → rubro-base, **sin asumir que ese mapeo es siempre correcto**.
2. Aplica un conjunto de reglas por ítem (por palabra clave en la descripción) que **corrige** el rubro base cuando la categoría original es transitoria, mezcla dos rubros, o el nombre de la partida indica claramente un rubro distinto (ej.: "Cámara de inspección" dentro de la categoría "Sanitario" se reclasifica a *Alcantarillado y drenaje* en vez de *Instalaciones sanitarias*).
3. Usa el campo `estructura` del APU vinculado (Hormigón / Metalcon / Madera / Estructuras Metálicas) y palabras clave de material (PVC, PPR, cobre, ACMA, aluminio, cerámico, etc.) para proponer `sistemaConstructivoPropuesto`, dando prioridad a las palabras clave de la descripción por sobre el campo genérico del APU (que en esta fuente usa "Hormigón" como etiqueta estructural amplia incluso para muros de albañilería reforzada).
4. Usa `esSubcontrato` del APU y palabras clave (fabricación, retiro, sin instalación, jornada, etc.) para proponer `alcancePropuesto`.
5. Asigna `confianza` según si hubo una regla explícita por ítem (que ya declara su propia confianza), si la categoría original es transitoria (confianza baja por defecto), o si el ítem no tiene APU vinculado (baja un nivel).

## 11. Recomendaciones antes de implementar

1. **Decidir el rubro final de las 2 partidas aún marcadas de confianza baja** (sección 9: id 363 "Traslado y acarreo de mobiliario" e id 432 "Transporte en camión tolva") — quedaron deliberadamente sin asignación automática a "Obras preliminares" ni "Demoliciones y desmontajes" por instrucción explícita; hoy están en un rubro de resguardo ("Servicios profesionales") y requieren una decisión humana puntual.
2. **Resolver las categorías catch-all antes de cualquier migración de datos** (`Varios`, `Servicios`, `Servicios Generales`, `Reparaciones Generales`, `Fachadas y Vidrios`) — la mayoría de sus partidas ya recibieron una decisión humana explícita en esta fase (ver `observacion`), pero la fusión real de categorías en la fuente canónica sigue pendiente.
3. **Decidir si `subrubroPropuesto` se deja como campo libre o se convierte en un segundo vocabulario controlado** antes de implementar: hoy es una etiqueta descriptiva de apoyo (no validada contra una lista cerrada, aunque sí validada para que nunca repita el nombre de una categoría actual) y en 74 partidas (24%) no se encontró un subrubro más específico que el propio rubro propuesto.
4. **No fusionar categorías automáticamente**: aunque `Impermeable`/`Impermeabilización` y `Seguridad`/`Corrientes Débiles` apuntan al mismo rubro propuesto, la fusión de categorías en la fuente canónica es una operación separada que debe hacerse partida por partida, con el mismo cuidado que cualquier cambio a `src/assets/index.js` (ver `docs/FUENTE_CANONICA_ECP.md`).
5. **Tratar `especialidadPropuesta` como una primera aproximación**, no como un campo validado: se derivó 1:1 desde el rubro propuesto y no distingue casos donde una misma partida podría requerir dos especialidades (ej. un muro cortina es a la vez fachada y carpintería de aluminio/vidrio).
6. **Esta propuesta no incluyó los 327 materiales ni los 311 APU** más allá de usarlos como señal de clasificación (campo `estructura`, `esSubcontrato`); una Fase 1B debería evaluar si materiales y APU necesitan su propia taxonomía o heredan la de su partida vinculada.
7. **No implementar los campos nuevos en `src/assets/index.js` todavía** — esta fase es solo de preparación y revisión, según lo solicitado explícitamente.

---

*Archivos generados en esta fase: `CATEGORIAS_ACTUALES_ECP.csv`, `PARTIDAS_TAXONOMIA_PROPUESTA.csv`, `DICCIONARIO_TAXONOMICO_ECP.json`, este reporte. Script generador: `scripts/classify_taxonomy.js` + `scripts/generate_taxonomy_artifacts.js` (reproducibles, no destructivos, no tocan la fuente canónica).*
