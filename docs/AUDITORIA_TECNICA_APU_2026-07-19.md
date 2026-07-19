# Auditoría técnica de partidas, materiales y APU

Fecha: 19 de julio de 2026  
Fuente revisada: `src/app.html`  
Alcance: biblioteca canónica incluida con ECP. Las personalizaciones guardadas por cada usuario no fueron modificadas ni leídas.

## Resultado ejecutivo

La estructura de datos está sana: no existen IDs repetidos, APU huérfanas, materiales inexistentes, cantidades inválidas ni APU con costo cero. La reparación estructural anterior quedó confirmada.

La revisión técnica encontró, sin embargo, componentes que no conviene ampliar todavía:

- 198 partidas disponibles.
- 287 materiales disponibles.
- 124 APU canónicas revisadas.
- 94 APU sin observaciones de las reglas actuales.
- 30 APU con al menos una observación.
- 1 observación de prioridad alta.
- 35 observaciones de revisión media.
- 74 partidas todavía no tienen una APU canónica asociada.
- 100 materiales aún no participan en ninguna APU canónica.

Una observación no significa automáticamente que una APU esté inutilizable. Indica que debe ser corregida o confirmada antes de considerarla una base técnica confiable.

## Hallazgos de prioridad alta

### 1. Bloque Metalcon — reconstruido

Las APU 10, 11, 12, 13, 14, 15, 19, 20, 21, 65 y 66 ahora registran la base técnica utilizada. Los muros y tabiques se calculan con altura de referencia de 2,40 m, separación de montantes de 40 cm y 10 % de merma. Las placas se cuantifican por caras y capas.

Los cielos dejaron de usar soleras estructurales de muro y ahora incorporan Perfil Portante 40R, Perfil AT y Conector TI. La separación es de 40 cm para placas de 10 mm y de 60 cm para placas de 12,5 mm, siguiendo la referencia técnica de Cintac.

Las cantidades siguen siendo editables porque cada proyecto debe confirmar altura, modulación, vanos, perímetro y exigencias de cálculo.

### 2. Espesor incompatible en techumbre — corregido

La APU 26 ahora combina la plancha de zinc de 0,5 mm con una cumbrera del mismo espesor.

### 3. Rendimiento anómalo en pilar armado — corregido

La APU 117 fue corregida de rendimiento 20 a 2, coherente con la variante H-30, APU 138.

### 4. Enfierradura por kilogramo

La APU 123 suma dos líneas de acero y no incorpora alambre de amarre. Debe reconstruirse como una composición por kilogramo instalado que distinga acero, pérdidas, amarre y mano de obra sin duplicar el acero base.

## Hallazgos de revisión media

### Mano de obra y precios calculados

Diecisiete APU presentan una diferencia superior al 50 % respecto de su precio referencial:

- APU 29, 31, 35, 36, 54, 69, 76, 77, 95, 96, 99, 101, 125, 126, 134, 137 y 138.

Los casos más evidentes son:

- Excavación mecánica, APU 101: $95.200 calculados frente a $22.000 referenciales por m³.
- Colector PVC 110 mm, APU 125: $6.361 frente a $28.000 por ml.
- Colector PVC 160 mm, APU 126: $9.842 frente a $38.000 por ml.
- Sello bituminoso, APU 134: $1.892 frente a $18.500 por m².
- Escalera metálica, APU 95: $59.761 frente a $185.000 por ml.

La causa principal es sistémica: varias APU calculan la mano de obra como porcentaje del costo de materiales. En trabajos intensivos en mano de obra o maquinaria, este método subvalora o sobrevalora el trabajo. La solución recomendada es calcular la mano de obra desde cargos, jornales, dotación y rendimiento, aprovechando los valores ya configurados en ECP.

### Rendimientos y dotaciones faltantes

Las APU 37, 53, 62, 64, 68, 76, 78 y 83 no tienen rendimiento o dotación definidos. Esto impide comprobar duración, cuadrilla y costo laboral.

### Variantes que reutilizan la composición base

Las APU 63 y 64, que incluyen retiro del revestimiento anterior, reutilizan exactamente los materiales de instalación nueva. El retiro puede resolverse mediante mano de obra, bolsas, transporte y disposición, o vinculando una APU auxiliar de demolición. Debe quedar visible y no escondido únicamente en un porcentaje.

### Materiales alternativos acumulados

Las APU 67, 75 y 76 cobran simultáneamente distintos sellantes que en muchos trabajos son alternativas —silicona, poliuretano o Sikaflex—. ECP necesita permitir seleccionar el producto aplicable en lugar de sumar siempre todos.

### Sistemas de estuco mezclados

Las APU 35, 36 y 77 mezclan producto premezclado con cemento y arena. Debe escogerse entre una dosificación preparada en obra o un mortero premezclado, salvo que la ficha técnica justifique los complementos.

### Hormigón premezclado con agregado adicional

Las APU 105 y 108 agregan arena o piedra a un hormigón premezclado. Hay que confirmar si se trata de una capa independiente; de lo contrario, el agregado está duplicado.

## Cobertura pendiente

De las 198 partidas, 74 aún no tienen APU canónica. Las mayores brechas son:

- Áreas exteriores: 14.
- Piscinas: 9.
- Carpintería: 7.
- Sanitario: 6.
- Hormigón y albañilería: 4.
- Gas: 3.
- Hormigón armado: 3.
- Instalaciones sanitarias: 3.
- Pisos, regularización, varios, obras exteriores, pavimentos, impermeabilización, movimiento de tierras y mantención sanitaria: 2 en cada grupo.

Esta cobertura debe ampliarse después de estabilizar el cálculo y las composiciones actuales.

## Orden recomendado de corrección

1. Vincular la mano de obra a cargos, jornales, dotación y rendimiento en lugar de depender del porcentaje de materiales.
2. Completar los ocho rendimientos faltantes.
3. Convertir materiales alternativos en opciones y permitir APU auxiliares para retiro, transporte o preparación.
4. Revisar y ajustar los diecisiete precios atípicos.
5. Solo entonces ampliar las 74 partidas sin APU.

## Verificador reproducible

La auditoría puede repetirse después de cada cambio con:

```powershell
node scripts\audit_apu_technical.js
```

El detalle técnico se genera localmente en `target/auditoria_apu_tecnica.json`. El verificador es de solo lectura: no modifica las APU ni el almacenamiento de los usuarios.

## Límites de esta auditoría

Los precios son referencias internas y no una cotización vigente de proveedores. La auditoría comprueba integridad, coherencia, cobertura y desviaciones técnicas detectables, pero las dosificaciones estructurales y exigencias normativas deben validarse para cada proyecto por el profesional responsable.
