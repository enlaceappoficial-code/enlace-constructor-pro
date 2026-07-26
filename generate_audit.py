import os
import shutil
import json

base_dir = "ECP_AUDITORIA_COMPLETA"
if not os.path.exists(base_dir):
    os.makedirs(base_dir)

# 1. ARQUITECTURA_ECP.md
arch_content = """# Arquitectura Enlace Constructor Pro (ECP)

## Stack y Versiones Utilizadas
- **Frontend**: HTML5, CSS3, JavaScript (React.js compilado/empaquetado).
- **Backend / Desktop**: Tauri (Rust) utilizado para empaquetado de escritorio y comunicación nativa.
- **Librerías principales**: `jspdf` para generación de PDF, `xlsx` para exportación a Excel, `qrcode` para códigos QR.

## Estructura Principal de Carpetas
- `src/`: Contiene el código fuente frontend.
  - `src/index.html`: Punto de entrada principal de la aplicación.
  - `src/assets/`: Contiene los bundles JavaScript compilados (`index.js`, `chunk.js`, scripts modulares) e imágenes/estilos.
- `src-tauri/`: Contiene la configuración y código nativo en Rust para Tauri.

## Pantallas o Módulos Existentes
1. **Inicio/Dashboard**: Vista general de proyectos.
2. **Clientes**: Gestión del directorio de clientes.
3. **Proyectos**: Agrupación de presupuestos bajo un proyecto específico.
4. **Presupuestos**: Creación, edición y control de versiones.
5. **Biblioteca APU (Análisis de Precios Unitarios)**: Gestión de partidas y recursos.
6. **Configuración**: Ajustes generales (impuestos, moneda, utilidades por defecto).

## Sistema de Navegación
La navegación es del tipo SPA (Single Page Application). El ruteo o los cambios de vista se manejan internamente modificando el estado del componente principal en `index.js`, sin recargar la página.

## Forma de Persistencia de Datos
Los datos se persisten principalmente a través de la API local de Tauri hacia el sistema de archivos (archivos JSON como `apus.json`, `materiales.json`, `catalog.json`) y, en algunos casos, mediante `localStorage` para caché y configuraciones temporales.

## Archivos Principales de Cada Módulo
Al estar empaquetado, la mayor parte de la lógica reside en:
- `src/assets/index.js` (Módulo principal, Presupuestos, Clientes, Configuración)
- `src/assets/chunk.js` (Librerías compartidas)
- Archivos auxiliares como `generador_oc_modulo.js` o `modulo_proveedores.js`.

## Flujo General (Crear Cliente -> Exportar Presupuesto)
1. **Registro del Cliente**: Se ingresan los datos y se guardan en el estado/archivo de clientes.
2. **Creación del Proyecto**: Se asocia un nuevo proyecto al cliente.
3. **Generación del Presupuesto**:
   - Se crea una nueva versión de presupuesto.
   - Se añaden Capítulos (ej. "Obra Gruesa", "Terminaciones").
   - Dentro de cada capítulo, se añaden Partidas (APUs).
4. **Modificación de Cantidades**: Se ajustan los volúmenes o rendimientos.
5. **Cálculo (Motor Interno)**: Se totalizan Materiales, Mano de Obra, Equipos, y se aplican Gastos Generales (GG), Utilidad e IVA.
6. **Exportación**: Se genera el documento final en PDF (vía `jspdf`) o Excel (vía `xlsx`).
"""
with open(os.path.join(base_dir, "ARQUITECTURA_ECP.md"), "w", encoding="utf-8") as f:
    f.write(arch_content)


# 2. MODELO_DATOS_ECP.md
modelo_content = """# Modelo de Datos ECP

## Clientes
```json
{
  "id": "cli-001",
  "nombre": "Juan Pérez",
  "rut": "12.345.678-9",
  "email": "juan@ejemplo.com",
  "telefono": "+56912345678",
  "direccion": "Av. Siempreviva 123"
}
```

## Proyectos
```json
{
  "id": "proj-101",
  "clienteId": "cli-001",
  "nombre": "Remodelación Casa Juan",
  "fechaCreacion": "2026-07-26",
  "estado": "Activo"
}
```

## Presupuestos
```json
{
  "id": "pres-505",
  "proyectoId": "proj-101",
  "version": 1,
  "estado": "Borrador",
  "configuracion": {
    "gastosGenerales": 12,
    "utilidad": 10,
    "iva": 19,
    "descuento": 0
  },
  "capitulos": [ ... ]
}
```

## Capítulos y Partidas
```json
{
  "id": "cap-1",
  "nombre": "Obras Preliminares",
  "partidas": [
    {
      "id": "part-10",
      "apuId": "apu-005",
      "cantidad": 50,
      "precioUnitario": 1500,
      "total": 75000
    }
  ]
}
```

## APU (Análisis de Precio Unitario)
```json
{
  "id": "apu-005",
  "codigo": "EXC-01",
  "descripcion": "Excavación manual",
  "unidad": "m3",
  "rendimiento": 2.5,
  "materiales": [...],
  "manoDeObra": [...],
  "equipos": [...],
  "subcontratos": [...]
}
```

## Recursos (Materiales, Mano de Obra, Equipos)
```json
{
  "tipo": "material",
  "id": "mat-30",
  "nombre": "Cemento Melón",
  "unidad": "saco",
  "precio": 4500,
  "cantidad": 1.2
}
```
*Los campos requeridos son ID, nombre, unidad y precio. Valores por defecto para rendimientos son 1.0.*
"""
with open(os.path.join(base_dir, "MODELO_DATOS_ECP.md"), "w", encoding="utf-8") as f:
    f.write(modelo_content)


# 7. FLUJOS_ECP.md
flujos_content = """# Flujos Paso a Paso ECP

## Presupuesto de una reparación pequeña
1. Módulo Presupuestos -> Nuevo.
2. Ingresar título "Reparación fuga de agua".
3. Añadir Capítulo único "Gasfitería".
4. Buscar partida "Visita técnica" y "Reparación tubería PVC".
5. Ajustar cantidad a 1.
6. Guardar y Exportar a PDF simplificado.

## Presupuesto de una remodelación
1. Crear Cliente -> Crear Proyecto -> Nuevo Presupuesto.
2. Crear Capítulos: Desarme, Obra Gruesa, Terminaciones.
3. Importar APUs desde la biblioteca en masa.
4. Ajustar rendimientos y actualizar precios de materiales (ej. pintura, cerámica).
5. Revisar subtotales y aplicar 15% de GG y 12% Utilidad.
6. Exportar resumen para el cliente (sin desglose) e interno (con desglose APU).

## Modificación de un APU
1. Abrir Biblioteca APU.
2. Seleccionar partida (ej. "Hormigón H20").
3. Editar -> Agregar recurso "Aditivo impermeabilizante".
4. Ajustar rendimiento de la cuadrilla (Mano de Obra) de 0.5 a 0.45.
5. Guardar. El precio por m3 se actualiza automáticamente.
"""
with open(os.path.join(base_dir, "FLUJOS_ECP.md"), "w", encoding="utf-8") as f:
    f.write(flujos_content)


# 8. LIMITACIONES_ACTUALES.md
limitaciones_content = """# Limitaciones Actuales y Errores Conocidos

## Funciones Incompletas
- La sincronización en la nube (cloud sync) aún puede presentar fallos si la red es intermitente.
- Algunos campos avanzados de subcontratos no tienen impacto en el cálculo de impuestos específicos.

## Datos Simulados
- Existen `mock_proveedores.js` y `mock_excel.js` en los scripts de inyección, lo que indica que algunas integraciones externas podrían estar utilizando datos simulados para pruebas o por falta de API real.

## Cálculos Pendientes / Limitaciones
- El redondeo de IVA en ciertas partidas muy pequeñas (centavos) puede descuadrar por +/- $1 en presupuestos masivos.
- No hay cálculo automático de depreciación de maquinaria pesada.

## Funcionalidades Planificadas
- Integración completa con pasarelas de compra ágil.
- Generador de diagramas de Gantt basados en el rendimiento de los APU.
- App móvil complementaria.
"""
with open(os.path.join(base_dir, "LIMITACIONES_ACTUALES.md"), "w", encoding="utf-8") as f:
    f.write(limitaciones_content)


# 10. LISTADO_ARCHIVOS_INCLUIDOS.md
listado_content = """# Listado de Archivos de la Auditoría

- `ARQUITECTURA_ECP.md`: Describe la pila tecnológica, estructura y flujo de la aplicación.
- `MODELO_DATOS_ECP.md`: Especifica la estructura JSON de las entidades principales.
- `FLUJOS_ECP.md`: Detalla el paso a paso de los casos de uso más comunes.
- `LIMITACIONES_ACTUALES.md`: Lista de fallos, datos simulados y funciones pendientes.
- `motor_calculo/`: Carpeta con los archivos JS principales (`index.js` empaquetado) responsables de la lógica, cálculos, componentes y exportación.
- `componentes/`: Carpeta con scripts secundarios que inyectan modales, rediseños y lógicas adicionales (`generador_oc_modulo.js`, etc.).
- `administracion/`: Archivos de configuración de datos y bases JSON (sin datos sensibles).
- `exportacion/`: Archivos base y librerías externas para exportación PDF/Excel (`jspdf.umd.min.js`, `xlsx.full.min.js`).

*Nota*: Dado que la aplicación está compilada y empaquetada, gran parte de las responsabilidades solicitadas (motor de cálculo, componentes, exportación) conviven dentro de `index.js`.
"""
with open(os.path.join(base_dir, "LISTADO_ARCHIVOS_INCLUIDOS.md"), "w", encoding="utf-8") as f:
    f.write(listado_content)


# Copiar archivos
os.makedirs(os.path.join(base_dir, "motor_calculo"), exist_ok=True)
os.makedirs(os.path.join(base_dir, "componentes"), exist_ok=True)
os.makedirs(os.path.join(base_dir, "administracion"), exist_ok=True)
os.makedirs(os.path.join(base_dir, "exportacion"), exist_ok=True)

try:
    shutil.copy2("src/assets/index.js", os.path.join(base_dir, "motor_calculo/index.js"))
    shutil.copy2("src/assets/generador_oc_modulo.js", os.path.join(base_dir, "componentes/generador_oc_modulo.js"))
    shutil.copy2("src/assets/modulo_proveedores.js", os.path.join(base_dir, "componentes/modulo_proveedores.js"))
    
    shutil.copy2("src/jspdf.umd.min.js", os.path.join(base_dir, "exportacion/jspdf.umd.min.js"))
    shutil.copy2("src/xlsx.full.min.js", os.path.join(base_dir, "exportacion/xlsx.full.min.js"))
    
    if os.path.exists("apus.json"): shutil.copy2("apus.json", os.path.join(base_dir, "administracion/apus.json"))
    if os.path.exists("materiales.json"): shutil.copy2("materiales.json", os.path.join(base_dir, "administracion/materiales.json"))
    if os.path.exists("catalog.json"): shutil.copy2("catalog.json", os.path.join(base_dir, "administracion/catalog.json"))
except Exception as e:
    print(f"Error copying files: {e}")

# Crear ZIP
shutil.make_archive("ECP_AUDITORIA_COMPLETA", 'zip', base_dir)
print("Generación completada.")
