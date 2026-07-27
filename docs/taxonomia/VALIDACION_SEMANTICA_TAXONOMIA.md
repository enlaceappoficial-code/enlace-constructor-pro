# Validación semántica automática — Taxonomía ECP

Resultado de ejecutar `scripts/validate_taxonomy_semantics.js` sobre `docs/taxonomia/PARTIDAS_TAXONOMIA_PROPUESTA.csv` (311 partidas). No se modificó la fuente canónica ni ningún dato productivo para generar este archivo.

**Resumen: 8 de 8 reglas pasan sin excepciones.**

## R1 — PASA

Ninguna partida que contenga radier, losa, fundación, pilar de hormigón o viga de hormigón puede quedar en el rubro Albañilería.

Sin excepciones.

## R2 — PASA

Ninguna descripción que contenga "mantención" puede quedar clasificada como tipo de intervención Obra nueva.

Sin excepciones.

## R3 — PASA

Ninguna descripción que contenga "reparación" o "parche" puede quedar clasificada como tipo de intervención Obra nueva.

Sin excepciones.

## R4 — PASA

Ningún subrubroPropuesto puede coincidir con el nombre de una categoría antigua abreviada, transitoria, duplicada o que mezcle rubro/material con función (ej. "Metalcon Mant.", "Madera Mant.", "Metalcon NC", "Impermeable", "Varios").

Sin excepciones.

## R5 — PASA

Ninguna partida puede quedar clasificada con alcance "Subcontrato" sin evidencia explícita en la descripción, en el campo esSubcontrato del APU vinculado, o en su base técnica.

Sin excepciones.

## R6 — PASA

Toda partida cuya descripción comience con "Techumbre" debe quedar en el rubro "Techumbres y aguas lluvias", sin importar si su sistema constructivo (apu.estructura) es Metalcon, madera u otro.

Sin excepciones.

## R7 — PASA

El valor combinado "No aplica / mixto" fue eliminado del vocabulario; ninguna partida puede conservarlo (deben quedar como "No aplica" o "Mixto" por separado).

Sin excepciones.

## R8 — PASA

Todo rubroPropuesto debe pertenecer al vocabulario controlado de 30 rubros (aunque algunos rubros puedan tener cero partidas asignadas).

Sin excepciones.

---

*Generado por `scripts/validate_taxonomy_semantics.js`. Reglas R1–R6 corresponden literalmente a la regla 7 del encargo de corrección; R7–R8 son verificaciones de consistencia interna agregadas para respaldar el resto de esta fase.*
