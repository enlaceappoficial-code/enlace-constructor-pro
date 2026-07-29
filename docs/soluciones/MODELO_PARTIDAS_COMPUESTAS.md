# Modelo de partidas compuestas ("Soluciones") — ECP

Estado: **propuesta de diseño, no implementada.** Este documento describe la estructura de datos y las reglas de negocio para agrupar varias partidas simples existentes bajo un mismo "paquete" reutilizable (una "solución") que el usuario pueda agregar de una vez a un presupuesto, revisando y ajustando cada partida antes de confirmarla.

No se modificó `src/assets/index.js` ni ningún otro archivo de código productivo para este diseño. Nada de lo aquí descrito está implementado en la app todavía.

## 1. Qué es una "partida compuesta" / "solución"

Una solución **no es una partida nueva del catálogo**. Es una plantilla que agrupa referencias (`catalogId`) a partidas simples que ya existen, más metadata de negocio: cuáles son obligatorias, cuáles opcionales, qué preguntas hacerle al cliente antes de aplicarla, y qué advertencias técnicas debe leer el profesional.

Al "aplicar" una solución a un presupuesto (funcionalidad futura, no incluida en esta fase), la app debería:

1. Mostrarle al usuario la lista de partidas sugeridas (obligatorias ya marcadas, opcionales para elegir).
2. Dejar que edite cantidad, precio o elimine cualquiera de ellas — igual que si las hubiera agregado una por una desde el catálogo.
3. Agregar al presupuesto solo las partidas que el usuario confirme, con su `catalogId` real (para que sigan beneficiándose de precios actualizados, APU, mínimos comerciales, etc., igual que cualquier partida agregada manualmente).

Es decir: la solución es un **acelerador de armado**, no una partida ni un precio nuevo. El precio de cada línea sigue viniendo 100% del catálogo (`qi` en `index.js`) al momento de agregarla, tal como ocurre hoy con cualquier partida agregada individualmente.

## 2. Esquema de datos

```json
{
  "id": "",
  "nombre": "",
  "descripcion": "",
  "rubro": "",
  "tipoIntervencion": "",
  "partidas": [
    {
      "catalogId": 0,
      "cantidadBase": 0,
      "formulaCantidad": "",
      "obligatoria": true,
      "editable": true,
      "motivo": ""
    }
  ],
  "preguntas": [],
  "advertencias": [],
  "requiereVisita": false
}
```

### Campos de la solución

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | string | Identificador estable, kebab-case (`sol-00N-nombre-corto`). No cambia entre versiones del catálogo. |
| `nombre` | string | Nombre visible al usuario. |
| `descripcion` | string | Explica el alcance típico de la solución y qué NO cubre. |
| `rubro` | string | Uno de los valores de la taxonomía ya vigente en `index.js` (`docs/taxonomia/DICCIONARIO_TAXONOMICO_ECP.json`). Es el rubro dominante de la solución, no necesariamente el de todas sus partidas (una solución puede cruzar rubros, p. ej. baño cruza Pisos y Sanitarias). |
| `tipoIntervencion` | string | Igual que `rubro`: valor de la taxonomía vigente, dominante de la solución. |
| `partidas` | array | Ver más abajo. |
| `preguntas` | string[] | Preguntas mínimas que el profesional debería hacer al cliente antes de aplicar la solución (definen alcance, activan/desactivan opcionales). |
| `advertencias` | string[] | Riesgos técnicos, exclusiones mutuas entre partidas, y vacíos de catálogo detectados durante el diseño. |
| `requiereVisita` | boolean | Indicador general de si esta solución típicamente amerita visita técnica antes de cotizar en firme. Es una señal de negocio, no un bloqueo — el profesional puede cotizar sin visita bajo su propio criterio. |

### Campos de cada partida dentro de `partidas[]`

| Campo | Tipo | Descripción |
|---|---|---|
| `catalogId` | number | ID real de una partida existente en `qi` (el catálogo de `index.js`). Nunca un ID inventado. |
| `cantidadBase` | number | Cantidad sugerida de partida, **punto de partida editable**, no una medición real. Ver §4. |
| `formulaCantidad` | string | Explica en texto cómo se debería calcular la cantidad real (fija / por m² / por ml / por m³), para guiar al profesional o a una futura calculadora. No es una fórmula ejecutable en esta fase — es documentación legible. |
| `obligatoria` | boolean | `true` = parte del núcleo de la solución, se sugiere pre-marcada. `false` = opcional, el usuario decide si la incluye. |
| `editable` | boolean | Siempre `true` en esta propuesta (ver regla en §3: todo debe poder editarse o eliminarse). Se deja el campo explícito para permitir, a futuro, algún caso especial que no aplica hoy. |
| `motivo` | string | Por qué esta partida está en la solución (o por qué es opcional / con qué otra es excluyente). Es la justificación que ve el profesional antes de decidir. |

## 3. Reglas de diseño aplicadas

Estas son las reglas que el usuario pidió respetar, y cómo se aplicaron:

- **Usar solo partidas existentes.** Las 33 referencias `catalogId` de las 6 soluciones fueron extraídas directamente del arreglo `qi` en `src/assets/index.js` (no de la documentación de taxonomía, que es solo un espejo). Ver `VALIDACION_SOLUCIONES.md` para el detalle de la verificación.
- **No duplicar partidas dentro de una solución.** Cada solución tiene `catalogId` únicos entre sus propias partidas (validado). El mismo `catalogId` sí puede repetirse **entre distintas soluciones** (p. ej. el cambio de cerámico de piso, id 64, aparece tanto en "Cambio de piso cerámico" como en "Remodelación básica de baño") — eso es reutilización legítima del catálogo, no una duplicación dentro de una solución.
- **No inventar precios.** Ninguna solución ni partida define un precio. El precio siempre proviene del catálogo real al momento de aplicar la partida al presupuesto — el diseño no lo toca ni lo copia.
- **No modificar APU.** No se tocó `li()`, `calculaMO()`, ni ninguna estructura de composición de precio. Las soluciones solo referencian `catalogId`, nunca reconstruyen el desglose de materiales/MO/GG/utilidad.
- **No agregar automáticamente partidas ambiguas.** Cuando el catálogo no tenía una partida clara para un caso (el ejemplo más notorio es "Reparación de portón", ver §5), se optó por dejar la solución más liviana y explicar el vacío en `advertencias`, en vez de forzar una partida que no calza semánticamente (p. ej. usar una fabricación completa nueva como si fuera una reparación).
- **Marcar partidas opcionales.** Campo `obligatoria: false` en cada partida que no es núcleo de la solución.
- **Distinguir cantidades fijas, por m², por ml y por unidad.** Cada `formulaCantidad` empieza explícitamente con `"fija: ..."`, `"por m²: ..."`, `"por ml: ..."` o `"por m³: ..."`, coincidiendo con la `unidad` real de esa partida en el catálogo (validado programáticamente, ver `VALIDACION_SOLUCIONES.md`).
- **Permitir que el usuario edite o elimine cualquier partida sugerida.** `editable: true` en todas las partidas, sin excepción, en las 6 soluciones. Nada se propone como "bloqueado".
- **No aplicar una solución directamente al presupuesto todavía.** Este documento y el JSON son solo diseño de datos. No hay ningún botón, handler, ni cambio en `index.js` que aplique una solución — eso queda para una fase futura y separada.

## 4. `cantidadBase`: qué es y qué no es

`cantidadBase` es un valor de partida razonable para que la interfaz muestre "algo" antes de que el usuario mida o pregunte (por ejemplo, 15 m² para un piso de baño, o 1 unidad para un WC). **No es una medición real ni una recomendación técnica de dimensionamiento** — cada valor debe considerarse un placeholder editable, coherente con `editable: true`. Los valores se eligieron a una escala doméstica típica (una habitación, un baño residencial, un tramo de canaleta) solo para que la plantilla no se vea vacía; el profesional siempre reemplaza esto por la medición real o la calculadora de dimensiones que ya existe en el editor de presupuestos.

## 5. Resumen de las 6 soluciones y sus decisiones más relevantes

Ver `SOLUCIONES_PROPUESTAS.json` para el detalle completo (partidas, preguntas, advertencias). Resumen de lo no evidente en el JSON:

1. **Reparación de filtración en techumbre** (`sol-001-filtracion-techumbre`) — única partida obligatoria (311, reparación puntual tipo "gl"). Las opciones de cambio de plancha completa (33 Metalcon / 43 madera) son mutuamente excluyentes según el sistema constructivo real; nunca deben coexistir aplicadas.
2. **Cambio de canaleta y bajante** (`sol-002-cambio-canaleta-bajante`) — la obligatoria (107, "cambio... existente") asume que ya había ojalaería previa. La opcional 106 ("Ojalaería completa") es la alternativa correcta cuando es instalación nueva sin canaleta previa; son excluyentes entre sí.
3. **Pintura interior de habitación** (`sol-003-pintura-interior-habitacion`) — es la única de las 6 con `requiereVisita: false`, porque una pintura de habitación estándar normalmente se puede cotizar sin visita. Si el cliente reporta humedad activa, la advertencia deriva a la solución de techumbre o a inspección de impermeabilización, en vez de intentar resolverlo con partidas de pintura.
4. **Cambio de piso cerámico** (`sol-004-cambio-piso-ceramico`) — la obligatoria (64) es el reemplazo completo con retiro incluido; la opcional 66 (reparación puntual) es una alternativa de menor alcance, excluyente con la 64 (no ambas a la vez).
5. **Reparación de portón** (`sol-005-reparacion-porton`) — la más liviana de las 6 a propósito. **Vacío de catálogo detectado y documentado explícitamente:** no existe una partida de mano de obra para reparación estructural (soldadura, enderezado, cambio de bisagras/ruedas) de un portón. Solo hay fabricación completa nueva (no aplicable a una reparación) y la partida de pintura/mantención (313, la única obligatoria). Ver §6.
6. **Remodelación básica de baño** (`sol-006-remodelacion-basica-bano`) — la más grande (12 partidas), con dos pares de opciones excluyentes explícitas (WC estándar/bidet, ducha simple/termostática) para modelar "básico" vs. "de mayor estándar" sin inventar una partida de nivel intermedio que no existe.

## 6. Vacíos de catálogo detectados durante el diseño

Estos no son errores del diseño de las soluciones — son límites reales del catálogo actual de 311 partidas, encontrados al intentar cubrir los 6 casos pedidos con partidas reales:

- **No existe una partida de "mano de obra de reparación estructural de portón"** (soldadura, enderezado, cambio de bisagras/ruedas/riel). Las únicas partidas relacionadas a portones son fabricación completa nueva (`catalogId` 120, 122, 127) y mantención de pintura (313). Esto limita la solución 5 a una sola partida obligatoria real, con una advertencia explícita indicando que ese trabajo debe agregarse manualmente como partida "Definir materiales manualmente" — no se fuerza ninguna partida existente a cubrir un alcance que no describe.
- **El `catalogId` 319 ("Cambio de chapa/cerradura puerta")** está descrito textualmente para puertas, no portones. Se usó como opcional razonable en la solución 5 por ser funcionalmente equivalente, pero se advierte explícitamente que requiere confirmación del profesional antes de aplicarlo — no se asumió como calce automático.
- **No existe una partida específica de "instalación sanitaria parcial"** entre el extremo de "solo cambiar artefactos" y "instalación sanitaria completa baño" (id 92, gl). La solución 6 deja 92 como opcional binario (todo o nada) en vez de inventar un punto intermedio.

## 7. Siguientes pasos (fuera del alcance de esta fase)

No implementados todavía, y deliberadamente no diseñados en detalle aquí porque exceden lo pedido:

- UI para elegir una solución, ver sus partidas obligatorias/opcionales y confirmar antes de agregarlas al presupuesto.
- Lógica real de cálculo de `cantidadBase` a partir de dimensiones ingresadas por el usuario (hoy `formulaCantidad` es solo texto descriptivo).
- Persistencia de qué solución originó cada partida agregada (para trazabilidad, similar a como hoy se registra `capituloId` en los ítems de presupuesto).
- Editor de soluciones dentro de la app (hoy `SOLUCIONES_PROPUESTAS.json` es un archivo estático de diseño, no una entidad editable en `Configuración`).
