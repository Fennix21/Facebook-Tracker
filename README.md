# Accountability Partner System

Aplicación full-stack para cerrar la brecha entre intención y ejecución mediante check-ins obligatorios, penalización inmediata y tracking de comportamiento.

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express + JWT
- Base de datos: PostgreSQL
- Orquestación: Docker Compose

## Arranque en 1 comando (recomendado)

## Inicio con doble clic (Windows)
- Haz doble clic en `START_WINDOWS.bat`.
- El script valida Docker y ejecuta `docker compose up --build` automáticamente.

1. Tener Docker Desktop abierto.
2. Desde la raíz del proyecto ejecutar:
   ```bash
   docker compose up --build
   ```
3. Abrir `http://localhost:5173`.

Con ese comando se levanta:
- PostgreSQL con el esquema aplicado automáticamente (`backend/sql/schema.sql`).
- Backend en `http://localhost:4000`.
- Frontend en `http://localhost:5173`.

## Flujo principal
- El usuario inicia sesión.
- Debe completar check-in diario para desbloquear dashboard.
- Si cumple: suma puntos, racha y recompensas.
- Si falla: resta puntos, reinicia racha y suma penalizaciones.
- Penalizaciones repetidas pueden bloquear funciones por 24h.

## Admin
Endpoints protegidos por role `admin` para usuarios, eventos, métricas e intervenciones configurables.
