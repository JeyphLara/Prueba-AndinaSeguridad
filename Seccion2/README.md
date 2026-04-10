# Modelo de datos - Punto 5

El modelo en soluciones.js es una representación en memoria, no una capa ORM....

Para el punto 5 diseñaría un modelo relacional con dos tablas principales:

1. `puntos_gestion`
2. `visitas`

## Diseño general

### Tabla `puntos_gestion`
Esta tabla almacena los puntos de gestión y su ubicación.

- `id` UUID o serial PRIMARY KEY
- `nombre` VARCHAR(255) NOT NULL
- `latitud` DECIMAL(10, 7) NOT NULL
- `longitud` DECIMAL(10, 7) NOT NULL
- `direccion` VARCHAR(255)
- `tipo` VARCHAR(100)
- `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
- `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

### Tabla `visitas`
Esta tabla registra cada visita realizada a un punto de gestión.

- `id` UUID o serial PRIMARY KEY
- `punto_id` UUID NOT NULL REFERENCES `puntos_gestion`(`id`)
- `inicio` TIMESTAMP NOT NULL
- `fin` TIMESTAMP NOT NULL
- `duracion_minutos` INTEGER GENERATED ALWAYS AS (
    EXTRACT(EPOCH FROM (fin - inicio)) / 60
  ) STORED
- `estado` VARCHAR(50)
- `comentarios` TEXT
- `usuario` VARCHAR(100)
- `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

## Beneficios del modelo

Este diseño permite:

- Calcular distancias entre puntos usando las coordenadas geográficas (`latitud`, `longitud`).
- Obtener los puntos más visitados mediante agregaciones de `COUNT(visitas.id)`.
- Analizar duración de visitas con diferencias de tiempo y funciones de agregación como `AVG` y `SUM`.
- Asociar visitas con puntos concretos, lo que facilita el análisis por ubicación.

También se incluye el archivo `schema.sql` en este directorio con el esquema SQL listo para ejecutar.
