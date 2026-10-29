# Capacitación farmacéutica (MVP)

App web tipo Duolingo para capacitar al equipo de ventas de farmacia. Módulo 0: Fundamentos.

## Correr
```bash
npm install
npm run dev      # abre http://localhost:5173 (usa --host para probar en el celular en la misma red)
npm run build    # build de producción en dist/
```

Progreso guardado en `localStorage` (clave `farma-progress-v1`). Para reiniciar: borrar esa clave.

## Qué hay
- Home (saludo, p. ej. "¡Hola, María!"), ruta del Módulo 0 (lecciones 1–8 + checkpoint bloqueado), nombre editable una vez.
- Lección 1 jugable: tip, 6 ejercicios (completar, V/F, emparejar, caso, elegir, ordenar), 5 vidas, XP (+10, +15 con racha de 3+, +25 lección perfecta), aprobar ≥80%, repaso de fallados.
- Lecciones 2–8: "Próximamente". Contenido en `src/data.ts`.
