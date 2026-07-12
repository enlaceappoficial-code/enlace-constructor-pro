# ECP Mobile (PWA) + Supabase — Punto de partida (2026-05-08)

Este documento guarda el contexto y la dirección recomendada para iniciar el proyecto “ECP Mobile”, sin ejecutar aún cambios de código.

## Objetivo

Crear una experiencia móvil tipo app (PWA) que se acople a ECP escritorio (Tauri) compartiendo los mismos datos, evitando instalar desde Play Store/App Store.

## Idea central (lo más importante)

Antes de “hacer la app móvil”, hay que convertir ECP en un producto multi-dispositivo con una única fuente de verdad.

Hoy ECP es local-first (localStorage). Al sumar móvil, el problema principal pasa a ser:

- Sincronización
- Usuarios / autenticación
- Permisos (qué puede ver/editar cada rol)
- Modelo de datos (presupuestos, clientes, licitaciones, gantt, etc.)

La UI móvil viene después de tener esto claro.

## Recomendación de enfoque

- Definir un MVP móvil con 3–5 flujos máximos (no “todo ECP”):
  - Inicio / dashboard
  - Presupuestos (lista, detalle, estado, compartir)
  - Clientes (ver + contacto rápido)
  - Licitaciones (estado, fechas, alertas)
  - Carta Gantt (solo lectura + alertas de atraso/avance)
- Configurar Supabase desde el inicio (Auth + DB + Storage + RLS).
- Construir móvil como PWA mobile-first apuntando a Supabase.
- Adaptar escritorio (Tauri) para leer/escribir a Supabase para que móvil y escritorio sean dos clientes del mismo sistema.

## Dominio (recomendación práctica)

Para ir rápido y mantener separación con Enlace Red Social:

- Usar subdominio (ej.: `ecp.redenlace.cl` o `app.redenlace.cl`) para la PWA.
- Más adelante se puede migrar a dominio propio si se decide (sin rehacer la app).

## Decisiones pendientes para cerrar arquitectura (antes de código)

1) Usuarios móviles v1:
   - ¿Solo equipo interno (dueño + colaboradores)?
   - ¿También clientes ven su presupuesto desde el celular?
2) Carta Gantt en móvil v1:
   - ¿Solo lectura o edición?
3) Alcance de sincronización escritorio↔móvil:
   - ¿Se requiere offline en móvil y/o en escritorio?
4) Seguridad:
   - Roles mínimos (admin / operador / solo-lectura / cliente).
   - Qué datos quedan aislados por empresa/cuenta.

## Entregables recomendados antes de programar

1) Documento de arquitectura:
   - Tablas y relaciones (Supabase Postgres)
   - RLS por roles
   - Estrategia de sync y conflictos
2) MVP UI:
   - Lista de pantallas
   - Navegación
   - Casos de uso y criterios de aceptación

