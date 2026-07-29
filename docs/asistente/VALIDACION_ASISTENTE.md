# Validación del Asistente Guiado

El Asistente Guiado (V1) no modifica las reglas contables ni matemáticas del presupuesto. Su rol es estrictamente como generador de configuración inicial.

## Criterios de Aceptación
1. **Conservación de Arquitectura**: El asistente genera un objeto de configuración que es consumido por la función `Zf` existente. No debe saltarse el modal de "Revisión".
2. **Propagación de Dimensiones**: Si el usuario ingresa una superficie `S`, todas las partidas asociadas que dependan de superficie deben precargar `S` o una proporción derivada de `S` validada.
3. **Mínimos Comerciales Intactos**: El catálogo seguirá aplicando las reglas de `cantidadMinimaFacturable` al momento de calcular la línea del presupuesto a través de `calcularLineaPresupuesto`. El asistente no sobrescribe esta restricción.
4. **Intervención Manual**: Las partidas obligatorias derivadas de la condición existente (ej. tratamiento antihongos por presencia de humedad) deben visualizarse como bloqueadas/obligatorias en la UI de revisión, permitiendo transparencia total.
5. **No Almacenamiento de Estado**: Las preguntas respondidas en el Wizard no se guardan en el presupuesto. Son efímeras y solo se usan para calcular la plantilla resultante.

## Resumen de Verificaciones a Implementar
- Probar que un flujo de "Remodelación de baño" con respuesta "Humedad visible" encienda la partida directa 40516 de forma mandatoria.
- Verificar que al dar clic en "Confirmar y Cargar", los `catalogId` mapeen correctamente y no generen errores `NaN` por incompatibilidad de unidad.
- Validar que si el usuario interrumpe el modal `Zf`, los datos se descartan limpiamente.
