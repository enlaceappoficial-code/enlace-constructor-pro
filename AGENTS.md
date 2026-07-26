# ECP — fuente canónica obligatoria

- La aplicación vigente y confirmada por el usuario usa exclusivamente `src/index.html` y `src/assets/index.js`.
- `src/app.html` es solo una redirección. La antigua implementación está archivada en `src/_legacy/` y nunca debe restaurarse como aplicación activa.
- No reemplazar `src/assets/index.js` por archivos `backup`, `ESTABLE`, artefactos de compilación ni versiones históricas.
- Antes y después de cualquier cambio ejecutar `npm run verify:canonical`.
- Un cambio intencional en la versión vigente debe conservar o aumentar la cobertura mínima y pasar las pruebas. Solo entonces se registra con `npm run canonical:accept`.
- `npm run build` ejecuta automáticamente la guarda canónica y debe detenerse ante cualquier regresión.
