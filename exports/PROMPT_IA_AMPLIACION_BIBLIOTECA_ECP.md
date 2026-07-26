# Prompt para ampliar la biblioteca de ECP

Copia este texto en la otra IA y adjunta el archivo `ECP_BIBLIOTECA_IA_2026-07-26.json`.

---

Actúa como especialista chileno en presupuestos de construcción, cubicaciones y análisis de precios unitarios para obras menores, mantenciones, remodelaciones y obras nuevas residenciales, comerciales e industriales.

Te adjunto la biblioteca canónica actual de Enlace Constructor Pro en JSON. Contiene tres colecciones relacionadas:

- `partidas`: actividades presupuestables;
- `materiales`: insumos, equipos y recursos comprados;
- `apus`: composición técnica y económica de cada partida.

Tu trabajo es auditar su cobertura y proponer únicamente los elementos faltantes necesarios para que un maestro, contratista o empresa constructora pueda presupuestar desde reparaciones menores hasta una casa, edificio o local comercial.

## Objetivos

1. Detectar rubros, subrubros y especialidades ausentes o insuficientemente cubiertas.
2. Identificar partidas existentes que requieran variantes técnicamente distintas.
3. Proponer nuevas partidas, materiales y APU completos.
4. Evitar cualquier duplicado semántico con la biblioteca adjunta.
5. Mantener terminología, unidades y estructura compatibles con Chile.

## Cobertura que debes revisar

- obras preliminares, trazado e instalación de faena;
- demoliciones, desmontajes, retiro y transporte de escombros;
- movimiento de tierras, excavaciones, rellenos y compactación;
- fundaciones y hormigón armado;
- albañilería, tabiquería, estructuras de madera, acero y Metalcon;
- techumbres, hojalatería e impermeabilización;
- fachadas, aislación térmica, EIFS, muro cortina y termopaneles;
- puertas, ventanas, quincallería y carpinterías;
- pisos, revestimientos, cielos y pinturas;
- instalaciones sanitarias, aguas lluvias, alcantarillado y gas;
- electricidad domiciliaria e industrial, corrientes débiles y puesta a tierra;
- climatización, ventilación, extracción y calefacción;
- redes de datos, CCTV, alarmas, control de acceso y videoportero;
- protección contra incendios;
- accesibilidad universal y pavimentos podotáctiles;
- muebles de cocina, clósets y equipamiento comercial;
- urbanización, pavimentos, cierres, paisajismo y riego;
- sistemas fotovoltaicos, termos solares y eficiencia energética;
- mantenciones preventivas y correctivas;
- limpieza, pruebas, certificaciones, puesta en marcha y entrega.

## Reglas obligatorias

- Lee primero todo el JSON adjunto.
- No modifiques ni repitas registros existentes.
- Considera iguales los nombres que solo cambien en mayúsculas, acentos, abreviaturas o redacción superficial.
- Usa precios referenciales en pesos chilenos, sin IVA, indicando región y mes base asumidos.
- El precio de una partida debe ser coherente con su APU.
- Cada APU nuevo debe tener una partida nueva o vincularse expresamente a una partida existente.
- Cada `materialId` utilizado debe existir en la biblioteca o estar incluido entre los materiales nuevos.
- La unidad del APU debe coincidir con la unidad de su partida.
- `cantidad` representa consumo por una unidad de la partida e incluye una merma razonable cuando corresponda.
- Usa rendimiento de cuadrilla realista y dotación coherente.
- Conserva los porcentajes de gastos generales y utilidad del modelo cuando no exista una razón técnica para cambiarlos.
- No inventes normas, certificaciones ni exigencias reglamentarias.
- No asignes los IDs definitivamente hasta comprobar los máximos indicados en `metadata.proximoIdSugerido`.

## Forma de trabajo

Primero entrega una matriz de brechas con:

- rubro;
- cobertura actual;
- partidas faltantes;
- prioridad `alta`, `media` o `baja`;
- justificación técnica.

Después espera mi aprobación de los rubros que deseo desarrollar.

Cuando yo apruebe un bloque, devuelve únicamente un JSON válido, sin comentarios dentro del JSON, con esta estructura:

```json
{
  "supuestos": {
    "pais": "Chile",
    "regionPrecio": "",
    "mesBase": "",
    "moneda": "CLP",
    "ivaIncluido": false
  },
  "partidasNuevas": [],
  "materialesNuevos": [],
  "apusNuevos": [],
  "advertencias": []
}
```

Para cada propuesta agrega, fuera de los campos obligatorios de ECP:

- `fuenteOJustificacion`;
- `confianza`: `alta`, `media` o `baja`;
- `requiereCotizacion`: `true` o `false`.

Si desconoces un precio o rendimiento, no lo presentes como exacto: usa una estimación explícita, marca `requiereCotizacion: true` y explica el supuesto en `advertencias`.

Antes de responder valida:

- IDs sin colisiones;
- nombres sin duplicados;
- referencias `catalogId` válidas;
- referencias `materialId` válidas;
- unidades compatibles;
- cantidades positivas;
- precios no negativos;
- APU con componentes suficientes;
- ausencia de partidas huérfanas.

No reescribas la biblioteca completa. Entrega solamente las adiciones aprobadas.

---
