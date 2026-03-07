---
name: "requirements-codegen"
description: "Transforms requirements into implementable specs and code plans. Invoke when users request detailed requirement specs, task breakdowns, or code generation guidance."
---

# Requirements Codegen

## Propósito
Crear especificaciones completas de requisitos y un plan de generación de código alineado al proyecto, con foco en calidad, validación y entregables listos para revisión.

## Inputs requeridos
- Contexto del proyecto (stack, estructura, restricciones, convenciones).
- Lenguaje(s) objetivo(s).
- Framework(s) objetivo(s).
- Historias de usuario (formato libre o estándar).
- Criterios de aceptación (explícitos o implícitos).
- Alcance y exclusiones (si aplica).
- Artefactos existentes relevantes (specs, SDD, diagramas).

## Algoritmo interno
1. Análisis de requisitos
   - Normaliza historias de usuario y criterios de aceptación.
   - Identifica entidades, flujos, estados y reglas de negocio.
   - Detecta ambigüedades y define supuestos operativos mínimos.
2. Descomposición en tareas
   - Divide en módulos funcionales y cambios de UI/UX.
   - Mapea impactos en archivos y dependencias.
   - Define orden de implementación y riesgos.
3. Selección de patrones de diseño
   - Elige patrones compatibles con el stack actual.
   - Prioriza reutilización de componentes y servicios existentes.
   - Define interfaces públicas y contratos de datos.
4. Generación de pseudocódigo
   - Esboza la lógica principal por módulo.
   - Define estructura de funciones, entradas y salidas.
   - Prepara hooks de validación y manejo de errores.

## Outputs esperados
- Especificación de requisitos clara y verificable.
- Plan de cambios por archivo y módulo.
- Propuesta de estructura de componentes o clases.
- Pseudocódigo alineado con el stack.
- Archivos de código nuevos o modificados.
- Tests unitarios actualizados o nuevos.
- Documentación operativa mínima cuando aplique.

## Métricas de calidad
- Cobertura de tests >90% en áreas impactadas.
- Cumplimiento de principios SOLID donde aplique.
- Tiempo de procesamiento <2s por requisito individual.
- Cero regresiones funcionales en flujos existentes.

## Proceso de validación
1. Validación funcional
   - Tests unitarios y de integración relevantes.
   - Casos de prueba manual definidos en la spec.
2. Revisión de seguridad
   - Sanitización de inputs y validación de parámetros.
   - No exposición de secretos ni datos sensibles.
3. Revisión de rendimiento
   - Evitar llamadas redundantes a API.
   - Minimizar renders y recomputaciones.
4. Verificación de estándares
   - Lint y typecheck sin errores nuevos.
   - Convenciones del proyecto respetadas.

## Entregables finales
- Pull request con:
  - Descripción detallada del cambio.
  - Checklist de criterios de aceptación.
  - Evidencia de pruebas exitosas (logs o salida de comandos).
  - Lista de archivos afectados.

## Cuándo invocar esta skill
Invocar cuando el usuario solicite:
- Especificaciones detalladas de requisitos.
- Planes de implementación antes del código.
- Generación de tareas con criterios de aceptación.
- Diseño de componentes y estructura de archivos.
