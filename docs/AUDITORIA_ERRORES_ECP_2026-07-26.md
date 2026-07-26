# Auditoría de errores ECP

Fecha: 26 de julio de 2026  
Versión: 1.0.3  
Fuente canónica: `src/index.html` + `src/assets/index.js`

## Resultado

La aplicación inicia, navega, conserva los datos existentes, carga la biblioteca profesional y compila instaladores para Windows. No se observaron errores ni advertencias en la consola durante los flujos revisados.

Se corrigieron dos errores funcionales encontrados durante esta auditoría:

1. Las tarjetas de estados del panel mostraban “Rechazados” para presupuestos aprobados y vencidos. Ahora presentan “Pendientes”, “Aprobados”, “Progreso”, “Rechazados” y “Vencidos” según corresponda.
2. Un presupuesto vencido aparecía correctamente como “Vencido” en el panel, pero como “Pendiente” en la vista previa. La vista previa y sus exportaciones ahora reciben el mismo estado calculado que el panel.

## Pruebas aprobadas

- Guarda canónica: `CANONICAL_OK`.
- Sintaxis JavaScript con Acorn: aprobada.
- Arranque HTTP y renderizado: aprobados.
- Navegación por los 14 módulos principales: aprobada.
- Formulario de nuevo presupuesto: carga completa sin errores.
- Persistencia local: aprobada.
- Migración de presupuestos y clientes existentes: aprobada.
- Catálogo: 311 partidas.
- Materiales canónicos: 327; biblioteca visible: 332.
- APU: 311.
- Auditoría técnica APU: 0 errores, 0 partidas sin vínculo y 0 materiales sin uso.
- Cobertura profesional y cierre perimetral ACMA: aprobadas.
- Consola del navegador: sin errores ni advertencias.
- Compilación Tauri release: aprobada.

## Identidad canónica fijada

- SHA-256 `src/index.html`: `97F8B5CFF8D7DFC9A1AE66B93C9C50AB7D5C02EF06F0D867F6918A39394CA6A0`
- SHA-256 `src/assets/index.js`: `ED29A5E1A21C8865908A1C53940B5044A2CC66B8022312CF3B9CCD791A907F96`

La nueva línea base fue aceptada mediante `npm run canonical:accept`. Las compilaciones futuras se detendrán si estos archivos cambian sin una aceptación canónica explícita.

## Instaladores finales

### EXE

Ruta: `src-tauri/target_build/release/bundle/nsis/Enlace Constructor Pro_1.0.3_x64-setup.exe`  
Tamaño: 6.956.238 bytes  
SHA-256: `143BF8AF6C74738AC5508B9E3272A0A6DEDBEE84A1F9C4CB969FB08A244D2641`

### MSI

Ruta: `src-tauri/target_build/release/bundle/msi/Enlace Constructor Pro_1.0.3_x64_en-US.msi`  
Tamaño: 8.982.528 bytes  
SHA-256: `E0A30B1D123E78F053F99E70BDD14D49F79E45A02F7C138744FF684822B44BE0`

Ambos instaladores están sin firma digital (`NotSigned`).

## Riesgos comerciales pendientes

Estos puntos no impiden probar el programa, pero sí deben resolverse para una venta pública protegida:

- Licenciamiento validado completamente en el cliente y susceptible de manipulación.
- Dependencia `xlsx@0.18.5` con vulnerabilidades altas conocidas.
- Permisos Tauri excesivos (`allowlist.all`, alcance de archivos amplio y CSP nula).
- Instaladores sin certificado de firma digital.
- 332 precios de materiales marcados con más de 90 días sin revisión.
- Bibliotecas de PDF, QR y Excel cargadas desde CDN, con dependencia de Internet.

## Recomendación

La versión actual es apta para demostración y piloto controlado. Antes de venderla públicamente como producto protegido, deben cerrarse el licenciamiento, XLSX, los permisos/CSP y la firma digital.
