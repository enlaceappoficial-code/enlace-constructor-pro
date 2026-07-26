# Fuente canónica de ECP

Desde el 23 de julio de 2026, la versión confirmada visualmente por el usuario es:

- Entrada: `src/index.html`
- Aplicación: `src/assets/index.js`
- Biblioteca mínima: 222 partidas, 311 materiales y 222 APUs

`src/app.html` ya no contiene una segunda aplicación: redirige a `index.html`. Su contenido histórico fue archivado en `src/_legacy/app_legacy_2026-07-23.html`.

## Protección contra regresiones

`npm run verify:canonical` comprueba:

1. La sintaxis del bundle.
2. La presencia de los módulos avanzados confirmados.
3. Las huellas SHA-256 de la versión aceptada.
4. Que la biblioteca no disminuya.
5. Que no existan partidas sin APU ni observaciones técnicas.

`npm run build` ejecuta esta verificación automáticamente. Si un programa restaura una copia anterior, la compilación se detendrá.

Después de un cambio intencional, probado y aprobado, se actualiza la línea base mediante `npm run canonical:accept`.
