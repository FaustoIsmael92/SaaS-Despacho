# OBLIGATORIO:
-Siempre debes leer la carpeta docs para entender el proyecto con su documentacion.
- La documentacion se debe seguir al pie de la letra.

# Estándar de código

- Usa siempre Tailwind y no escribas CSS propio.
- Aplica patrones DRY y buenas prácticas.
- Crea archivos separados para interfaces y types; usa una carpeta dedicada para tipado.
- Mantén los componentes pequeños; no superes 120 líneas por archivo.
- Nombra funciones, variables y archivos de forma clara y consistente.
- Una función o componente debe tener una única responsabilidad.
- Evita anidación profunda; extrae lógica a funciones o hooks cuando supere 2–3 niveles.
- Prefiere composición sobre herencia o componentes monolíticos.
- Extrae constantes, configuraciones y textos repetidos a constantes o i18n.
- Documenta con JSDoc solo APIs públicas, tipos complejos o decisiones no obvias.
- Escribe tests para lógica crítica y utilidades compartidas.
- Evita `any`; usa tipos genéricos o `unknown` cuando sea necesario.
- Agrupa imports: externos, internos, tipos; orden alfabético dentro de cada grupo.
- No dejes código comentado ni logs de depuración; usa el historial de git.
- Mantén dependencias al mínimo y actualizadas; revisa el impacto antes de añadir nuevas.
- La UI debe ser minimalista. Nada de agregar muchos colores.