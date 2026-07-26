# Auditoría de reanudación ECP

Fecha: 23 de julio de 2026  
Objetivo: verificar el trabajo dejado por Antigravity y retomar la estabilización de partidas, materiales y APU antes del lanzamiento comercial.

## Estado verificado

- Catálogo: 198 partidas.
- Materiales: 287.
- APU canónicas: 198.
- APU sin observaciones de las reglas actuales: 198.
- APU con observaciones: 0.
- Observaciones altas: 0.
- Observaciones medias: 0.
- Partidas sin APU canónica: 0.
- Materiales utilizados por APU canónicas: 201.
- Materiales todavía no utilizados: 86.

La sintaxis del paquete JavaScript fue validada con Acorn y la aplicación Tauri pasó `cargo check`.

## Verificación del trabajo de Antigravity

El cálculo de mano de obra fue integrado en la fuente legible y en el paquete ejecutable. La prioridad de cálculo es:

1. Precio de mano de obra explícito de la APU.
2. Costo diario de la cuadrilla dividido por el rendimiento.
3. Porcentaje del costo de materiales como compatibilidad para APU incompletas.

La integración recibe los jornales configurados por el usuario, muestra la fuente del cálculo y conserva el método porcentual solo como respaldo. La sintaxis y el paso de configuración hacia las pantallas APU fueron verificados.

## Correcciones aplicadas al retomar

- APU 123: se eliminó la duplicidad de líneas de acero y se incorporó pérdida y alambre de amarre.
- Se completaron rendimiento y dotación en APU 37, 53, 62, 64, 68, 76, 78 y 83.
- APU 35, 36 y 77: se separó el sistema premezclado de la dosificación artesanal.
- APU 63 y 64: el retiro ahora incluye un insumo visible de embolsado y deja el transporte como alcance ajustable.
- APU 67, 75 y 76: se dejó un sellante canónico por solución, sin sumar productos alternativos.
- APU 105 y 108: la cama o base granular quedó identificada como capa independiente del hormigón premezclado.
- Los supuestos técnicos incorporados quedaron marcados como editables para su adaptación a cada proyecto.

El resultado de la auditoría bajó de 31 observaciones —una alta y treinta medias— a cero observaciones.

## Desviaciones de precio resueltas

| APU | Partida | Calculado | Referencia | Relación |
|---:|---|---:|---:|---:|
| 79 | Pintura repaso exterior, una mano | $7.416 | $3.500 | 2,12x |
| 95 | Escalera metálica recta | $82.587 | $185.000 | 0,45x |
| 96 | Baranda o pasamanos metálico | $37.102 | $85.000 | 0,44x |
| 101 | Excavación mecánica | $95.200 | $22.000 | 4,33x |
| 125 | Colector PVC 110 mm | $13.377 | $28.000 | 0,48x |
| 126 | Colector PVC 160 mm | $17.942 | $38.000 | 0,47x |
| 134 | Sello bituminoso doble tratamiento | $4.200 | $18.500 | 0,23x |
| 137 | Señalética horizontal | $4.000 | $8.500 | 0,47x |
| 31001 | Visita técnica o diagnóstico | $81.995 | $25.000 | 3,28x |
| 31004 | Cambio de chapa o cerradura | $57.979 | $28.000 | 2,07x |
| 31005 | Cambio de enchufe o interruptor | $25.511 | $12.500 | 2,04x |

Las diferencias fueron clasificadas antes de corregirse:

- Se corrigió el prorrateo unitario de la excavación mecánica.
- Se ajustaron rendimientos de fabricación metálica, colectores y pavimentos.
- Se corrigió el consumo del tratamiento bituminoso doble.
- Se actualizaron referencias históricas que no cubrían material, jornal y movilización.
- Cada alcance quedó documentado con supuestos técnicos editables.

## Cobertura completada

Las 74 partidas que no tenían APU fueron incorporadas en cuatro lotes auditados:

- Reparaciones, carpintería e instalaciones prioritarias: 16 APU.
- Sanitario, mantenciones y especialidades: 18 APU.
- Áreas exteriores y piscinas: 23 APU.
- Gas, radieres, pavimentos, regularización y obras estructurales: 17 APU.

El catálogo quedó con 198 partidas y 198 APU vinculadas. Los trabajos abiertos, regulados o dependientes de cálculo se identifican como subcontratos con supuestos editables; las partidas ejecutables directamente incluyen materiales, rendimiento y dotación.

## Condiciones mínimas antes de vender

1. Ejecutar pruebas funcionales de creación, edición y recálculo de presupuestos con jornales personalizados.
2. Verificar migración y conservación de datos de usuarios existentes.
3. Revisar comercialmente los 86 materiales todavía no utilizados y decidir si se conservan como biblioteca auxiliar.
4. Generar un instalador de prueba y realizar una prueba de humo antes del instalador comercial.

## Repetición de la auditoría

```powershell
node scripts\audit_apu_technical.js
node check_syntax_acorn.js
cargo check --manifest-path src-tauri/Cargo.toml --target-dir src-tauri/target_build
```

El detalle legible por máquina se genera en `target/auditoria_apu_tecnica.json`.

## Prueba funcional aislada

La prueba automatizada `scripts/test_ecp_smoke.js` se ejecutó con Chrome en un contexto aislado y confirmó:

- Respuesta HTTP correcta y montaje de la aplicación.
- Carga persistida de 198 APU, 198 partidas y 287 materiales.
- Navegación al módulo APU.
- Escritura y recuperación de una configuración de jornal después de recargar.
- Escritura y recuperación de un presupuesto temporal después de recargar.
- Ausencia de errores JavaScript y recursos fallidos.

La prueba no modifica el almacenamiento real del usuario porque utiliza un contexto nuevo del navegador y cierra el servidor local al finalizar.

## Prueba de migración y construcción de lanzamiento

Se utilizó el respaldo real `ECP_Backup_2026-05-04_Manual (1).json` en un navegador aislado:

- 14 de 14 presupuestos conservados.
- 55 de 55 partidas de presupuesto conservadas por el normalizador.
- 11 de 11 clientes conservados.
- La biblioteca antigua de 122 APU recibió las APU canónicas faltantes.
- Las APU y partidas personalizadas del respaldo también fueron conservadas.
- Resultado migrado: 201 APU y 203 partidas, incluyendo las 198 canónicas.
- Sin errores JavaScript durante la migración.

La compilación Tauri de producción generó correctamente:

- MSI x64 versión 1.0.3, 8,55 MB.
- Instalador NSIS EXE x64 versión 1.0.3, 6,58 MB.

SHA-256:

- MSI: `F46430AEDD373BFC09B5A85B408E911DBBC40D950C82DB60488DEB9C889DDCEA`
- EXE: `FE9C3A765D61E3893F9B81FDED396956DAF7DAF5523D39E0B723ED709113E112`
