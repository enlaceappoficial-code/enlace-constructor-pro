# Validación de Plantillas de Presupuesto

Este documento recoge el análisis y validación de las 6 plantillas propuestas en `PLANTILLAS_PROPUESTAS.json`.

## Verificación de Reglas y Restricciones

1. **Reutilización de Soluciones:** 
   - Se utilizaron únicamente soluciones activas (confirmadas del `SOLUCIONES_PROPUESTAS.json` v0.2.0):
     - `sol-001-filtracion-techumbre`
     - `sol-002-cambio-canaleta-bajante`
     - `sol-003-pintura-interior-habitacion`
     - `sol-004-cambio-piso-ceramico`
     - `sol-006-remodelacion-basica-bano`
   - **Resultado:** Cumple (100%).

2. **Uso de catalogId Reales:**
   - Los `catalogId` inyectados como partidas directas (ej: 40003, 79, 40, 41, 40516, 337, 40007, 40005) fueron verificados contra el array `PARTIDAS_BASE` de `src/assets/index.js`.
   - **Resultado:** Cumple. Todos los IDs existen y tienen un precio y análisis de mercado preexistente.

3. **Sin Invención de Precios ni Modificación del APU:**
   - No se alteró ningún archivo fuente, solo se orquestaron referencias (`catalogId`).
   - **Resultado:** Cumple.

4. **Distinción Obligatorio/Opcional:**
   - La estructura de la plantilla diferencia las inclusiones a través del boolean `obligatoria: true | false`. Las partidas opcionales sugieren al usuario posibles trabajos anexos (ej: pintar el cielo si se está pintando un muro).
   - **Resultado:** Cumple.

5. **Incompatibilidades y Duplicidades:**
   - No existen soluciones incompatibles combinadas. (Ej: no se mezclan remodelación de baño con instalación de techo industrial en la misma zona).
   - Las partidas directas complementan los vacíos de la solución (ej: cielo y puertas en la solución de pintura interior).
   - **Resultado:** Sin conflictos.

6. **Capítulos Únicos y Órdenes Consecutivos:**
   - Cada plantilla posee `cap-01`, `cap-02`, etc., con `orden: 1, 2` de manera consecutiva e indexada localmente a la plantilla.
   - **Resultado:** Cumple.

## Vacíos del Catálogo (Gaps Detectados)

Durante el diseño de estas plantillas, se encontraron las siguientes áreas grises o vacíos en el catálogo oficial:
- **Muebles de Cocina Aéreos:** En la plantilla de cocina, la partida directa (337) aborda el mueble base, pero existen vacíos para armar configuraciones completas de aéreos estandarizados sin recurrir a ítems muy desagregados.
- **Tratamiento de humedad estructural:** La solución de techumbre carece de una partida nativa potente para reparación estructural de cerchas (madera/metalcon) en caso de que la filtración haya podrido el material; depende de inyectar partidas de carpintería aisladas.
- **Electricidad anexa:** Ninguna de estas plantillas de remodelación general amarra fuertemente la restitución de circuitos eléctricos afectados, obligando al usuario a buscar manualmente en el catálogo eléctrico.

## Conclusión
El diseño de datos es robusto y escalable, y cumple con el principio de delegar la cotización final en el motor central de ECP, limitándose a pre-seleccionar los ítems lógicos para cada escenario.
