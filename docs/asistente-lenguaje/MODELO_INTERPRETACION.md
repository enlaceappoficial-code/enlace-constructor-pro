# Modelo de Interpretación (Asistente Lenguaje Natural)

Este documento detalla la arquitectura para la siguiente fase del Asistente Inteligente, enfocada en interpretar solicitudes en lenguaje natural provistas por el usuario.

## Arquitectura Dual

El sistema operará bajo dos modalidades, asegurando resiliencia si la conexión a internet falla, y maximizando precisión cuando esté disponible.

### 1. Modo Local (Sin API, Offline)
Usa heurísticas basadas en expresiones regulares, coincidencia de cadenas, y diccionarios de sinónimos:
- **Diccionario de Términos:** Busca palabras clave y sinónimos (chilenismos, jerga constructiva) descritos en `DICCIONARIO_TERMINOS.json`.
- **Extracción de Cantidades:** Usa expresiones regulares para detectar números seguidos de unidades (ej. `\b(\d+)\s*(m2|mts2|ml|metros|mt)\b`).
- **Inferencia de Flujos:** Suma puntajes basados en palabras clave (ej. "llueve" + "techo" -> suma puntos para `flujo-1-filtracion-techumbre`). El flujo con mayor coincidencia es propuesto.

### 2. Modo Futuro (Con IA - LLMs)
Se conectará a proveedores de IA Generativa (OpenAI, Gemini, u otros) usando una interfaz desacoplada:
- **Prompt Base:** Se enviará al modelo un prompt sistémico que restrinja su respuesta estricta y únicamente al formato JSON especificado en `ESQUEMA_RESPUESTA.json`.
- **Desacoplamiento:** La integración se realizará a través de un adaptador `IA_InterpreterService`, el cual estandariza el *payload* y maneja *fallbacks* hacia el Modo Local si hay *timeouts* o cuotas excedidas.

## Principios Inmutables
- **La respuesta del proveedor nunca modifica directamente el presupuesto.**
- La interpretación (ya sea IA o Local) debe precargar el `AsistenteInteligenteModal` (pasos 1 a 6) para que el **usuario valide visualmente** lo interpretado, permitiéndole corregir cantidades, materiales u omisiones antes de proceder.
