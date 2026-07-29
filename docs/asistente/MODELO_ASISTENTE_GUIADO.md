# Arquitectura: Asistente Inteligente Guiado (V1)

## 1. Elementos Reutilizables de ECP
Para implementar el Asistente Inteligente sin IA generativa ni APIs externas, apalancaremos los siguientes componentes ya existentes en la plataforma:

- **Selector de Soluciones Compuestas (`SOLUCIONES_COMPUESTAS_ACTIVAS`)**: Ya agrupa partidas base lógicas (ej. impermeabilización + cerámica).
- **Plantillas Modernizadas (`Xf`, `Zf`)**: Ya contamos con un modal de "Revisión" que muestra precios dinámicos y opcionales. El Asistente desembocará en este mismo modal.
- **Taxonomía**: Permite estructurar las recomendaciones.
- **Catálogo (`PARTIDAS_BASE`)**: Contiene los precios vigentes, descripciones reales y restricciones.
- **Mínimos Comerciales y Cálculo de Líneas**: Funciones existentes que garantizan que la cantidad sugerida por el asistente no rompa las reglas de negocio.
- **Preguntas de Referencia**: Expandiremos este concepto para que las respuestas del asistente alimenten las partidas obligatorias u opcionales antes de abrir la plantilla.

## 2. Flujo Guiado Propuesto
El asistente será un flujo por pasos (Wizard) previo a la generación del presupuesto.

### Pasos Iniciales (Formulario)
1. **Tipo de Trabajo**: Reparación, Mantención, Remodelación u Obra Nueva.
2. **Recinto / Elemento Afectado**: (Ej. Baño, Cocina, Techo, Muros, Piso).
3. **Dimensión**: Superficie (m²), longitud (ml) o cantidad (un).
4. **Condición Existente**: (Ej. Hay cerámica instalada, la madera está podrida, hay filtración activa).
5. **Materiales / Sistema**: (Ej. Porcelanato, Piso Flotante, Zinc, Asfáltica).
6. **Urgencia / Complejidad**: Inmediata, estándar.
7. **Visita Técnica**: ¿Requiere visita para confirmar medidas/estado?

### Salida del Asistente
Tras responder, el sistema mapea las respuestas a un `id` de Plantilla o construye una plantilla efímera "Asistente" y la envía al modal `Zf` preconfigurando:
- Las soluciones pertinentes.
- Capítulos lógicos.
- Cantidades pre-rellenadas (basadas en la dimensión ingresada).
- Advertencias (basadas en la Condición Existente).

El usuario aterriza en la interfaz de "Revisión" que ya construimos para confirmar, desmarcar opcionales, ver precio en vivo y cargar al presupuesto.

## 3. Vacíos Detectados (Gaps)
- **Cálculo de Proporciones**: Actualmente las plantillas tienen `cantidadSugerida`. Necesitaremos una función matemática en el asistente que propague la superficie ingresada por el usuario (ej. 30 m²) a las partidas de la solución (ej. pintura 30 m², esmalte 30 m², molduras 12 ml).
- **Mapeo Combinatorio**: Faltan reglas de decisión que vinculen "Tipo de Piso = Flotante" + "Condición = Piso disparejo" -> Partida Directa "Nivelación". Esto requiere un pequeño motor de reglas local.
- **UI del Asistente**: Se requiere construir el componente de interfaz para el formulario de 7 preguntas.
