# Pendientes para próximas sesiones

## País y moneda histórica de cada presupuesto

Estado: pendiente; no implementar todavía.

Cuando el usuario cambie el país de operación en Configuración, la nueva moneda debe aplicarse a los presupuestos creados desde ese momento. Antes de modificar presupuestos existentes se debe definir una migración segura que:

- conserve el país, moneda, símbolo, formato e impuesto con los que fue creado cada presupuesto;
- no convierta valores históricos automáticamente ni cambie sus totales;
- permita elegir explícitamente entre conservar la moneda original o convertir una copia;
- solicite una tasa de cambio y fecha de referencia cuando corresponda convertir;
- muestre claramente la moneda propia de cada presupuesto en listados, documentos y reportes.

No modificar el mecanismo actual de almacenamiento hasta diseñar y aprobar esta migración.
