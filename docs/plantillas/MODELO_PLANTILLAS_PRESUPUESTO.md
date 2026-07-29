# Modelo de Plantillas de Presupuesto (ECP)

Este documento define la estructura y reglas del nuevo sistema de plantillas de presupuestos. Las plantillas permiten inicializar presupuestos completos de manera rápida, combinando capítulos, soluciones compuestas y partidas directas predefinidas.

## Estructura JSON (TypeScript Interface)

```typescript
interface PlantillaPresupuesto {
  id: string;               // Identificador único (ej: tpl-001-reparacion)
  nombre: string;           // Nombre comercial de la plantilla
  descripcion: string;      // Descripción detallada del alcance
  estado: "activa" | "borrador" | "archivada";
  tipoProyecto: string;     // Ej: "Remodelación", "Mantención", "Obra Nueva"
  capitulos: CapituloPlantilla[];
  preguntasIniciales: string[]; // Cuestionario para afinar cantidades
  advertencias: string[];       // Avisos técnicos o exclusiones
  requiereVisita: boolean;      // Si el alcance exige visita técnica previa
}

interface CapituloPlantilla {
  codigo: string;           // Identificador del capítulo (ej: cap-01)
  nombre: string;           // Nombre visible en el presupuesto
  orden: number;            // Orden de aparición
  soluciones: SolucionRef[];// Soluciones compuestas incluidas
  partidasDirectas: PartidaRef[]; // Partidas individuales incluidas
}

interface SolucionRef {
  solucionId: string;       // ID que hace referencia a SOLUCIONES_PROPUESTAS
  obligatoria: boolean;     // Si el usuario puede desmarcarla o no al usar la plantilla
}

interface PartidaRef {
  catalogId: number;        // ID de la partida base en el catálogo oficial
  obligatoria: boolean;     // Si es opcional para el cliente
  cantidadSugerida?: number;// Valor por defecto sugerido
}
```

## Reglas de Negocio
1. **Reutilización:** Las plantillas NO definen lógicas internas de precios. Únicamente orquestan `solucionId` y `catalogId` existentes en la taxonomía y el catálogo de soluciones.
2. **Jerarquía:** Un presupuesto nace de una plantilla, la plantilla agrupa capítulos, los capítulos agrupan soluciones y partidas.
3. **No Duplicidad:** Se debe evitar agregar una partida como directa si ya está intrínsecamente contenida en la solución obligatoria del mismo capítulo.
4. **Validación:** Antes de agregar la plantilla, el sistema mostrará al usuario un resumen de los elementos, permitiéndole descartar los que estén marcados como `obligatoria: false`.
