# Auditoría de publicación ECP

Fecha: 26 de julio de 2026  
Versión auditada: 1.0.3  
Fuente canónica: `src/index.html` + `src/assets/index.js`

## Veredicto

La versión es funcional, conserva la biblioteca profesional y genera instaladores válidos. Puede mostrarse y probarse con clientes, pero todavía no debe venderse como una versión comercial plenamente protegida y segura sin resolver los bloqueantes P0 descritos abajo.

## Evidencia aprobada

- Guarda canónica: `CANONICAL_OK`.
- Hash del entrypoint: `97F8B5CFF8D7DFC9A1AE66B93C9C50AB7D5C02EF06F0D867F6918A39394CA6A0`.
- Hash del bundle vigente: `37A8C51D286E76A09E6A979190ADE53EA59AC8D92B39503237230207948C15AD`.
- Catálogo: 311 partidas.
- Materiales canónicos: 327; biblioteca visible después de migración: 332.
- APU: 311, todos vinculados.
- Auditoría técnica APU: 0 observaciones, 0 partidas huérfanas y 0 materiales sin uso.
- Prueba de arranque, navegación y persistencia: aprobada.
- Prueba de migración: presupuestos y clientes preservados.
- Prueba de cobertura profesional: aprobada.
- Prueba del cierre perimetral ACMA: aprobada.
- Consola del navegador durante los flujos revisados: sin errores ni advertencias.
- Compilación Tauri release: aprobada.
- Instaladores MSI y EXE: generados correctamente.

## Corrección aplicada durante la auditoría

La pantalla “Mis Presupuestos” indicaba 4 presupuestos utilizados, pero mostraba una lista vacía. Los datos no estaban perdidos: el plan Starter ocultaba presupuestos con más de 30 días sin explicarlo.

Se corrigió para mostrar:

- el período visible del plan;
- la cantidad visible respecto del total conservado;
- un aviso explícito cuando existen presupuestos anteriores;
- exclusión consistente de registros marcados como eliminados.

La corrección pasó todas las pruebas y fue registrada en la línea base canónica.

## Bloqueantes P0 antes de una venta pública

### 1. Licencias falsificables

La validación está completamente dentro del JavaScript entregado al cliente. Existe un secreto incorporado en el bundle y además se acepta un formato histórico sin firma criptográfica robusta. La prueba y el estado de licencia se guardan localmente.

Impacto: una persona con conocimientos técnicos puede extender la prueba, fabricar códigos o desbloquear planes.

Acción requerida: reemplazar el esquema por licencias firmadas con clave privada externa. ECP debe contener únicamente la clave pública; la clave privada y el generador nunca deben distribuirse con la aplicación.

### 2. Dependencia XLSX vulnerable

El proyecto usa `xlsx@0.18.5` y permite importar archivos Excel. Esta versión está afectada por vulnerabilidades de severidad alta de contaminación de prototipos y denegación de servicio mediante expresiones regulares. La rama npm no ofrece una versión corregida.

Acción requerida: migrar la importación a una versión segura oficial de SheetJS distribuida fuera de npm o reemplazarla por una biblioteca mantenida. Mientras no se corrija, no importar archivos Excel de origen desconocido.

Referencias:

- https://github.com/advisories/GHSA-4r6h-8v6p-xvw6
- https://github.com/advisories/GHSA-5pgg-2g8v-p4x9

### 3. Permisos de escritorio excesivos

La configuración Tauri tiene `allowlist.all: true`, acceso de archivos con alcance `**`, HTTP para cualquier destino y `csp: null`.

Impacto: si código no confiable llegara a ejecutarse en la interfaz, tendría una superficie de acceso muy superior a la necesaria.

Acción requerida: permitir solamente HTTP hacia las API oficiales de Mercado Público y las notificaciones utilizadas. Desactivar `fs`, `dialog`, `shell` y las demás API que no sean necesarias, y establecer una CSP compatible con los recursos requeridos.

### 4. Instaladores sin firma digital

El MSI y el EXE se generaron correctamente, pero ambos aparecen como `NotSigned`.

Impacto: Windows puede mostrar advertencias de editor desconocido o SmartScreen, lo que perjudica la confianza y la conversión de ventas.

Acción requerida: adquirir y configurar un certificado de firma de código y una URL de sellado de tiempo.

## Prioridades P1

- Los 332 materiales visibles figuran sin revisión de precio por más de 90 días. Debe mostrarse claramente que son precios referenciales o actualizarse antes de usarlos comercialmente.
- Varias funciones de PDF, QR y Excel cargan bibliotecas desde CDN. Conviene empaquetarlas localmente para que la aplicación funcione sin Internet y reducir riesgos de terceros.
- Los datos viven en `localStorage`. El respaldo funciona, pero debe verificarse la restauración completa y mejorar la orientación sobre copias externas.
- La actualización automática está desactivada; debe definirse cómo se entregarán correcciones y nuevas bibliotecas a los compradores.
- El diagnóstico histórico de Babel revisa `src/app.html`, que ya no es la aplicación vigente. Debe retirarse o reescribirse para la fuente canónica.

## Instaladores generados

### EXE

Ruta: `src-tauri/target_build/release/bundle/nsis/Enlace Constructor Pro_1.0.3_x64-setup.exe`  
Tamaño: 6.954.372 bytes  
SHA-256: `C3899A3BCFC6B37F6403C5F9479D021B2263B01BB772E88EA6BD7223988402CE`

### MSI

Ruta: `src-tauri/target_build/release/bundle/msi/Enlace Constructor Pro_1.0.3_x64_en-US.msi`  
Tamaño: 8.982.528 bytes  
SHA-256: `D4C39B2101C86CD7CBF878A7FA58FB134D54C59FA307FB6BA2FA5373D5A9A596`

## Recomendación de salida

Para hoy: demostración o piloto controlado, indicando que los precios son referenciales y evitando archivos Excel de terceros.

Para venta pública: resolver primero licencias, XLSX, permisos/CSP y firma del instalador. Después repetir pruebas, reconstruir, firmar y publicar esa nueva versión.
