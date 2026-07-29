# Validación de Interpretación

Para garantizar que ni el motor heurístico local ni la inteligencia artificial generen daños en la estructura del presupuesto (regresión o alucinaciones), se establecerán múltiples capas de validación.

## 1. Validación Estructural (Tipado Fuerte)
Todo resultado arrojado por el interpretador debe pasar por una capa de validación JSON estricta contra `ESQUEMA_RESPUESTA.json`:
- `dimension`: Debe ser `null` o un número positivo mayor que 0.
- Enum estricto: Variables como `unidad`, `material`, `elemento` deben existir en el diccionario o ser forzadas a nulo.

## 2. Detección de Faltantes y Redirección al Asistente
El sistema evaluará si faltan piezas obligatorias para resolver el flujo sugerido:
- Si el usuario dice "pintar mi pieza", falta determinar la `dimension`.
- En este escenario, `datosFaltantes: ["dimension"]` se llenará.
- La aplicación abrirá automáticamente el `AsistenteInteligenteModal` situando al usuario exactamente en el paso faltante (ej: Paso 3 - Dimensión), con las preguntas previas ya pre-rellenadas en la UI (Tipo de trabajo: Mantención, Elemento: Muros).

## 3. Barrera Canónica (Inmutabilidad del Motor)
- El asistente jamás inyectará partidas directamente a `gg` (monolito) desde el lenguaje natural.
- El lenguaje natural sólo rellena el estado `respuestas` de la UI.
- Es el flujo guiado validado (`AsistenteInteligenteModal` -> botón "Revisar propuesta" -> Generación de `soluciones`) el que siempre ejecutará la conversión y propagación final.
- Esta separación asegura que no sea necesario auditar nuevamente las reglas de los catálogos para esta nueva funcionalidad.

## 4. Riesgos y Ambigüedades Detectadas
- **Jerga extrema o errores de tipografía ortográfica:** El modo local puede fallar en detectar una palabra muy mal escrita (ej. "tayo la pared" en vez de "rayo la pared"). La IA soluciona esto, pero el modo local necesitará mantener un diccionario amplio.
- **Multicitas:** Si el usuario incluye más de un problema ("se llueve el techo y quiero cambiar el piso del baño"). *Solución propuesta:* El interpretador debe devolver múltiples estructuras JSON o priorizar el de mayor urgencia, forzando a llenar dos veces el asistente guiado de forma secuencial.
- **Unidades mezcladas:** El usuario dice "12 planchas" en vez de metros cuadrados. El sistema debe interpretar la falta de metros cuadrados y preguntar en la UI.
