## Actualización Enlace Constructor Pro (Tauri) — Instrucciones para Cliente

Este documento explica cómo instalar la versión nueva y qué hacer si vienes de versiones antiguas (modelos anteriores).

### 1) Antes de instalar (muy importante)
- Cierra Enlace Constructor Pro si está abierto.
- Haz un respaldo de tus datos:
  - En la app: **💾 Respaldos** → **Crear respaldo** (o exportar/descargar respaldo).
  - Guarda ese respaldo en una carpeta segura (Ej: Escritorio o Documentos).

### 2) Instalar la versión nueva
Se entrega uno de estos instaladores (usa el que te enviamos):
- Instalador EXE (recomendado): `Enlace Constructor Pro_1.0.0_x64-setup.exe`
- Instalador MSI: `Enlace Constructor Pro_1.0.0_x64_en-US.msi`

Pasos:
1. Descarga el instalador en tu PC (Ej: carpeta Descargas).
2. Doble click al instalador.
3. Si Windows muestra una advertencia de seguridad, selecciona **Más información** → **Ejecutar de todas formas**.
4. Completa el asistente de instalación con **Siguiente** → **Instalar** → **Finalizar**.

### 3) Si vienes de versiones anteriores (modelos antiguos)
En versiones antiguas algunos presupuestos pueden venir con un formato de datos distinto.

Si al abrir/editar un presupuesto antes te salía un error tipo:
- “Cannot read properties of undefined (reading 'map')”

En esta versión ya queda corregido para que:
- La app NO se caiga al abrir presupuestos antiguos
- Puedas abrir y guardar nuevamente esos presupuestos

Recomendación rápida:
1. Abre cada presupuesto antiguo importante.
2. Presiona **💾 Guardar Presupuesto**.
Esto lo “actualiza” al formato actual.

### 4) Carta Gantt (Excel tipo Gantt)
- La exportación a Excel ahora marca con un símbolo **■** las semanas donde la tarea está activa.
- Si quieres que el archivo se vea “más como Gantt” (colores/barras), avísanos y lo afinamos según tu formato de trabajo.

### 5) Exportar a Microsoft Project (XML)
El archivo que descarga NO es para “verlo” en el navegador. Es un archivo para **importarlo** en Microsoft Project.

Cómo abrirlo en Microsoft Project:
1. Abre **Microsoft Project**.
2. Ve a **Archivo → Abrir**.
3. Selecciona el archivo descargado `.xml`.
4. Si te pide confirmar, elige **Abrir/Importar como proyecto**.

Nota: Si haces doble click al `.xml` y se abre en Chrome, es normal (Windows asocia `.xml` al navegador). Igual se abre correctamente desde Project con **Archivo → Abrir**.

### 6) Si algo no te resulta
Envía estas 3 cosas para ayudarte rápido:
- Captura del error (pantalla completa)
- Qué estabas haciendo (Ej: “Editar presupuesto N° 123”)
- Si tus datos vienen de una versión anterior (sí/no) y cómo los traspasaste (respaldo, copia, etc.)
